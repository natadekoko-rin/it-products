import { View } from "react-native";

interface GapProps {
  size?: number
}

export default function MGap({
  size = 8,
}: GapProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
      }}
    />
  )
}