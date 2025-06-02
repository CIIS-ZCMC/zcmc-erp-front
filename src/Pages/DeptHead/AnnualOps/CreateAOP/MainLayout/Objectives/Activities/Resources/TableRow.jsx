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
    setTotalCost,
    resources: resourceHooks,
    removeItemResource,
    updateResourceField,
  } = useResourceHook();

  const [localResources, setLocalResources] = useState(rows);
  const [editRowId, setEditRowId] = useState(null);
  const [localTotalCost, setLocalTotalCost] = useState(0)

  const handleOnRowClick = (id) => setEditRowId(id);

  function onChangeFieldValue(id, key, value) {
    setLocalResources((prev) => [
      ...prev.map((item) => {
        if (item.id !== id) return item;

        const updatedItem = {
          ...item,
          [key]: value,
        };

        if (key === "quantity") {
          updatedItem.totalCost = value * item.individualPrice;
          updateResourceField(id, key, value)
        };

        return {
          ...item,
          [key]: value,
        };
      }),
    ]);
  }

  // useEffect(() => {
  //   console.log(localResources)
  // }, [localResources])

  const expenseClassOptions = [
    { id: 1, label: 'MOOE', value: 'MOOE' },
    { id: 2, label: 'CO', value: 'CO' }
  ]

  //get the total cost 
  const totalCostFormat = (quantity, individualPrice) => {
    const total = (quantity * individualPrice).toFixed(2);
    setLocalTotalCost(total);
  };

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
            const [selectPurchaseType, setSelectPurchaseType] = useState(purchaseTypeId ?? null);
            const [selectedExpenseClass, setSelectedExpenseClass] = useState(expenseClass ?? "")

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
                      value={quantity ?? 0}
                      size="sm"
                      placeholder="Quantity"
                      onChange={(e) => {
                        const intValue = parseInt(e.target.value, 10) || 0;
                        onChangeFieldValue(id, "quantity", intValue)
                      }}
                    />
                  ) : (
                    <Typography>{quantity ?? "-"}</Typography>
                  )}
                </td>

                <td>
                  <Typography>{individualPrice || "-"}</Typography>
                </td>

                <td onClick={() => handleOnRowClick(id)}>
                  <Typography>
                    {/* {totalCostFormat(quantity, individualPrice)} */}
                    {(Number(quantity * individualPrice).toFixed(2)) || "-"}
                  </Typography>
                </td>

                <td onClick={() => handleOnRowClick(id)}>
                  {isEditing ? (
                    <>
                      <AutocompleteComponent
                        placeholder="Select Purchase"
                        value={selectPurchaseType}
                        setValue={(val) => {
                          // console.log(val)
                          setSelectPurchaseType(val);
                          updateResourceField(id, "purchaseTypeId", val);
                        }}
                        options={purchase_types.map((item) => {
                          // console.log(item)
                          return { id: item.id, label: item.code };
                        })}
                      />
                    </>
                  ) : (
                    <Typography>{purchaseTypeId?.label || "-"}</Typography>
                  )}
                </td>

                <td onClick={() => handleOnRowClick(id)}>
                  {isEditing ? (
                    <>
                      <AutocompleteComponent
                        placeholder="Select Expense Class"
                        value={selectedExpenseClass}
                        setValue={(val) => {
                          // console.log(val)
                          setSelectedExpenseClass(val);
                          updateResourceField(id, "expenseClass", val.value);
                        }}
                        options={expenseClassOptions}
                      />
                    </>

                  ) : (
                    <Typography>
                      {expenseClass || "-"}
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
