import { supabase } from '../components/supabase';

jest.mock('../components/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: {
          session: { user: { id: '123', email: 'test@example.com' } }
        },
        error: null
      })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({
            data: {
              preferred_name: 'Testy',
              first_name: 'John',
              last_name: 'Doe',
              zipcode: '12345',
            },
            error: null
          }),
        }),
      }),
      update: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    }),
  }
}));

describe('Supabase logic', () => {
  it('fetches preferred name successfully', async () => {
    const session = await supabase.auth.getSession();
    const userId = session.data.session.user.id;

    const result = await supabase
      .from('profiles')
      .select('preferred_name')
      .eq('id', userId)
      .maybeSingle();

    expect(result.data.preferred_name).toBe('Testy');
  });

  it('updates preferred name successfully', async () => {
    const response = await supabase
      .from('profiles')
      .update({ preferred_name: 'Lenny' })
      .eq('id', '123');

    expect(response.error).toBeNull();
  });
});
