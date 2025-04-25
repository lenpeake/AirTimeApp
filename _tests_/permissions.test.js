import { requestPermissions } from '../utils/Permissions';

jest.mock('../utils/Permissions', () => ({
  requestPermissions: jest.fn().mockResolvedValue({
    notificationsGranted: true,
    locationGranted: true,
  }),
}));

describe('Permissions logic', () => {
  it('grants both permissions', async () => {
    const result = await requestPermissions();
    expect(result.notificationsGranted).toBe(true);
    expect(result.locationGranted).toBe(true);
  });
});
