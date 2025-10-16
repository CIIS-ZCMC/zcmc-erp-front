import { Fragment, useEffect, useState } from 'react'

import { Chip, Stack, Link, Typography, Input } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { Trash } from 'lucide-react';

import useResourceHook from '../../../../../../Hooks/ResourceHook';
import useResponsiblePeopleHook from '../../../../../../Hooks/ResponsiblePeopleHook';
import useModalHook from '../../../../../../Hooks/ModalHook';
import useActivitiesHook from '../../../../../../Hooks/ActivitiesHook';

import AutocompleteComponent from '../../../../../../Components/Form/AutocompleteComponent';
import IconButtonComponent from '../../../../../../Components/Common/IconButtonComponent';
import ConfirmationModalComponent from '../../../../../../Components/Common/Dialog/ConfirmationModalComponent';
import TextareaComponent from '../../../../../../Components/Form/TextareaComponent';

import { formattedLongDate } from '../../../../../../Utils/formattedLongDate';
import { formattedPrice } from '../../../../../../Utils/formattedPrice';


const gadRelatedOptions = [
    { id: 1, label: 'Yes', value: true },
    { id: 2, label: 'No', value: false }
]

const ActivitiesTable = ({
    isEditing,
    rows,
    handleChange,
    deleteRow,
    parentId,
    objectiveRowId,
}) => {
    const navigate = useNavigate();

    const filteredActivities = rows?.filter(value => value?.parentId === parentId)

    const { resources, findResourcesByActivityID, totalCost, removeItemResource, removeItem } = useResourceHook();
    const { responsible_people, removeMultipleResponsiblePersonnel } = useResponsiblePeopleHook();
    const { setAlertDialog, closeConfirmation, setConfirmationModal } = useModalHook();
    const { removeActivity } = useActivitiesHook();

    const [isLoading, setIsLoading] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [activityId, setActivityId] = useState(null);
    const [pin, setPin] = useState('');

    const resourceCountPerActivity = resources.reduce((acc, resource) => {
        const { parentId } = resource;

        if (parentId) {
            acc[parentId] = (acc[parentId] || 0) + 1;
        }

        return acc;
    }, {});

    const responsibleCountPerActivity = responsible_people.reduce((acc, responsible) => {

        const { activityId, areas, designations, users } = responsible

        const count =
            (areas?.length || 0) +
            (designations?.length || 0) +
            (users?.length || 0);

        acc[activityId] = count;
        return acc;

    }, {});


    const handleOpenDeleteModal = (params) => {
        setActivityId(params)
        setOpenDeleteModal(true)
        const data = {
            status: "warning",
            title: ` Are you sure you want to delete this activity?`,
            description:
                "The selected activity will be removed from the table. Please input authorization pin to proceed.",
        };
        setConfirmationModal(data);
    }

    const handleDeleteActivity = async () => {

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

                deleteActivityAndRelated(activityId)
                setActivityId(null)
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

    const deleteActivityAndRelated = (activityId) => {
        // Find the activity (if you need to check existence)
        // const activity = activities.find(act => act.id === activityId);

        // Remove resources related to this activity
        const resourceIdsToDelete = resources
            .filter(res => res.parentId === activityId)
            .map(res => res.id);

        if (resourceIdsToDelete.length > 0) {
            removeItemResource(resourceIdsToDelete);
        }

        // Remove responsible people for this activity
        removeMultipleResponsiblePersonnel([activityId]);

        // Remove the activity itself
        removeActivity(activityId);

        // console.log(activityId)
    };

    return (
        <Fragment>
            {filteredActivities?.map(({ rowId, id, parentId, name, isGadRelated, cost, startMonth, endMonth, target: { firstQuarter, secondQuarter, thirdQuarter, fourthQuarter } }, index) => {

                // const isEditing = editRowId === id;
                const isEnableRemove = !name && !isGadRelated;

                return (

                    <tr key={id}>
                        <td>
                            <Typography>
                                {index + 1}
                            </Typography>
                        </td>

                        <td >
                            {isEditing ? (
                                <TextareaComponent
                                    // label={'Objective'}
                                    placeholder="Activity name"
                                    value={name}
                                    onChange={(e) => handleChange(id, 'name', e.target.value)}
                                    onBlur={() => {
                                        handleChange(id, 'name', name);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>{name || '-'}</Typography>
                            )}

                        </td>

                        <td>
                            {isEditing ? (
                                <>
                                    <Input
                                        size='sm'
                                        type='month'
                                        value={startMonth}
                                        onChange={(e) => handleChange(id, 'startMonth', e.target.value)}
                                        onBlur={() => setEditRowId(null)}
                                    />
                                </>
                            ) : (
                                <Typography>
                                    {formattedLongDate(startMonth)}
                                </Typography>
                            )}
                        </td>

                        <td>
                            {isEditing ? (
                                <Input
                                    size='sm'
                                    type='month'
                                    value={endMonth}
                                    onChange={(e) => handleChange(id, 'endMonth', e.target.value)}
                                    onBlur={() => setEditRowId(null)}
                                />

                            ) : (
                                <Typography>
                                    {formattedLongDate(endMonth)}
                                </Typography>
                            )}
                        </td>

                        <td>
                            {isEditing ? (
                                <Input
                                    value={firstQuarter}
                                    size='sm'
                                    onChange={(e) => handleChange(id, 'target.firstQuarter', e.target.value)
                                    }
                                    onBlur={() => {
                                        const value = firstQuarter;
                                        handleChange(id, 'target.firstQuarter', value);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>
                                    {firstQuarter || '-'}
                                </Typography>
                            )}
                        </td>

                        <td>
                            {isEditing ? (
                                <Input
                                    value={secondQuarter}
                                    size='sm'
                                    onChange={(e) =>
                                        handleChange(id, 'target.secondQuarter', e.target.value)}
                                    onBlur={() => {
                                        const value = secondQuarter;
                                        handleChange(id, 'target.secondQuarter', value);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>
                                    {secondQuarter || '-'}
                                </Typography>
                            )}
                        </td>

                        <td>
                            {isEditing ? (
                                <Input
                                    value={thirdQuarter}
                                    size='sm'
                                    onChange={(e) =>
                                        handleChange(id, 'target.thirdQuarter', e.target.value)
                                    }
                                    onBlur={() => {
                                        const value = thirdQuarter;
                                        handleChange(id, 'target.thirdQuarter', value);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>
                                    {thirdQuarter || '-'}
                                </Typography>
                            )}
                        </td>

                        <td>
                            {isEditing ? (
                                <Input
                                    value={fourthQuarter}
                                    size='sm'
                                    onChange={(e) =>
                                        handleChange(id, 'target.fourthQuarter', e.target.value)
                                    }
                                    onBlur={() => {
                                        const value = fourthQuarter;
                                        handleChange(id, 'target.fourthQuarter', value);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>
                                    {fourthQuarter || '-'}
                                </Typography>
                            )}
                        </td>

                        <td >
                            <Typography>
                                {formattedPrice(cost)}
                            </Typography>
                        </td>

                        <td>
                            {isEditing ? (

                                <AutocompleteComponent
                                    placeholder="is GAD related activity"
                                    value={isGadRelated === true ? 'Yes' : 'No'}
                                    setValue={(val) =>
                                        handleChange(id, "isGadRelated", val.value)}
                                    options={gadRelatedOptions}
                                />
                            ) : (
                                <Typography>
                                    {/* {console.info(isGadRelated)} */}
                                    {isGadRelated
                                        ? 'Yes'
                                        : 'No'
                                    }
                                </Typography>
                            )}
                        </td>

                        <td >

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
                                        onClick={() => {
                                            const resources = findResourcesByActivityID(id);
                                            console.log(id)
                                            navigate(resources.length > 0 ? `resources/${rowId}` : `items/${rowId}`, {
                                                state: {
                                                    parentId: id,
                                                    objectiveRowId: objectiveRowId,
                                                    activityRowId: rowId,
                                                    cost,
                                                    name, //activity name
                                                }
                                            })
                                        }}
                                        fontSize={12}
                                    >
                                        Resources
                                    </Link>

                                    <Chip
                                        variant="outlined"
                                        color="success"
                                    >
                                        {resourceCountPerActivity[id] || 0}
                                    </Chip>

                                </Stack>


                                <Stack
                                    direction={'row'}
                                    alignItems={'center'}
                                    gap={1}
                                >
                                    <Link
                                        component="button"
                                        onClick={() => navigate(`person/${rowId}`, {
                                            state:
                                            {
                                                parentId: id,
                                                objectiveId: parentId,
                                                activityrowId: rowId,
                                            }
                                        })}
                                        fontSize={12}
                                    >

                                        Responsible Person
                                    </Link>


                                    <Chip
                                        variant="outlined"
                                        color="success"
                                    >
                                        {responsibleCountPerActivity[id] || 0}
                                    </Chip>
                                </Stack>

                                <IconButtonComponent
                                    onClick={() => handleOpenDeleteModal(id)}
                                    disabled={!isEditing}
                                    icon={<Trash size={14} />}
                                    size={'sm'}
                                    color={'danger'}
                                    variant={'text'}
                                />
                            </Stack>
                        </td>
                    </tr>
                )
            })}

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
                        rightButtonAction={() => handleDeleteActivity()}
                        setAuthPin={setPin}
                        isLoading={isLoading}
                    />
                )
            }

        </Fragment >
    )
}

export default ActivitiesTable