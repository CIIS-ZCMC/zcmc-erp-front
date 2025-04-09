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

  TABLE_TITLE: "List of AOP requests",
  TABLE_SUBHEADING:
    "This is a subheading.It should add more context to the interaction.",

  CREATE_AOP_TITLE: 'Create a new AOP',
  CREATE_AOP_SUBHEADING: 'This is a subheading. It should add more context to the interaction.',

  MANAGE_ACTIVITIES_HEADER: `You're Managing activities for Objective:`,
  MANAGE_ACTIVITIES_SUBHEADER: `Collapse this card to view more information about the selected objective.`,

  TABLE_ACTIVITY_HEADER: 'Step 2 of 4: Manage activities',
  TABLE_ACTIVITY_SUBHEADING: 'This is a subheading. It should add more context to the interaction.',

  MODAL_RESOURCE_HEADER: "Select resources for activity Activity",
  MODAL_RESOURCE_SUBHEADING: "Select a request status and reasons (if returned) to continue. You may add remarks if necessary.",

  ITEMS_HEADER: 'Select resources (items) for activity Activity',
  ITEMS_SUBHEADER: 'Select a request status and reasons (if returned) to continue. You may add remarks if necessary.',

  TABLE_RESOURCES_HEADER: 'Step 3.2 of 4: Manage resources',
  TABLE_RESOURCES_SUBHEADING: 'This is a subheading. It should add more context to the interaction.',

}

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
