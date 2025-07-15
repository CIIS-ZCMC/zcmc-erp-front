import { useEffect, useState, Fragment } from "react";
import { Typography, Stack, Link, Chip, Input, Tooltip, Textarea } from "@mui/joy";
import { Trash, PencilLine } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import AutocompleteComponent from "../../../../../Components/Form/AutocompleteComponent";
import IconButtonComponent from "../../../../../Components/Common/IconButtonComponent";
import InputComponent from "../../../../../Components/Form/InputComponent";
import ModalComponent from "../../../../../Components/Common/Dialog/ModalComponent";
import TextareaComponent from "../../../../../Components/Form/TextareaComponent";
import ConfirmationModalComponent from "../../../../../Components/Common/Dialog/ConfirmationModalComponent";
import AlertDialogComponent from "../../../../../Components/Common/Dialog/AlertDialogComponent";

import useObjectivesHook from "../../../../../Hooks/ObjectivesHook";
import useModalHook from "../../../../../Hooks/ModalHook";

const ObjectivesTable = ({
    rows,
    handleChange,
    deleteRow,
    function_types,
    activitiesCount,
    isEditing,
    disabledEditMode,
}) => {
    const navigate = useNavigate();

    const tableDataStyles = { cursor: 'pointer' }

    const { objectives, deleteObjective, currentEditedObjective, setCurrentEditedObjective, clearOthersFields, removeItem } = useObjectivesHook();
    const { setAlertDialog, closeConfirmation, setConfirmationModal } = useModalHook();

    const [objectiveId, setObjectiveId] = useState(null);
    const [openOthersModal, setOpenOthersModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pin, setPin] = useState(null)

    const handleRemoveObjective = (id) => {
        localStorage.removeItem('activities-storage');
        deleteObjective(id)
    }

    const handleOpenOthersModal = (id) => {
        const objective = objectives.find(obj => obj.id === id)
        setCurrentEditedObjective(objective)
        setOpenOthersModal(true)
    }

    const handleCloseOthersModal = () => {
        setOpenOthersModal(false)
    }

    // local handler for onChange text area
    const handleOnTextAreaChange = (id, field, value) => {
        handleChange(id, field, value);
        if (currentEditedObjective?.id === id) {
            setCurrentEditedObjective({
                ...currentEditedObjective,
                [field]: value
            });
        }
    };

    const handleSaveOthers = () => {
        let data = {};

        data = {
            status: 200,
            title: "Objectives and Success Indicator created successfully!",
            description: "",
        };
        setAlertDialog(data)
        handleCloseOthersModal()
    }

    // useEffect(() => {
    //     console.log('objectives rows table', objectives)
    // }, [objectives])


    const handleOpenDeleteModal = (params) => {
        setObjectiveId(params)
        setOpenDeleteModal(true)
        const data = {
            status: "warning",
            title: ` Are you sure you want to delete item?`,
            description:
                "The selected item will be removed from the table. Please input authorization pin to proceed.",
        };
        setConfirmationModal(data);
    }

    const handleDeleteObjective = async () => {
        setIsLoading(true)
        try {
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
                deleteRow(objectiveId)
                setObjectiveId(null)
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
        catch (error) {
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
            {
                rows?.map(({ id, rowId, functionType, objective, successIndicator, othersObjective, othersSuccessIndicator, objectiveUuid }, index) => {

                    const isEnableRemove = !functionType && !objective && !successIndicator

                    return (
                        <Fragment key={id}>
                            <tr>
                                <td>
                                    <Typography>
                                        {/* {id} */}
                                        {/* {objectiveUuid} */}
                                        {index + 1}
                                    </Typography>
                                </td>

                                <td style={tableDataStyles}>

                                    {isEditing ?
                                        (
                                            <>
                                                <Stack>
                                                    <AutocompleteComponent
                                                        placeholder="Select function type"
                                                        value={functionType}
                                                        setValue={(val) => {
                                                            handleChange(id, 'functionType', val);
                                                        }}
                                                        options={function_types}
                                                    />

                                                    <Typography mt={1}>
                                                        {functionType?.label || ""}
                                                        {/* {functionType?.description} */}
                                                    </Typography>
                                                </Stack>
                                            </>
                                        )
                                        :
                                        (
                                            <Typography mt={1}>
                                                {functionType?.label || "-"}
                                                {/* {functionType?.description} */}
                                            </Typography>
                                        )
                                    }
                                </td>

                                <td style={tableDataStyles}>
                                    {isEditing ? (
                                        <Fragment>
                                            <Stack
                                                direction={'row'}
                                                alignItems={'center'}
                                                gap={1}
                                            >
                                                <AutocompleteComponent
                                                    placeholder="Select objective"
                                                    value={objective}
                                                    setValue={(val) => {
                                                        handleChange(id, 'objective', val);
                                                        if (val?.code !== 'OBJ-O-6480') {
                                                            clearOthersFields(id); // Clear if not "Other" type
                                                        }
                                                    }}
                                                    options={functionType?.objectives ?? []}
                                                    isRenderOption
                                                />

                                                {objective?.description === 'Others, please insert note/remarks' &&
                                                    <IconButtonComponent
                                                        onClick={() => handleOpenOthersModal(id)}
                                                        icon={<PencilLine size={14} />}
                                                        // color={'danger'}
                                                        disabled={isEnableRemove}
                                                        size={'sm'}
                                                        variant={'text'}
                                                    />
                                                }

                                            </Stack>

                                            <Typography mt={1}>
                                                {objective?.description === 'Others, please insert note/remarks' ? othersObjective : objective?.description || ''}
                                            </Typography>
                                        </Fragment>
                                    ) : (
                                        // <Tooltip title={objective ? objective?.description : ''} variant="solid">
                                        <Typography >
                                            {objective?.description === 'Others, please insert note/remarks' ? othersObjective : objective?.description || '-'}
                                        </Typography>
                                        // </Tooltip>
                                    )}
                                </td>

                                <td style={tableDataStyles}>

                                    {isEditing ? (
                                        <Fragment>
                                            <AutocompleteComponent
                                                placeholder="Select success indicator"
                                                value={successIndicator}
                                                setValue={(val) => {
                                                    handleChange(id, 'successIndicator', val);
                                                }}
                                                options={objective?.success_indicators ?? []}
                                                isRenderOption
                                            />
                                            <Typography mt={1} >
                                                {objective?.description === 'Others, please insert note/remarks' ? othersSuccessIndicator : successIndicator?.description || ''}
                                            </Typography>
                                        </Fragment>

                                    ) :
                                        (
                                            <Typography >
                                                {objective?.description === 'Others, please insert note/remarks' ? othersSuccessIndicator : successIndicator?.description || '-'}
                                            </Typography>
                                        )
                                    }
                                </td>

                                <td>
                                    <Stack
                                        direction={'flex'}
                                        alignItems={'center'}
                                        justifyContent={'space-between'}
                                        gap={1}
                                    >

                                        <Stack
                                            direction={'row'}
                                            alignItems={'center'}
                                            gap={1}
                                        >
                                            <Link
                                                component="button"
                                                onClick={() => navigate(`activities/${rowId}`, {
                                                    state: {
                                                        objectiveParentId: objectiveUuid ? objectiveUuid : id,
                                                        rowId: rowId,
                                                    }
                                                })}
                                                fontSize={14}
                                                disabled={disabledEditMode()}
                                            >
                                                Manage Activities
                                            </Link>

                                            <Chip
                                                variant="outlined"
                                                color="success"
                                            >
                                                {activitiesCount[index]?.length || 0}
                                            </Chip>
                                        </Stack>

                                        <Stack
                                            alignItems={'center'}
                                            justifyContent={'center'}
                                        >
                                            <IconButtonComponent
                                                onClick={() => handleOpenDeleteModal(id)}
                                                // onClick={() => handleRemoveObjective(id)}
                                                icon={<Trash size={14} />}
                                                color={'danger'}
                                                disabled={!isEditing}
                                                size={'sm'}
                                                variant={'text'}
                                            />
                                        </Stack>

                                    </Stack>
                                </td>
                            </tr >

                            <ModalComponent
                                isOpen={openOthersModal}
                                handleClose={handleCloseOthersModal}
                                title={'Other Objective and Success Indicator'}
                                content={
                                    <>
                                        <Stack
                                            direction={'column'}
                                            gap={3}
                                        >
                                            <TextareaComponent
                                                label={'Objective'}
                                                placeholder="Other objective, please specify"
                                                value={currentEditedObjective?.othersObjective || ''}
                                                onChange={(e) => handleOnTextAreaChange(
                                                    currentEditedObjective?.id,
                                                    'othersObjective',
                                                    e.target.value
                                                )}
                                            />

                                            <TextareaComponent
                                                label={'Success Indicator'}
                                                placeholder="Other success indicator, please specify"
                                                value={currentEditedObjective?.othersSuccessIndicator || ''}
                                                onChange={(e) => handleOnTextAreaChange(
                                                    currentEditedObjective?.id,
                                                    'othersSuccessIndicator',
                                                    e.target.value
                                                )}
                                            />
                                        </Stack>

                                    </>
                                }
                                hasActionButtons={true}
                                rightButtonLabel={"Save"}
                                rightButtonAction={() => handleSaveOthers()}
                            />

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
                                        rightButtonAction={() => handleDeleteObjective()}
                                        setAuthPin={setPin}
                                        isLoading={isLoading}
                                    />
                                )
                            }
                        </Fragment>

                    )
                })
            }
        </Fragment >
    );
};

export default ObjectivesTable;
