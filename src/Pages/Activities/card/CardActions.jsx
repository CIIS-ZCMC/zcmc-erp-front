import React from "react";

import { Chip, Stack } from "@mui/joy";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CardActions = ({ activityId }) => {
  const navigate = useNavigate();
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
          startDecorator={10}
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
          startDecorator={10}
          endDecorator={<ArrowRight size={18} />}
          // onClick={handleActivities}
        >
          Responsible Person
        </Chip>
      </Stack>
    </>
  );
};

export default CardActions;
