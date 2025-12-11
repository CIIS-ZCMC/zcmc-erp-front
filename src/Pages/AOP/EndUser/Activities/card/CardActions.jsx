import React, { Fragment, useState, useEffect } from "react";

import { Avatar, Chip, Stack, Tooltip, IconButton, Typography } from "@mui/joy";
import { Comment } from "@mui/icons-material";

import { ArrowRight, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import ModalComponent from "@Components/Common/Dialog/ModalComponent";

import useAOPId from "../../../../../Hooks/AOP/AOPIDHook";


const Content = ({ comments }) => {

  // useEffect(() => {
  //   console.log(comments)
  // }, [comments])

  return (
    <>
      {comments?.map(({ id, comment, user_name, user_area, created_at }, index) => {

        const formattedDate = moment(created_at).format("MMMM D, YYYY")

        return (
          <Fragment key={id}>
            <Stack
              display={'flex'}
              flexDirection={'row'}
              alignItems={'start'}
              justifyContent={'space-between'}
            >

              <Stack>
                <Typography
                  level="body-md"
                  fontWeight={600}
                >
                  {user_name}
                </Typography>

                <Typography
                  level="body-xs"
                >
                  {user_area}
                </Typography>
              </Stack>

              <Typography
                level="body-xs"
              >
                {formattedDate}
              </Typography>

            </Stack>

            <Stack
              sx={{
                bgcolor: "#F2F2F2",
                padding: 1,
                borderRadius: 10,
                mt: 0.5,
                mb: 1
              }}
            >
              {comment}
            </Stack>
          </Fragment>


        )
      })}
    </>
  )
}


const CardActions = ({ activityId, resourcesCount, responsibleCount, comments }) => {
  const navigate = useNavigate();

  const [isOpenCommentsModal, setIsOpenCommentsModal] = useState(false);


  const handleOpenModal = () => {
    setIsOpenCommentsModal(true)
  }

  return (
    <>

      <Stack
        gap={1}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"end"}
      >

        {comments.length !== 0 &&
          <>
            <Chip
              variant="soft"
              color="primary"
              size="md"
              p={2}
              startDecorator={
                <Avatar
                  size="sm" // small avatar for chip
                  variant="solid"
                  color="primary"
                  sx={{
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {comments.length}
                </Avatar>
              }
              endDecorator={<Comment />}
              onClick={() => handleOpenModal()}
            >
              Comments
            </Chip>
          </>

        }

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
              state: { activityId: activityId }, // do not change state name
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

      <ModalComponent
        isOpen={isOpenCommentsModal}
        handleClose={() => setIsOpenCommentsModal(false)}
        title={"Comments List"}
        minWidth={500}
        content={
          <Content
            comments={comments}
          />
        }
        hasActionButtons
        noRightButton={true}
      />

    </>
  );
};

export default CardActions;
