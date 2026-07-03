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
} from "../../../../Store/ResponsiblePeopleStore";
import useAOPStore from "../../../../Store/AOPStore";

import useResponsibleHook from "../../../../Hooks/ResponsiblePeopleHook";
import useModalHook from "../../../../Hooks/ModalHook";

import { RESPONSIBLE } from "../../../../Data/constants";
import useSnackbarHook from "../../../../Hooks/SnackbarHook";
import useAOPIdStore from "../../../../Hooks/AOP/AOPIdStore";

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
  const { activityId, objectiveId } = useAOPIdStore();

  const { MODAL_TITLE, MODAL_DESCRIPTION } = RESPONSIBLE;

  const { clearSelectedPeople, setIsSubmitting, setIsDeleting } =
    useResponsiblePeopleActions();

  const { aop } = useAOPStore();
  const status = aop.status.id;

  const { selectedPeople, responsiblePeople, isSubmitting, isDeleting } =
    useResponsibleStore();
  const { activity, responsible_people, users_only, designations_only } =
    responsiblePeople;

  const { setAlertDialog, setConfirmationModal, closeConfirmation } =
    useModalHook();
  const { showSnack } = useSnackbarHook();
  const { getPeople, createResponsible, removeResponsible } =
    useResponsibleHook();

  const [isLoading, setIsLoading] = useState(false);
  const [openResponsibleModal, setOpenResponsibleModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");

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

    const params = { activity_id: activityId, search: search };

    getPeople(params, (status, message) => {
      setIsLoading(false);

      if (!(status >= 200 && status < 300)) {
        // if status not success
        return; //Toast error
      }
    });
  }, [search, activityId]);

  const handleAssignPerson = async () => {
    setIsSubmitting(true);

    const payload = {
      activity_id: activityId,
      users: selectedPeople.filter((p) => p.sector_id).map((p) => p.id),
      designations: selectedPeople.filter((p) => !p.sector_id).map((p) => p.id),
    };

    try {
      await createResponsible(payload, (status, message) => {
        if (status === 201) {
          setIsSubmitting(false);
          handleCloseModal();
          clearSelectedPeople();
          showSnack(200, message);
        } else {
          setAlertDialog({
            status: "error",
            title: message,
            description: "Please try again",
          });
          setIsSubmitting(false);
          console.error(" Failed to add responsible person(s):", message);
        }
      });
    } catch (error) {
      console.error("Error adding responsible person(s):", error);
      setAlertDialog({
        status: "error",
        title: "Unexpected Error",
        description: error.message || "Something went wrong.",
      });
    }
  };

  const handleOpenDeleteModal = (id) => {
    setSelectedId(id);
    setOpenDeleteModal(true);
    const data = {
      status: "warning",
      title: ` Are you sure you want to remove this assigned person/position? `,
      description: "The assigned person/position will be removed",
    };
    setConfirmationModal(data);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    setIsDeleting(true);

    const params = { id: selectedId };

    await removeResponsible(params, (status, message) => {
      const isSuccess = status === 200 || status === true;

      showSnack(status, message);
      if (!isSuccess) {
        setAlertDialog({
          status: "error",
          title: message,
          description: "Please try again.",
        });
        console.error("Failed to delete responsible:", message);
      }
      setIsDeleting(false);
      setOpenDeleteModal(false);
      setSelectedId(null);
    });
  };

  return (
    <>
      <Stack spacing={2}>
        <ResponsibleTitle activity={activity} objectiveId={objectiveId} />
        <ResponsibleStatus
          activity={activity}
          openResponsibleModal={handleOpenResponsibleModal}
          status={status}
          search={search}
          setSearch={setSearch}
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
        isLoading={isSubmitting}
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
          isLoading={isDeleting}
        />
      )}
    </>
  );
};

export default ResponsiblePerson;
