// useAOPBreadcrumbs.js
import { useLocation } from "react-router-dom";
import useAOPId from "./AOPIDHook";

export default function useAOPBreadcrumbs() {
  const { aopId, objectiveId, activityId } = useAOPId();

  const location = useLocation();
  const path = location.pathname;

  const crumbs = [];

  // OBJECTIVES
  if (path.includes("/objectives/")) {
    crumbs.push({
      label: "Objectives",
      current: true,
    });
  }

  // ACTIVITIES
  else if (path.includes("/activities/")) {
    crumbs.push(
      {
        label: "Objectives",
        to: `/aop/objectives/${aopId}`,
      },
      {
        label: "Activities",
        current: true,
      }
    );
  }

  // RESPONSIBLE PERSON
  else if (path.includes("/responsible-person/")) {
    crumbs.push(
      {
        label: "Objectives",
        to: `/aop/objectives/${aopId}`,
      },
      {
        label: "Activities",
        to: `/aop/activities/${objectiveId}`,
      },
      {
        label: "Responsible Person",
        current: true,
      }
    );
  }

  // SELECT RESOURCES
  else if (path.includes("/select-resources/")) {
    crumbs.push(
      {
        label: "Objectives",
        to: `/aop/objectives/${aopId}`,
      },
      {
        label: "Activities",
        to: `/aop/activities/${objectiveId}`,
      },
      {
        label: "Manage Resources",
        to: `/aop/manage-resources/${activityId}`,
      },
      {
        label: "Select Resources",
        current: true,
      }
    );
  }

  // MANAGE RESOURCES
  else if (path.includes("/manage-resources/")) {
    crumbs.push(
      {
        label: "Objectives",
        to: `/aop/objectives/${aopId}`,
      },
      {
        label: "Activities",
        to: `/aop/activities/${objectiveId}`,
      },
      {
        label: "Manage Resources",
        current: true,
      }
    );
  }

  return crumbs;
}
