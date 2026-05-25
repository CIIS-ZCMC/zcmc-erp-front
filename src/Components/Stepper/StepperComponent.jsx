import React, { act, Fragment, useEffect } from "react";
import StepItem from "./StepItem";
import { Stack, Step, StepIndicator, Stepper, Typography } from "@mui/joy";
import { BiCheck, BiCircle } from "react-icons/bi";
const StepperComponent = ({ data = [] }) => {
  // useEffect(() => {
  //   console.log(data)
  // }, [data])

  return (
    <Stepper orientation="vertical" sx={{ gap: 2 }} size="sm">
      {/* {data?.map(({ id, current_timeline }) => {
        const {
          user,
          user_position,
          approver_user_role,
          approver_user,
          remarks,
          status,
          status_id,
          date_approved,
          date_created,
        } = current_timeline;

        return (
          <StepItem
            position={approver_user_role}
            name={approver_user}
            remarks={remarks}
            status={status}
            user={user}
            userPosition={user_position}
            statusId={status_id}
            approved_at={date_approved}
            created_at={date_created}
          />
        );
      })} */}

      {data?.map(
        (
          {
            approver_user,
            actor,
            user_position = "Department Head",
            area_code = "IISU",
            area = "Innovations",
            status,
            date_approved = null,
            remarks = null,
            activities_with_comments = null,
            number_of_comments = null,
            created_at,
            date_returned,
            turnaround,
          },
          key,
        ) => {
          const isActor = status === "submitted"; // actor exists → it's the creator submission

          return (
            <StepItem
              key={key}
              isLast={key === data.length - 1}
              role={!isActor && approver_user.role}
              position={isActor ? actor?.area : approver_user?.position}
              name={isActor ? actor?.name : approver_user?.name}
              area_code={isActor ? actor?.area_code : approver_user?.area_code}
              area={isActor ? actor?.area : approver_user?.area}
              status={status}
              submitted_at={created_at}
              date_submitted={created_at}
              approved_at={date_approved}
              returned_at={date_returned}
              remarks={remarks}
              activities_with_comments={activities_with_comments}
              number_of_comments={number_of_comments}
              turnaround={turnaround}
            />
          );
        },
      )}

      {/* <Step
        indicator={
          <StepIndicator>
            <BiCircle />
          </StepIndicator>
        }
      >
        <Stack
          direction={"row"}
          sx={{ justifyContent: "space-between", alignItems: "center" }}
          ml={0.5}
        >
          <Typography
            level={window.innerWidth < 1200 ? "body-xs" : "title-sm"}
            fontWeight={600}
            color="neutral"
            width={"60%"}
          >
            Office name
          </Typography>
        </Stack>
      </Step> 

       <Step
        indicator={
          <StepIndicator variant="solid">
            <BiCheck />
          </StepIndicator>
        }
      >
        <Stack
          direction={"row"}
          sx={{ justifyContent: "space-between", alignItems: "center" }}
          ml={0.5}
        >
          <Typography level="title-sm" fontWeight={600} color="success">
            End
          </Typography>
        </Stack>
      </Step> */}
    </Stepper>
  );
};

export default StepperComponent;
