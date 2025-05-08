import React, { Fragment, useEffect, useMemo, useState } from "react";
import { localStorageGetter } from "../../../../Utils/LocalStorage";
import { useAOPApplication } from "../../../../Hooks/AOP/AOPApplicationsHook";
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
  const aopApplicationData = useAOPApplication();
  const AOPApplication = useMemo(
    () => aopApplicationData ?? localStorageGetter("aopApplication"),
    [aopApplicationData]
  );
  const { setActiveActivity, getActivityById } = useActivityActions();

  const { getCommentsByActivity } = useCommentActions();
  const { activeActivity } = useActivityUIStates();

  // ACCORDION
  const expandedParent = useExpandedParent();
  const expandedChild = useExpandedChild();

  //   MODAL
  const [openModal, setOpenModal] = useState(false);

  //   FUNCTIONS

  const handleClickActivity = (id) => {
    if (id !== activeActivity) {
      setActiveActivity(id);
      getActivityById(id, () => {});

      getCommentsByActivity(id, () => {});
    }
  };

  const handeEditObjective = (id) => {
    const {
      success_indicator,
      success_indicator_id,
      objective,
      objective_id,
      function_description,
    } = getObjectiveDetails(id);

    setObjectiveData(() => {
      return {
        success_indicator: success_indicator,
        objective: objective,
        index: id,
        objective_id: objective_id,
        success_indicator_id: success_indicator_id,
        core: toCapitalize(function_description),
      };
    });
    setOpenModal(true);
  };

  const getObjectiveDetails = (id) => {
    return AOPApplication?.filter((element) => element.id === id)[0];
  };

  const handleCloseModal = () => {
    setOpenModal(false);

    setObjectiveData({
      success_indicator: "",
      objective: "",
    });
  };

  useEffect(() => {
    if (AOPApplication?.[0]?.activities?.[0]?.id && !activeActivity) {
      setActiveActivity(AOPApplication[0].activities[0].id);
    }
  }, [AOPApplication]);

  return (
    <Fragment>
      <Stack width={400} gap={2} sx={{ width: "100%" }}>
        {AOPApplication?.map(
          (
            {
              id,
              function_description,
              objective,
              success_indicator,
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
                  <Typography textColor={"success.700"} fontWeight={600}>
                    {toCapitalize(function_description)}
                  </Typography>
                </Typography>
              }
              withEdit={is_editable}
              name="parent"
              onClickEdit={() => handeEditObjective(id)}
            >
              <Stack gap={2} px={0.5}>
                <EllipsisComponent label={"Objective:"} text={objective} />
                <EllipsisComponent
                  label={"Success indicators:"}
                  text={success_indicator}
                />

                <CustomAccordionComponent
                  size={"sm"}
                  expanded={expandedChild}
                  title={`Activities (${activities?.length})`}
                  id={objective_key + 1}
                  name="child"
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
