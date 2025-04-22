import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { getAirportWaitTimes } from './ApiService';

export default function AirportWaitTimeScreen({ route, navigation }) {
  const { airportCode } = route.params; // Airport code passed from AirportSelectionPage
  const [waitTimes, setWaitTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWaitTimes = async () => {
      try {
        const data = await getAirportWaitTimes(airportCode);
        setWaitTimes(data);
      } catch (error) {
        console.error("Failed to fetch wait times:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWaitTimes();
  }, [airportCode]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading wait times...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error fetching wait times. Please try again.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {waitTimes ? (
        <View style={styles.results}>
          <Text style={styles.header}>{waitTimes.airport || airportCode}</Text>
          {waitTimes.checkpoints && waitTimes.checkpoints.length > 0 ? (
            waitTimes.checkpoints.map((checkpoint, index) => (
              <View key={index} style={styles.checkpointCard}>
                <Text style={styles.checkpointName}>{checkpoint.checkpoint_name}</Text>
                <Text style={styles.waitTime}>{checkpoint.wait_time} minutes</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No checkpoint data available.</Text>
          )}
        </View>
      ) : (
        <Text style={styles.noDataText}>No wait-time data available.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#374151',
  },
  results: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111827',
  },
  checkpointCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  checkpointName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  waitTime: {
    fontSize: 16,
    color: '#4b5563',
    marginTop: 6,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  noDataText: {
    fontSize: 16,
    color: '#6b7280',
  },
});