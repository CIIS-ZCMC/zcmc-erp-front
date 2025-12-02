import React, { Fragment, useEffect } from "react";
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
            approver_user = "Krizelle Mae Falcasantos",
            approver_user_position = null,
            user_position = "Department Head",
            area_code = "IISU",
            area = "Innovations",
            status = status,
            date_approved = null,
            remarks = null,
            activities_with_comments = null, // e.g 4 comments in 2 activities
            number_of_comments = null, // e.g 4 comments in 2 activities
            created_at,
            updated_at,
          },
          key
        ) => {
          if (key === 0) {
            return (
              <StepItem
                isLast={data?.length - 1 === key}
                key={key}
                position={user_position}
                name={approver_user}
                area_code={area_code}
                area={area}
                status={status}
                created_at={created_at}
                date_submitted={updated_at}
                approved_at={date_approved}
                remarks={remarks}
                activities_with_comments={activities_with_comments} // e.g 4 comments in 2 activities
                number_of_comments={number_of_comments} // e.g 4 comments in 2 activities
              />
            );
          } else {
            return (
              <StepItem
                isLast={data?.length - 1 === key}
                key={key}
                position={approver_user_position}
                name={approver_user}
                area_code={area_code}
                area={area}
                status={status}
                created_at={created_at}
                date_submitted={created_at}
                approved_at={date_approved}
                remarks={remarks}
                date_approved={date_approved}
                activities_with_comments={activities_with_comments} // e.g 4 comments in 2 activities
                number_of_comments={number_of_comments} // e.g 4 comments in 2 activities
              />
            );
          }
        }
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
