import { ReceiptEuroIcon } from "lucide-react";

/**
 * System Name must be assign here
 */
export const SYSTEM_NAME = "Enterprise Resource Planning System";

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

export const AREA_ID = {
  PLANNING_UNIT: "OMCC-PLAN-SE-047",
  OMCC: "OMCC-DI-001",
};

export const AOP_CONSTANTS = {
  AOP_TITLE: "Annual Operations Planning",
  AOP_SUBHEADING:
    "This is a subheading. It should add more context to the interaction.",

  AOP_EMPTY_STATE_TITLE: " You didn’t have an AOP for this year yet.",
  AOP_CREATE_NEW_AOP: "Begin by creating a new request",
  AOP_EMPTY_STATE_CONTENT: `  Nothing to show yet for this year’s AOP. You may request new items for the
                <br></br>
                meantime or create a new AOP request.`,

  AOP_REQUEST_SUBHEADING:
    "All AOP requests sent by Department/Section/Unit Heads or Officers in charge appear here.",

  TABLE_TITLE: "List of AOP requests",
  TABLE_SUBHEADING:
    "This is a subheading.It should add more context to the interaction.",

  TABLE_ACTIVITY_HEADER: "Step 2 of 4: Manage activities",
  TABLE_ACTIVITY_SUBHEADING:
    "This is a subheading. It should add more context to the interaction.",

  TABLE_ITEMS_HEADER: "Select resources (items) to add",
  TABLE_ITEMS_SUBHEADER:
    "All resources you’ll select here only applies to the specified activity above.",

  TABLE_RESOURCES_HEADER: "Step 3.2 of 4: Manage resources",
  TABLE_RESOURCES_SUBHEADING:
    "This is a subheading. It should add more context to the interaction.",

  TABLE_PERSON_HEADER: "Manage responsible persons",
  TABLE_PERSON_SUBHEADING: `Select people you’d like to assign for the selected activity. Assign more and include generic
   selections such as areas and job positions as necessary`,

  CREATE_AOP_TITLE: "Create a new AOP",
  CREATE_AOP_SUBHEADING:
    "This is a subheading. It should add more context to the interaction.",

  EDIT_AOP_TITLE: "Edit AOP",
  EDIT_AOP_SUBHEADING:
    "This is a subheading. It should add more context to the interaction.",

  MANAGE_OBJECTIVES_HEADER: "Step 1 of 4: Manage functions and objectives",
  MANAGE_OBJECTIVES_SUBHEADER:
    "This is a subheading. It should add more context to the interaction.",

  MANAGE_ACTIVITIES_HEADER: `You're Managing activities for Objective:`,
  MANAGE_ACTIVITIES_SUBHEADER: `Collapse this card to view more information about the selected objective.`,

  MANAGE_HEADER: "You are managing resources for",
  MANAGE_SUBHEADER: `Collapse this card to view more information about the selected`,

  MODAL_RESOURCE_HEADER: "Select resources for activity Activity",
  MODAL_RESOURCE_SUBHEADING:
    "Select a request status and reasons (if returned) to continue. You may add remarks if necessary.",
};

export const DEADLINES_CONSTANTS = {
  DEADLINE_TITLE: "Deadline management",
  DEADLINE_SUBHEADER:
    "Fully control when submissions of AOP and PMP requests will begin and close, to be imposed for all users.",
  DEADLINE_TABLE_TITLE: "List of deadlines",
  DEADLINE_TABLE_SUBHEADER:
    "Create, change and remove deadlines here, including advance deadlines for future years.",
};

export const PPMP_CONSTANTS = {
  PPMP_TITLE: "PPMP Management",
  PPMP_SUBHEADING:
    "This is a subheading. It should add more context to the interaction.",

  PPMP_RECEIVE_TITLE: "PPMP Management: Receiving",
  PPMP_RECEIVE_SUBHEADING:
    "Receive PPMP requests here. Each request is therefore recognized as completed its processing once received.",
};

export const LIBRARY_CONSTANTS = {
  LIBRARY_TITLE: "Item information management",
  LIBRARY_SUBTITLE:
    "All information used by end-users around the system, across different modules and areas can be managed here.",
  LIBRARY_HEADER: "Lis of records ready for AOP and PPMP",
  LIBRARY_SUBHEADER:
    "The following records of information are used to define user-inputted values",
};

export const MONTHS = [
  { label: "January", value: "01" },
  { label: "February", value: "02" },
  { label: "March", value: "03" },
  { label: "April", value: "04" },
  { label: "May", value: "05" },
  { label: "June", value: "06" },
  { label: "July", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

export const approvalActions = [
  {
    value: "approved",
    label: "Approve",
    color: "success",
  },
  {
    value: "returned",
    label: "Return",
    color: "warning",
  },
];

export const API = {
  AOP_APPLICATIONS: "aop-applications",
  AOP_APPLICATION_SHOW: "aop-application-show",
  AOP_APPLICATION_EDIT: "aop-application-edit",
  AOP_APPLICATION_UPDATE: 'aop-application-update',
  AOP_APPLICATION_STORE: "aop-application-store",
  AOP_APPLICATION_SUMMARY: "aop-application-summary",
  AOP_APPLICATION_TIMELINE: "application-timelines",

  TYPE_OF_FUNCTIONS: "type-of-functions",
  TYPE_OF_PURCHASE: "purchase-types",

  DEADLINES: "deadlines",
  AOP_DEADLINE_STORE: "aop-deadline-store",
  AOP_DEADLINE_UPDATE: "aop-deadline-update",
  PPMP_DEADLINE_STORE: "ppmp-deadline-store",
  PPMP_DEADLINE_UPDATE: "ppmp-deadline-update",

  USERS: "get-users",
  JOB_POSITIONS: "get-designations",
  AREAS: "get-areas",

  // AOP REQUESTS
  AOP_REQUESTS: "aop-requests",
  MANAGE_AOP_REQUEST: "manage-aop-request",
  SHOW_OBJECTIVE: "show-objective-activity",
  PROCESS_AOP_REQUEST: "process-aop-request",

  // TIMELINE
  APPROVAL_TIMELINE: "application-timelines",

  // OBJECTIVES
  EDIT_OBJECTIVE: "edit-objective-and-success-indicator",

  // PPMP
  PPMP_APPLICATION: "ppmp-receiving-list",
};

export const expenseClassData = [
  {
    label: "MOOE",
    value: "MOOE",
  },
  {
    label: "CO",
    value: "CO",
  },
];
