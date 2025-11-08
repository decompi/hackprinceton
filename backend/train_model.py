from gc import callbacks
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
import os
from sklearn.metrics import classification_report, confusion_matrix
import numpy as np
from tensorflow.keras.preprocessing import image_dataset_from_directory


# ---------------------------
# Paths
# ---------------------------
BASE_DIR = os.path.dirname(__file__)
TRAIN_TFRECORD = os.path.join(BASE_DIR, "dataset/train/Acne-Types-and-Severity.tfrecord")
TEST_TFRECORD = os.path.join(BASE_DIR, "dataset/test/Acne-Types-and-Severity.tfrecord")
VALID_TFRECORD = os.path.join(BASE_DIR, "dataset/valid/Acne-Types-and-Severity.tfrecord")

# ---------------------------
# TFRecord Parsing
# ---------------------------
feature_description = {
    "image/encoded": tf.io.FixedLenFeature([], tf.string),
    "image/object/class/label": tf.io.VarLenFeature(tf.int64),
}

def _parse_function(example_proto):
    parsed = tf.io.parse_single_example(example_proto, feature_description)
    image = tf.image.decode_jpeg(parsed["image/encoded"], channels=3)
    image = tf.image.resize_with_pad(image, 224, 224) / 255.0  # preserves aspect ratio
    label = tf.sparse.to_dense(parsed["image/object/class/label"])
    label = tf.cast(label[0] - 1, tf.int32)  # shift labels to 0–17

    return image, label

def make_dataset(tfrecord_path, batch_size=32, shuffle=False):
    ds = tf.data.TFRecordDataset(tfrecord_path)
    ds = ds.map(_parse_function, num_parallel_calls=tf.data.AUTOTUNE)
    if shuffle:
        ds = ds.shuffle(1000)
    ds = ds.batch(batch_size).prefetch(tf.data.AUTOTUNE)
    return ds

train_ds = make_dataset(TRAIN_TFRECORD, shuffle=True)
test_ds  = make_dataset(TEST_TFRECORD)
valid_ds = make_dataset(VALID_TFRECORD)

from collections import Counter
counts = Counter()
for _, label in train_ds.unbatch():
    counts[int(label.numpy())] += 1
print(counts)

total = sum(counts.values())
class_weights = {i: total / (len(counts) * c) for i, c in counts.items()}

# ---------------------------
# Model Definition
# ---------------------------
num_classes = 18  # from label_map.pbtxt

base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False  # freeze base layers initially

x = GlobalAveragePooling2D()(base_model.output)
x = Dense(128, activation='relu')(x)
x = Dropout(0.3)(x)
output = Dense(num_classes, activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=output)

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# ---------------------------
# Training
# ---------------------------
callback = tf.keras.callbacks.EarlyStopping(
    monitor='val_loss',
    patience=5,
    restore_best_weights=True
)

history = model.fit(
    train_ds,
    validation_data=valid_ds,
    epochs=30,
    callbacks=[callback],
    class_weight=class_weights
)

# ---------------------------
# Fine-tune deeper layers
# ---------------------------

# Unfreeze most of MobileNetV2 except the earliest low-level filters
base_model.trainable = True
for layer in base_model.layers[:100]:   # keep the first ~100 layers frozen
    layer.trainable = False

# Recompile with a smaller learning rate
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

print(f"Trainable layers: {len([l for l in model.layers if l.trainable])}")

# Train for more epochs to fine-tune
history_finetune = model.fit(
    train_ds,
    validation_data=valid_ds,
    epochs=25,
    callbacks=[callback],
    class_weight=class_weights
)

# ---------------------------
# Save model
# ---------------------------
model.save(os.path.join(BASE_DIR, "acne_model_finetuned.h5"))
print("✅ Model saved as acne_model.h5")

# Collect predictions
y_true, y_pred = [], []
for images, labels in test_ds:
    preds = model.predict(images)
    y_true.extend(labels.numpy())
    y_pred.extend(np.argmax(preds, axis=1))

print("\n✅ Evaluation Report:")
print(classification_report(y_true, y_pred, digits=3))

cm = confusion_matrix(y_true, y_pred)
print("Confusion matrix:\n", cm)