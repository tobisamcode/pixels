type FontWeight =
  | "normal"
  | "bold"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900;

export const theme = {
  colors: {
    white: "#fff",
    black: "#000",
    grayBG: "#e5e5e5",

    // neutral
    neutral: (opacity: number) => `rgba(0, 0, 0, ${opacity})`,
  },

  fontWeights: {
    medium: 500 as FontWeight,
    semibold: 600 as FontWeight,
    bold: 700 as FontWeight,
  },

  radius: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
  },
};
