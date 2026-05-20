export const nextYear = new Date().getFullYear() + 1;

export const getNextYearRange = () => {
  const year = new Date().getFullYear() + 1;

  return {
    min: `${year}-01`,
    max: `${year}-12`,
  };
};

const formatCategories = (categories = [], visibleCount = 2) => {
  if (!Array.isArray(categories) || categories.length === 0) {
    return {
      visible: "",
      remaining: [],
      remainingCount: 0,
    };
  }

  const visible = categories.slice(0, visibleCount);
  const remaining = categories.slice(visibleCount);

  return {
    visible: visible.map((c) => c.name).join(", "),
    remaining,
    remainingCount: remaining.length,
  };
};
