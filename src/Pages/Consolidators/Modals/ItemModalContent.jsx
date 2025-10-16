import React, { Fragment } from "react";
import useModalHook from "../../../Hooks/ModalHook";
import ModalComponent from "../../../Components/Common/Dialog/ModalComponent";

function ItemModalContent(props) {
  const { openModal, setOpenModal } = useModalHook();
  return (
    <Fragment>
      {openModal.isOpen && (
        <ModalComponent
          title={
            openModal.isNew
              ? "Create Item"
              : openModal.isUpdate
              ? "Update Item"
              : "Delete Item"
          }
          isOpen={openModal.isOpen}
        />
      )}
    </Fragment>
  );
}

export default ItemModalContent;
