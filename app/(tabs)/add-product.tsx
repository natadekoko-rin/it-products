import MText from "@/components/common/text";
import { StatusBar, useColorScheme, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
export default function AddProductScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeText = isDark ? '#F3F4F6' : '#11181C';

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <MText text="add product" size={24} weight="800" color={themeText} />

    </SafeAreaView>
  );
}