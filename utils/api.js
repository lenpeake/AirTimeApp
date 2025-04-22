import { supabase } from '../components/supabase';

export async function submitWaitTime({
  airportCode,
  actualMinutes,
  estimatedMinutes,
  language = 'en',
  deviceId = null,
}) {
  const { data, error } = await supabase
    .from('actual_wait_times')
    .insert([
      {
        airport_code: airportCode,
        actual_minutes: actualMinutes,
        estimated_minutes: estimatedMinutes,
        language,
        device_id: deviceId,
      },
    ]);

  if (error) {
    console.error('Insert failed:', error.message);
    throw new Error('Could not submit wait time');
  }

  return data;
}
