import React from "react";

import { Avatar, Box, Chip } from "@mui/joy";
import { ArrowRight } from "lucide-react";
import { blue } from "@mui/material/colors";
import ChipComponent from "@Components/Common/ChipComponent";

const CardActions = ({ handleActivities, count }) => {
  return (
    <>
      <Chip
        variant="soft"
        color="primary"
        size="lg"
        p={2}
        sx={{
          zIndex: 2,
        }}
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
            {count}
          </Avatar>
        }
        endDecorator={<ArrowRight size={18} />}
        onClick={handleActivities}
      >
        Activities
      </Chip>
    </>
  );
};

export default CardActions;
