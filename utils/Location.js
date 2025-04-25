// Location.js
import * as Location from 'expo-location';

export async function verifyUserAtAirport(airportCoords) {
  const userPosition = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });

  const distance = calculateDistance(
    userPosition.coords.latitude,
    userPosition.coords.longitude,
    airportCoords.latitude,
    airportCoords.longitude
  );

  // Allow submissions within 2 km of the airport
  return distance <= 2.0;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
