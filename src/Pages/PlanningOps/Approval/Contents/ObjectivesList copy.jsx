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
import useAccordionHook, {
  useExpandedChild,
  useExpandedParent,
} from "../../../../Hooks/AccordionHook";
import { useCommentActions } from "../../../../Hooks/CommentHook";
import EditObjective from "./EditObjective";
import { useCallback } from "react";

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
  const {
    // setActiveActivity,
    getActivityById,
  } = useActivityActions();

  const { getCommentsByActivity } = useCommentActions();
  // const { activeActivity } = useActivityUIStates();

  const { handleRotation } = useAccordionHook();

  // ACCORDION
  // const expandedParent = useExpandedParent();
  // const expandedChild = useExpandedChild();

  const [expandedParentLocal, setExpandedParentLocal] = useState([
    {
      name: "parent",
      id: 1,
    },
  ]);
  const [expandedChildLocal, setExpandedChildLocal] = useState([
    {
      name: "child",
      id: 1,
    },
  ]);
  const [activeActivityLocal, setActiveActivityLocal] = useState(1);
  //   MODAL
  const [openModal, setOpenModal] = useState(false);

  //   FUNCTIONS

  const fetchData = useCallback(() => {
    Promise.all([
      getCommentsByActivity(activeActivityLocal, () => {}),
      // getActivityById(id, () => {}),
    ]).catch((error) => {
      console.error("Error fetching data:", error);
    });
  }, [activeActivityLocal, getCommentsByActivity]);

  const handleActiveActivity = (id) => {
    setActiveActivityLocal(id);

    try {
      fetchData();
    } catch (error) {
      console.error("Error in handleActiveActivity:", error);
    }
  };

  const handleClickActivity = (id) => {
    if (id !== activeActivityLocal) {
      handleActiveActivity(id);
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
    return AOPApplication?.filter((element) => element.id === id)[0];
  };

  const handleCloseModal = () => {
    setOpenModal(false);

    setObjectiveData({
      success_indicator: "",
      objective: "",
    });
  };

  const handleExpand = (isOpen, id, name) => {
    // set({ rotation: true, rotationId: id });\

    if (name === "child") {
      setExpandedChildLocal((prev) => {
        return isOpen
          ? prev.filter((item) => item.id !== id)
          : [...prev, { id, name }];
      });
    } else {
      setExpandedParentLocal((prev) => {
        return isOpen
          ? prev.filter((item) => item.id !== id)
          : [...prev, { id, name }];
      });
    }

    // setTimeout(() => handleRotation(), 500);
  };

  useEffect(() => {
    if (AOPApplication?.[0]?.activities?.[0]?.id && !activeActivityLocal) {
      handleActiveActivity(AOPApplication[0].activities[0].id);
    }
  }, [AOPApplication]);

  useEffect(() => console.info("This page rerendered"), []);

  return (
    <Fragment>
      <Stack width={400} gap={2} sx={{ width: "100%" }}>
        {AOPApplication?.map(
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
              expanded={expandedParentLocal}
              handleExpand={handleExpand}
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
                  expanded={expandedChildLocal}
                  title={`Activities (${activities?.length})`}
                  id={objective_key + 1}
                  name="child"
                  withActivity={activities?.length > 0}
                  handleExpand={handleExpand}
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
                          active={id === activeActivityLocal}
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
