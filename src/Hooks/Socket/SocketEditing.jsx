import { useState, useEffect, useCallback } from "react";
import { socket, emitToEvent } from "../../Services/Socket";
import { useSocketEvent } from "./useSocketEvent";

const useSocketHook = ({ user, assignedArea }) => {
  const { name, id } = user ?? {};

  const [openNotify, setOpenNotify] = useState(false);
  const [editor, setEditor] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [show, setShow] = useState(false);
  const [editLoad, setEditLoad] = useState(false);

  // Register user on socket when assignedArea changes
  useEffect(() => {
    if (!assignedArea?.name || !id) return;
    emitToEvent("register-user", {
      userId: id,
      name: name,
      area: assignedArea.name,
    });
    emitToEvent("authenticate", {
      id,
      area: assignedArea.name,
    });
  }, [name, id, assignedArea?.name]);

  // Handle editing events
  const handleEditing = useCallback(
    ({ editable, showEdit, editorName, editorId }) => {
      setDisabled(!editable);
      setShow(showEdit);
      setOpenNotify(!editable);
      setEditor({ editorName, editorId });
    },
    [],
  );

  // Register editing socket event listener safely
  useSocketEvent("editing", handleEditing, Boolean(socket));

  const editSignal = useCallback(() => {
    emitToEvent("start-edit", {
      userId: id,
      name,
      area: assignedArea?.name,
    });
    setShow(true);
  }, [id, name, assignedArea?.name]);

  const handleEditClick = () => {
    setEditLoad(true);
    setTimeout(() => {
      editSignal();
      setShow(true);
      setEditLoad(false);
    }, 500);
  };

  const disconnectSignal = () => {
    emitToEvent("stop-edit", {
      userId: id,
      area: assignedArea?.name,
    });
    setShow(false);
  };

  return {
    openNotify,
    editor,
    disabled,
    show,
    editLoad,
    disconnectSignal,
    handleEditClick,
    closeNotify: () => setOpenNotify(false),
  };
};

export default useSocketHook;

