import React from "react";
import { Avatar, Box, Stack, Typography, useTheme } from "@mui/joy";
import { formattedLongDate } from "../../../../../Utils/formattedLongDate";
import formattedPrice from "../../../../../Utils/formattedPrice";
import {
  Cancel,
  CheckCircle,
  Circle,
  CommentOutlined,
  ExtensionOutlined,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import ButtonComponent from "@Components/Common/ButtonComponent";
import DrawerComponent from "@Components/Common/DrawerComponent";
import {
  useAllComments,
  useCommentActions,
  useComments,
} from "../../../../../Hooks/CommentHook";
import NoResultComponent from "@Components/Common/Table/NoResultComponent";
import CommentContainerComponent from "@Components/Comments/CommentContainerComponent";

const AccordionSummary = ({
  id,
  activityIndex,
  name,
  startMonth,
  endMonth,
  isGadRelated,
  totalCost,
  resourcesCount,
  peopleCount,
  commentsCount,
  openDrawer,
  showDrawer,
  closeDrawer,
}) => {
  const { getCommentsByActivity } = useCommentActions();
  const fetchedAllComments = useAllComments();
  const fetchedComments = useComments();
  const comments = fetchedAllComments?.length
    ? fetchedAllComments
    : fetchedComments || [];
  const theme = useTheme();
  const color = theme.palette.custom;

  const showComments = (e) => {
    e.stopPropagation(); // <-- this prevents the accordion from opening

    getCommentsByActivity(id, () => {
      showDrawer();
    });
  };

  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        width={"100%"}
      >
        <Stack
          flex={1}
          minWidth={0}
          direction={"row"}
          alignItems={"center"}
          spacing={1}
        >
          <Avatar color="neutral" size={"lg"}>
            <ExtensionOutlined />
          </Avatar>
          <Stack>
            <Typography level="body-xs" textTransform={"uppercase"}>
              # Activity {activityIndex}
            </Typography>

            <Typography level="title-sm">{name}</Typography>

            <Typography
              level="body-xs"
              // color={'primary'}
            >
              {startMonth && endMonth
                ? `${formattedLongDate(startMonth)} to ${formattedLongDate(
                    endMonth,
                  )}`
                : "Please select a start month and end month"}
            </Typography>
          </Stack>
        </Stack>

        {/* GAD Related */}
        <Stack direction="row" alignItems="center" width="180px">
          <Typography
            level="body-xs"
            textTransform="capitalize"
            startDecorator={
              isGadRelated ? (
                <CheckCircle sx={{ fontSize: 20, color: grey[400] }} />
              ) : (
                <Cancel sx={{ fontSize: 20, color: grey[400] }} />
              )
            }
            color="neutral"
          >
            {isGadRelated ? "GAD-related" : "Not GAD-related"}
          </Typography>
        </Stack>
        {/* Resources */}
        <Circle sx={{ fontSize: 6, color: grey[400], pr: 5 }} />

        <Stack direction="row" alignItems="center" width="120px">
          <Typography level="body-xs" color="neutral">
            {resourcesCount} Resource{resourcesCount > 1 ? "s" : ""}
          </Typography>
        </Stack>
        {/* Personnel */}
        <Circle sx={{ fontSize: 6, color: grey[400], pr: 5 }} />

        <Stack direction="row" alignItems="center" width="120px">
          <Typography level="body-xs" color="neutral">
            {peopleCount} Personnel
          </Typography>
        </Stack>

        <ButtonComponent
          width="200px"
          onClick={(e) => showComments(e)}
          label={
            <Stack direction="row" alignItems="center" spacing={1}>
              <CommentOutlined color="warning" />
              <Avatar size="sm" color="warning">
                {commentsCount}
              </Avatar>
              <Typography level="body-xs" color="warning">
                View Comments
              </Typography>
            </Stack>
          }
          variant={"plain"}
          color="warning"
        />

        {/* Cost */}
        <Stack width="140px" alignItems="flex-end">
          <Typography level="body-sm" color="neutral">
            Cost
          </Typography>
          <Typography
            level="title-md"
            fontWeight={600}
            sx={{ color: color.main }}
          >
            {formattedPrice(totalCost)}
          </Typography>
        </Stack>
      </Stack>
      <DrawerComponent
        open={openDrawer}
        setOpen={closeDrawer}
        title={name}
        description={`The following comments were submitted by reviewing offices regarding this activity.`}
        size="md"
        content={
          comments?.length > 0 ? (
            <Box
              sx={{
                maxHeight: "595px", // adjust as needed
                overflowY: "auto",
                pr: 1, // optional: add padding for scrollbar
              }}
            >
              <Stack width="100%" py={1} spacing={1.5}>
                {comments.map((c, index) => (
                  <CommentContainerComponent
                    key={index}
                    name={c?.name}
                    comment={c?.comment}
                    area_code={c?.area}
                    date={c.created_at}
                  />
                ))}
              </Stack>
            </Box>
          ) : (
            <Box
              sx={{
                height: "50vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <NoResultComponent />{" "}
            </Box>
          )
        }

        //no post for END - USER
        // footer={
        //   <>
        //     <Stack width={"100%"} spacing={2}>
        //       <TextareaComponent
        //         placeholder={"Comment here .. "}
        //         maxRows={3}
        //         label={"Add a comment"}
        //       />
        //       <Stack direction={"row"} justifyContent={"right"}>
        //         <ButtonComponent label={"Post Comment"} width="200px" />
        //       </Stack>
        //     </Stack>
        //   </>
        // }
      />
    </>
  );
};

export default AccordionSummary;
