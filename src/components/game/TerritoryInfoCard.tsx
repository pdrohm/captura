import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import type { Territory } from '../../types/game';
import { ThemedText } from '../ThemedText';

interface TerritoryInfoCardProps {
  territory: Territory;
  onPress?: () => void;
}

export const TerritoryInfoCard: React.FC<TerritoryInfoCardProps> = ({ 
  territory, 
  onPress 
}) => {
  const ownerName = territory.owner?.displayName || 'Unknown Player';
  const ownerColor = territory.owner?.color || territory.color || '#007AFF';

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.ownerInfo}>
          <View style={[styles.ownerAvatar, { backgroundColor: ownerColor }]}>
            <ThemedText style={styles.ownerInitial}>
              {ownerName.charAt(0).toUpperCase()}
            </ThemedText>
          </View>
          <View style={styles.ownerDetails}>
            <ThemedText style={styles.ownerName}>{ownerName}</ThemedText>
            <ThemedText style={styles.territoryType}>
              {territory.type || 'Territory'}
            </ThemedText>
          </View>
        </View>
        <View style={[styles.colorIndicator, { backgroundColor: ownerColor }]} />
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <ThemedText style={styles.detailLabel}>Size:</ThemedText>
          <ThemedText style={styles.detailValue}>{territory.radius}m radius</ThemedText>
        </View>
        <View style={styles.detailRow}>
          <ThemedText style={styles.detailLabel}>Created:</ThemedText>
          <ThemedText style={styles.detailValue}>
            {territory.createdAt.toLocaleDateString()}
          </ThemedText>
        </View>
        {territory.owner?.email && (
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Owner:</ThemedText>
            <ThemedText style={styles.detailValue}>{territory.owner.email}</ThemedText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ownerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ownerInitial: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ownerDetails: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 2,
  },
  territoryType: {
    fontSize: 12,
    color: '#687076',
    textTransform: 'capitalize',
  },
  colorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#687076',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#11181C',
    fontWeight: '400',
  },
});
