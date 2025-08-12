import { LoadingSpinner } from '@/app/(main)/map/components/LoadingSpinner';
import { ThemedView } from '@/src/components/ThemedView';
import { FirestoreMapRepository } from '@/src/services/firestoreMapRepository';
import { useAuthStore } from '@/src/stores/authStore';
import { Territory } from '@/src/types/domain';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { TerritoryList } from './components/TerritoryList';

export default function TerritoriesScreen() {
  const { user } = useAuthStore();
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const mapRepository = new FirestoreMapRepository();

  const loadTerritories = useCallback(async () => {
    try {
      setLoading(true);
      const loadedTerritories = await mapRepository.getTerritories({
        showTerritories: true,
        showPointsOfInterest: true,
        showBoundaries: true,
      });
      setTerritories(loadedTerritories);
    } catch (error) {
      console.error('Failed to load territories:', error);
      Alert.alert('Error', 'Failed to load territories. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTerritories();
    setRefreshing(false);
  }, [loadTerritories]);

  const handleTerritoryPress = useCallback((territory: Territory) => {
    console.log('Territory pressed:', territory);
    Alert.alert(
      territory.name,
      `${territory.description}\n\nArea: ${(territory.area / 10000).toFixed(2)} hectares\nBoundary Points: ${territory.boundaries.length}\nCreated: ${territory.createdAt.toLocaleDateString()}`,
      [
        { text: 'OK', style: 'default' },
        { text: 'View on Map', style: 'default' }
      ]
    );
  }, []);

  const handleTerritoryEdit = useCallback((territory: Territory) => {
    console.log('Edit territory:', territory);
    Alert.alert(
      'Edit Territory',
      'Territory editing feature coming soon!',
      [{ text: 'OK', style: 'default' }]
    );
  }, []);

  const handleTerritoryDelete = useCallback(async (territory: Territory) => {
    try {
      // TODO: Implement territory deletion in FirestoreMapRepository
      console.log('Delete territory:', territory);
      Alert.alert(
        'Delete Territory',
        'Territory deletion feature coming soon!',
        [{ text: 'OK', style: 'default' }]
      );
      
      // For now, just remove from local state
      setTerritories(prev => prev.filter(t => t.id !== territory.id));
    } catch (error) {
      console.error('Failed to delete territory:', error);
      Alert.alert('Error', 'Failed to delete territory. Please try again.');
    }
  }, []);

  useEffect(() => {
    loadTerritories();
  }, [loadTerritories]);

  if (loading && !refreshing) {
    return (
      <ThemedView style={styles.container}>
        <LoadingSpinner message="Loading territories..." testID="territories-loading" />
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Territory List with integrated header */}
      <TerritoryList
        territories={territories}
        loading={refreshing}
        onRefresh={handleRefresh}
        onTerritoryPress={handleTerritoryPress}
        onTerritoryEdit={handleTerritoryEdit}
        onTerritoryDelete={handleTerritoryDelete}
        testID="territories-list"
        headerTitle="My Territories"
        headerSubtitle={`${territories.length} territories conquered`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});
