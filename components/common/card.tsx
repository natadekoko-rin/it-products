import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function MCard({
  children,
  onPress,
  style,
}: CardProps) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) =>
          [
            styles.card,
            pressed && { opacity: 0.5 },
            style
          ]}
      >
        {children}
      </Pressable>
    )
  }

  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    // backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    // flex: 1

    // flexDirection: "column"
  }
})