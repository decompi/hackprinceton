import { supabase } from './supabaseClient';

export interface AuthResponse {
  user: any | null;
  error: Error | null;
}

export const signUp = async (
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) {
      throw error;
    }

    // Create user profile in users table
    if (data.user) {
      const { error: profileError } = await supabase.from('users').insert([
        {
          id: data.user.id,
          email: email,
          name: name,
        },
      ]);

      if (profileError) {
        console.error('Error creating user profile:', profileError);
      }
    }

    return { user: data.user, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
};

export const signIn = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // Ensure user profile exists (in case it wasn't created during signup)
    if (data.user) {
      const { data: existingProfile } = await supabase
        .from('users')
        .select('id')
        .eq('id', data.user.id)
        .single();

      if (!existingProfile) {
        // Create user profile if it doesn't exist
        await supabase.from('users').insert([
          {
            id: data.user.id,
            email: email,
            name: data.user.user_metadata?.name || null,
          },
        ]);
      }
    }

    return { user: data.user, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
};

export const signOut = async (): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const getCurrentUser = async (): Promise<{
  user: any | null;
  error: Error | null;
}> => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
};

export const onAuthStateChange = (callback: (user: any) => void) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
};

