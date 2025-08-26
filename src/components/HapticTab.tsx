import { RetroColors } from '@/src/config/Colors';
import { RetroBorders, RetroRadius, RetroShadows } from '@/src/config/retroStyles';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { StyleSheet, View } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  
  const isActive = props.accessibilityState?.selected;

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: isActive 
          ? RetroColors.softPurple 
          : 'transparent',
      }
    ]}>
      <PlatformPressable
        {...props}
        style={[
          styles.tabButton,
          {
            borderColor: isActive 
              ? RetroColors.outlineBlack 
              : 'transparent',
          }
        ]}
        onPressIn={(ev) => {
          if (process.env.EXPO_OS === 'ios') {
            
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          props.onPressIn?.(ev);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    marginVertical: 6,
    ...RetroBorders.sticker,
    borderRadius: RetroRadius.xl,
    ...RetroShadows.soft,
  },
  tabButton: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: RetroRadius.lg,
  },
});