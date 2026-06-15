import React from "react";
import IconButtonComponent from "@Components/Common/IconButtonComponent";
import { isAopDisabled } from "../../../../../Utils/AopStatus";
import { DeleteOutline, Edit, EditOutlined } from "@mui/icons-material";

const CardHeader = ({
  status,
  handleEdit,
  handleDelete,
  isLockedByOther,
  lockedBy,
}) => {
  return (
    <>
      <IconButtonComponent
        disabled={isLockedByOther || isAopDisabled(status)}
        size={"sm"}
        icon={<EditOutlined size={18} />}
        onClick={handleEdit}
      />

      <IconButtonComponent
        disabled={isLockedByOther || isAopDisabled(status)}
        size={"sm"}
        icon={<DeleteOutline size={18} />}
        onClick={handleDelete}
      />
    </>
  );
};

export default CardHeader;
