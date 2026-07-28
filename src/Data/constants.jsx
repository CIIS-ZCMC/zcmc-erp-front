import { Typography } from "@mui/joy";
import { nextYear } from "../Utils/Functions";
import { ReceiptEuroIcon, Check } from "lucide-react";

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
export const ROOT_PATH = "/";

export const EPR_API_ENDPOINTS = {
  //ERP END POINTS RELATED HERE
};

export const AREA_ID = {
  PLANNING_UNIT: "OMCC-PLAN-SE-047",
  OMCC: "OMCC-DI-001",
  BUDGET: "BUDGET-DE-003",
};

export const OBJECTIVES = {
  OBJECTIVES_TITLE: "Objectives",
  OBJECTIVES_SUBHEADING:
    "This is a subheading. It should add more context to the interaction.",
  ADD_OBJECTIVE: "Add an objective",
  EDIT_OBJECTIVE: "Edit Objective",
  ADD_OBJECTIVE_SUBHEADING: "Add details to give context to the objective",
  OBJECTIVE_ALERT:
    "After this, you will have to make activities for this objective through manage objectives",
  MANAGE_OBJECTIVES_HEADER: "Manage Objectives",
  MANAGE_OBJECTIVES_SUBHEADER:
    "Set your department’s functions, objectives, and success indicators. Each objective serves as a basis for the activities you’ll also define.",
  OBJECTIVES_EMPTY_STATE_TITLE:
    " You don’t have any Objective for this year yet.",
  OBJECTIVES_CREATE_NEW: "Begin by adding a new one",
};

export const ACTIVITIES = {
  MANAGE_ACTIVITIES_HEADER: "Manage Activities for",
  MANAGE_ACTIVITIES_SUBHEADER:
    "Define and manage the activities under this objective. Set the timeframe, quarterly targets, and specify the needed resources and responsible persons for each activity",
  MODAL_TITLE: "Add Activity",
  MODAL_DESCRIPTION:
    "Enter the number of activities to create. You may define their details later by editing each activity card.",
  COUNT_LABEL: "How many activities would you like to add ?",
  EMPTY_STATE_TITLE: "No Activities Added Yet",
  ACTIVITY_CREATE_NEW:
    "This objective doesn’t have any activities assigned. Add one to start defining what needs to be accomplished.",
};

export const RESPONSIBLE = {
  PAGE_TITLE: "AOP for Fiscal Year ",
  PAGE_DESCRIPTION:
    "The following below serves as the summary of your AOP request. You can open and update your request before the deadline as set by the administrators.",
  MANAGE_RESPONSIBLE_HEADER: "Manage Responsible Person for",
  MANAGE_RESPONSIBLE_SUBHEADER:
    "Assign designated personnel for each activity to ensure accountability.",
  EMPTY_STATE_TITLE: "No Assigned Responsible Persons",
  EMPTY_STATE_DESCRIPTION:
    " You haven’t assigned any responsible persons for this activity. Add someone now to make sure progress and accountability are properly tracked.",
  MODAL_TITLE: "Assign Responsible Persons",
  MODAL_DESCRIPTION:
    "Select individuals or job positions who will be responsible for this activity. You can assign multiple people and positions.",
};

export const AOP_SUMMARY = {
  PAGE_TITLE: "AOP #2025-0031 for Fiscal Year 2026",
  PAGE_REVIEW:
    "Please carefully review the complete summary of your AOP request below. Verify all details are correct before submitting. Once submitted, your AOP will be forwarded to the the approving bodies for review and approval.",
  SUMMARY_CARD_HEADER: "Document Status:",
  SUMMARY_CARD_BODY:
    "All required sections contain at least one item and have been validated. Your Annual Operations Plan has successfully passed preliminary compliance checks and meets the minimum requirements for official submission. The document will undergo comprehensive review by the Planning Office, Division Chief, and Medical Center Chief. The complete review process typically takes 7-10 business days. You will receive official notification via email and system alert upon completion of each review stage.",
  SUMMARY_TITLE:
    "Detailed Breakdown: Objectives, Activities, Resources, & Personnel",
  SUMMARY_FOOTER_TITLE: "Official Submission of Annual Operations Plan",
  SUMMARY_FOOTER_CONTENT:
    'By clicking "Proceed to PPMP", you certify that all information contained in this Annual Operations Plan is true, accurate, and complete to the best of your knowledge. A Project Procurement Management Plan (PPMP) will be generated based on the procurable resources identified in this plan. This document, together with the generated PPMP, will be submitted to the appropriate Approving Bodies for review and approval in accordance with government planning and procurement procedures.',
};

export const AOP = {
  HEADER_TITLE: "AOP for Fiscal year",
  MISSION_LABEL: "Mission",
  PAGE_TITLE: "Annual Operations Plan",
  PAGE_DESCRIPTION: ` The following below serves as the summary of your AOP request. You
                can open and update your request before the deadline as set by the
                administrators.`,
  AOP_EMPTY_OBJECTIVE_TITLE: `You don't have anything for this year's AOP yet`,
  AOP_EMPTY_OBJECTIVE_DESC: "Begin by adding a new objective.",
  EMPTY_STATE_TITLE: ` You don't have an AOP for this year yet.`,
  EMPTY_STATE_SUBTITLE: `Begin by creating a new AOP.`,
  EMPTY_STATE_DESCRIPTION: `Nothing to show yet for this year’s AOP. You may create a new AOP request.`,
  EMPTY_TITLE_PAGE: "Enterprise Resource Planning System",
  EMPTY_TITLE_DESC: "Sample description",
};

export const AOP_TIMELINE = {
  TITLE: "Approval Timeline",
  SUBTITLE: "The list below shows the current status of the request.",
  EMPTY_STATE: " No transactions done yet.",
};

export const PROCESS_AOP = {
  SELECT_ACTION_LABEL: "Select the action you would like to take:",
  INPUT_HELPER:
    "Confirm you action by entering your 6-digit authorization PIN.",

  MODAL_TITLE: "Approve request",
  MODAL_DESCRIPTION:
    "Select a request status and reasons (if returned) to continue. You may add remarks if necessary.",

  RETURN_AOP: "The AOP request has been returned for revision",
  SUCCESS_AOP: "The AOP request successfully approved",
  APPROVED_AOP:
    "Everyone can now see the changes you’ve made. The request is now ready for processing of the next approving body",
  MCC_APPROVED_AOP:
    "The AOP request has been successfully approved. All parties involved will be notified of this update.",
  RETURNED_AOP:
    "The request has been returned to the requesting party for necessary revisions. They will be notified of your remarks and required changes.",
  ERROR:
    "An error occurred while updating the status of the AOP request. Please check your authorization PIN and try again. If the problem persists, contact the system administrator.",
};

export const AOP_CONFRIM_DATA = [
  {
    icon: <Check />,
    title: "All information provided is accurate and complete",
  },

  {
    icon: <Check />,
    title: "All required sections have been properly filled out",
  },

  {
    icon: <Check />,
    title: "You have the authority to submit this document",
  },
];

export const AOP_CONSTANTS = {
  APPLICATION_TITLE: `AOP with PPMP for Fiscal Year`,
  AOP_TITLE: "Annual Operations Planning",
  AOP_SUBHEADING:
    "This is a subheading. It should add more context to the interaction.",

  AOP_EMPTY_STATE_TITLE: " You don’t have any Objective for this year yet.",
  AOP_CREATE_NEW_AOP: "Begin by adding a new one",
  AOP_EMPTY_STATE_CONTENT: `  Nothing to show yet for this year’s AOP. You may request new items for the
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

  MANAGE_OBJECTIVES_HEADER: "Manage Objectives",
  MANAGE_OBJECTIVES_SUBHEADER:
    "Set your department’s functions, objectives, and success indicators. Each objective serves as a basis for the activities you’ll also define.",

  MANAGE_ACTIVITIES_HEADER: `You're Managing activities for Objective:`,
  MANAGE_ACTIVITIES_SUBHEADER: `Collapse this card to view more information about the selected objective.`,

  MANAGE_HEADER: "You are managing resources for",
  MANAGE_SUBHEADER: `Collapse this card to view more information about the selected`,

  MODAL_RESOURCE_HEADER: "Select resources for activity Activity",
  MODAL_RESOURCE_SUBHEADING:
    "Select a request status and reasons (if returned) to continue. You may add remarks if necessary.",

  DISCUSSED_TITLE: "Discussed",
  DISCUSSED_LABEL: "Yes, I have discussed these plans with my Division Chief.",
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

  PPMP_REGULAR:
    "Covers all resources your unit planned under its own Annual Operations Plan objectives and activities. This is your department's standard procurement plan.",
  PPMP_DISPENSING:
    "Covers all common-use supply requests from other offices. Items here were added to your PPMP when end-users selected common-use supply under your office.",
};

export const LIBRARY_CONSTANTS = {
  LIBRARY_TITLE: "Item Information Management",
  LIBRARY_SUBTITLE:
    "All information used by end-users around the system, across different modules and areas can be managed here.",
  LIBRARY_HEADER: "List of records ready for AOP and PPMP",
  LIBRARY_SUBHEADER:
    "The following records of information are used to define user-inputted values",
};

export const ITEM_SUBMITTED_LIST_CONSTANTS = {
  ITEM_SUBMITTED_LIST_TITLE: "Submitted Item Requests",
  ITEM_SUBMITTED_LIST_SUBTITLE: "All your item requests this year appear here.",
  ITEM_SUBMITTED_LIST_HEADER: "Item Requests",
  ITEM_SUBMITTED_LIST_SUBHEADER:
    "Manage and review all submitted item requests. Approve or decline requests based on accuracy, necessity, and compliance with procurement guidelines.",
};

export const CONFIRMATION_CONSTANTS = {
  ALERT_SUBMITTION_TITLE:
    "Your AOP request is now ready for submission, would you like to get a preview first?",
  ALERT_SUBMITTION_DESCRIPTION:
    "Document previews will be generated and downloaded in Microsoft Excel Spreadsheet (.xls) file format. The document preview is for viewing purposes only to help you ensure that all fields are filled-up correctly and accurately.",

  ALERT_HASDISCUSSED_TITLE:
    "Have you discussed this AOP request with your Division Chief?",
  ALERT_HASDISCUSSED_DESCRIPTION:
    "We need to make sure that you already have a previous discussion and official go-signal for creating and submitting this request.",
};

export const ANNUAL_OPS = {
  header: "Create New AOP",
  description:
    "Fill in the details below to create a new Annual Operational Plan. Once saved, you’ll be able to define your objectives, activities, and resources.",
  missionPlaceHolder: "Please insert mission content here",
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
  AOP_APPLICATIONS_STORE: "aop-application-store",
  AOP_BY_SECTOR_AND_YEAR: "user-aop-applications",
  AOP_CHECKLIST: "aop-checklist",
  AOP_YEAR_LIST: "aop-application-yearList ",
  AOP_UPDATE: "aop-application-update-status",
  AOP_UPDATE_MISSION: "aop-application-mission",
  EXPORT_AOP: "export-aop",

  CONSOLIDATORS: "category-consolidators",
  UPDATE_CONSOLIDATOR: "update-consolidator",

  OBJECTIVES: "application-objectives",
  OBJECTIVE_BY_SECTOR: "user-application-objectives",
  OBJECTIVE_STORE: "application-objectives-store",
  OBJECTIVE_EDIT: "edit-application-objectives",
  OBJECTIVE_DELETE: "delete-application-objectives",
  OBJECTIVE_SHOW: "show-application-objective",
  OBJECTIVE_BY_FUNCTION_TYPE: "choose-objective",
  SUCCESS_INDICATOR_BY_OBJECTIVE: "choose-success-indicator",

  ACTIVITIES: "activities",
  ACTIVITIES_STORE: "activities-store",
  ACTIVITY_EDIT: "activities-update",
  ACTIVITIES_DELETE: "activities-delete",
  ACTIVITY_SHOW: "activities-show",

  PEOPLE: "responsible-people",
  PEOPLE_STORE: "responsible-people-post",
  PEOPLE_SHOW: "responsible-people-show",
  PEOPLE_UPDATE: "responsible-people-update",
  PEOPLE_DELETE: "responsible-people-delete",

  AOP_APPLICATION_SHOW: "aop-application-show",
  AOP_APPLICATION_EDIT: "aop-application-edit",
  AOP_APPLICATION_UPDATE: "aop-application-update",
  AOP_APPLICATION_STORE: "aop-application-store-aop",
  AOP_APPLICATION_SUMMARY: "aop-application-summary",
  AOP_APPLICATION_TIMELINE: "application-timelines",
  AOP_EXPORT_EXCEL: "export-aop",

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

  APPROVAL_PPMP: "requests-approve-or-return",
  GENERATE_WFP: "wfp-encoding-matrix/download-directly",

  APPROVAL_DIVISION_CHIEF: "approve-by-division-chief",
  RETURNED_DIVISON_CHIEF: "returned-by-division-chief",

  //ITEM REQUESTS
  ITEM_REQUESTS: "item-requests-approver",
  ITEM_REQUESTS_BY_USER: "my-item-requests",
  APPROVAL_ITEM_REQUEST: "item-requests-approval",

  // TIMELINE
  APPROVAL_TIMELINE: "approval-trail",
  APPROVER_TIMELINE: "ppmp-application-timelines-approver",

  // OBJECTIVES
  EDIT_OBJECTIVE: "edit-objective-and-success-indicator",

  //library
  ClASSIFICATION: "item-classifications",
  ITEM_CATEGORIES: "item-categories",
  ITEM_CLASSIFICATIONS: "item-classifications",
  ITEM_UNIT: "item-units",
  ITEM_VARIANT: "variants",
  ITEM_TERMINOLOGY: "reference-terminologies",
  ITEMS_: "items",

  // PPMP
  // PPMP_APPLICATION: "ppmp-receiving-list",
  PPMP_APPLICATION: "ppmp-items-approver",

  //PPMP COMMENTS
  PPMP_COMMENTS: "ppmp-item-comments",
  POST_PPMP_COMMENTS: "ppmp-item-comments-store",
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

export const PPMP_COLLAPSE = [
  { label: "Item Information", value: "item" },
  { label: "Procurement Schedule", value: "schedule" },
];

export const STATUS_LABELS = {
  1: "Draft",
  2: "Submitted",
  4: "Approved",
  6: "Returned",
};

export const STATUS_MESSAGES = {
  1: "This AOP is currently in draft mode. You may proceed to generate a PPMP from the procurable resources identified in this plan.",
  2: "A PPMP has been generated from this AOP and is pending review.",
  4: "The PPMP generated from this AOP has been approved.",
  6: "The AOP and PPMP has been returned for revision.",
};

export const AOP_BUTTON_LABEL = {
  1: "Generate PPMP",
  2: "View AOP Summary",
  4: "View AOP Summary",
  6: "Generate PPMP",
};

//PPMP AND AOP SUBMISSION
export const happensNext = [
  {
    description: (
      <Typography level="body-sm" color="black">
        ● <b>Planning Office Review:</b> Your AOP and PPMP will be reviewed by
        the Planning Office within 7–10 business days
      </Typography>
    ),
  },
  {
    description: (
      <Typography level="body-sm" color="black">
        ● <b>Notification:</b> You will receive an official notification once
        the review is complete
      </Typography>
    ),
  },
  {
    description: (
      <Typography level="body-sm" color="black">
        ● <b>Dashboard Updates:</b> Check your AOP and PPMP Dashboard anytime to
        track the status of your submission
      </Typography>
    ),
  },
  {
    description: (
      <Typography level="body-sm" color="black">
        ● <b>Possible Outcomes:</b> Your AOP and PPMP may be approved, returned
        for revision, or require additional information
      </Typography>
    ),
  },
];
