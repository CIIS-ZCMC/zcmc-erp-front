import React from "react";

import { Stack } from "@mui/joy";

import IconButtonComponent from "@Components/Common/IconButtonComponent";

import { Check, Pencil, Trash } from "lucide-react";

import { isAopDisabled } from "../../../../../Utils/AopStatus";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";

const CardHeader = ({ status, handleSave, handleEdit, handleDelete }) => {
  return (
    <>
      {/* <IconButtonComponent
                size={'sm'}
                icon={<Check size={18} />}
                onClick={handleSave}
            /> */}

      <IconButtonComponent
        size={"sm"}
        icon={<EditOutlined size={18} sx={{ color: "black" }} />}
        onClick={handleEdit}
        disabled={isAopDisabled(status)}
      />

      <IconButtonComponent
        size={"sm"}
        icon={<DeleteOutline size={18} sx={{ color: "black" }} />}
        onClick={handleDelete}
        disabled={isAopDisabled(status)}
      />
    </>
  );
};

export default CardHeader;
