// utils/getProfile.js
import { supabase } from '../components/supabase';

export const getProfile = async () => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !sessionData?.session?.user?.id) {
      console.error('❌ Session error in getProfile:', sessionError?.message || 'No active session found');
      return null;
    }

    const userId = sessionData.session.user.id;

    const { data, error } = await supabase
      .from('profiles')
      .select('preferred_name')
      .eq('id', userId)
      .maybeSingle(); // ✅ FIXED HERE

    if (error) {
      console.error('❌ Supabase query error in getProfile:', error.message);
      return null;
    }

    if (!data?.preferred_name) {
      console.warn('⚠️ No preferred_name found for user ID:', userId);
      return null;
    }

    return data.preferred_name;
  } catch (err) {
    console.error('❌ Unexpected error in getProfile:', err.message || err);
    return null;
  }
};
