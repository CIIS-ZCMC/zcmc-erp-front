import { CheckOutlined, ModeEditOutlineOutlined } from "@mui/icons-material";
import ChipComponent from "@Components/Common/ChipComponent";

export default function EditPPMPChip({
  rowId,
  editing,
  handleEditToggle,
  openRow = null,
  disabled = false,
  size = "md",
}) {
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
