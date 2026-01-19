import React, { useEffect, useState } from "react";

import { Stack } from "@mui/joy";
import { useLocation } from "react-router-dom";

import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import ConfirmationModalComponent from "@Components/Common/Dialog/ConfirmationModalComponent";
import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";

import ResponsibleTitle from "./ResponsibleTitle";
import ResponsibleStatus from "./ResponsibleStatus";
import ResponsibleList from "./ResponsibleList";

import ResponsibleModal from "./modal/ResponsibleModal";

import useResponsibleStore, {
  useResponsiblePeopleActions,
} from "../../../../Store/ResponsibleStore";
import useAOPStore from "../../../../Store/AOPStore";

import useResponsibleHook from "../../../../Hooks/ResponsiblePeopleHook";
import useModalHook from "../../../../Hooks/ModalHook";

import { RESPONSIBLE } from "../../../../Data/constants";

const centeredStyle = {
  direction: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  height: "65vh",
  my: 2,
};

const ResponsiblePerson = () => {
  const location = useLocation();
  const { activityId } = location.state;

  const { MODAL_TITLE, MODAL_DESCRIPTION } = RESPONSIBLE;

  const { clearSelectedPeople } = useResponsiblePeopleActions();

  const { aop } = useAOPStore();
  const status = aop.status.id;

  const { selectedPeople, responsiblePeople } = useResponsibleStore();
  const { activity, responsible_people, users_only, designations_only } =
    responsiblePeople;

  useEffect(() => {
    // console.log('responsible people data:', users_only)
    // console.log('aop', status)
  }, [users_only, aop]);

  const { setAlertDialog, setConfirmationModal, closeConfirmation } =
    useModalHook();

  const { getPeople, createResponsible, removeResponsible } =
    useResponsibleHook();

  const [isLoading, setIsLoading] = useState(false);
  const [openResponsibleModal, setOpenResponsibleModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleOpenResponsibleModal = () => {
    setOpenResponsibleModal(true);
  };

  const handleCloseResponsibleModal = () => {
    setOpenResponsibleModal(false);
  };

  const handleCloseModal = () => {
    setOpenResponsibleModal(false);
    clearSelectedPeople();
  };

  useEffect(() => {
    setIsLoading(true);

    const params = { activity_id: activityId };

    getPeople(params, (status, message) => {
      if (!(status >= 200 && status < 300)) {
        // if status not success
        return; //Toast error
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    console.log("updated responsible people list", responsiblePeople);
  }, [responsiblePeople]);

  const handleAssignPerson = async () => {
    setIsLoading(true);

    const payload = {
      activity_id: activityId,
      users: selectedPeople.filter((p) => p.sector_id).map((p) => p.id),

      designations: selectedPeople.filter((p) => !p.sector_id).map((p) => p.id),
    };

    try {
      await createResponsible(payload, (status, message) => {
        if (status === 201) {
          setAlertDialog({
            status: "success",
            title: `${message}`,
            description: "",
          });
          setIsLoading(false);
          handleCloseModal();
        } else {
          setAlertDialog({
            status: "error",
            title: message,
            description: "Please try again later",
          });
          setIsLoading(false);
          console.error(" Failed to create responsible people:", message);
        }
      });
    } catch (error) {
      console.error("Error creating responsible people:", error);
      setAlertDialog({
        status: "error",
        title: "Unexpected Error",
        description: error.message || "Something went wrong.",
      });
    }
  };

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true);
    const data = {
      status: "warning",
      title: ` Are you sure you want to delete this activity ? `,
      description: "The selected activity will be removed",
    };
    setConfirmationModal(data);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    setIsLoading(true);

    const params = { id: selectedId };

    await removeResponsible(params, (status, message) => {
      const isSuccess = status === 200 || status === true;

      setAlertDialog({
        status: isSuccess ? "success" : "error",
        title: message,
        description: isSuccess ? "" : "Please try again later.",
      });

      if (!isSuccess) {
        console.error("Failed to delete responsible:", message);
      }

      setIsLoading(false);
      setOpenDeleteModal(false);
      setSelectedId(null);
    });

    setTimeout(() => {
      setIsLoading(false);
      setOpenDeleteModal(false);
    }, 2000);
  };

  return (
    <>
      <Stack spacing={2}>
        <ResponsibleTitle activity={activity} />
        <ResponsibleStatus
          activity={activity}
          openResponsibleModal={handleOpenResponsibleModal}
          status={status}
        />

        {isLoading ? (
          <Stack sx={centeredStyle}>
            <ThreeDotsLoader />
          </Stack>
        ) : (
          <ResponsibleList
            usersCount={users_only}
            positionsCount={designations_only}
            setSelectedId={setSelectedId}
            handleDelete={handleOpenDeleteModal}
            responsible_people={responsible_people}
            openResponsibleModal={handleOpenResponsibleModal}
            status={status}
          />
        )}
      </Stack>

      <ModalComponent
        isOpen={openResponsibleModal}
        handleClose={handleCloseResponsibleModal}
        title={MODAL_TITLE}
        description={MODAL_DESCRIPTION}
        maxWidth={700}
        minWidth={700}
        content={
          <>
            <ResponsibleModal />
          </>
        }
        hasActionButtons={true}
        rightButtonLabel={"Assign Person"}
        rightButtonAction={() => handleAssignPerson()}
        isLoading={isLoading}
      />

      {openDeleteModal && (
        <ConfirmationModalComponent
          leftButtonLabel="Cancel"
          leftButtonAction={() => {
            setOpenDeleteModal(false);
            closeConfirmation();
          }}
          rightButtonLabel="Delete"
          rightButtonAction={() => handleConfirmDelete()}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default ResponsiblePerson;
