import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { Colors } from '../../../config/Colors';
import { RetroBorders, RetroRadius, RetroShadows, RetroText } from '../../../config/retroStyles';
import { PuzzleTileData } from '../../../types/slidingPuzzle';

interface PuzzleTileProps {
  tile: PuzzleTileData;
  gridSize: number;
  tileSize: number;
  imageSource?: string;
  onTilePress: (tileId: string) => void;
  canMove: boolean;
  disabled?: boolean;
}

export const PuzzleTile: React.FC<PuzzleTileProps> = ({
  tile,
  gridSize,
  tileSize,
  imageSource,
  onTilePress,
  canMove,
  disabled = false,
}) => {
  const colors = Colors.light;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const isDragging = useSharedValue(false);

  const calculatePosition = (position: { row: number; col: number }) => {
    return {
      x: position.col * (tileSize + 8) + 8,
      y: position.row * (tileSize + 8) + 8,
    };
  };

  const targetPosition = calculatePosition(tile.currentPosition);

  useEffect(() => {
    if (!isDragging.value) {
      translateX.value = withSpring(targetPosition.x, {
        damping: 15,
        stiffness: 150,
      });
      translateY.value = withSpring(targetPosition.y, {
        damping: 15,
        stiffness: 150,
      });
    }
  }, [tile.currentPosition.row, tile.currentPosition.col, targetPosition.x, targetPosition.y, translateX, translateY, isDragging]);

  const handlePress = () => {
    if (disabled || !canMove) return;
    
    scale.value = withSpring(0.95, { damping: 15, stiffness: 150 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    }, 100);
    
    onTilePress(tile.id);
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      if (disabled || !canMove) return;
      isDragging.value = true;
      scale.value = withSpring(1.05, { damping: 15, stiffness: 150 });
    })
    .onUpdate((event) => {
      if (disabled || !canMove) return;
      
      // Limit the drag distance to prevent tiles from going too far
      const maxDragDistance = tileSize * 0.8;
      const dragDistance = Math.sqrt(event.translationX ** 2 + event.translationY ** 2);
      
      if (dragDistance <= maxDragDistance) {
        translateX.value = targetPosition.x + event.translationX;
        translateY.value = targetPosition.y + event.translationY;
      }
    })
    .onEnd((event) => {
      if (disabled || !canMove) return;
      
      isDragging.value = false;
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
      
      // Check if the drag was significant enough to trigger a move
      const threshold = tileSize * 0.3;
      const dragDistance = Math.sqrt(event.translationX ** 2 + event.translationY ** 2);
      
      if (dragDistance > threshold) {
        // Determine the direction of the drag
        const absX = Math.abs(event.translationX);
        const absY = Math.abs(event.translationY);
        
        if (absX > absY) {
          // Horizontal drag
          if (event.translationX > 0) {
            runOnJS(onTilePress)(tile.id); // Move right
          } else {
            runOnJS(onTilePress)(tile.id); // Move left
          }
        } else {
          // Vertical drag
          if (event.translationY > 0) {
            runOnJS(onTilePress)(tile.id); // Move down
          } else {
            runOnJS(onTilePress)(tile.id); // Move up
          }
        }
      } else {
        // Snap back to original position
        translateX.value = withSpring(targetPosition.x);
        translateY.value = withSpring(targetPosition.y);
      }
    });

  const tapGesture = Gesture.Tap()
    .onStart(() => {
      if (disabled || !canMove) return;
      scale.value = withSpring(0.95, { damping: 15, stiffness: 150 });
    })
    .onEnd(() => {
      if (disabled || !canMove) return;
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
      runOnJS(handlePress)();
    });

  const combinedGesture = Gesture.Exclusive(panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => {
    const shadowOpacity = interpolate(
      scale.value,
      [1, 1.05],
      [0.3, 0.6],
      Extrapolate.CLAMP
    );

    const shadowRadius = interpolate(
      scale.value,
      [1, 1.05],
      [4, 12],
      Extrapolate.CLAMP
    );

    const elevation = interpolate(
      scale.value,
      [1, 1.05],
      [4, 12],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      shadowOpacity,
      shadowRadius,
      elevation,
      zIndex: isDragging.value ? 1000 : 1,
    };
  });

  if (tile.isBlank) {
    return null;
  }

  const renderTileContent = () => {
    if (imageSource) {
      const imageSize = tileSize - 8;
      const cropX = (tile.targetPosition.col * imageSize);
      const cropY = (tile.targetPosition.row * imageSize);
      
      return (
        <View style={[styles.imageContainer, { width: tileSize - 8, height: tileSize - 8 }]}>
          <Image
            source={{ uri: imageSource }}
            style={[
              styles.tileImage,
              {
                width: imageSize * gridSize,
                height: imageSize * gridSize,
                left: -cropX,
                top: -cropY,
              }
            ]}
            resizeMode="cover"
            onError={() => {
              console.log('Failed to load image:', imageSource);
            }}
          />
        </View>
      );
    }

    // Fallback to number if no image (shouldn't happen now)
    return (
      <Text style={[styles.tileNumber, { color: colors.text }]}>
        {tile.value}
      </Text>
    );
  };

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.View
        style={[
          styles.tile,
          {
            width: tileSize,
            height: tileSize,
            backgroundColor: colors.card,
            borderColor: canMove ? '#FF6B35' : colors.border, // Orange border for movable tiles
            borderWidth: canMove ? 3 : 1,
          },
          animatedStyle,
        ]}
      >
        {renderTileContent()}
        
        {tile.currentPosition.row === tile.targetPosition.row && 
         tile.currentPosition.col === tile.targetPosition.col && (
          <View style={[styles.correctIndicator, { backgroundColor: '#4CAF50' }]} />
        )}
        
        {canMove && !disabled && (
          <View style={[styles.moveIndicator, { backgroundColor: '#FF6B35' }]} />
        )}
        
        {/* Add a subtle glow effect for movable tiles */}
        {canMove && !disabled && (
          <View style={[styles.moveGlow, { backgroundColor: '#FF6B35' }]} />
        )}
        
        {/* Add corner indicators for movable tiles */}
        {canMove && !disabled && (
          <>
            <View style={[styles.cornerIndicator, { backgroundColor: '#FF6B35', top: 2, left: 2 }]} />
            <View style={[styles.cornerIndicator, { backgroundColor: '#FF6B35', top: 2, right: 2 }]} />
            <View style={[styles.cornerIndicator, { backgroundColor: '#FF6B35', bottom: 2, left: 2 }]} />
            <View style={[styles.cornerIndicator, { backgroundColor: '#FF6B35', bottom: 2, right: 2 }]} />
          </>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  tile: {
    position: 'absolute',
    ...RetroBorders.sticker,
    borderRadius: RetroRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...RetroShadows.soft,
    shadowColor: '#2D2D2D',
    shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
  },
  tileNumber: {
    ...RetroText.heading,
    fontWeight: '800',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  imageContainer: {
    overflow: 'hidden',
    borderRadius: RetroRadius.sm,
  },
  tileImage: {
    position: 'absolute',
  },
  correctIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.8,
  },
  moveIndicator: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.8,
  },
  moveGlow: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: RetroRadius.md,
    opacity: 0.2,
    zIndex: -1,
  },
  cornerIndicator: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    opacity: 0.8,
  },
});