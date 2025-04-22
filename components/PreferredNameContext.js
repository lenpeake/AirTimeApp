// components/PreferredNameContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile } from '../utils/getProfile';
import { useAuth } from './AuthContext';

const PreferredNameContext = createContext();

export const PreferredNameProvider = ({ children }) => {
  const [preferredName, setPreferredNameState] = useState('Traveler');
  const auth = useAuth();
  const user = auth?.user;

  const setPreferredName = async (name) => {
    console.log('📝 setPreferredName called with:', name);
    setPreferredNameState(name);

    if (name) {
      await AsyncStorage.setItem('preferred_name', name);
      console.log('💾 AsyncStorage: stored preferred_name =', name);
    } else {
      await AsyncStorage.removeItem('preferred_name');
      console.log('🧹 AsyncStorage: removed preferred_name');
    }
  };

  useEffect(() => {
    const loadPreferredName = async () => {
      console.log('🔁 useEffect running inside PreferredNameContext');

      if (user?.id) {
        console.log('✅ User ID found:', user.id);

        const nameFromSupabase = await getProfile();
        console.log('📡 Supabase returned preferred name:', nameFromSupabase);

        if (nameFromSupabase) {
          await AsyncStorage.setItem('preferred_name', nameFromSupabase);
          setPreferredNameState(nameFromSupabase);
          console.log('📲 Context and AsyncStorage updated with Supabase name');
        } else {
          const cachedName = await AsyncStorage.getItem('preferred_name');
          console.log('📦 Retrieved preferred_name from AsyncStorage:', cachedName);

          if (cachedName) {
            setPreferredNameState(cachedName);
            console.log('⚡ Fallback to AsyncStorage name:', cachedName);
          } else {
            console.log('😬 No preferred name found anywhere. Keeping default.');
          }
        }
      } else {
        console.log('🚫 No user logged in. Clearing preferred name.');
        await AsyncStorage.removeItem('preferred_name');
        setPreferredNameState('Traveler');
      }
    };

    loadPreferredName();
  }, [user]);

  return (
    <PreferredNameContext.Provider value={{ preferredName, setPreferredName }}>
      {children}
    </PreferredNameContext.Provider>
  );
};

export const usePreferredName = () => useContext(PreferredNameContext);
