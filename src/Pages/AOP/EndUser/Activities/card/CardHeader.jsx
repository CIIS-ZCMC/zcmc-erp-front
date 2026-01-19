import React from "react";

import IconButtonComponent from "@Components/Common/IconButtonComponent";
import { Pencil, Trash } from "lucide-react";

import { isAopDisabled } from "../../../../../Utils/AopStatus";
import { DeleteOutline, Edit, EditOutlined } from "@mui/icons-material";

const CardHeader = ({ status, handleEdit, handleDelete }) => {
  return (
    <>
      <IconButtonComponent
        disabled={isAopDisabled(status)}
        size={"sm"}
        icon={<EditOutlined size={18} sx={{ color: "black" }} />}
        onClick={handleEdit}
      />

      <IconButtonComponent
        disabled={isAopDisabled(status)}
        size={"sm"}
        icon={<DeleteOutline size={18} sx={{ color: "black" }} />}
        onClick={handleDelete}
      />
    </>
  );
};

export default CardHeader;
