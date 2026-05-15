import { useEffect } from "react";

import { Stack, Typography } from "@mui/joy";

import TextareaComponent from "@Components/Form/TextareaComponent";
import InputComponent from "@Components/Form/InputComponent";

import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";
import { grey } from "@mui/material/colors";

const CardBody = ({
  status,
  success_indicator,
  other_objective,
  objective,
  other_success_indicator,
  activities,
  type_of_function,
}) => {
  if (!objective && !other_objective) {
    return <ThreeDotsLoader />; // Still loading or not yet selected
  }

  // const { description, type_of_function } = objective;

  return (
    <Stack direction={"row"} justifyContent={"space-between"} width={"100%"}>
      <Stack width={"100%"} className="objectiveWrapper">
        {!status ? (
          <Typography
            level={"body-sm"}
            textAlign={"left"}
            // sx={{ flex: 1 }}
          >
            {type_of_function?.type}
          </Typography>
        ) : (
          <InputComponent placeholder={"Function Type"} />
        )}

        {!status ? (
          <Typography
            level={"title-md"}
            sx={{
              // flex: 1,
              textAlign: "left",
              color: grey[800],
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden",
              transition: "all 0.2s ease",

              ".objectiveWrapper:hover &": {
                WebkitLineClamp: "unset",
                display: "block",
              },
              WebkitLineClamp: 3,
              maxHeight: "4.5em",
              "&:hover": {
                WebkitLineClamp: "unset",
                maxHeight: "none",
              },
              cursor: "pointer",
            }}
          >
            {objective !== null
              ? objective?.description
              : other_objective?.description}
          </Typography>
        ) : (
          <InputComponent placeholder={"Objective Name"} />
        )}
      </Stack>

      <Stack
        width={"100%"}
        sx={{
          textAlign: "left",
          bgcolor: "#F2F2F2",
          borderRadius: 10,
          p: 1.5,
          position: "relative",
        }}
        className="successWrapper"
      >
        <Typography level="body-sm">Success Indicator</Typography>

        {/* COLLAPSED VIEW */}
        <Typography
          level="title-md"
          sx={{
            color: grey[800],

            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {success_indicator !== null
            ? success_indicator?.description
            : other_success_indicator?.description}
        </Typography>

        {/* 🔥 EXPANDED OVERLAY */}
        <Stack
          className="successOverlay"
          sx={{
            display: "none",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 999999,
            width: "100%",
            minHeight: "100%",
            bgcolor: "#F2F2F2",
            borderRadius: 10,
            p: 1.5,
            boxShadow: "lg",
          }}
        >
          <Typography level="body-sm">Success Indicator</Typography>

          <Typography level="body-sm" sx={{ color: grey[900] }}>
            {success_indicator !== null
              ? success_indicator?.description
              : other_success_indicator?.description}
          </Typography>
        </Stack>

        {/* hover trigger */}
        <style>
          {`
      .successWrapper:hover .successOverlay {
        display: block;
      }
    `}
        </style>
      </Stack>
    </Stack>
  );
};

export default CardBody;
