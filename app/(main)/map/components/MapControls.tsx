import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface MapControlsProps {
  conquestStatus: string;
  locationPermissionGranted: boolean;
  onConquestPress: () => void;
  onLocationPress: () => void;
  getConquestButtonIcon: (status: string) => string;
  getConquestButtonColor: (status: string) => string;
  getConquestButtonBackground: () => string;
  testID?: string;
}

export const MapControls: React.FC<MapControlsProps> = ({
  conquestStatus,
  locationPermissionGranted,
  onConquestPress,
  onLocationPress,
  getConquestButtonIcon,
  getConquestButtonColor,
  getConquestButtonBackground,
  testID,
}) => {
  return (
    <>
      {/* Conquest Mode Floating Action Button */}
      <TouchableOpacity
        style={[
          styles.conquestButton,
          { backgroundColor: getConquestButtonBackground() }
        ]}
        onPress={onConquestPress}
        testID={`${testID}-conquest-button`}
      >
        <Ionicons
          name={getConquestButtonIcon(conquestStatus) as any}
          size={28}
          color={getConquestButtonColor(conquestStatus)}
        />
      </TouchableOpacity>

      {/* Custom Location Button */}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={onLocationPress}
        testID={`${testID}-location-button`}
      >
        <Ionicons
          name={locationPermissionGranted ? "location" : "location-outline"}
          size={24}
          color={locationPermissionGranted ? "#007AFF" : "#8E8E93"}
        />
      </TouchableOpacity>

   
    </>
  );
};

const styles = StyleSheet.create({
  locationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  debugButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  conquestButton: {
    position: 'absolute',
    bottom: 100, // Adjust as needed
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

