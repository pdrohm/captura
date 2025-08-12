import { Territory } from '@/src/types/domain';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TerritoryCardProps {
  territory: Territory;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  testID?: string;
}

export const TerritoryCard: React.FC<TerritoryCardProps> = ({
  territory,
  onPress,
  onEdit,
  onDelete,
  testID,
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatArea = (area: number) => {
    if (area >= 10000) {
      return `${(area / 10000).toFixed(2)} ha`;
    } else {
      return `${area.toFixed(0)} m²`;
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      testID={testID}
    >
      {/* Territory Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {territory.name}
          </Text>
          <Text style={styles.date}>
            {formatDate(territory.createdAt)}
          </Text>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onEdit}
            testID={`${testID}-edit`}
          >
            <Ionicons name="pencil" size={16} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onDelete}
            testID={`${testID}-delete`}
          >
            <Ionicons name="trash" size={16} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Territory Description */}
      {territory.description && (
        <Text style={styles.description} numberOfLines={2}>
          {territory.description}
        </Text>
      )}

      {/* Territory Stats */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Ionicons name="resize" size={16} color="#666" />
          <Text style={styles.statText}>
            {formatArea(territory.area)}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Ionicons name="location" size={16} color="#666" />
          <Text style={styles.statText}>
            {territory.boundaries.length} points
          </Text>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.statText}>
            {territory.status}
          </Text>
        </View>
      </View>

      {/* Owner Information */}
      {territory.owner && (
        <View style={styles.ownerContainer}>
          <View style={styles.ownerInfo}>
            <View style={styles.ownerAvatar}>
              <Text style={styles.avatarText}>
                {territory.owner.displayName?.charAt(0) || territory.owner.email.charAt(0)}
              </Text>
            </View>
            <View style={styles.ownerDetails}>
              <Text style={styles.ownerName}>
                {territory.owner.displayName || 'Anonymous User'}
              </Text>
              <Text style={styles.ownerLabel}>Owner</Text>
            </View>
          </View>
        </View>
      )}

      {!territory.owner && territory.assignedTo && (
        <View style={styles.ownerContainer}>
          <View style={styles.ownerInfo}>
            <View style={styles.ownerAvatar}>
              <Ionicons name="person" size={16} color="#666" />
            </View>
            <View style={styles.ownerDetails}>
              <Text style={styles.ownerName}>Loading owner...</Text>
              <Text style={styles.ownerLabel}>Owner</Text>
            </View>
          </View>
        </View>
      )}

      {/* Territory Preview (Mini Map Placeholder) */}
      <View style={styles.previewContainer}>
        <View style={styles.preview}>
          <Ionicons name="map-outline" size={24} color="#ccc" />
          <Text style={styles.previewText}>Map Preview</Text>
        </View>
      </View>

      {/* Territory Status Badge */}
      <View style={[styles.statusBadge, styles[`status${territory.status}`]]}>
        <Text style={styles.statusText}>
          {territory.status.charAt(0).toUpperCase() + territory.status.slice(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  previewContainer: {
    height: 80,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusactive: {
    backgroundColor: '#d4edda',
  },
  statusinactive: {
    backgroundColor: '#f8d7da',
  },
  statuspending: {
    backgroundColor: '#fff3cd',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  ownerContainer: {
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  ownerDetails: {
    flex: 1,
  },
  ownerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  ownerLabel: {
    fontSize: 12,
    color: '#666',
  },
});
