import { useParams, useLocation, useNavigate } from "react-router-dom";
import useAOPId from "./AOPIDHook";

export default function useAOPBreadcrumbs() {
  const { aopId, objectiveId, activityId } = useAOPId();

  const location = useLocation();
  const stateAopId = location.state?.aopId;
  const stateObjectiveId = location.state?.objectiveId;
  const navigate = useNavigate();
  const path = location.pathname;

  const crumbs = [];

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
        path: () => navigate(`/aop/objectives/${aopId ?? stateAopId ?? ""}`),
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
        path: () => navigate(`/aop/objectives/${aopId ?? stateAopId ?? ""}`),
      },
      {
        label: "Activities",
        path: () =>
          navigate(`/aop/activities/${objectiveId ?? stateObjectiveId ?? ""}`),
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
        path: () => navigate(`/aop/objectives/${aopId ?? stateAopId ?? ""}`),
      },
      {
        label: "Activities",
        path: () =>
          navigate(`/aop/activities/${objectiveId ?? stateObjectiveId ?? ""}`),
      },
      {
        label: "Manage Resources",
        path: () => navigate(`/aop/manage-resources/${activityId ?? ""}`),
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
        path: () => navigate(`/aop/objectives/${aopId ?? stateAopId ?? ""}`),
      },
      {
        label: "Activities",
        path: () =>
          navigate(`/aop/activities/${objectiveId ?? stateObjectiveId ?? ""}`),
      },
      {
        label: "Manage Resources",
        current: true,
      }
    );
  }

  return crumbs;
}
