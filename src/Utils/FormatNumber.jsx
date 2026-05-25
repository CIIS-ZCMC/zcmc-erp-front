export const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") return "";

  // Remove non-numeric characters except decimal point
  const cleaned = String(value).replace(/,/g, "");

  const number = Number(cleaned);

  if (isNaN(number)) return value; // return raw input instead of breaking

  return new Intl.NumberFormat("en-US").format(number);
};
