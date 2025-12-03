// Hooks/useAOPId.js
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useAOPIdStore from "./AOPIdStore";

export default function useAOPId() {
  const { aopId, objectiveId, activityId } = useParams();
  const { setAopId, setObjectiveId, setActivityId } = useAOPIdStore();

  useEffect(() => {
    if (aopId) setAopId(aopId);
    if (objectiveId) setObjectiveId(objectiveId);
    if (activityId) setActivityId(activityId);
  }, [aopId, objectiveId, activityId]);

  // return store + params for convenience
  const store = useAOPIdStore();
  return {
    ...store,
    aopId: store.aopId,
    objectiveId: store.objectiveId,
    activityId: store.activityId,
  };
}
