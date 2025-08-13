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
        <View style={styles.titleSection}>
          <ThemedText type="title" style={styles.title}>
            {displayTerritory.name}
          </ThemedText>
          <View style={styles.statusBadge}>
            <ThemedText style={styles.statusBadgeText}>
              {displayTerritory.status.toUpperCase()}
            </ThemedText>
          </View>
        </View>
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
            Territory Statistics
          </ThemedText>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>{formatArea(displayTerritory.area)}</ThemedText>
              <ThemedText style={styles.statLabel}>Total Area</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>{displayTerritory.boundaries.length}</ThemedText>
              <ThemedText style={styles.statLabel}>Boundary Points</ThemedText>
            </View>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Created:</ThemedText>
            <ThemedText style={styles.infoValue}>{formatDate(displayTerritory.createdAt)}</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Last Updated:</ThemedText>
            <ThemedText style={styles.infoValue}>{formatDate(displayTerritory.updatedAt)}</ThemedText>
          </View>
        </View>

        {displayTerritory.owner && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Territory Owner
            </ThemedText>
            <View style={styles.ownerCard}>
              <View style={[
                styles.ownerAvatar, 
                { backgroundColor: displayTerritory.owner.color || '#007AFF' }
              ]}>
                <ThemedText style={styles.avatarText}>
                  {displayTerritory.owner.displayName?.charAt(0) || displayTerritory.owner.email.charAt(0)}
                </ThemedText>
              </View>
              <View style={styles.ownerDetails}>
                <ThemedText style={styles.ownerName}>
                  {displayTerritory.owner.displayName || 'Anonymous User'}
                </ThemedText>
                <ThemedText style={styles.ownerEmail}>{displayTerritory.owner.email}</ThemedText>
                <View style={styles.ownerMeta}>
                  <ThemedText style={styles.ownerMetaText}>
                    Conquered {formatDate(displayTerritory.createdAt)}
                  </ThemedText>
                </View>
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
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  titleSection: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
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
  ownerCard: {
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.1)',
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
    marginBottom: 4,
  },
  ownerMeta: {
    marginTop: 4,
  },
  ownerMetaText: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.2)',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.8,
    textAlign: 'center',
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
