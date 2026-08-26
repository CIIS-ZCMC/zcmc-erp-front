import { CheckOutlined, ModeEditOutlineOutlined } from "@mui/icons-material";
import ChipComponent from "@Components/Common/ChipComponent";
import { usePPMPState } from "../../../Hooks/PPMP/PPMPHook";

export default function EditPPMPChip({
  rowId,
  editing,
  handleEditToggle,
  openRow = null,
  disabled = false,
  size = "md",
}) {
  const { status } = usePPMPState();
  const isEditable = status?.name === "draft" || status?.name === "returned";

  if (!isEditable) return null;

  return (
    <ChipComponent
      label={editing ? "Save" : "Edit"}
      startDecorator={editing ? <CheckOutlined /> : <ModeEditOutlineOutlined />}
      color={editing ? "success" : "neutral"}
      variant="soft"
      size={size}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        handleEditToggle(rowId, openRow, editing);
      }}
    />
  );
}

