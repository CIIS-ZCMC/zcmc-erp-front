import { useEffect, useState, Fragment } from "react";
import { Typography, Stack, Link, Chip, Input, Tooltip, } from "@mui/joy";
import { Trash, PencilLine } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import AutocompleteComponent from "../../../../../Components/Form/AutocompleteComponent";
import IconButtonComponent from "../../../../../Components/Common/IconButtonComponent";
import InputComponent from "../../../../../Components/Form/InputComponent";
import ModalComponent from "../../../../../Components/Common/Dialog/ModalComponent";
import TextareaComponent from "../../../../../Components/Form/TextareaComponent";

import useObjectivesHook from "../../../../../Hooks/ObjectivesHook";
import useModalHook from "../../../../../Hooks/ModalHook";

const ObjectivesTable = ({
    rows,
    handleChange,
    deleteRow,
    function_types,
    activitiesCount,
}) => {
    const navigate = useNavigate();

    const tableDataStyles = { cursor: 'pointer' }
    const { objectives, deleteObjective, currentEditedObjective, setCurrentEditedObjective } = useObjectivesHook();

    const [openOthersModal, setOpenOthersModal] = useState(false);
    const [editRowId, setEditRowId] = useState(null);

    const handleRemoveObjective = (id) => {
        localStorage.removeItem('activities-storage');
        deleteObjective(id)
    }

    const handleOpenOthersModal = (id) => {
        const objective = objectives.find(obj => obj.id === id)
        console.log(objective)
        setCurrentEditedObjective(objective)
        setOpenOthersModal(true)
    }

    const handleCloseOthersModal = () => {
        setOpenOthersModal(false)
    }

    return (
        <Fragment>
            {
                rows?.map(({ id, rowId, functionType, objective, successIndicator, othersObjective, othersSuccessIndicator }, index) => {

                    const isEnableRemove = !functionType && !objective && !successIndicator

                    return (
                        <>
                            <tr key={id}>
                                <td>
                                    <Typography>
                                        {index + 1}
                                    </Typography>
                                </td>

                                <td onClick={() => setEditRowId(id)}
                                    style={tableDataStyles}
                                >
                                    {editRowId === id ?
                                        (
                                            <AutocompleteComponent
                                                placeholder="Select function type"
                                                value={functionType}
                                                setValue={(val) => {
                                                    handleChange(id, 'functionType', val);
                                                    setEditRowId(null);
                                                }}
                                                options={function_types}
                                            />
                                        )
                                        :
                                        (
                                            <Typography>
                                                {functionType?.label || "-"}
                                            </Typography>
                                        )
                                    }
                                </td>

                                <td onClick={() => setEditRowId(id)}
                                    style={tableDataStyles}
                                >

                                    {editRowId === id ?
                                        (
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
                                                        setEditRowId(null);
                                                    }}
                                                    options={functionType?.objectives ?? []}
                                                    isRenderOption
                                                />

                                                {objective?.code === 'OBJ-O-4904' &&
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
                                        )
                                        :
                                        (
                                            <Tooltip title={objective ? objective?.description : ''} variant="solid">
                                                <Typography >
                                                    {objective?.code === 'OBJ-O-4904' ? othersObjective : objective?.code || '-'}
                                                </Typography>
                                            </Tooltip>
                                        )
                                    }
                                </td>

                                <td onClick={() => setEditRowId(id)}
                                    style={tableDataStyles}
                                >
                                    {editRowId === id ?
                                        (
                                            <AutocompleteComponent
                                                placeholder="Select success indicator"
                                                value={successIndicator}
                                                setValue={(val) => {
                                                    handleChange(id, 'successIndicator', val);
                                                    setEditRowId(null);
                                                }}
                                                options={objective?.success_indicators ?? []}
                                                isRenderOption
                                            />
                                        )
                                        :
                                        (
                                            <Tooltip title={successIndicator ? successIndicator?.description : ''} variant="solid">
                                                <Typography >
                                                    {objective?.code === 'OBJ-O-4904' ? othersSuccessIndicator : successIndicator?.code || '-'}
                                                </Typography>
                                            </Tooltip>
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
                                                onClick={() => navigate(`activities/${rowId}`, { state: { parentId: id, rowId: rowId, objectId: id } })}
                                                fontSize={14}
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

                                        <Stack>
                                            <IconButtonComponent
                                                onClick={() => handleRemoveObjective(id)}
                                                icon={<Trash size={14} />}
                                                // color={'danger'}
                                                disabled={isEnableRemove}
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
                                                onChange={(e) => handleChange(
                                                    currentEditedObjective?.id,
                                                    'othersObjective',
                                                    e.target.value
                                                )}
                                            />

                                            <TextareaComponent
                                                label={'Success Indicator'}
                                                placeholder="Other success indicator, please specify"
                                                value={currentEditedObjective?.othersSuccessIndicator || ''}
                                                onChange={(e) => handleChange(
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

                        </>

                    )
                })
            }



        </Fragment >
    );
};

export default ObjectivesTable;
