import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Animated,
  Easing,
  Dimensions
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import ScreenWithHeaderFooter from '../components/ScreenWithHeaderFooter';

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
    marginBottom: 24,
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
  cardTransparent: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
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
  hourList: { maxHeight: 160 },
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
});
