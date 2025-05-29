import { Fragment, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Stack, Link } from "@mui/joy";
import { Plus, ExternalLink } from "lucide-react";

//custom components
import ButtonComponent from "../../../../../../Components/Common/ButtonComponent";
import ContainerComponent from "../../../../../../Components/Common/ContainerComponent";
import EditableTableComponent from "../../../../../../Components/Common/Table/EditableTableComponent";
import ModalComponent from "../../../../../../Components/Common/Dialog/ModalComponent";
import TextareaComponent from "../../../../../../Components/Form/TextareaComponent";
import TableRow from "./TableRow";

// hooks
import useFunctionTypeHook from "../../../../../../Hooks/FunctionTypeHook";
import useAOPObjectivesHooks from "../../../../../../Hooks/AOP/AOPObjectivesHook";
import useObjectivesHook from "../../../../../../Hooks/ObjectivesHook";
import useActivitiesHook from "../../../../../../Hooks/ActivitiesHook";
import useModalHook from "../../../../../../Hooks/ModalHook";

//data related
import { AOP_CONSTANTS } from "../../../../../../Data/constants";
import { AOP_HEADER } from "../../../../../../Data/Columns";
import useResourceHook from "../../../../../../Hooks/ResourceHook";
import useResponsiblePeopleHook from "../../../../../../Hooks/ResponsiblePeopleHook";

const Objectives = () => {
  const { aopObjectives, create, deleteObjective } = useAOPObjectivesHooks();
  const { function_types, getFunctionType } = useFunctionTypeHook();
  const { objectives, addObjective, updateObjectiveField } =
    useObjectivesHook();
  const { findActivitiesByObjectiveID, activities } = useActivitiesHook();
  const { responsible_people, findResponsiblePeopleByActivityID } = useResponsiblePeopleHook();
  const { resources, findResourcesByActivityID } = useResourceHook();
  const { setAlertDialog } = useModalHook();

  const navigate = useNavigate();

  // local states
  const [editRowId, setEditRowId] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const [openSaveMissionModal, setOpenSaveMissionModal] = useState(false)

  const [mission, setMission] = useState("");

  const activitiesCount = objectives.map((objective) =>
    // console.log(item.id)
    activities.filter((activity) => activity.parentId === objective.id)
  );

  const savedMission = localStorage.getItem("mission");

  useEffect(() => {
    if (savedMission) {
      setMission(JSON.parse(savedMission));
    }
  }, []);

  useEffect(() => {
    console.log(aopObjectives)
  }, [aopObjectives])

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


  useEffect(() => {
    console.log(resources)
  }, [])

  function buildAOP() {
    const objectiveData = objectives.map((item) => {
      const activities = findActivitiesByObjectiveID(item.id);
      const activitiesWithResourceAndResponsiblePeople = activities.map(
        (act) => {
          const {
            parentId,
            id,
            startMonth,
            endMonth,
            target,
            isGadRelated,
            ...actData
          } = act;
          const resources = findResourcesByActivityID(act.id);
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
            resources: resources,
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

  // handle submit aop objective
  const handleSubmit = () => {
    const aopPayload = buildAOP();

    const payload = {
      mission: mission,
      has_discussed: true,
      application_objectives: aopPayload
    }

    create(payload, (status, message) => {
      // console.log(message)
      let data = {}

      if (!(status === 200)) {
        data = {
          status: 200,
          title: 'AOP created successfully!',
          description: ''
        };
        setOpenSubmitModal(false)
      } else {
        data = {
          status: !200,
          title: message,
          description: message,
        }
      }

      setAlertDialog(data);
    });

    setMission('');

    // console.log('final payload', payload)
  };

  // handle save mission
  const handleSaveMission = () => {
    let data = {}

    // alert("saving...");
    data = {
      status: 200,
      title: 'Mission created successfully!',
      description: ''
    }
    setOpenSaveMissionModal(false)
    setAlertDialog(data);

    // Save to local storage
    localStorage.setItem('mission', JSON.stringify(mission));
  };

  const handleOpenDialog = () => {
    setOpenSaveMissionModal(true);
  };

  const handleCloseDialog = () => {
    setOpenSaveMissionModal(false);
    // setMission('')
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
          secondaryHeader={
            <Link component="button" onClick={() => handleOpenDialog()} pb={1}>
              <Stack direction={"row"} gap={1} alignItems={"center"}>
                Create Mission
                <ExternalLink size={16} />
              </Stack>
            </Link>
          }
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
            onClick={() => navigate('/aop/all')}
          />

          <ButtonComponent
            label={"Submit AOP"}
            size={"md"}
            variant={"solid"}
            disabled={!mission || resources.length === 0 || responsible_people.length === 0}
            onClick={() => handleSubmit()}
          />
        </Stack>
      </ContainerComponent>

      <ModalComponent
        isOpen={openSaveMissionModal}
        handleClose={handleCloseDialog}
        title={"Mission"}
        description={`Define the core purpose and primary focus of the organization's operational efforts for the upcoming fiscal year. This statement should guide the development and execution of the annual plan.`}
        content={
          <>
            <TextareaComponent
              // label={'Mission'}
              placeholder={"Please insert mission content here"}
              value={mission}
              onChange={(e) => setMission(e.target.value)}
            />
          </>
        }
        hasActionButtons={true}
        rightButtonLabel={"Save"}
        rightButtonAction={() => handleSaveMission()}
      />
    </Fragment>
  );
};

export default Objectives;
