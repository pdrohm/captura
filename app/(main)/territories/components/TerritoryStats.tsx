import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TerritoryStatsProps {
  stats: {
    totalTerritories: number;
    totalArea: number;
    totalBoundaries: number;
    averageArea: number;
  };
  testID?: string;
}

export const TerritoryStats: React.FC<TerritoryStatsProps> = ({
  stats,
  testID,
}) => {
  const formatArea = (area: number) => {
    if (area >= 1000000) {
      return `${(area / 1000000).toFixed(2)} km²`;
    } else if (area >= 10000) {
      return `${(area / 10000).toFixed(2)} ha`;
    } else {
      return `${area.toFixed(0)} m²`;
    }
  };


  return (
    <View style={styles.container} testID={testID}>     

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="map" size={20} color="#007AFF" />
          </View>
          <Text style={styles.statValue}>{stats.totalTerritories}</Text>
          <Text style={styles.statLabel}>Territories</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="resize" size={20} color="#34C759" />
          </View>
          <Text style={styles.statValue}>{formatArea(stats.totalArea)}</Text>
          <Text style={styles.statLabel}>Total Area</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="location" size={20} color="#FF9500" />
          </View>
          <Text style={styles.statValue}>{stats.totalBoundaries}</Text>
          <Text style={styles.statLabel}>Boundary Points</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="analytics" size={20} color="#AF52DE" />
          </View>
          <Text style={styles.statValue}>{formatArea(stats.averageArea)}</Text>
          <Text style={styles.statLabel}>Avg. Area</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Conquest Progress</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${Math.min((stats.totalTerritories / 10) * 100, 100)}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {stats.totalTerritories}/10 territories conquered
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e1e5e9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
