import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ConquestStatusProps {
  status: string;
  trackedPoints: { id: string; latitude: number; longitude: number; accuracy?: number }[];
  totalDistance: number;
  totalArea: number;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onCancel: () => void;
  testID?: string;
}

export const ConquestStatus: React.FC<ConquestStatusProps> = ({
  status,
  trackedPoints,
  totalDistance,
  totalArea,
  onPause,
  onResume,
  onStop,
  onCancel,
  testID,
}) => {
  if (status !== 'tracking' && status !== 'paused' && status !== 'completed') return null;

  return (
    <View style={styles.conquestStatusContainer} testID={testID}>
      <View style={styles.conquestStatusContent}>
        <View style={styles.conquestStatusRow}>
          <Ionicons 
            name={status === 'tracking' ? 'location' : status === 'paused' ? 'pause-circle' : 'checkmark-circle'} 
            size={20} 
            color={status === 'tracking' ? '#34C759' : status === 'paused' ? '#FF9500' : '#34C759'} 
          />
          <Text style={styles.conquestStatusText}>
            {status === 'tracking' ? 'Conquest Active' : status === 'paused' ? 'Conquest Paused' : 'Conquest Complete!'}
          </Text>
        </View>
        <View style={styles.conquestStatsRow}>
          <Text style={styles.conquestStatsText}>
            Path Length: {(totalDistance / 1000).toFixed(2)} km | 
            Points: {trackedPoints.length} | 
            Area: {(totalArea / 10000).toFixed(2)} ha
          </Text>
        </View>
        {status !== 'completed' && (
          <View style={styles.conquestActionsRow}>
            {status === 'tracking' && (
              <TouchableOpacity style={styles.conquestActionButton} onPress={onPause}>
                <Text style={styles.conquestActionButtonText}>Pause</Text>
              </TouchableOpacity>
            )}
            {status === 'paused' && (
              <TouchableOpacity style={styles.conquestActionButton} onPress={onResume}>
                <Text style={styles.conquestActionButtonText}>Resume</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.conquestActionButton, styles.conquestActionButtonComplete]} 
              onPress={onStop}
            >
              <Text style={styles.conquestActionButtonText}>Complete</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.conquestActionButton, styles.conquestActionButtonDanger]} 
              onPress={onCancel}
            >
              <Text style={styles.conquestActionButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
        {status === 'completed' && (
          <View style={styles.conquestActionsRow}>
            <TouchableOpacity 
              style={[styles.conquestActionButton, styles.conquestActionButtonComplete]} 
              onPress={onCancel}
            >
              <Text style={styles.conquestActionButtonText}>Start New Conquest</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  conquestStatusContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    padding: 10,
    zIndex: 10,
  },
  conquestStatusContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  conquestStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  conquestStatusText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
  },
  conquestStatsRow: {
    marginBottom: 10,
  },
  conquestStatsText: {
    color: '#fff',
    fontSize: 12,
  },
  conquestActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  conquestActionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  conquestActionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  conquestActionButtonDanger: {
    backgroundColor: '#FF3B30',
  },
  conquestActionButtonComplete: {
    backgroundColor: '#34C759',
  },
});

