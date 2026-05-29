import { Stack, Typography } from "@mui/joy";

import InputComponent from "@Components/Form/InputComponent";
import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";
import { grey } from "@mui/material/colors";

const CardBody = ({
  status,
  success_indicator,
  other_objective,
  objective,
  other_success_indicator,
  type_of_function,
}) => {
  if (!objective && !other_objective) {
    return <ThreeDotsLoader />;
  }

  return (
    <Stack direction="row" justifyContent="space-between" width="100%" gap={2}>
      <Stack
        width="100%"
        className="objectiveWrapper"
        sx={{ textAlign: "left" }}
      >
        {!status ? (
          <Typography
            level="title-md"
            sx={{
              fontWeight: 600,
              color: grey[900],
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              transition: "all 0.25s ease",
              cursor: "pointer",

              ".objectiveWrapper:hover &": {
                display: "block",
                WebkitLineClamp: "unset",
                overflow: "visible",
              },
            }}
          >
            {objective?.is_other
              ? other_objective?.description
              : objective?.description}
          </Typography>
        ) : (
          <InputComponent placeholder="Objective Name" />
        )}
      </Stack>

      <Stack
        width="100%"
        className="successWrapper"
        sx={{
          textAlign: "left",
          bgcolor: "#F2F2F2",
          borderRadius: 10,
          p: 1.5,
        }}
      >
        <Typography level="body-sm">Success Indicator</Typography>

        <Typography
          level="title-md"
          sx={{
            color: grey[800],
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            transition: "all 0.25s ease",
            cursor: "pointer",

            ".successWrapper:hover &": {
              display: "block",
              WebkitLineClamp: "unset",
              overflow: "visible",
            },
          }}
        >
          {success_indicator?.is_other
            ? other_success_indicator?.description
            : success_indicator?.description}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default CardBody;
