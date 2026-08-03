import React, { Fragment, useEffect, useState } from "react";
import AccordionSummary from "../Activities/AccordionSummary";
import AccordionDetails from "../Activities/AccordionDetails";
import AccordionComponent from "@Components/Common/AccordionComponent";
import { grey } from "@mui/material/colors";
import { Box, Stack, Typography } from "@mui/joy";
import ChipComponent from "@Components/Common/ChipComponent";

const ActivityAccordion = ({
  objId,
  activities,
  withActivityBtn = true,
  targetActivityId = null,
}) => {
  const [expandedActivity, setExpandedActivity] = useState(null);

  useEffect(() => {
    if (targetActivityId) {
      const match = activities?.find(
        (act) =>
          act.id === targetActivityId ||
          act.activity_id === targetActivityId ||
          act.id == targetActivityId ||
          act.activity_id == targetActivityId
      );
      if (match) {
        setExpandedActivity(match.id);
      }
    }
  }, [targetActivityId, activities]);

  // Controlled drawer state per activity id
  const [drawerOpen, setDrawerOpen] = useState({});

  const openDrawer = (id) => setDrawerOpen((prev) => ({ ...prev, [id]: true }));

  const closeDrawer = (id) =>
    setDrawerOpen((prev) => ({ ...prev, [id]: false }));

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
          index,
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
            <Box key={id} id={`activity-accordion-${id}`}>
              <AccordionComponent
                expanded={expandedActivity === id}
                onChange={(event, isExpanded) =>
                  setExpandedActivity(isExpanded ? id : null)
                }
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
                      openDrawer={drawerOpen[id] || false}
                      showDrawer={() => openDrawer(id)}
                      closeDrawer={() => closeDrawer(id)}
                    />
                  </Fragment>
                }
                accordionDetails={
                  <>
                    <AccordionDetails
                      objId={objId}
                      activity_id={id}
                      first_quarter={first_quarter}
                      second_quarter={second_quarter}
                      third_quarter={third_quarter}
                      fourth_quarter={fourth_quarter}
                      resources={resources}
                      responsiblePeople={responsible_people}
                      resourcesCount={resources_count}
                      peopleCount={responsible_people_count}
                      withActivityBtn={withActivityBtn}
                    />
                  </>
                }
              />
            </Box>
          );
        },
      )}
    </>
  );
};

export default ActivityAccordion;
