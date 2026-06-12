import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect } from 'react';
import { store } from "./store/mainStore"
import { LoadingIndicator } from '@/components/common/loading-indicator';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { Provider } from 'react-redux';
import { restoreUser } from './store/slices/authSlice';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

function NavigationLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const dispatch = useAppDispatch();
  const segmentsStr = segments.join('/');

  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(restoreUser());
  }, [dispatch]);

  useEffect(() => {
    if (isLoading) return;

    const inTabsGroup = segmentsStr.startsWith('(tabs)');
    const inProductGroup = segmentsStr.startsWith('product');
    const isLogin = segmentsStr.startsWith('login');
    const isRoot = segmentsStr === '' || segmentsStr === 'index';

    if (!isAuthenticated && (inTabsGroup || inProductGroup || isRoot)) {
      router.replace('/login');
    } else if (isAuthenticated && isLogin) {
      router.replace('/(tabs)');
    }

  }, [isAuthenticated, isLoading, segmentsStr, router]);

  if (isLoading) {
    return <LoadingIndicator size="large" fullscreen={true} />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product/detail" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationLayout />
      </SafeAreaProvider>
    </Provider>
  )
}