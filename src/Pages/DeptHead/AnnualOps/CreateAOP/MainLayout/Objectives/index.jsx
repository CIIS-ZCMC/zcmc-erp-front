import { Fragment, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/joy";
import { Plus } from "lucide-react";

//custom components
import ButtonComponent from "../../../../../../Components/Common/ButtonComponent";
import ContainerComponent from "../../../../../../Components/Common/ContainerComponent";
import EditableTableComponent from "../../../../../../Components/Common/Table/EditableTableComponent";
import TableRow from "./TableRow";

// hooks
import useFunctionTypeHook from "../../../../../../Hooks/FunctionTypeHook";
import useAOPObjectivesHooks from "../../../../../../Hooks/AOP/AOPObjectivesHook";
import useObjectivesHook from "../../../../../../Hooks/ObjectivesHook";
import useActivitiesHook from "../../../../../../Hooks/ActivitiesHook";

//data related
import { AOP_CONSTANTS } from "../../../../../../Data/constants";
import { AOP_HEADER } from "../../../../../../Data/Columns";
import useResourceHook from "../../../../../../Hooks/ResourceHook";
import useResponsiblePeopleHook from "../../../../../../Hooks/ResponsiblePeopleHook";

const Objectives = () => {
  const { deleteObjective } = useAOPObjectivesHooks();
  const { function_types, getFunctionType } = useFunctionTypeHook();
  const { objectives, addObjective, updateObjectiveField } = useObjectivesHook();
  const { findActivitiesByObjectiveID, activities } = useActivitiesHook();
  const { findResponsiblePeopleByActivityID } = useResponsiblePeopleHook();
  const { resources, findResourcesByActivityID } = useResourceHook();

  const navigate = useNavigate();

  // local states
  const [editRowId, setEditRowId] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  const activitiesCount = objectives.map((objective) =>
    // console.log(item.id)
    activities.filter((activity) => activity.parentId === objective.id)
  );

  // useEffect(() => {
  //   console.log("Activities per objective:", activitiesCount);
  // }, [activitiesCount]);

  useEffect(() => {
    const params = { with_sub_data: 1 };
    getFunctionType(params, (status, message) => {
      // console.log(status)
      if (!(status >= 200 && status < 300)) {
        // if status not success
        return; //Toast error
      }
      setisLoading(false);
    });
  }, [isLoading]);

  // check pag walang objectives then add default objective
  useEffect(() => {
    if (objectives.length === 0) {
      addObjective();
    }
  }, [objectives, addObjective]);

  function buildAOP() {
    const objectiveData = objectives.map((item) => {
      const activities = findActivitiesByObjectiveID(item.id);
      const activitiesWithResourceAndResponsiblePeople = activities.map(
        (act) => {
          const { parentId, id, startMonth, endMonth, target, isGadRelated, ...actData } = act
          //   const resources = findResourcesByActivityID(act.uuid);
          const responsible_people = findResponsiblePeopleByActivityID(act.id);

          return {
            ...actData,
            start_month: startMonth,
            end_month: endMonth,
            is_gad_related: isGadRelated,
            target: {
              first_quarter: target.firstQuarter,
              second_quarter: target.secondQuarter,
              third_quarter: target.thirdQuarter,
              fourth_quarter: target.fourthQuarter,
            },
            // resources: resources,
            responsible_people: responsible_people,
          };
        }
      );

      return {
        objective_id: item.objective.id,
        success_indicator_id: item.successIndicator.id,
        activities: activitiesWithResourceAndResponsiblePeople,
      };
    });

    return objectiveData;
  }

  // handle Submit
  const handleSubmit = () => {
    const aopPayload = buildAOP();
    console.log("Submitting payload:", aopPayload);

    // await axios.post('/api/aop/submit', { application_objectives: payload });
  };

  return (
    <Fragment>
      <ContainerComponent
        title={AOP_CONSTANTS.MANAGE_OBJECTIVES_HEADER}
        description={AOP_CONSTANTS.MANAGE_OBJECTIVES_SUBHEADER}
        actions={
          <Stack>
            <ButtonComponent
              onClick={addObjective}
              label={"Add an Objective"}
              endDecorator={<Plus size={16} />}
            />
          </Stack>
        }
      >
        <EditableTableComponent
          columns={AOP_HEADER}
          tableRow={
            <TableRow
              editRowId={editRowId}
              setEditRowId={setEditRowId}
              rows={objectives}
              deleteRow={deleteObjective}
              handleChange={updateObjectiveField}
              function_types={function_types}
              activitiesCount={activitiesCount}
            />
          }
          stickLast
        />

        <Stack
          mt={2}
          direction={"flex"}
          alignItems={"center"}
          justifyContent={"start"}
          gap={1}
        >
          <ButtonComponent
            label={"Cancel Request"}
            size={"md"}
            variant={"outlined"}
            onClick={() => navigate(`/aop/all`)}
          />

          <ButtonComponent
            label={"Submit AOP"}
            size={"md"}
            variant={"solid"}
            disabled={false}
            onClick={() => handleSubmit()}
          />
        </Stack>
      </ContainerComponent>
    </Fragment>
  );
};

export default Objectives;
