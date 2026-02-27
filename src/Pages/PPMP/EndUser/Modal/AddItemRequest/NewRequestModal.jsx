import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import React, { Fragment } from "react";
// Add New Item Request Components
import Content from "./Content";

export default function NewRequestModal({
  openNewRequest,
  setOpenNewRequest,
  step,
  itemReq,
  setItemReq,
  handlePreviousStep,
  handleNextStep,
  submit,
  buttonLoader,
}) {
  return (
    <Fragment>
      <ModalComponent
        isOpen={openNewRequest}
        handleClose={() => setOpenNewRequest(false)}
        title={step === 1 ? "General information" : "Specifications"}
        description={
          step === 1
            ? "Fill in the item information to create it"
            : "List down details for the item you want to cretae to specify it."
        }
        maxWidth={"500px"}
        height={step === 1 ? "auto" : step === 2 ? "680px" : "650px"}
        content={
          <Content step={step} itemReq={itemReq} setItemReq={setItemReq} />
        }
        leftButtonLabel={step > 1 ? "Back to previous" : "Cancel"}
        leftButtonAction={() => {
          if (step > 1) {
            handlePreviousStep();
          } else {
            setOpenNewRequest(false);
          }
        }}
        rightButtonLabel={step < 2 ? "Next step" : "Confirm and save"}
        rightButtonAction={() => {
          if (step < 2) {
            handleNextStep();
          } else {
            submit();
          }
        }}
        isLoading={buttonLoader}
        hasActionButtons
      />
    </Fragment>
  );
}
