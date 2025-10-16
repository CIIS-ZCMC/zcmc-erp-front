export const flattenColumns = (columns) => {
  return columns.flatMap((col) =>
    col.children ? flattenColumns(col.children) : col
  );
};
