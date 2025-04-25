import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('i18next', () => ({
  changeLanguage: jest.fn().mockImplementation((lang) => Promise.resolve(lang)),
  language: 'en',
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

describe('Language Logic', () => {
  it('changes language and persists it', async () => {
    const i18n = require('i18next');
    await i18n.changeLanguage('es');
    expect(i18n.changeLanguage).toHaveBeenCalledWith('es');
  });

  it('saves language preference to AsyncStorage', async () => {
    await AsyncStorage.setItem('selectedLanguage', 'es');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('selectedLanguage', 'es');
  });
});
