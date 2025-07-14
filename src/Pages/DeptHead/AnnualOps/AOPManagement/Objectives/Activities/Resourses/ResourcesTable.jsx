import { Fragment, useEffect, useState } from "react";

import { Typography, Input, } from "@mui/joy";
import { Trash } from "lucide-react";

import useResourceHook from "../../../../../../../Hooks/ResourceHook";
import useActivitiesHook from "../../../../../../../Hooks/ActivitiesHook";
import useModalHook from "../../../../../../../Hooks/ModalHook";

import AutocompleteComponent from "../../../../../../../Components/Form/AutocompleteComponent";
import IconButtonComponent from "../../../../../../../Components/Common/IconButtonComponent";
import ConfirmationModalComponent from "../../../../../../../Components/Common/Dialog/ConfirmationModalComponent";

import { formattedPrice } from "../../../../../../../Utils/formattedPrice";

const Resources = ({
    isEditing,
    editLoad,
    rows,
    parentId,
    purchase_types,
}) => {

    const {
        setTotalCost,
        resources: resourceHooks,
        removeItemResource,
        updateResourceField,
        removeItem,
    } = useResourceHook();

    const { updateCost } = useActivitiesHook();
    const { setAlertDialog, closeConfirmation, setConfirmationModal } = useModalHook();

    const [localResources, setLocalResources] = useState(rows);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [resourceId, setResourceId] = useState(null);
    const [pin, setPin] = useState('')
    const [isLoading, setIsLoading] = useState(false);

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

    // useEffect(() => {
    //     console.log('resources', rows)
    // }, [rows])

    const handleOpenDeleteModal = (params) => {
        setResourceId(params);
        setOpenDeleteModal(true)
        const data = {
            status: "warning",
            title: ` Are you sure you want to delete this resource?`,
            description:
                "The selected resource will be removed from the table. Please input authorization pin to proceed.",
        };
        setConfirmationModal(data);
    }

    const handleDeleteResource = async () => {
        try {
            setIsLoading(true)

            const formData = new FormData();
            formData.append("pin", pin);

            const result = await new Promise((resolve) => {
                removeItem(formData, (status, message,) =>
                    resolve({ status, message, })
                );
            });

            const { status, message } = result;
            if (status === 200) {
                setAlertDialog({
                    status: "success",
                    title: message,
                    description: message,
                });
                onRemove(resourceId);
                setResourceId(null)
                removeItemResource(resourceId)
                setOpenDeleteModal(false);
                closeConfirmation();
            } else {
                setAlertDialog({
                    status: "error",
                    title: message,
                    description: message,
                });
            }
        }
        catch (err) {
            setIsLoading(false)
            setAlertDialog({
                status: "error",
                title: "Unexpected error",
                description: "Something went wrong. Please try again.",
            });
        }
        finally {
            setIsLoading(false)
        }
    }

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

                                <td>
                                    <Typography>{name || "-"}{pin}</Typography>
                                </td>

                                <td>
                                    {isEditing ? (
                                        <Input
                                            value={quantity ?? 0}
                                            size="sm"
                                            placeholder="Quantity"
                                            onChange={(e) => {
                                                const intValue = parseInt(e.target.value, 10) || 0;
                                                onChangeFieldValue(id, "quantity", intValue)
                                                onblur()
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

                                <td>
                                    <Typography>
                                        {formattedPrice(quantity * individualPrice) || "-"}
                                    </Typography>
                                </td>

                                <td>
                                    {isEditing ? (
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
                                            {purchaseTypeId?.label || "-"}
                                        </Typography>
                                    )}
                                </td>

                                <td>
                                    {isEditing ? (
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
                                        onClick={() => handleOpenDeleteModal(id)}
                                        disabled={!isEditing}
                                        icon={<Trash size={14} />}
                                        size={"sm"}
                                        color={'danger'}
                                        variant={"text"}
                                    />
                                </td>
                            </tr>
                        );
                    }
                ) ?? []}

            {
                openDeleteModal && (
                    <ConfirmationModalComponent
                        withAuthPin={true}
                        leftButtonLabel="Cancel"
                        leftButtonAction={() => {
                            setOpenDeleteModal(false)
                            closeConfirmation()
                        }}
                        rightButtonLabel="Delete"
                        rightButtonAction={() => handleDeleteResource()}
                        setAuthPin={setPin}
                        isLoading={isLoading}
                    />
                )
            }

        </Fragment>
    );
};

export default Resources;
