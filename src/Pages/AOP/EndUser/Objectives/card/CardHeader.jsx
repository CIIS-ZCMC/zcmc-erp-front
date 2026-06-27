import React from "react";

import { Stack } from "@mui/joy";

import IconButtonComponent from "@Components/Common/IconButtonComponent";

import { Check, Pencil, Trash } from "lucide-react";

import { isAopDisabled } from "../../../../../Utils/AopStatus";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import ChipComponent from "@Components/Common/ChipComponent";

const CardHeader = ({
  status,
  handleSave,
  handleEdit,
  handleDelete,
  isLocked,
  type_of_function,
}) => {
  return (
    <>
      {/* <IconButtonComponent
                size={'sm'}
                icon={<Check size={18} />}
                onClick={handleSave}
            /> */}

      <ChipComponent
        label={type_of_function?.type || ""}
        variant={"soft"}
        color={
          type_of_function?.id === 1
            ? "primary"
            : type_of_function?.id === 2
              ? "success"
              : "danger"
        }
      />
      <Stack direction={"row"} sx={{ zIndex: 0 }}>
        <IconButtonComponent
          size={"sm"}
          icon={<EditOutlined size={18} />}
          onClick={handleEdit}
          disabled={isLocked || isAopDisabled(status)}
        />

        <IconButtonComponent
          size={"sm"}
          icon={<DeleteOutline size={18} />}
          onClick={handleDelete}
          disabled={isLocked || isAopDisabled(status)}
        />
      </Stack>
    </>
  );
};

export default CardHeader;
