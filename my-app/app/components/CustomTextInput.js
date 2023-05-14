import { TextInput } from "react-native-paper";

export default function CustomTextInput({ style, onPress, ...otherProps }) {
  return (
    <TextInput
      activeUnderlineColor="green"
      style={[{ width: "80%", backgroundColor: "transparent" }, style]}
      {...otherProps}
    />
  );
}
