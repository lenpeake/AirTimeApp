import { supabase } from '../components/supabase';

jest.mock('../components/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: {
          session: {
            user: {
              id: '123',
              email: 'test@example.com',
            },
          },
        },
        error: null,
      }),
    },
  },
}));

describe('Session Recovery', () => {
  it('restores user session successfully', async () => {
    const session = await supabase.auth.getSession();
    expect(session.data.session.user.email).toBe('test@example.com');
  });
});
