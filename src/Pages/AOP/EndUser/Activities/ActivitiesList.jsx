import React, { useEffect } from "react";

import moment from "moment";

import CardComponent from "@Components/Common/Card/CardComponent";

import CardHeader from "./card/CardHeader";
import CardBody from "./card/CardBody";
import CardActions from "./card/CardActions";

import { ACTIVITIES } from "../../../../Data/constants";

const ActivitiesList = ({
  activity,
  isLoading,
  activities,
  handleAdd,
  handleEdit,
  handleDelete,
}) => {
  const { EMPTY_STATE_TITLE, ACTIVITY_CREATE_NEW } = ACTIVITIES;

  const {
    id,
    objective_code,
    activity_code,
    total_cost,
    is_draft,
    activity_name,
    start_month,
    end_month,
    resources_count,
    responsible_people_count,
  } = activity;

  const formattedStartMonth = moment(start_month, "YYYY-MM").format("MMMM");
  const formattedEndMonth = moment(end_month, "YYYY-MM").format("MMMM");

  return (
    <>
      <CardComponent
        height={"auto"}
        statusColor={is_draft ? "red" : "green"}
        cardHeader={
          <CardHeader handleEdit={handleEdit} handleDelete={handleDelete} />
        }
        cardBody={
          <CardBody
            // objective={objective_code}
            activity={activity_name ? activity_name : activity_code}
            cost={total_cost}
            timeframe={`${start_month ? formattedStartMonth : ""} - ${end_month ? formattedEndMonth : ""
              }  `}
          />
        }
        cardActions={
          <CardActions
            activityId={id}
            resourcesCount={resources_count}
            responsibleCount={responsible_people_count}
            handleActivities={() => console.log("activities")}
          />
        }
      />
    </>
  );
};

export default ActivitiesList;
