export const wrapLabel = (text = "", wordsPerLine = 2, maxLines = 3) => {
  const words = String(text).trim().split(/\s+/);
  const lines = [];

  for (let i = 0; i < words.length; i += wordsPerLine) {
    lines.push(words.slice(i, i + wordsPerLine).join(" "));
  }

  const trimmed = lines.slice(0, maxLines);

  if (lines.length > maxLines) {
    trimmed[maxLines - 1] += "...";
  }

  return trimmed.join("\n");
};
