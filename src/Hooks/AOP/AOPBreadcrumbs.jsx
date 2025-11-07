import { useParams, useLocation, useNavigate } from "react-router-dom";

export default function useAOPBreadcrumbs() {
  const { aopId, objectiveId, activityId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const crumbs = [
    {
      label: `AOP for Fiscal Year ${new Date().getFullYear()}`,
      path: () => navigate(`/objectives/${aopId ?? ""}`),
    },
  ];

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
        path: () => navigate(`/objectives/${aopId ?? ""}`),
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
        path: () => navigate(`/objectives/${aopId ?? ""}`),
      },
      {
        label: "Activities",
        path: () => navigate(`/activities/${objectiveId ?? ""}`),
      },
      {
        label: "Responsible Person",
        current: true,
      }
    );
  }

  // SELECT RESOURCES (must come before manage-resources)
  else if (path.includes("/select-resources/")) {
    crumbs.push(
      {
        label: "Objectives",
        path: () => navigate(`/objectives/${aopId ?? ""}`),
      },
      {
        label: "Activities",
        path: () => navigate(`/activities/${objectiveId ?? ""}`),
      },
      {
        label: "Manage Resources",
        path: () => navigate(`/manage-resources/${activityId ?? ""}`),
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
        path: () => navigate(`/objectives/${aopId ?? ""}`),
      },
      {
        label: "Activities",
        path: () => navigate(`/activities/${objectiveId ?? ""}`),
      },
      {
        label: "Manage Resources",
        current: true,
      }
    );
  }

  return crumbs;
}
