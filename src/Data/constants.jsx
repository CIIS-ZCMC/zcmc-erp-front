import { ReceiptEuroIcon } from "lucide-react";

/**
 * System Name must be assign here
 */
export const SYSTEM_NAME =
  "Operations and Procurement Planning Management System";

/**
 * Umis SSO Signing Path
 *
 * Don't change this path as this is the main authentication of the umis and your system.
 */
export const SSO_SIGNING_PATH = "signing-in";

/**
 * Directory of user first sigin
 * Change according to your system needs
 */
export const ROOT_PATH = "/dashboard";

export const EPR_API_ENDPOINTS = {
  //ERP END POINTS RELATED HERE
};

export const AOP_CONSTANTS = {
  AOP_TITLE: "Annual Operations Planning",
  AOP_SUBHEADING:
    "This is a subheading. It should add more context to the interaction.",

  AOP_REQUEST_SUBHEADING:
    "All AOP requests sent by Department/Section/Unit Heads or Officers in charge appear here.",

  TABLE_TITLE: "List of AOP requests",
  TABLE_SUBHEADING:
    "This is a subheading.It should add more context to the interaction.",

  CREATE_AOP_TITLE: "Create a new AOP",
  CREATE_AOP_SUBHEADING:
    "This is a subheading. It should add more context to the interaction.",

  MANAGE_OBJECTIVES_HEADER: "Step 1 of 4: Manage functions and objectives",
  MANAGE_OBJECTIVES_SUBHEADER:
    "This is a subheading. It should add more context to the interaction.",

  MANAGE_ACTIVITIES_HEADER: `You're Managing activities for Objective:`,
  MANAGE_ACTIVITIES_SUBHEADER: `Collapse this card to view more information about the selected objective.`,

  TABLE_ACTIVITY_HEADER: "Step 2 of 4: Manage activities",
  TABLE_ACTIVITY_SUBHEADING:
    "This is a subheading. It should add more context to the interaction.",

  MODAL_RESOURCE_HEADER: "Select resources for activity Activity",
  MODAL_RESOURCE_SUBHEADING:
    "Select a request status and reasons (if returned) to continue. You may add remarks if necessary.",

  ITEMS_HEADER: "Select resources (items) for activity Activity",
  ITEMS_SUBHEADER:
    "Select a request status and reasons (if returned) to continue. You may add remarks if necessary.",

  TABLE_RESOURCES_HEADER: "Step 3.2 of 4: Manage resources",
  TABLE_RESOURCES_SUBHEADING:
    "This is a subheading. It should add more context to the interaction.",

  TABLE_PERSON_HEADER: "Manage responsible persons",
  TABLE_PERSON_SUBHEADING: `Select people you’d like to assign for the selected activity. Assign more and include generic
   selections such as areas and job positions as necessary`,
};

export const PPMP_CONSTANTS = {
  PPMP_TITLE: "PPMP Management",
  PPMP_SUBHEADING:
    "This is a subheading. It should add more context to the interaction.",

  PPMP_RECEIVE_TITLE: "PPMP Management: Receiving",
  PPMP_RECEIVE_SUBHEADING:
    "Receive PPMP requests here. Each request is therefore recognized as completed its processing once received.",
};

export const MONTHS = [
  { label: 'January', value: '01' },
  { label: 'February', value: '02' },
  { label: 'March', value: '03' },
  { label: 'April', value: '04' },
  { label: 'May', value: '05' },
  { label: 'June', value: '06' },
  { label: 'July', value: '07' },
  { label: 'August', value: '08' },
  { label: 'September', value: '09' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
];

export const approvalActions = [
  {
    value: "Approve",
    label: "Approve",
    color: "success",
  },
  {
    value: "Returned",
    label: "Return",
    color: "warning",
  },
];

export const API = {
  AOP_APPLICATIONS: "aop-applications",
  TYPE_OF_FUNCTIONS: "type-of-functions",

  USERS: "get-users",
  JOB_POSITIONS: "get-designations",
  AREAS: "get-areas",

  // AOP REQUESTS
  AOP_REQUESTS: "aop-requests",
  MANAGE_AOP_REQUEST: "manage-aop-request",
  SHOW_OBJECTIVE: "show-objective-activity",

  // OBJECTIVES
  EDIT_OBJECTIVE: "edit-objective-and-success-indicator",
};
