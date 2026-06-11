import React from 'react';
import { StyleSheet, View, ActivityIndicator, ActivityIndicatorProps } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface LoadingIndicatorProps {
  size?: ActivityIndicatorProps['size'];
  color?: string;
  fullscreen?: boolean;
  backgroundColor?: string;
}

export function LoadingIndicator({
  size = 'large',
  color,
  fullscreen = true,
  backgroundColor,
}: LoadingIndicatorProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const defaultIndicatorColor = isDark ? '#ffffff' : '#0a7ea4';
  const finalColor = color || defaultIndicatorColor;

  const defaultBgColor = isDark ? '#151718' : '#ffffff';
  const finalBgColor = backgroundColor || (fullscreen ? defaultBgColor : 'transparent');

  return (
    <View
      style={[
        styles.container,
        fullscreen ? styles.fullscreen : styles.inline,
        { backgroundColor: finalBgColor },
      ]}
    >
      <ActivityIndicator size={size} color={finalColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreen: {
    flex: 1,
  },
  inline: {
    padding: 16,
  },
});
