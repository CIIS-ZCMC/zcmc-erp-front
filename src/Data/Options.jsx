export const feedbackTabOptions = [
  {
    id: 1,
    field: "comments",
    name: "Comments",
  },
  { id: 2, field: "remarks", name: "Remarks" },
];

// export const approvalPageTabs = [
//   { id: 2, name: "Pending", value: "pending" },
//   { id: 3, name: "Approved", value: "approved" },
//   { id: 4, name: "Returned", value: "returned" },
//   { id: 1, name: "All requests", value: "all" },
// ];

export const approvalPageTabs = [
  { id: 3, name: "Pending", value: 3 },
  { id: 4, name: "Approved", value: 4 },
  { id: 6, name: "Returned", value: 6 },
  { id: 8, name: "All requests", value: 8 },
];

export const libaryTabs = [
  { id: 1, name: "Item", value: "", path: "" },
  {
    id: 2,
    name: "Classification",
    value: "classification",
    path: "classification",
  },
  { id: 3, name: "Category", value: "category", path: "category" },
  { id: 4, name: "Terminology", value: "variant", path: "variant" },
];

export const deadlineTabs = [
  { id: 1, name: "Annual Operations Plan (AOP)", value: "" },
  { id: 2, name: "Project Procurement Management Plan", value: "ppmp" },
];

export const ppmpReceivingTabs = [
  { id: 1, name: "Pending", value: "pending" },
  { id: 2, name: "Received", value: "received" },
  { id: 3, name: "View all", value: "all" },
];

export const submittedRequestsTabs = [
  { id: 1, name: "View all", value: "" },
  { id: 2, name: "Pending", value: "pending" },
  { id: 3, name: "Added to library", value: "saved" },
];
