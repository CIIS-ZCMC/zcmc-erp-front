import { useEffect } from "react";

import { Stack, Typography } from "@mui/joy";

import TextareaComponent from "@Components/Form/TextareaComponent";
import InputComponent from "@Components/Form/InputComponent";

import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";

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
    <Stack direction={"row"} alignItems={"flex-start"} gap={2}>
      <Stack width={"100%"}>
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
        sx={{ textAlign: "left", bgcolor: "#F2F2F2", borderRadius: 5, p: 2 }}
      >
        <Typography level="body-xs">Success Indicator</Typography>
        {!status ? (
          <Typography
            level="body-sm"
            sx={{
              display: "-webkit-box", // enables the line clamping
              WebkitLineClamp: 3, // number of lines to show
              WebkitBoxOrient: "vertical", // required for -webkit-box
              overflow: "hidden", // hide overflowing text
              textOverflow: "ellipsis", // show "..." at the end
            }}
          >
            {success_indicator !== null
              ? success_indicator?.description
              : other_success_indicator?.description}
          </Typography>
        ) : (
          <TextareaComponent placeholder={"Success indicator"} />
        )}
      </Stack>
    </Stack>
  );
};

export default CardBody;
