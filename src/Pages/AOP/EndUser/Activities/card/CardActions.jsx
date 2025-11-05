import React, { useEffect } from "react";

import { Chip, Stack } from "@mui/joy";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CardActions = ({
  activityId,
  resourcesCount,
  responsibleCount }) => {

  const navigate = useNavigate();

  useEffect(() => {
    console.log(resourcesCount)
  }, [resourcesCount])

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
            navigate(`/manage-resources/${activityId}`, {
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
            navigate(`/responsible-person/${activityId}`, {
              state: { activityId: activityId },
            })
          }
        >
          Responsible Person
        </Chip>
      </Stack >
    </>
  );
};

export default CardActions;
