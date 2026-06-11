import React from "react";
import { TextProps as RNTextProps, Text, TextStyle } from "react-native";

interface MTextProps extends RNTextProps {
  text: string;
  size?: number;
  weight?: TextStyle["fontWeight"];
  color?: string;
}

export default function MText({
  text,
  size = 14,
  weight = "400",
  color = "#000000",
  style,
  ...rest
}: MTextProps) {
  return (
    <Text
      {...rest}
      style={[
        {
          fontSize: size,
          fontWeight: weight,
          color,
        },
        style,
      ]}
    >
      {text}
    </Text>
  );
}