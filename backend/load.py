import tensorflow as tf
import os

label_map = {
    1: "Blackheads_Mild", 2: "Blackheads_Moderate", 3: "Blackheads_Severe",
    4: "Cystic_Mild", 5: "Cystic_Moderate", 6: "Cystic_Severe",
    7: "Nodular_Mild", 8: "Nodular_Moderate", 9: "Nodular_Severe",
    10: "Papules_Mild", 11: "Papules_Moderate", 12: "Papules_Severe",
    13: "Pustules_Mild", 14: "Pustules_Moderate", 15: "Pustules_Severe",
    16: "Whiteheads_Mild", 17: "Whiteheads_Moderate", 18: "Whiteheads_Severe"
}

# Paths (relative to where this file lives)
BASE_DIR = os.path.dirname(__file__)
train_path = os.path.join(BASE_DIR, "dataset/train/Acne-Types-and-Severity.tfrecord")
test_path  = os.path.join(BASE_DIR, "dataset/test/Acne-Types-and-Severity.tfrecord")

print("Using train file:", train_path)
print("Using test file :", test_path)

# TFRecord schema
feature_description = {
    "image/encoded": tf.io.FixedLenFeature([], tf.string),
    "image/object/class/label": tf.io.VarLenFeature(tf.int64),
}

def _parse_function(example_proto):
    parsed = tf.io.parse_single_example(example_proto, feature_description)
    image = tf.image.decode_jpeg(parsed["image/encoded"], channels=3)
    image = tf.image.resize(image, [224, 224]) / 255.0

    # Convert from sparse to dense (take first label per image)
    label = tf.sparse.to_dense(parsed["image/object/class/label"])
    label = tf.cast(label[0], tf.int32)  # use first label only

    return image, label

train_ds = tf.data.TFRecordDataset(train_path).map(_parse_function)
test_ds  = tf.data.TFRecordDataset(test_path).map(_parse_function)

for img, label in train_ds.take(1):
    lbl = int(label.numpy())
    print(f"✅ Loaded sample image shape: {img.shape}")
    print(f"Label: {lbl} → {label_map[lbl]}")

import matplotlib.pyplot as plt
import numpy as np

# Label map
label_map = {
    1: "Blackheads_Mild", 2: "Blackheads_Moderate", 3: "Blackheads_Severe",
    4: "Cystic_Mild", 5: "Cystic_Moderate", 6: "Cystic_Severe",
    7: "Nodular_Mild", 8: "Nodular_Moderate", 9: "Nodular_Severe",
    10: "Papules_Mild", 11: "Papules_Moderate", 12: "Papules_Severe",
    13: "Pustules_Mild", 14: "Pustules_Moderate", 15: "Pustules_Severe",
    16: "Whiteheads_Mild", 17: "Whiteheads_Moderate", 18: "Whiteheads_Severe"
}

# Fetch 9 samples
images, labels = [], []
for img, label in train_ds.take(9):
    images.append(img.numpy())
    labels.append(int(label.numpy()))

# Plot 3x3 grid
plt.figure(figsize=(10,10))
for i in range(9):
    plt.subplot(3,3,i+1)
    plt.imshow(images[i])
    plt.title(label_map[labels[i]])
    plt.axis('off')
plt.tight_layout()
plt.show()
