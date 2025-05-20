import { Fragment, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Typography, Input, Select, Option } from "@mui/joy";
import { Trash } from "lucide-react";

import useResourceHook from "../../../../../../../../Hooks/ResourceHook";
import AutocompleteComponent from "../../../../../../../../Components/Form/AutocompleteComponent";
import IconButtonComponent from "../../../../../../../../Components/Common/IconButtonComponent";

const TableRow = ({
  rows,
  parentId,
  resources,
  handleEdit,
  handleBlur,
  purchase_types,
}) => {
  const navigate = useNavigate();

  const {
    resources: resourceHooks,
    removeItemResource,
    updateResourceField,
  } = useResourceHook();

  const [localResources, setLocalResources] = useState(rows);
  const [localResource, setLocalResource] = useState(rows);
  const [editRowId, setEditRowId] = useState(null);

  const handleOnRowClick = (id) => setEditRowId(id);

  function onChangeFieldValue(id, key, value) {
    setLocalResources((prev) => [
      ...prev.map((item) => {
        if (item.id !== id) return item;

        if (key === "quantity") {
          return {
            ...item,
            [key]: value,
            totalCost: value * item.individualPrice,
          };
        }

        return {
          ...item,
          [key]: value,
        };
      }),
    ]);
  }

  return (
    <Fragment>
      {localResources
        ?.filter((value) => value.parentId === parentId)
        .map(
          (
            {
              id,
              name,
              quantity,
              individualPrice,
              purchaseTypeId,
              expenseClass,
            },
            index
          ) => {
            const isEditing = editRowId === id;
            const [select, setSelect] = useState(purchaseTypeId ?? null);

            return (
              <tr key={id}>
                <td>
                  <Typography>{index + 1}</Typography>
                </td>

                <td onClick={() => handleOnRowClick(id)}>
                  <Typography>{name || "-"}</Typography>
                </td>

                <td onClick={() => handleOnRowClick(id)}>
                  {isEditing ? (
                    <Input
                      value={quantity || ""}
                      size="sm"
                      placeholder="Quantity"
                      onChange={(e) =>
                        onChangeFieldValue(id, "quantity", e.target.value)
                      }
                    />
                  ) : (
                    <Typography>{quantity || "-"}</Typography>
                  )}
                </td>

                <td>
                  <Typography>{individualPrice || "-"}</Typography>
                </td>

                <td onClick={() => handleOnRowClick(id)}>
                  <Typography>{quantity * individualPrice || "-"}</Typography>
                </td>

                <td onClick={() => handleOnRowClick(id)}>
                  {isEditing ? (
                    <>
                      <AutocompleteComponent
                        placeholder="Select Purchase"
                        value={select}
                        setValue={(val) => {
                          setSelect(val);
                          onChangeFieldValue(id, "purchaseTypeId", val.id);
                        }}
                        options={purchase_types.map((item) => {
                          return { id: item.id, label: item.code };
                        })}
                      />
                    </>
                  ) : (
                    <Typography>{select?.code || "-"}</Typography>
                  )}
                </td>

                <td onClick={() => handleOnRowClick(id)}>
                  {isEditing ? (
                    <Select
                      size="sm"
                      value={localResource?.[id]?.expenseClass || false}
                      onChange={(e, newValue) =>
                        updateResourceField(id, "expenseClass", newValue)
                      }
                    >
                      <Option value={true}>MOOE</Option>
                      <Option value={false}>CO</Option>
                    </Select>
                  ) : (
                    <Typography>
                      {localResource?.[id]?.expenseClass}
                      {expenseClass ? "MOOE" : "CO"}
                    </Typography>
                  )}
                </td>

                <td>
                  <IconButtonComponent
                    onClick={() => removeItemResource(id)}
                    icon={<Trash size={14} />}
                    size={"sm"}
                    // color={'danger'}
                    variant={"text"}
                  />
                </td>
              </tr>
            );
          }
        )}
    </Fragment>
  );
};

export default TableRow;
