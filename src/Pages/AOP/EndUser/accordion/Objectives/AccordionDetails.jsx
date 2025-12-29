import React, { Fragment, useEffect } from "react";

import AccordionSummary from "../Activities/AccordionSummary";
import AccordionDetails from "../Activities/AccordionDetails";

import AccordionComponent from "@Components/Common/AccordionComponent";
import { grey } from "@mui/material/colors";

const ActivityAccordion = ({ activities }) => {
  return (
    <>
      {activities.map(
        (
          {
            id,
            name,
            start_month,
            end_month,
            is_gad_related,
            counts,
            target,
            resources,
            responsible_people,
          },
          index
        ) => {
          const {
            total_cost,
            resources_count,
            responsible_people_count,
            comments_count,
          } = counts;

          const {
            first_quarter,
            second_quarter,
            third_quarter,
            fourth_quarter,
          } = target || {};

          const activityIndex = index + 1;

          return (
            <>
              <AccordionComponent
                defaultExpanded={false}
                summaryStyles={(expanded) => ({
                  borderLeft: `4px solid ${grey[600]}`,
                  bgcolor: grey[100],
                })}
                accordionSummary={
                  <Fragment key={id}>
                    <AccordionSummary
                      id={id}
                      activityIndex={activityIndex}
                      name={name}
                      startMonth={start_month}
                      endMonth={end_month}
                      isGadRelated={is_gad_related}
                      totalCost={total_cost}
                      resourcesCount={resources_count}
                      peopleCount={responsible_people_count}
                      commentsCount={comments_count}
                    />
                  </Fragment>
                }
                accordionDetails={
                  <AccordionDetails
                    first_quarter={first_quarter}
                    second_quarter={second_quarter}
                    third_quarter={third_quarter}
                    fourth_quarter={fourth_quarter}
                    resources={resources}
                    responsiblePeople={responsible_people}
                    resourcesCount={resources_count}
                    peopleCount={responsible_people_count}
                  />
                }
              />
            </>
          );
        }
      )}
    </>
  );
};

export default ActivityAccordion;
