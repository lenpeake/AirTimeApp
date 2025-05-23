import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleWaitNotification } from '../utils/Notifications';
import ScreenWithHeaderFooter from '../components/ScreenWithHeaderFooter';
import { useTranslation } from 'react-i18next';
import { supabase } from './supabase'; // ✅ added

const API_KEY = 'ngEO7KsYQqb0lGtd4As1H0OnJdYeSWjR';
const BASE_URL = 'https://www.tsawaittimes.com/api';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function useDebouncedCallback(callback, delay) {
  const timeoutRef = useRef(null);

  return (...args) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

// ✅ NEW FUNCTION
async function addToMonitoredAirportsIfNeeded(airportCode) {
  try {
    await supabase
      .from('monitored_airports')
      .upsert(
        [{ airport_code: airportCode, added_by_user: true }],
        { onConflict: ['airport_code'] }
      );
    console.log(`✅ Airport ${airportCode} added to monitored list.`);
  } catch (err) {
    console.error(`❌ Failed to add ${airportCode} to monitored airports:`, err.message);
  }
}

export default function AirportSelectionPage({ navigation }) {
  const { t, i18n } = useTranslation();

  const [airports, setAirports] = useState([]);
  const [query, setQuery] = useState('');
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/airports/${API_KEY}/json`)
      .then((response) => response.json())
      .then((data) => setAirports(data))
      .catch((error) => console.error('✈️ Airport List Fetch Error:', error));
  }, []);

  useEffect(() => {
    const loadStoredData = async () => {
      const savedAirport = await AsyncStorage.getItem('lastAirport');
      const savedLang = await AsyncStorage.getItem('preferredLanguage');
      if (savedLang) i18n.changeLanguage(savedLang);
      if (savedAirport) {
        const airport = JSON.parse(savedAirport);
        setQuery(`${airport.name} (${airport.code})`);
        setSelectedAirport(airport);
      }
    };
    loadStoredData();
  }, []);

  const debouncedFindAirport = useDebouncedCallback((text) => {
    if (text) {
      try {
        const safePattern = escapeRegExp(text.trim());
        const regex = new RegExp(safePattern, 'i');
        const filtered = airports.filter(
          (airport) =>
            airport.name.search(regex) >= 0 || airport.code.search(regex) >= 0
        );
        setFilteredAirports(filtered);
      } catch (err) {
        console.warn('Regex creation failed:', err.message);
        setFilteredAirports([]);
      }
    } else {
      setFilteredAirports([]);
    }
  }, 300);

  const handleInputChange = (text) => {
    setQuery(text);
    setSelectedAirport(null);
    debouncedFindAirport(text);
  };

  const selectAirport = async (airport) => {
    setQuery(`${airport.name} (${airport.code})`);
    setSelectedAirport(airport);
    setFilteredAirports([]);
    await AsyncStorage.setItem('lastAirport', JSON.stringify(airport));
  };

  const handleConfirm = async () => {
    if (!selectedAirport) {
      Alert.alert(t('airportSelection.alertMessage'));
      return;
    }

    setLoading(true);
    try {
      // ✅ Add to monitored list before proceeding
      await addToMonitoredAirportsIfNeeded(selectedAirport.code);

      const url = `${BASE_URL}/airport/${API_KEY}/${selectedAirport.code}/json`;
      const response = await fetch(url, {
        headers: {
          'Cache-Control': 'max-age=30',
        },
      });

      const text = await response.text();

      if (!response.ok || !text.trim().startsWith('{')) {
        throw new Error('Invalid response from TSA API');
      }

      const waitTimeData = JSON.parse(text);
      waitTimeData.hourly = waitTimeData.estimated_hourly_times.map((item) => ({
        hour: item.timeslot,
        wait: Math.round(parseFloat(item.waittime)),
      }));

      const estimatedWaitTime = waitTimeData.rightnow || 15;
      scheduleWaitNotification(estimatedWaitTime);

      await AsyncStorage.setItem('preferredLanguage', i18n.language);

      navigation.navigate('AirportDetails', {
        airportCode: selectedAirport.code,
        airportName: selectedAirport.name,
        waitTimes: waitTimeData,
        language: i18n.language,
      });
    } catch (error) {
      console.error('❌ Error fetching wait time data:', error.message);
      Alert.alert('Error', t('airportSelection.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://imagizer.imageshack.com/img924/7739/OxEREx.jpg' }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScreenWithHeaderFooter navigation={navigation}>
        <Text style={styles.title}>{t('airportSelection.title')}</Text>

        <Autocomplete
          data={filteredAirports}
          value={query}
          placeholder={t('airportSelection.placeholder')}
          onChangeText={handleInputChange}
          flatListProps={{
            keyExtractor: (_, idx) => idx.toString(),
            renderItem: ({ item }) => (
              <TouchableOpacity onPress={() => selectAirport(item)}>
                <Text style={styles.itemText}>
                  {item.name} ({item.code})
                </Text>
              </TouchableOpacity>
            ),
          }}
          containerStyle={styles.autocompleteContainer}
          inputContainerStyle={styles.inputContainer}
          style={styles.inputText}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>{t('airportSelection.confirmButton')}</Text>
          </TouchableOpacity>
        )}
      </ScreenWithHeaderFooter>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
    color: '#111827',
  },
  autocompleteContainer: {
    width: '100%',
    zIndex: 1,
  },
  inputContainer: {
    borderWidth: 0,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  inputText: {
    fontSize: 20,
    fontFamily: 'Inter_18pt',
    color: '#111827',
  },
  itemText: {
    fontSize: 18,
    padding: 8,
    fontFamily: 'Inter_18pt',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Inter-Bold',
  },
});
