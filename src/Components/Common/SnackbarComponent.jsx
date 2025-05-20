import { Button, Snackbar } from "@mui/joy";
import { BiCheckDouble, BiCopy } from "react-icons/bi";
import { getAlertColor } from "../../Utils/ColorScheme";
import useSnackbarHook from "./SnackbarHook";

SnackbarComponent.propTypes = {};

function SnackbarComponent() {
  const { title, statusCode, isOpen, closeSnack } = useSnackbarHook();

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      variant="solid"
      color={getAlertColor(statusCode)}
      open={isOpen}
      autoHideDuration={4000}
      onClose={closeSnack}
      startDecorator={<BiCopy />}
      endDecorator={
        <Button
          onClick={closeSnack}
          size="xs"
          variant="soft"
          color={getAlertColor(statusCode)}
        >
          Dismiss
        </Button>
      }
    >
      {title}
    </Snackbar>
  );
}

export default SnackbarComponent;
