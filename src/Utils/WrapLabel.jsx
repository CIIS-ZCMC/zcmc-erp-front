export const wrapLabel = (text = "", wordsPerLine = 2, maxLines = 3) => {
  if (!text) return "";

  const words = text.trim().split(/\s+/);
  const lines = [];

  for (let i = 0; i < words.length; i += wordsPerLine) {
    lines.push(words.slice(i, i + wordsPerLine).join(" "));
  }

  // Limit lines and add ellipsis if needed
  const result = lines.slice(0, maxLines);
  if (lines.length > maxLines) {
    result[maxLines - 1] += "...";
  }

  return result.join("\n");
};
