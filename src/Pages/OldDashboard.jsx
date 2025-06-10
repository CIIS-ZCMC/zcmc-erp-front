import { Fragment, useEffect, useState } from "react";
import ButtonComponent from "../Components/Common/ButtonComponent";
import { Alert, Snackbar, Stack, Typography } from "@mui/joy";
import { socket } from "../Services/Socket";
import { useLocation } from "react-router-dom";
import InputComponent from "../Components/Form/InputComponent";
import { useAuth } from "../Store/AuthStore";

const OldDashboard = () => {
  const [text, setText] = useState("");
  //   const [userId, set] = useState("");
  const [open, setOpen] = useState(false);
  const [editor, setEditor] = useState(null);
  const [isDisabled, setDisabled] = useState(false);
  const location = useLocation();

  const { user } = useAuth();

  const { name, id } = user ?? {};

  const userInDashboard = location.pathname?.includes("dashboard");

  //  SNACKBAR
  const notify = () => setOpen(true);
  const handleClose = () => {
    setEditor(null);
    setOpen(false);
  };

  const sendSignal = () => {
    socket.emit("register-user", { userId: id, name: name });
  };

  const disconnectSignal = () => {
    socket.emit("logout", { userId: id, name: name });
    handleClose();
  };

  // To handle user editing actions
  const handleEditing = ({ editable, editorName, editorId }) => {
    setDisabled(!editable);
    setOpen(editable ? false : true);

    setEditor(() => {
      return { editorName: editorName, editorId: editorId };
    });

    if (!editable) {
      return notify();
    }
  };

  useEffect(() => {
    socket.on("editing", handleEditing);
    return () => {
      socket.off("editing"); // Clean up on unmount
    };
  }, [socket]);

  // AUTHENTICATE
  useEffect(() => {
    socket.emit("authenticate", { id: id, name: name });

    return () => {
      socket.disconnect(); // Clean up on unmount
    };
  }, []);

  return (
    <Fragment>
      <Stack mt={10} width={"50%"} gap={2}>
        <Typography>USER: {name}</Typography>
        <InputComponent
          label={"Text field"}
          setValue={setText}
          value={text}
          disabled={isDisabled}
        />
        <ButtonComponent
          width={200}
          label={"Request edit"}
          onClick={sendSignal}
          disabled={isDisabled}
          color="warning"
        />
        <ButtonComponent
          width={200}
          label={"Exit"}
          disabled={isDisabled}
          onClick={disconnectSignal}
        />
      </Stack>

      {/* <Typography>
        {editor?.editorId !== id && (
          <Alert
            onClose={handleClose}
            color="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {editor?.editorName} is currently editing
          </Alert>
        )}
      </Typography> */}
      <Snackbar
        open={open}
        // autoHideDuration={2000}
        onClose={handleClose}
        color="success"
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {editor?.editorName} is currently editing
        </Alert>
      </Snackbar>
    </Fragment>
  );
};

export default OldDashboard;
