export const getFontSize = (size) => {
  switch (size) {
    case "sm":
      return 12;
    case "md":
      return 13;
    case "lg":
      return 14;
  }
};

export function toCapitalize(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
