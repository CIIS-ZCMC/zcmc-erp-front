export const formatNumber = (value) => {
  if (!value) return "";
  return new Intl.NumberFormat("en-US").format(value);
};
