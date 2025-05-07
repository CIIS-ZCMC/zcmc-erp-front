import React, { Fragment, useEffect, useState } from "react";
import { handleChangeInput } from "../../../../Utils/HandleInput";
import ModalComponent from "../../../../Components/Common/Dialog/ModalComponent";
import { Divider, Stack } from "@mui/joy";
import TextareaComponent from "../../../../Components/Form/TextareaComponent";
import InputComponent from "../../../../Components/Form/InputComponent";
import { useAOPApplicationsActions } from "../../../../Hooks/AOP/AOPApplicationsHook";

const EditObjective = ({ onOpen, data, handleClose }) => {
  // STATES
  const [authPin, setAuthPin] = useState("");
  const [objectiveData, setObjectiveData] = useState({ ...data });

  // HOOKS
  const { updateObjectiveSuccessIndicator } = useAOPApplicationsActions();

  // FUNCTIONS
  const handleSubmitObjective = () => {
    updateObjectiveSuccessIndicator(objectiveData, (status, message) => {
      console.log(status, message);
    });
  };

  const handleCloseModal = () => {
    setAuthPin("");
    handleClose();
  };

  const disabledEditBtn =
    objectiveData?.objective === "" || objectiveData?.success_indicator === "";

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
        handleClose={handleCloseModal}
        rightButtonDisabled={disabledEditBtn}
        rightButtonAction={handleSubmitObjective}
        maxWidth={"55vh"}
        hasActionButtons
        content={
          <Stack gap={2} py={1}>
            <TextareaComponent
              minRows={4}
              label={"Objective"}
              value={objectiveData?.objective}
              setValue={(value) =>
                handleChangeInput("objective", setObjectiveData, value)
              }
            />
            <TextareaComponent
              minRows={4}
              label={"Success indicators"}
              value={objectiveData?.success_indicator}
              setValue={(value) =>
                handleChangeInput("success_indicator", setObjectiveData, value)
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
