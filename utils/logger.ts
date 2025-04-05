export const logBanner = (label: string, value?: any): void => {
  console.log("====================================");
  console.log(`${label} ===>`, value ?? "");
  console.log("====================================");
};
