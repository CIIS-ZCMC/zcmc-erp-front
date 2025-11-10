import React, { useEffect } from "react";

import { Chip, Stack } from "@mui/joy";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAOPId from "../../../../../Hooks/AOP/AOPIDHook";

const CardActions = ({ activityId, resourcesCount, responsibleCount }) => {
  const navigate = useNavigate();
  const { setActivityId } = useAOPId();

  useEffect(() => {
    if (activityId) {
      setActivityId(activityId);
    }
  }, [activityId]);

  return (
    <>
      <Stack
        gap={1}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"end"}
      >
        <Chip
          variant="outlined"
          color="primary"
          size="md"
          p={2}
          startDecorator={resourcesCount === 0 ? "0" : resourcesCount}
          endDecorator={<ArrowRight size={18} />}
          onClick={() =>
            navigate(`/aop/manage-resources/${activityId}`, {
              state: { activityId: activityId },
            })
          }
        >
          Resources
        </Chip>

        <Chip
          variant="outlined"
          color="primary"
          size="md"
          p={2}
          startDecorator={responsibleCount === 0 ? "0" : responsibleCount}
          endDecorator={<ArrowRight size={18} />}
          onClick={() =>
            navigate(`/aop/responsible-person/${activityId}`, {
              state: { activityId: activityId },
            })
          }
        >
          Responsible Person
        </Chip>
      </Stack>
    </>
  );
};

export default CardActions;
