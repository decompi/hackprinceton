import { supabase, Scan, Dermatologist, Appointment } from './supabaseClient';

// Scan operations
export const uploadScan = async (
  userId: string,
  file: File,
  acneType: string,
  causes: string[],
  confidence: number
): Promise<{ data: Scan | null; error: Error | null }> => {
  try {
    // First, ensure user profile exists
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (profileError || !userProfile) {
      // User profile doesn't exist, create it
      const { data: authUser } = await supabase.auth.getUser();
      if (authUser.user) {
        const { error: createError } = await supabase.from('users').insert([
          {
            id: userId,
            email: authUser.user.email || '',
            name: authUser.user.user_metadata?.name || null,
          },
        ]);

        if (createError) {
          throw new Error(`Failed to create user profile: ${createError.message}`);
        }
      } else {
        throw new Error('User not authenticated');
      }
    }

    // Upload image to Supabase Storage
    const fileName = `${userId}/${Date.now()}_${file.name}`;
    const { data: imageData, error: imgError } = await supabase.storage
      .from('user-scans')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (imgError) {
      throw imgError;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('user-scans')
      .getPublicUrl(imageData.path);

    const imageUrl = urlData.publicUrl;

    // Insert scan record
    const { data, error } = await supabase
      .from('scans')
      .insert([
        {
          user_id: userId,
          image_url: imageUrl,
          acne_type: acneType,
          causes: causes,
          confidence: confidence,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as Scan, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const getUserScans = async (
  userId: string
): Promise<{ data: Scan[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', userId)
      .order('analysis_date', { ascending: false });

    if (error) {
      throw error;
    }

    return { data: data as Scan[], error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const getScanById = async (
  scanId: string
): Promise<{ data: Scan | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('id', scanId)
      .single();

    if (error) {
      throw error;
    }

    return { data: data as Scan, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

// Dermatologist operations
export const getDermatologists = async (): Promise<{
  data: Dermatologist[] | null;
  error: Error | null;
}> => {
  try {
    const { data, error } = await supabase
      .from('dermatologists')
      .select('*')
      .eq('available', true)
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    return { data: data as Dermatologist[], error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const getDermatologistById = async (
  dermId: string
): Promise<{ data: Dermatologist | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('dermatologists')
      .select('*')
      .eq('id', dermId)
      .single();

    if (error) {
      throw error;
    }

    return { data: data as Dermatologist, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

// Appointment operations
export const createAppointment = async (
  userId: string,
  dermatologistId: string,
  scanId: string | null,
  scheduledAt: string,
  reason?: string
): Promise<{ data: Appointment | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          user_id: userId,
          dermatologist_id: dermatologistId,
          scan_id: scanId,
          scheduled_at: scheduledAt,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as Appointment, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const getUserAppointments = async (
  userId: string
): Promise<{ data: Appointment[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .order('scheduled_at', { ascending: true });

    if (error) {
      throw error;
    }

    return { data: data as Appointment[], error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

// User operations
export const getUserProfile = async (
  userId: string
): Promise<{ data: any | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const getUserByEmail = async (
  email: string
): Promise<{ data: any | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const updateUserProfile = async (
  userId: string,
  updates: { name?: string; profile_pic?: string }
): Promise<{ data: any | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

