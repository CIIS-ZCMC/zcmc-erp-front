import React, { Fragment, useEffect, useState } from "react";
import { handleChangeInput } from "../../../../Utils/HandleInput";
import ModalComponent from "../../../../Components/Common/Dialog/ModalComponent";
import { Stack } from "@mui/joy";
import TextareaComponent from "../../../../Components/Form/TextareaComponent";
import {
  APPLICATION_ID,
  useAOPApplicationsActions,
} from "../../../../Hooks/AOP/AOPApplicationsHook";
import useSnackbarHook from "../../../../Components/Common/SnackbarHook";
import { localStorageGetter } from "../../../../Utils/LocalStorage";

const EditObjective = ({ onOpen, data, handleClose }) => {
  // STATES
  const [objectiveData, setObjectiveData] = useState({ ...data });
  const [loading, setLoading] = useState(false);

  // HOOKS
  const { updateObjectiveSuccessIndicator, getAOPApplicationById } =
    useAOPApplicationsActions();
  const { showSnack } = useSnackbarHook();
  const AOP_APPLICATION_ID = localStorageGetter("aop_application_id");

  // FUNCTIONS
  const handleSubmitObjective = () => {
    setLoading(true);
    updateObjectiveSuccessIndicator(objectiveData, (status, message) => {
      setLoading(false);
      if (status === 200) {
        handleClose();
        showSnack(200, message);
        getAOPApplicationById(AOP_APPLICATION_ID, () => {});
      }
    });
  };

  const disabledEditBtn =
    objectiveData?.other_objective === "" ||
    objectiveData?.other_success_indicator === "";

  useEffect(() => setObjectiveData(data), [data]);

  return (
    <Fragment>
      {/* MODAL EDIT OBJECTIVES */}
      <ModalComponent
        isOpen={onOpen}
        title={`You’re editing for objective (#${objectiveData?.index} - ${objectiveData?.core})`}
        description={
          "The following information you’re editing are based on end-users selection of “Others” in objectives and success indicators that are unique and not registered on the system library."
        }
        handleClose={handleClose}
        rightButtonDisabled={disabledEditBtn}
        rightButtonAction={handleSubmitObjective}
        maxWidth={"55vh"}
        isLoading={loading}
        hasActionButtons
        content={
          <Stack gap={2} py={1}>
            <TextareaComponent
              minRows={4}
              label={"Objective"}
              value={objectiveData?.other_objective}
              setValue={(value) =>
                handleChangeInput("other_objective", setObjectiveData, value)
              }
            />
            <TextareaComponent
              minRows={4}
              label={"Success indicators"}
              value={objectiveData?.other_success_indicator}
              setValue={(value) =>
                handleChangeInput(
                  "other_success_indicator",
                  setObjectiveData,
                  value
                )
              }
            />
            {/* <Divider />
            <InputComponent
              isRequired
              type="password"
              label="Authorization pin"
              helperText={
                "Confirm you action by typing-in your authorization PIN."
              }
              setValue={setAuthPin}
              value={authPin}
            /> */}
          </Stack>
        }
      />
    </Fragment>
  );
};

EditObjective.propTypes = {};

export default EditObjective;
