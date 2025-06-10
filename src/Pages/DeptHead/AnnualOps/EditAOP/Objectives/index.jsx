import { Fragment, useState, useEffect } from "react";

import { Stack, Link } from "@mui/joy";
import { ExternalLink, Plus } from "lucide-react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { v4 as uuid } from "uuid";

import BoxComponent from "../../../../../Components/Common/Card/BoxComponent";
import ContainerComponent from "../../../../../Components/Common/ContainerComponent";
import EditableTableComponent from "../../../../../Components/Common/Table/EditableTableComponent";
import ButtonComponent from "../../../../../Components/Common/ButtonComponent";
import ModalComponent from "../../../../../Components/Common/Dialog/ModalComponent";
import TextareaComponent from "../../../../../Components/Form/TextareaComponent";
import { ThreeDotsLoader } from "../../../../../Components/Common/Loading/ThreeDotsLoader";

import useFunctionTypeHook from "../../../../../Hooks/FunctionTypeHook";
import { useAOPActions } from "../../../../../Hooks/AOP/AOPObjectivesHook";
import useAOPObjectivesHooks from "../../../../../Hooks/AOP/AOPObjectivesHook";
import useObjectivesHook from "../../../../../Hooks/ObjectivesHook";
import useActivitiesHook from "../../../../../Hooks/ActivitiesHook";
import useResourceHook from "../../../../../Hooks/ResourceHook";
import useResponsiblePeopleHook from "../../../../../Hooks/ResponsiblePeopleHook";
import useModalHook from "../../../../../Hooks/ModalHook";

import TableRow from "./TableRow";

import { AOP_CONSTANTS } from "../../../../../Data/constants";
import { AOP_HEADER } from "../../../../../Data/Columns";
import ConfirmationModalComponent from "../../../../../Components/Common/Dialog/ConfirmationModalComponent";

const index = () => {
  const { getSingleAOP, updateAOP } = useAOPActions();

  const navigate = useNavigate();
  const location = useLocation();
  const aopId = location.state?.aopAppId;

  const {
    aopObjectives,
    mission: defaultMission,
    aop_id,
    deleteObjective,
  } = useAOPObjectivesHooks();
  const { function_types, getFunctionType } = useFunctionTypeHook();
  const {
    objectives,
    addObjective,
    setObjectives,
    clearObjectives,
    setIsDiscussed,
  } = useObjectivesHook();
  const {
    findActivitiesByObjectiveID,
    setActivities,
    activities,
    clearActivities,
  } = useActivitiesHook();
  const { findResourcesByActivityID, setResources, clearResources } =
    useResourceHook();
  const {
    findResponsiblePeopleByActivityID,
    clearResponsiblePeople,
    setResponsiblePeople,
  } = useResponsiblePeopleHook();
  const { setAlertDialog, setConfirmationModal, closeConfirmation } =
    useModalHook();

  const [mission, setMission] = useState("Mission sample");
  const [isDraft, setIsDnraft] = useState(false);

  const [authorizationPin, setAuthorizationPin] = useState("123456");

  const [isLoading, setIsLoading] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openSaveMissionModal, setOpenSaveMissionModal] = useState(false);
  const [openConfirmDiscussedDialog, setOpenConfirmDiscussedDialog] =
    useState(false);

  const activitiesCount = objectives.map((objective) =>
    activities.filter((activity) => activity.parentId === objective.id)
  );

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
  }, []);

  useEffect(() => {
    const id = aopId;
    setIsLoading(true);
    getSingleAOP(id, (status, message) => {
      setIsLoading(false);
      // console.log(status)
      if (!(status >= 200 && status < 300)) {
        return; //Toast error
      }
    });
  }, []);

  // formatted objectives
  const formattedObjectives = aopObjectives.application_objectives?.map(
    (
      { function_type, objective, success_indicator, objective_uuid },
      index
    ) => ({
      id: uuid(),
      rowId: index + 1,
      functionType: function_type,
      objective: objective,
      successIndicator: success_indicator,
      objectiveUuid: objective_uuid,
    })
  );

  // get flat activities
  const flatActivities =
    aopObjectives.application_objectives?.flatMap((data) =>
      data.activity.map((activity) => ({
        ...activity,
        objectiveUuid: data.objective_uuid,
      }))
    ) || [];

  // formatted activities
  const formattedActivities = flatActivities.map(
    (
      {
        activity_uuid,
        name,
        is_gad_related,
        cost,
        start_month,
        end_month,
        target,
        objectiveUuid,
      },
      index
    ) => ({
      id: activity_uuid ? activity_uuid : uuid(),
      parentId: objectiveUuid,
      rowId: index + 1,
      name: name,
      isGadRelated: is_gad_related,
      cost: cost,
      startMonth: start_month,
      endMonth: end_month,
      target: {
        firstQuarter: target?.first_quarter,
        secondQuarter: target?.second_quarter,
        thirdQuarter: target?.third_quarter,
        fourthQuarter: target?.fourth_quarter,
      },
    })
  );

  //get item resourcese
  const flatResources =
    aopObjectives.application_objectives?.flatMap((data) =>
      data.activity.flatMap((item) => item.resources)
    ) || [];

  const flatResponsiblePeople = aopObjectives.application_objectives?.flatMap(
    (data) => data.activity.flatMap((item) => item.responsible_people)
  );

  const formattedResponsiblePeople = flatResponsiblePeople?.map(
    (responsible) => ({
      activityId: responsible.activity_uuid,
      users: responsible.users,
      designations: responsible.designations,
      areas: responsible.areas,
    })
  );

  // formatted resources
  const formattedResources = flatResources?.map((resource, index) => ({
    id: uuid(),
    item_id: resource.item?.id,
    parentId: resource.item.parentId,
    rowId: index + 1,
    name: resource.item?.name,
    quantity: resource.quantity,
    individualPrice: resource.item?.estimated_budget,
    totalCost: Number(
      (resource.item?.estimated_budget * resource.quantity).toFixed(2)
    ),
    expenseClass: resource.expense_class,
    purchaseTypeId: resource.purchase_type,
  }));

  useEffect(() => {
    setObjectives(formattedObjectives ? formattedObjectives : []);
    setActivities(formattedActivities ? formattedActivities : []);
    //add set cart
    setResources(formattedResources ? formattedResources : []);
    setResponsiblePeople(
      formattedResponsiblePeople ? formattedResponsiblePeople : []
    );
  }, [aopObjectives]);

  const handleOpenDialog = () => {
    setOpenSaveMissionModal(true);
  };

  function buildAOP() {
    const objectivesData = objectives.map((item) => {
      const activities_obj = findActivitiesByObjectiveID(item.objectiveUuid);

      const activitiesWithResourceAndResponsiblePeople = activities_obj.map(
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

    return objectivesData;
  }

  const clearLocalStorage = () => {
    //set objectives, activities, resources into empty state then clear localStorrage
    clearObjectives();
    clearActivities();
    clearResources();
    clearResponsiblePeople();
  };

  const handleConfirmationModal = () => {
    setOpenConfirmDialog(true);
    const data = {
      status: "warning",
      title:
        "Your AOP request is now ready for submission, would you like to get a preview first?",
      description:
        "Document previews will be generated and downloaded in Microsoft Excel Spreadsheet (.xls) file format. The document preview is for viewing purposes only to help you ensure that all fields are filled-up correctly and accurately.",
    };
    setConfirmationModal(data);
  };

  //   const handleDiscussedConfirmationModal = () => {
  //     setOpenConfirmDiscussedDialog(true);

  //     const data = {
  //       status: "warning",
  //       title: "Are you sure you want to resubmit this AOP request?",
  //       //   description:
  //       //     "We need to make sure that you already have a previous discussion and official go-signal for creating and submitting this request.",
  //     };

  //     setConfirmationModal(data);
  //   };

  const proceed = () => {
    handleConfirmationModal();
    // closeConfirmation();
  };

  const handleSubmit = () => {
    const aopPayload = buildAOP();

    const payload = {
      mission: mission,
      has_discussed: true,
      status: isDraft ? isDraft : "pending",
      authorization_pin: authorizationPin,
      application_objectives: aopPayload,
    };

    // console.log("payload", payload);

    setTimeout(() => {
      updateAOP(payload, aop_id, (status, message) => {
        let data = {};

        // if existing
        if (
          status === 200 &&
          message === "You already have an AOP application in your area."
        ) {
          data = {
            status: 200,
            title: "Existing AOP",
            description: "You already have an AOP application in your area.",
          };
          setAlertDialog(data);
          return;
        }

        //create new
        if (status === 200) {
          data = {
            status: 200,
            title: "Successfully submitted for approval.",
            description:
              "Your AOP request has been sent to the next approving body and they have been notified.",
          };

          //   setOpenSubmitModal(false);
          //   clearLocalStorage();
          //   setMission("");
          //   setAlertDialog(data);
          window.location.href = "/aop";
          // window.location.reload(false);
          //   closeConfirmation();
          return;
        }

        // failed
        data = {
          status: status,
          title: "Submission failed",
          description: message || "An unexpected error occurred.",
        };
        setAlertDialog(data);
      });
    }, 1000);
  };

  const handleCloseDialog = () => {
    setOpenSaveMissionModal(false);
    // setMission('')
  };

  const handleCancelRequest = () => {
    {
      clearLocalStorage();
      navigate("/aop");
    }
  };

  const handleSaveMission = () => {
    let data = {};

    // alert("saving...");
    data = {
      status: 200,
      title: "Mission created successfully!",
      description: "",
    };
    setOpenSaveMissionModal(false);
    setAlertDialog(data);

    // Save to local storage
    localStorage.setItem("mission", JSON.stringify(mission));
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
        {isLoading ? (
          <BoxComponent
            mt={3}
            height={"65vh"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignContent={"center"}
          >
            <ThreeDotsLoader />
          </BoxComponent>
        ) : (
          <EditableTableComponent
            columns={AOP_HEADER}
            secondaryHeader={
              <Link
                component="button"
                onClick={() => handleOpenDialog()}
                pb={1}
              >
                <Stack direction={"row"} gap={1} alignItems={"center"}>
                  Update Mission
                  <ExternalLink size={16} />
                </Stack>
              </Link>
            }
            tableRow={
              <TableRow
                aopId={aopId}
                rows={objectives}
                function_types={function_types}
              />
            }
            stickLast
          />
        )}

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
            onClick={() => handleCancelRequest()}
          />

          <ButtonComponent
            label={"Resubmit"}
            size={"md"}
            variant={"solid"}
            onClick={proceed}
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
              label={"Mission"}
              placeholder={"Please insert mission content here"}
              value={mission}
              setValue={setMission}
              //   onChange={(e) => setMission(e.target.value)}
            />
          </>
        }
        hasActionButtons={true}
        rightButtonLabel={"Save"}
        rightButtonAction={handleSaveMission}
      />

      {openConfirmDialog && (
        <ConfirmationModalComponent
          leftButtonlabel={"Back to editor"}
          rightButtonAction={() => handleSubmit()}
          withAuthPin
          rightButtonDisabled={!authorizationPin}
          setAuthPin={setAuthorizationPin}
        />
      )}

      {/* Confirmation modal to proceed */}
      {openConfirmDiscussedDialog && (
        <ConfirmationModalComponent
          leftButtonLabel={"Back"}
          rightButtonAction={handleSubmit}
          rightButtonLabel="Proceed"
          //   rightButtonDisabled={!hasDiscussed}
          isLoading={isLoading}
          withAuthPin
          setAuthPin={setAuthorizationPin}
        />
      )}
    </Fragment>
  );
};

export default index;
