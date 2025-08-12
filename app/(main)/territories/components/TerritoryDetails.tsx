import { ThemedText } from '@/src/components/ThemedText';
import { ThemedView } from '@/src/components/ThemedView';
import { useAuthStore } from '@/src/stores/authStore';
import { Territory } from '@/src/types/domain';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTerritoryWithOwner } from '../hooks/useTerritoryWithOwner';

interface TerritoryDetailsProps {
  territory: Territory;
  onClose: () => void;
  onEdit?: () => void;
}

export const TerritoryDetails: React.FC<TerritoryDetailsProps> = ({
  territory,
  onClose,
  onEdit,
}) => {
  console.log('TerritoryDetails rendering with territory:', territory);
  
  const { user } = useAuthStore();
  const isOwner = user?.uid === territory.assignedTo;
  
  // If territory doesn't have owner info but has assignedTo, fetch it
  const { territory: territoryWithOwner, loading: loadingOwner } = useTerritoryWithOwner(
    territory.assignedTo && !territory.owner ? territory.id : null
  );
  
  // Use the territory with owner info if available, otherwise use the original
  const displayTerritory = territoryWithOwner || territory;

  const formatArea = (area: number) => {
    if (area < 1000) {
      return `${area.toFixed(0)} m²`;
    } else if (area < 1000000) {
      return `${(area / 1000).toFixed(1)} km²`;
    } else {
      return `${(area / 1000000).toFixed(2)} km²`;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          {displayTerritory.name}
        </ThemedText>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <ThemedText style={styles.closeButtonText}>✕</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {displayTerritory.description && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Description
            </ThemedText>
            <ThemedText style={styles.description}>{displayTerritory.description}</ThemedText>
          </View>
        )}

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Territory Info
          </ThemedText>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Area:</ThemedText>
            <ThemedText style={styles.infoValue}>{formatArea(displayTerritory.area)}</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Status:</ThemedText>
            <ThemedText style={[styles.infoValue, styles.statusText]}>
              {displayTerritory.status.charAt(0).toUpperCase() + displayTerritory.status.slice(1)}
            </ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Created:</ThemedText>
            <ThemedText style={styles.infoValue}>{formatDate(displayTerritory.createdAt)}</ThemedText>
          </View>
        </View>

        {displayTerritory.owner && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Owner
            </ThemedText>
            <View style={styles.ownerInfo}>
              {displayTerritory.owner.photoURL && (
                <View style={styles.ownerAvatar}>
                  <ThemedText style={styles.avatarText}>
                    {displayTerritory.owner.displayName?.charAt(0) || displayTerritory.owner.email.charAt(0)}
                  </ThemedText>
                </View>
              )}
              <View style={styles.ownerDetails}>
                <ThemedText style={styles.ownerName}>
                  {displayTerritory.owner.displayName || 'Anonymous User'}
                </ThemedText>
                <ThemedText style={styles.ownerEmail}>{displayTerritory.owner.email}</ThemedText>
              </View>
            </View>
          </View>
        )}

        {!displayTerritory.owner && displayTerritory.assignedTo && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Owner
            </ThemedText>
            <ThemedText style={styles.infoValue}>
              {loadingOwner ? 'Loading owner information...' : 'Owner information unavailable'}
            </ThemedText>
          </View>
        )}

        {!displayTerritory.assignedTo && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Status
            </ThemedText>
            <ThemedText style={styles.infoValue}>Unclaimed Territory</ThemedText>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {isOwner && onEdit && (
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <ThemedText style={styles.editButtonText}>Edit Territory</ThemedText>
          </TouchableOpacity>
        )}
        
        {!displayTerritory.assignedTo && user && (
          <TouchableOpacity 
            style={styles.claimButton} 
            onPress={() => {
              Alert.alert(
                'Claim Territory',
                `Would you like to claim "${displayTerritory.name}"?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Claim', style: 'default' }
                ]
              );
            }}
          >
            <ThemedText style={styles.claimButtonText}>Claim Territory</ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    flex: 1,
    marginRight: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  description: {
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontWeight: '500',
  },
  infoValue: {
    textAlign: 'right',
  },
  statusText: {
    textTransform: 'capitalize',
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ownerDetails: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  ownerEmail: {
    fontSize: 14,
    opacity: 0.7,
  },
  actions: {
    marginTop: 20,
    gap: 12,
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  claimButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  claimButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
