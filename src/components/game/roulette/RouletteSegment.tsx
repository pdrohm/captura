import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { RouletteSegment as RouletteSegmentType } from '../../../types/roulette';

interface RouletteSegmentProps {
  segment: RouletteSegmentType;
  index: number;
  totalSegments: number;
  angle: number;
  radius: number;
  center: number;
}

export const RouletteSegment: React.FC<RouletteSegmentProps> = ({
  segment,
  index,
  totalSegments,
  angle,
  radius,
  center,
}) => {
  const startAngle = index * angle;

  // Function to determine if text should be black or white based on background color
  const getTextColor = (backgroundColor: string): string => {
    // Convert hex to RGB
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate luminance using the formula: 0.299*R + 0.587*G + 0.114*B
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Use black text on light backgrounds, white text on dark backgrounds
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };



  return (
    <View style={styles.segmentContainer}>
      <View
        style={[
          styles.segment,
          {
            backgroundColor: segment.color,
            transform: [
              { rotate: `${startAngle}deg` },
              { translateX: center },
              { translateY: center },
            ],
          },
        ]}
      >
        <View style={styles.segmentContent}>
          <Text 
            style={[
              styles.segmentIcon, 
              { 
                color: getTextColor(segment.color),
                textShadowColor: getTextColor(segment.color) === '#FFFFFF' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              }
            ]}
          >
            {segment.icon}
          </Text>
          <Text 
            style={[
              styles.segmentLabel, 
              { 
                color: getTextColor(segment.color),
                textShadowColor: getTextColor(segment.color) === '#FFFFFF' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              }
            ]} 
            numberOfLines={1}
          >
            {segment.label}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  segmentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  segment: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    transformOrigin: '100% 100%',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
  },
  segmentContent: {
    position: 'absolute',
    top: '20%',
    left: '20%',
    right: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-45deg' }],
  },
  segmentIcon: {
    fontSize: 16,
    marginBottom: 2,
    fontWeight: 'bold',
  },
  segmentLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
