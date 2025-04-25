import { renderHook, act } from '@testing-library/react-hooks';
import { usePreferredName, PreferredNameProvider } from '../components/PreferredNameContext';

describe('PreferredNameContext', () => {
  it('sets and retrieves the preferred name', () => {
    const wrapper = ({ children }) => <PreferredNameProvider>{children}</PreferredNameProvider>;
    const { result } = renderHook(() => usePreferredName(), { wrapper });

    act(() => {
      result.current.setPreferredName('Lenny');
    });

    expect(result.current.preferredName).toBe('Lenny');
  });
});
