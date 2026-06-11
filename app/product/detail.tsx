import MText from "@/components/common/text";
import { StatusBar, useColorScheme, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
export default function DetailScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeText = isDark ? '#F3F4F6' : '#11181C';

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <MText text="Detail" size={24} weight="800" color={themeText} />

    </SafeAreaView>
  );
}