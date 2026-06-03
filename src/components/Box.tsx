import { ReactNode } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

type Props = {
  color: string;
  dashed?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  children: ReactNode;
};

export function Box({ color, dashed, onPress, style, children }: Props) {
  const content = (
    <View
      style={[
        styles.box,
        {
          borderColor: color,
          borderStyle: dashed ? 'dashed' : 'solid',
        },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
