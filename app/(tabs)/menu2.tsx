import MText from "@/components/common/text";
import { StatusBar, useColorScheme, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
export default function Menu2Screen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeText = isDark ? '#F3F4F6' : '#11181C';
  const bgColor = isDark ? '#000000' : '#FFFFFF';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor, }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <MText text="Menu 2" size={24} weight="800" color={themeText} />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  }
})