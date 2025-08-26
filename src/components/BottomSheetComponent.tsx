import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Modal, PanResponder, StyleSheet, View } from 'react-native';

interface BottomSheetComponentProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number | `${number}%` | 'auto';
  backgroundColor?: string;
}

export const BottomSheetComponent: React.FC<BottomSheetComponentProps> = ({
  visible,
  onClose,
  children,
  height = '60%',
  backgroundColor = '#fff',
}) => {
  
  const panY = useRef(new Animated.Value(0)).current;
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        
        return gestureState.dy > 0;
      },
      onPanResponderMove: (_, gestureState) => {
        
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        } else {
          
          panY.setValue(0);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          
          Animated.timing(panY, {
            toValue: 500,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onClose();
          });
        } else {
          
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      panY.setValue(0);
    }
  }, [visible, panY]);

  const handleClose = useCallback(() => {
    panY.setValue(0);
    onClose();
  }, [panY, onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.modalContent,
            {
              height,
              backgroundColor,
              transform: [{ translateY: panY }]
            }
          ]}
          {...panResponder.panHandlers}
        >
          {}
          <View style={styles.dragHandle}>
            <View style={styles.dragIndicator} />
          </View>
          
          {}
          <View style={styles.content}>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  dragHandle: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
});