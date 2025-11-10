import React, { useEffect } from "react";

import { Avatar, Chip, Stack } from "@mui/joy";
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
          variant="soft"
          color="primary"
          size="md"
          p={2}
          startDecorator={
            <Avatar
              size="md" // small avatar for chip
              variant="solid"
              color="primary"
              sx={{
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {resourcesCount}
            </Avatar>
          }
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
          variant="soft"
          color="primary"
          size="md"
          p={2}
          startDecorator={
            <Avatar
              size="md" // small avatar for chip
              variant="solid"
              color="primary"
              sx={{
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {responsibleCount}
            </Avatar>
          }
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
