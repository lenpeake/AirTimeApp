// utils/Backend.js
import { supabase } from '../components/supabase';

export async function submitWaitTime(
  airportCode,
  actualMinutes,
  estimatedMinutes = null,
  language = 'en',
  deviceId = null,
  lineType = 'regular' // ✅ New parameter with default value
) {
  console.log('📤 Submitting to Supabase:', {
    airportCode,
    actualMinutes,
    estimatedMinutes,
    language,
    deviceId,
    lineType, // ✅ Log the lineType
  });

  const { data, error } = await supabase
    .from('actual_wait_times')
    .insert([
      {
        airport_code: airportCode,
        actual_minutes: actualMinutes,
        estimated_minutes: estimatedMinutes,
        language,
        device_id: deviceId,
        line_type: lineType, // ✅ Insert into Supabase
      },
    ]);

  if (error) {
    console.error('🚨 Supabase Insert Error:', error);
    throw new Error(error.message || 'Submission failed');
  }

  console.log('✅ Submission Success:', data);
  return data;
}
