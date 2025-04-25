<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
=======
import React from 'react';
>>>>>>> 694cb3ef9322a5a6dfc6a290f12298295a3edd6f
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Animated,
  Easing,
<<<<<<< HEAD
  Dimensions,
  Alert,
  TouchableOpacity,
=======
  Dimensions
>>>>>>> 694cb3ef9322a5a6dfc6a290f12298295a3edd6f
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import ScreenWithHeaderFooter from '../components/ScreenWithHeaderFooter';
<<<<<<< HEAD
import { useWaitTimeReminder } from './WaitTimeReminderProvider';

const screenWidth = Dimensions.get('window').width;
const API_KEY = 'ngEO7KsYQqb0lGtd4As1H0OnJdYeSWjR';
const BASE_URL = 'https://www.tsawaittimes.com/api';

export default function AirportDetails({ route, navigation }) {
  const { startReminder } = useWaitTimeReminder();
  const { airportCode, airportName, waitTimes: initialWaitTimes } = route.params;
  const { t } = useTranslation();

  const [waitTimes, setWaitTimes] = useState(initialWaitTimes);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const tableAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fallbackMinutes = 2;
    const estimatedMinutes = Math.max(fallbackMinutes, initialWaitTimes?.estimatedMinutes || 0);
    console.log('🧪 Scheduling reminder with estimatedMinutes =', estimatedMinutes);

    startReminder({
      airportCode,
      estimatedMinutes,
      deviceId: 'abc123-device-xyz',
    });

    Animated.timing(tableAnim, {
      toValue: 1,
      duration: 800,
      delay: 400,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchLatestWaitTimes = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`${BASE_URL}/airport/${API_KEY}/${airportCode}/json`);
      const text = await response.text();

      if (!response.ok || !text.trim().startsWith('{')) {
        throw new Error('Invalid response from TSA API');
      }

      const data = JSON.parse(text);
      data.hourly = data.estimated_hourly_times.map((item) => ({
        hour: item.timeslot,
        wait: Math.round(parseFloat(item.waittime)),
      }));

      setWaitTimes(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('❌ TSA API Refresh Error:', error.message);
      Alert.alert('Error', t('airportSelection.fetchError'));
    } finally {
      setRefreshing(false);
    }
  };

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const hour = ((hours + 11) % 12 + 1);
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour}:${paddedMinutes} ${suffix}`;
  };

  const hourlyLabels = waitTimes.estimated_hourly_times?.map((slot) => slot.timeslot.split(' ')[0]) || [];
  const hourlyData = waitTimes.estimated_hourly_times?.map((slot) =>
    typeof slot.waittime === 'number' ? slot.waittime : 0
  ) || [];
=======

const screenWidth = Dimensions.get('window').width;

export default function AirportDetails({ route, navigation }) {
  const { airportCode, airportName, waitTimes } = route.params;
  const { t } = useTranslation();

  const hourlyLabels =
    waitTimes.estimated_hourly_times?.map((slot) => slot.timeslot.split(' ')[0]) || [];

  const hourlyData =
    waitTimes.estimated_hourly_times?.map((slot) =>
      typeof slot.waittime === 'number' ? slot.waittime : 0
    ) || [];
>>>>>>> 694cb3ef9322a5a6dfc6a290f12298295a3edd6f

  const pulse = new Animated.Value(1);
  Animated.loop(
    Animated.sequence([
      Animated.timing(pulse, {
        toValue: 1.03,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(pulse, {
        toValue: 1,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  ).start();

  return (
    <ScreenWithHeaderFooter navigation={navigation}>
<<<<<<< HEAD
      <ScrollView contentContainerStyle={{ paddingBottom: 60, flexGrow: 1 }} nestedScrollEnabled={true}>
        <View style={styles.headerAirportContainer}>
          <Text style={styles.headerAirport}>
            {airportName} ({airportCode})
          </Text>
        </View>

        <Animated.View style={[styles.cardHighlightLux, { transform: [{ scale: pulse }] }]}>
          <LinearGradient
            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.15)']}
            style={styles.gradientBox}
          >
            <View style={styles.clockRow}>
              <Image
                source={require('../assets/clock_premium.png')}
                style={styles.clockIcon}
                resizeMode="contain"
              />
              <Text style={styles.labelHighlight}>{t('details.title')}</Text>
            </View>
            <Text style={styles.valueHighlight}>
              {waitTimes.rightnow_description || t('details.notAvailable')}
            </Text>
          </LinearGradient>
        </Animated.View>

        <View style={styles.refreshArea}>
          <TouchableOpacity onPress={fetchLatestWaitTimes}>
            <Text style={styles.refreshText}>
              {refreshing ? 'Refreshing...' : '🔄 Refresh'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.timestampText}>
            {t('Last Updated')}: {formatTime(lastUpdated)}
          </Text>
        </View>

        <View style={styles.badgeRow}>
          <View style={[styles.badge, waitTimes.precheck === 1 ? styles.badgeAvailable : styles.badgeUnavailable]}>
            <Text style={styles.badgeText}>
              TSA Pre✓  {waitTimes.precheck === 1 ? 'Available' : 'Not Available'}
            </Text>
          </View>
          <View style={[styles.badge, styles.badgeUnavailable]}>
            <Text style={styles.badgeText}>CLEAR: Coming Soon</Text>
          </View>
        </View>

        <Animated.View
          style={{
            opacity: tableAnim,
            transform: [{ translateY: tableAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
          }}
        >
          <View style={styles.scrollableCard}>
            <Text style={styles.label}>{t('details.hourlyEstimates')}</Text>
            <Text style={styles.scrollHintTop}>{t('details.scrollHint')}</Text>
            <ScrollView
              style={styles.hourList}
              showsVerticalScrollIndicator
              persistentScrollbar
              nestedScrollEnabled
            >
              {waitTimes.estimated_hourly_times?.map((slot, index) => (
                <View key={index} style={styles.row}>
                  <Text style={styles.time}>{slot.timeslot}</Text>
                  <Text style={styles.wait}>
                    {typeof slot.waittime === 'number'
                      ? `${slot.waittime.toFixed(1)} ${t('units.minutes')}`
                      : t('details.notAvailable')}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </Animated.View>

        {hourlyData.length > 0 && (
          <View style={styles.chartContainerTransparent}>
            <Text style={styles.label}>{t('details.hourlyEstimates')}</Text>
            <LineChart
              data={{ labels: hourlyLabels, datasets: [{ data: hourlyData }] }}
              width={screenWidth - 40}
              height={220}
              yAxisSuffix={t('units.minutes')}
              chartConfig={{
                backgroundGradientFrom: '#f3f4f6',
                backgroundGradientTo: '#e5e7eb',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                propsForDots: {
                  r: '3',
                  strokeWidth: '2',
                  stroke: '#2563eb',
                },
              }}
              bezier
              style={{ marginVertical: 16, borderRadius: 16 }}
            />
          </View>
        )}
      </ScrollView>
=======
      <View style={styles.headerAirportContainer}>
        <Text style={styles.headerAirport}>
          {airportName} ({airportCode})
        </Text>
      </View>

      <Animated.View style={[styles.cardHighlightLux, { transform: [{ scale: pulse }] }]}>
        <LinearGradient
          colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.15)']}
          style={styles.gradientBox}
        >
          <View style={styles.clockRow}>
            <Image
              source={require('../assets/clock_premium.png')}
              style={styles.clockIcon}
              resizeMode="contain"
            />
            <Text style={styles.labelHighlight}>{t('details.title')}</Text>
          </View>
          <Text style={styles.valueHighlight}>
            {waitTimes.rightnow_description || t('details.notAvailable')}
          </Text>
        </LinearGradient>
      </Animated.View>

      <View style={styles.cardTransparent}>
        <Text style={styles.label}>{t('details.precheck')}</Text>
        <Text style={styles.value}>
          {waitTimes.precheck === 1
            ? t('details.available')
            : t('details.notAvailable')}
        </Text>
      </View>

      <View style={styles.scrollableCard}>
        <Text style={styles.label}>{t('details.hourlyEstimates')}</Text>
        <Text style={styles.scrollHintTop}>{t('details.scrollHint')}</Text>
        <ScrollView
          style={styles.hourList}
          showsVerticalScrollIndicator
          persistentScrollbar
          nestedScrollEnabled
        >
          {waitTimes.estimated_hourly_times?.map((slot, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.time}>{slot.timeslot}</Text>
              <Text style={styles.wait}>
                {typeof slot.waittime === 'number'
                  ? `${slot.waittime.toFixed(1)} ${t('units.minutes')}`
                  : t('details.notAvailable')}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {hourlyData.length > 0 && (
        <View style={styles.chartContainerTransparent}>
          <Text style={styles.label}>{t('details.hourlyEstimates')}</Text>
          <LineChart
            data={{ labels: hourlyLabels, datasets: [{ data: hourlyData }] }}
            width={screenWidth - 40}
            height={220}
            yAxisSuffix={` ${t('units.minutes')}`}
            chartConfig={{
              backgroundGradientFrom: '#f3f4f6',
              backgroundGradientTo: '#e5e7eb',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
              propsForDots: {
                r: '3',
                strokeWidth: '2',
                stroke: '#2563eb',
              },
            }}
            bezier
            style={{ marginVertical: 16, borderRadius: 16 }}
          />
        </View>
      )}
>>>>>>> 694cb3ef9322a5a6dfc6a290f12298295a3edd6f
    </ScreenWithHeaderFooter>
  );
}

const styles = StyleSheet.create({
  headerAirportContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  headerAirport: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 22,
    color: '#111827',
  },
  cardHighlightLux: {
    borderRadius: 20,
    overflow: 'hidden',
<<<<<<< HEAD
    marginBottom: 8,
=======
    marginBottom: 24,
>>>>>>> 694cb3ef9322a5a6dfc6a290f12298295a3edd6f
    elevation: 10,
  },
  gradientBox: {
    padding: 28,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#94a3b8',
  },
  clockRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  clockIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    opacity: 0.95,
  },
  labelHighlight: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 30,
    color: '#1e40af',
  },
  valueHighlight: {
    fontFamily: 'Inter-Bold',
    fontSize: 30,
    color: '#111827',
    textAlign: 'center',
  },
<<<<<<< HEAD
  refreshArea: {
    alignItems: 'center',
    marginBottom: 20,
  },
  refreshText: {
    fontFamily: 'Inter_18pt',
    fontSize: 16,
    color: '#2563eb',
  },
  timestampText: {
    fontFamily: 'Inter_18pt',
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
=======
  cardTransparent: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
>>>>>>> 694cb3ef9322a5a6dfc6a290f12298295a3edd6f
  },
  label: {
    fontFamily: 'PlayfairDisplay',
    fontSize: 25,
    color: '#1e40af',
    marginBottom: 4,
  },
  value: {
    fontFamily: 'Inter_18pt',
    fontSize: 16,
    color: '#111827',
  },
  scrollableCard: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 10,
    padding: 16,
    maxHeight: 220,
    marginBottom: 20,
  },
<<<<<<< HEAD
  hourList: {
    height: 160,
  },
=======
  hourList: { maxHeight: 160 },
>>>>>>> 694cb3ef9322a5a6dfc6a290f12298295a3edd6f
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  time: {
    fontFamily: 'Inter_18pt',
    fontSize: 14,
    color: '#1f2937',
  },
  wait: {
    fontFamily: 'Inter_18pt',
    fontSize: 14,
    color: '#111827',
  },
  scrollHintTop: {
    fontFamily: 'Inter_18pt',
    textAlign: 'center',
    fontSize: 12,
    color: '#000000',
    marginBottom: 4,
  },
  chartContainerTransparent: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 16,
    padding: 12,
  },
<<<<<<< HEAD
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#d1d5db',
  },
  badgeAvailable: {
    backgroundColor: '#10b981',
  },
  badgeUnavailable: {
    backgroundColor: '#f87171',
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_18pt',
  },
=======
>>>>>>> 694cb3ef9322a5a6dfc6a290f12298295a3edd6f
});
