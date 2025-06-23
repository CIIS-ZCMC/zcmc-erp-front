import { Fragment, useEffect, useState } from "react";

import { Typography, Input, } from "@mui/joy";
import { Trash } from "lucide-react";

import useResourceHook from "../../../../../../../Hooks/ResourceHook";
import useActivitiesHook from "../../../../../../../Hooks/ActivitiesHook";

import AutocompleteComponent from "../../../../../../../Components/Form/AutocompleteComponent";
import IconButtonComponent from "../../../../../../../Components/Common/IconButtonComponent";

import { formattedPrice } from "../../../../../../../Utils/formattedPrice";

const Resources = ({
    rows,
    parentId,
    purchase_types,
}) => {

    const {
        setTotalCost,
        resources: resourceHooks,
        removeItemResource,
        updateResourceField,
    } = useResourceHook();

    const { updateCost } = useActivitiesHook();

    const [localResources, setLocalResources] = useState(rows);
    const [editRowId, setEditRowId] = useState(null);

    const handleOnRowClick = (id) => setEditRowId(id);

    function onRemove(id) {
        setLocalResources(
            localResources.filter((item) => item.id !== id)
        )
    }

    function onChangeFieldValue(id, key, value) {
        if (key === 'quantity') {
            const totalCost = localResources.reduce((acc, item) => {
                const quantity = item.id === id ? value : item.quantity;
                return acc + (quantity * item.individualPrice);
            }, 0);

            updateCost(parentId, totalCost)
        }

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

    const expenseClassOptions = [
        { id: 1, label: 'MOOE', value: 'MOOE' },
        { id: 2, label: 'CO', value: 'CO' }
    ]


    return (
        <Fragment>
            {rows
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
                        return (
                            <tr key={id}>
                                <td>
                                    <Typography>{index + 1}</Typography>
                                </td>

                                <td onClick={() => handleOnRowClick(id)}>
                                    <Typography>{name || "-"}</Typography>
                                </td>

                                <td onClick={() => handleOnRowClick(id)}>
                                    {editRowId === id ? (
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
                                    <Typography>
                                        {formattedPrice(individualPrice) || "-"}
                                    </Typography>
                                </td>

                                <td onClick={() => handleOnRowClick(id)}>
                                    <Typography>
                                        {formattedPrice(quantity * individualPrice) || "-"}
                                    </Typography>
                                </td>

                                <td onClick={() => handleOnRowClick(id)}>
                                    {editRowId === id ? (
                                        <>
                                            <AutocompleteComponent
                                                placeholder="Select Purchase"
                                                value={purchaseTypeId}
                                                setValue={(val) => {
                                                    updateResourceField(id, "purchaseTypeId", val);
                                                }}
                                                options={purchase_types.map((item) => {
                                                    return { id: item.id, label: item.code };
                                                })}
                                            />
                                        </>
                                    ) : (
                                        <Typography>
                                            {/* {console.info(purchaseTypeId.label)} */}
                                            {purchaseTypeId?.label || "-"}
                                            {/* {purchase_types[purchaseTypeId]?.code || "-"} */}
                                        </Typography>
                                    )}
                                </td>

                                <td onClick={() => handleOnRowClick(id)}>
                                    {editRowId === id ? (
                                        <>
                                            <AutocompleteComponent
                                                placeholder="Select Expense Class"
                                                value={expenseClass}
                                                setValue={(val) => {
                                                    updateResourceField(id, "expenseClass", val?.value);
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
                                        onClick={() => {
                                            removeItemResource(id);
                                            onRemove(id)
                                        }}
                                        icon={<Trash size={14} />}
                                        size={"sm"}
                                        // color={'danger'}
                                        variant={"text"}
                                    />
                                </td>
                            </tr>
                        );
                    }
                ) ?? []}
        </Fragment>
    );
};

export default Resources;
