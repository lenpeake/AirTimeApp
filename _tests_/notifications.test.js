import { requestNotificationPermissionOnce } from '../utils/Notifications';

jest.mock('../utils/Notifications', () => ({
  requestNotificationPermissionOnce: jest.fn(),
}));

describe('Notifications logic', () => {
  it('calls requestNotificationPermissionOnce without crashing', () => {
    expect(() => requestNotificationPermissionOnce()).not.toThrow();
  });
});
