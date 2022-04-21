import { PixelRatio } from "react-native";

const designDp = 480;
const designDensity = 160;

export default function calculate(size) {
  return designDp / designDensity * size / PixelRatio.get();
}
