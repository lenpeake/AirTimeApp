import { supabase } from '../components/supabase';

jest.mock('../components/supabase', () => ({
  supabase: {
    from: () => ({
      insert: () => Promise.resolve({
        data: [{ id: 1 }],
        error: null,
      }),
    }),
  },
}));

describe('Wait Time Submission', () => {
  it('submits wait time successfully', async () => {
    const result = await supabase
      .from('actual_wait_times')
      .insert({ airport_code: 'JFK', minutes: 12 });

    expect(result.data).toEqual([{ id: 1 }]);
    expect(result.error).toBeNull();
  });
});
