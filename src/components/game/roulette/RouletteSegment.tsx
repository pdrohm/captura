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
  const endAngle = (index + 1) * angle;
  const midAngle = (startAngle + endAngle) / 2;

  // Convert angles to radians
  const startRad = (startAngle - 90) * (Math.PI / 180);
  const endRad = (endAngle - 90) * (Math.PI / 180);
  const midRad = (midAngle - 90) * (Math.PI / 180);

  // Calculate path for the segment
  const x1 = center + radius * Math.cos(startRad);
  const y1 = center + radius * Math.sin(startRad);
  const x2 = center + radius * Math.cos(endRad);
  const y2 = center + radius * Math.sin(endRad);

  // Calculate text position
  const textRadius = radius * 0.7;
  const textX = center + textRadius * Math.cos(midRad);
  const textY = center + textRadius * Math.sin(midRad);

  // Create SVG path for the segment
  const largeArcFlag = angle > 180 ? 1 : 0;
  const path = [
    `M ${center} ${center}`,
    `L ${x1} ${y1}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
    'Z',
  ].join(' ');

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
          <Text style={styles.segmentIcon}>{segment.icon}</Text>
          <Text style={styles.segmentLabel} numberOfLines={1}>
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
  },
  segmentLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
