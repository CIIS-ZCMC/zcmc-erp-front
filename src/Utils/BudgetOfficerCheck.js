/**
 * Checks whether the authenticated user has the Budget Officer role.
 * Mirrors backend DeliberationService::isBudgetOfficerUser / UserAuthResource checks.
 */
export const isBudgetOfficerUser = (user) => {
  if (!user || typeof user !== "object") return false;

  if (user.is_budget_officer === true || user.meta?.is_budget_officer === true) {
    return true;
  }

  const area = user.assignedArea || user.assigned_area;
  if (!area) return false;

  const areaCode = String(area.area_code || "").toUpperCase();
  const areaId = String(area.area_id || "").toUpperCase();
  const areaName = String(area.name || "").toLowerCase();

  return (
    ["BUDGET", "FS-BUD"].includes(areaCode) ||
    areaId.includes("BUDGET") ||
    areaName.includes("budget section")
  );
};
