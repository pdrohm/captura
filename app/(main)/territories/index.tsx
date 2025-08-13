import { LoadingSpinner } from '@/app/(main)/map/components/LoadingSpinner';
import { ThemedView } from '@/src/components/ThemedView';
import { FirestoreMapRepository } from '@/src/services/firestoreMapRepository';
import { useAuthStore } from '@/src/stores/authStore';
import { useMapStore } from '@/src/stores/mapStore';
import { Territory } from '@/src/types/domain';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { TerritoryList } from './components/TerritoryList';
import { TerritoryModalScreen } from './components/TerritoryModalScreen';

export default function TerritoriesScreen() {
  const { user } = useAuthStore();
  const { territories: mapStoreTerritories, setTerritories: setMapStoreTerritories } = useMapStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const mapRepository = new FirestoreMapRepository();

  const loadTerritories = useCallback(async () => {
    try {
      setLoading(true);
      const loadedTerritories = await mapRepository.getTerritories({
        showTerritories: true,
        showPointsOfInterest: true,
        showBoundaries: true,
      });
      setMapStoreTerritories(loadedTerritories);
    } catch (error) {
      console.error('Failed to load territories:', error);
      Alert.alert('Error', 'Failed to load territories. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [mapRepository, setMapStoreTerritories]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTerritories();
    setRefreshing(false);
  }, [loadTerritories]);

  const handleTerritoryPress = useCallback((territory: Territory) => {
    console.log('Territory pressed:', territory);
    console.log('Setting selected territory and showing modal...');
    setSelectedTerritory(territory);
    setShowDetailsModal(true);
    console.log('Modal state should now be visible');
  }, []);

  const handleTerritoryEdit = useCallback((territory: Territory) => {
    console.log('Edit territory:', territory);
    setSelectedTerritory(territory);
    setShowDetailsModal(true);
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
      setMapStoreTerritories(mapStoreTerritories.filter(t => t.id !== territory.id));
    } catch (error) {
      console.error('Failed to delete territory:', error);
      Alert.alert('Error', 'Failed to delete territory. Please try again.');
    }
  }, [mapStoreTerritories, setMapStoreTerritories]);

  const handleCloseDetails = useCallback(() => {
    setShowDetailsModal(false);
    setSelectedTerritory(null);
  }, []);

  const handleEditTerritory = useCallback(() => {
    Alert.alert(
      'Edit Territory',
      'Territory editing feature coming soon!',
      [{ text: 'OK', style: 'default' }]
    );
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

  console.log('Render state:', { showDetailsModal, selectedTerritory: !!selectedTerritory });

  return (
    <View style={styles.container}>
      {/* Territory List with integrated header */}
      <TerritoryList
        territories={mapStoreTerritories}
        loading={refreshing}
        onRefresh={handleRefresh}
        onTerritoryPress={handleTerritoryPress}
        onTerritoryEdit={handleTerritoryEdit}
        onTerritoryDelete={handleTerritoryDelete}
        testID="territories-list"
        headerTitle="My Territories"
        headerSubtitle={`${mapStoreTerritories.length} territories conquered`}
      />

      {/* Territory Details Modal */}
      <TerritoryModalScreen
        visible={showDetailsModal}
        territory={selectedTerritory}
        onClose={handleCloseDetails}
        onEdit={handleEditTerritory}
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
