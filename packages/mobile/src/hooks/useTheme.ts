import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { lightColors, darkColors } from "../constants/theme";

export const useTheme = () => {
  const theme = useSelector((state: RootState) => state.ui.theme);
  const colors = theme === "light" ? lightColors : darkColors;
  return { colors, theme };
};
