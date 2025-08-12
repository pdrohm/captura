import { Territory } from '@/src/types/domain';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { TerritoryCard } from './TerritoryCard';
import { TerritoryStats } from './TerritoryStats';

interface TerritoryListProps {
  territories: Territory[];
  loading: boolean;
  onRefresh: () => void;
  onTerritoryPress: (territory: Territory) => void;
  onTerritoryEdit: (territory: Territory) => void;
  onTerritoryDelete: (territory: Territory) => void;
  testID?: string;
  headerTitle?: string;
  headerSubtitle?: string;
}

export const TerritoryList: React.FC<TerritoryListProps> = ({
  territories,
  loading,
  onRefresh,
  onTerritoryPress,
  onTerritoryEdit,
  onTerritoryDelete,
  testID,
  headerTitle,
  headerSubtitle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'area'>('date');

  // Filter and sort territories
  const filteredAndSortedTerritories = useMemo(() => {
    let filtered = territories;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = territories.filter(territory =>
        territory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        territory.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'area':
          return b.area - a.area;
        default:
          return 0;
      }
    });
  }, [territories, searchQuery, sortBy]);

  // Calculate total stats
  const totalStats = useMemo(() => {
    const totalArea = territories.reduce((sum, territory) => sum + territory.area, 0);
    const totalBoundaries = territories.reduce((sum, territory) => sum + territory.boundaries.length, 0);
    
    return {
      totalTerritories: territories.length,
      totalArea,
      totalBoundaries,
      averageArea: territories.length > 0 ? totalArea / territories.length : 0,
    };
  }, [territories]);

  const handleTerritoryDelete = useCallback((territory: Territory) => {
    Alert.alert(
      'Delete Territory',
      `Are you sure you want to delete "${territory.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onTerritoryDelete(territory)
        },
      ]
    );
  }, [onTerritoryDelete]);

  const renderSortButton = useCallback((type: 'date' | 'name' | 'area', label: string) => (
    <TouchableOpacity
      style={[styles.sortButton, sortBy === type && styles.sortButtonActive]}
      onPress={() => setSortBy(type)}
      testID={`${testID}-sort-${type}`}
    >
      <Text style={[styles.sortButtonText, sortBy === type && styles.sortButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  ), [sortBy, testID]);

  const renderTerritoryItem = useCallback(({ item }: { item: Territory }) => (
    <TerritoryCard
      territory={item}
      onPress={() => onTerritoryPress(item)}
      onEdit={() => onTerritoryEdit(item)}
      onDelete={() => handleTerritoryDelete(item)}
      testID={`${testID}-card-${item.id}`}
    />
  ), [onTerritoryPress, onTerritoryEdit, handleTerritoryDelete, testID]);

  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyState} testID={`${testID}-empty`}>
      <Ionicons name="map-outline" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No Territories Found</Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchQuery ? 'Try adjusting your search terms' : 'Start conquering territories to see them here!'}
      </Text>
    </View>
  ), [searchQuery, testID]);

  return (
    <View style={styles.container} testID={testID}>

     
      {/* Territory Stats Header */}
      <TerritoryStats stats={totalStats} testID={`${testID}-stats`} />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search territories..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          testID={`${testID}-search`}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
            testID={`${testID}-clear-search`}
          >
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Sort Buttons */}
      <View style={styles.sortContainer}>
        {renderSortButton('date', 'Date')}
        {renderSortButton('name', 'Name')}
        {renderSortButton('area', 'Area')}
      </View>

      {/* Territory List */}
      <FlatList
        data={filteredAndSortedTerritories}
        renderItem={renderTerritoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        testID={`${testID}-list`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 0,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 122, 255, 0.2)',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  sortContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  sortButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
