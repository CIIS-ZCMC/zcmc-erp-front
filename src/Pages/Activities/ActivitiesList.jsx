import React, { useEffect } from "react";

import { Stack, Typography, Grid } from "@mui/joy";

import ButtonComponent from "@Components/Common/ButtonComponent";
import CardComponent from "@Components/Common/Card/CardComponent";
import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";

import CardHeader from "./card/CardHeader";
import CardBody from "./card/CardBody";
import CardActions from "./card/CardActions";

import { ACTIVITIES } from "../../Data/constants";

const ActivitiesList = ({
  activity,
  isLoading,
  activities,
  handleAdd,
  handleEdit,
  handleDelete,
}) => {
  const { EMPTY_STATE_TITLE, ACTIVITY_CREATE_NEW } = ACTIVITIES;

  useEffect(() => {
    // console.log('current activities:', activities)
  }, [activities]);

  const { id, is_draft, name, start_month, end_month } = activity;

  return (
    <>
      <CardComponent
        height={150}
        statusColor={is_draft ? "red" : "green"}
        cardHeader={
          <CardHeader handleEdit={handleEdit} handleDelete={handleDelete} />
        }
        cardBody={
          <CardBody
            objective={"Objective"}
            activity={name ? name : "Activity Name"}
            timeframe={`${start_month ? start_month : "start month"} - ${
              end_month ? end_month : "end month"
            }  `}
          />
        }
        cardActions={
          <CardActions
            handleActivities={() => console.log("activities")}
            activityId={id}
          />
        }
      />
    </>
  );
};

export default ActivitiesList;
