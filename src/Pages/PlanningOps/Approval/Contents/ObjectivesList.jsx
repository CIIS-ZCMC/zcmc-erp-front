import React, { Fragment, useEffect, useMemo, useState } from "react";
import { localStorageGetter } from "../../../../Utils/LocalStorage";
import {
  useAOPApplication,
  useAOPApplicationObjectives,
} from "../../../../Hooks/AOP/AOPApplicationsHook";
import { toCapitalize } from "../../../../Utils/Typography";
import { Divider, Stack, Typography } from "@mui/joy";
import CustomAccordionComponent from "../../../../Components/Common/Accordion/CustomAccordionComponent";
import EllipsisComponent from "../../../../Components/Common/Typography/EllipsisComponent";
import { ActivityContainerComponent } from "../../../../Components/Activities/ActivityContainerComponent";
import ModalComponent from "../../../../Components/Common/Dialog/ModalComponent";
import TextareaComponent from "../../../../Components/Form/TextareaComponent";
import InputComponent from "../../../../Components/Form/InputComponent";
import {
  useActivityActions,
  useActivityUIStates,
} from "../../../../Hooks/AOP/ActivityHook";
import {
  useExpandedChild,
  useExpandedParent,
} from "../../../../Hooks/AccordionHook";
import { useCommentActions } from "../../../../Hooks/CommentHook";
import EditObjective from "./EditObjective";

const ObjectivesList = () => {
  // STATES
  const [objectiveData, setObjectiveData] = useState({
    success_indicator: "",
    objective: "",
  });

  // HOOKS
  const AOPApplicationObjectives = useAOPApplicationObjectives();
  const AppicationObjectives = useMemo(
    () => AOPApplicationObjectives ?? localStorageGetter("aopApplication"),
    [AOPApplicationObjectives]
  );
  const { setActiveActivity, getActivityById } = useActivityActions();

  const { getCommentsByActivity } = useCommentActions();
  const { activeActivity } = useActivityUIStates();

  // ACCORDION
  const expandedParent = useExpandedParent();
  const expandedChild = useExpandedChild();

  // MODAL
  const [openModal, setOpenModal] = useState(false);

  // FUNCTIONS
  const handleClickActivity = (id) => {
    if (id !== activeActivity) {
      setActiveActivity(id);
      Promise.all([
        getCommentsByActivity(id, () => {}),
        getActivityById(id, () => {}),
      ]).catch((error) => {
        console.error("Error fetching data:", error);
      });
    }
  };

  const handeEditObjective = (id) => {
    const { other_success_indicator, other_objective, function_description } =
      getObjectiveDetails(id);

    setObjectiveData(() => {
      return {
        other_success_indicator: other_success_indicator,
        other_objective: other_objective,
        index: id,
        core: toCapitalize(function_description),
      };
    });
    setOpenModal(true);
  };

  const getObjectiveDetails = (id) => {
    return AOPApplicationObjectives?.filter((element) => element.id === id)[0];
  };

  const handleCloseModal = () => {
    setOpenModal(false);

    setObjectiveData({
      success_indicator: "",
      objective: "",
    });
  };

  useEffect(() => {
    if (AOPApplicationObjectives?.[0]?.activities?.[0]?.id && !activeActivity) {
      setActiveActivity(AOPApplicationObjectives[0].activities[0].id);
    }
  }, []);

  return (
    <Fragment>
      <Stack width={400} gap={2} sx={{ width: "100%" }}>
        {AppicationObjectives?.map(
          (
            {
              id,
              function_description,
              objective,
              other_objective,
              success_indicator,
              other_success_indicator,
              activities,
              is_editable,
            },
            objective_key
          ) => (
            <CustomAccordionComponent
              key={objective_key}
              id={objective_key + 1}
              expanded={expandedParent}
              title={
                <Typography>
                  Objective #{objective_key + 1} -
                  <Typography textColor={"primary.700"} fontWeight={600}>
                    {toCapitalize(function_description)}
                  </Typography>
                </Typography>
              }
              withEdit={is_editable}
              name="parent"
              onClickEdit={() => handeEditObjective(id)}
            >
              <Stack gap={3} px={0.5}>
                <EllipsisComponent
                  label={"Objective:"}
                  text={is_editable ? other_objective : objective}
                />
                <EllipsisComponent
                  label={"Success indicators:"}
                  text={
                    is_editable ? other_success_indicator : success_indicator
                  }
                />

                <CustomAccordionComponent
                  size={"sm"}
                  expanded={expandedChild}
                  title={`Activities (${activities?.length})`}
                  id={objective_key + 1}
                  name="child"
                  withActivity={activities?.length > 0}
                >
                  <Stack gap={1}>
                    {activities?.map(
                      (
                        { id, name, with_comments, is_reviewed },
                        activity_key
                      ) => (
                        <ActivityContainerComponent
                          key={activity_key}
                          onClick={() => handleClickActivity(id)}
                          active={id === activeActivity}
                          label={`Activity #${activity_key + 1} `}
                          text={name}
                          withComment={with_comments}
                          reviewed={is_reviewed}
                        />
                      )
                    )}
                  </Stack>
                </CustomAccordionComponent>
              </Stack>
            </CustomAccordionComponent>
          )
        )}

        {/* EDIT OBJECTIVE */}
        <EditObjective
          onOpen={openModal}
          data={objectiveData}
          handleClose={handleCloseModal}
        />
      </Stack>
    </Fragment>
  );
};

ObjectivesList.propTypes = {};

export default ObjectivesList;
