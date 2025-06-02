import { Fragment, useState, useEffect } from 'react';

import { Stack, Link, Typography, Input, Select, Option } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { Trash } from 'lucide-react';
import { v4 as uuid } from 'uuid';

import useAOPObjectivesHooks from '../../../../../../Hooks/AOP/AOPObjectivesHook';
import useResourceHook from '../../../../../../Hooks/ResourceHook';
import useActivitiesHook from '../../../../../../Hooks/ActivitiesHook';

import IconButtonComponent from '../../../../../../Components/Common/IconButtonComponent';
import { createJSONStorage } from 'zustand/middleware';

const TableRow = ({
    rows,
    parentId,
    objectiveRowId,
}) => {

    const navigate = useNavigate();

    const { resources, findResourcesByActivityID } = useResourceHook();
    const { updateActivityField, removeActivity } = useActivitiesHook();

    //local state
    const [localAopActivity, setLocalAopActivity] = useState({});
    const [editRowId, setEditRowId] = useState(null);

    //format the activities array for the table
    const formattedActivities = rows.map(({ activity_uuid, name, is_gad_related, cost, start_month, end_month, target }, index) => ({
        id: activity_uuid ? activity_uuid : uuid(),
        parentId: objectiveRowId,
        rowId: index + 1,
        name: name,
        isGadRelated: is_gad_related,
        cost: cost,
        startMonth: start_month,
        endMonth: end_month,
        target: {
            firstQuarter: target.first_quarter,
            secondQuarter: target.second_quarter,
            thirdQuarter: target.third_quarter,
            fourthQuarter: target.fourth_quarter,
        }
    }));

    useEffect(() => {
        console.log(formattedActivities);
    }, [])

    const handleOnRowClick = (id) => {

        setEditRowId(id);

        if (localAopActivity[id]) return;

        // Find the current row by ID
        const currentRow = formattedActivities.find((row) => row.id === id);
        if (!currentRow) return;

        const { name, startMonth, endMonth, target, cost, isGadRelated } = currentRow;

        setLocalAopActivity((prev) => ({
            ...prev,
            [id]: {
                localName: name || '',
                localStartMonth: startMonth || '',
                localEndMonth: endMonth || '',
                localTarget: {
                    firstQuarter: target?.firstQuarter || '',
                    secondQuarter: target?.secondQuarter || '',
                    thirdQuarter: target?.thirdQuarter || '',
                    fourthQuarter: target?.fourthQuarter || '',
                },
                localCost: cost || 0,
                localIsGadRelated: isGadRelated || false
            },
        }));

    };

    return (
        <Fragment>

            {formattedActivities?.filter(value => value?.parentId === parentId)?.map(({ rowId, id, name, isGadRelated, cost, startMonth, endMonth, target }, index) => {

                const isEditing = editRowId === id;

                return (

                    <tr key={id}>
                        <td>
                            <Typography>
                                {index + 1}
                                {/* {id} */}
                            </Typography>
                        </td>

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <Input
                                    value={localAopActivity[id]?.localName || ''}
                                    size='sm'
                                    placeholder='name'
                                    onChange={(e) =>
                                        setLocalAopActivity((prev) => ({
                                            ...prev,
                                            [id]: {
                                                ...prev[id],
                                                localName: e.target.value,
                                            },
                                        }))
                                    }
                                    onBlur={() => {
                                        updateActivityField(id, 'name', localAopActivity[id]?.localName);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>
                                    {/* {console.info(localAopActivity[id]?.localName || '')} */}
                                    {name || '-'}
                                </Typography>
                            )}
                        </td>

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <>
                                    <Input
                                        size='sm'
                                        type='month'
                                        value={localAopActivity?.[id]?.localStartMonth || ''}
                                        onChange={(e) => {
                                            const newValue = e.target.value
                                            setLocalAopActivity((prev) => ({
                                                ...prev,
                                                [id]: {
                                                    ...prev[id],
                                                    localStartMonth: newValue
                                                },
                                            }));
                                            // console.log(newValue)
                                            updateActivityField(id, 'startMonth', newValue);
                                        }}

                                        onBlur={() => setEditRowId(null)}
                                    />
                                </>
                            ) : (
                                <Typography>
                                    {startMonth
                                        ? new Date(startMonth + '-01').toLocaleString('default', { month: 'long' })
                                        : '-'}
                                </Typography>
                            )}
                        </td>

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <Input
                                    size='sm'
                                    type='month'
                                    value={localAopActivity?.[id]?.localEndMonth || ''}
                                    onChange={(e) => {
                                        const newValue = e.target.value
                                        setLocalAopActivity((prev) => ({
                                            ...prev,
                                            [id]: {
                                                ...prev[id],
                                                localEndMonth: newValue
                                            },
                                        }));
                                        // console.log(newValue)

                                        updateActivityField(id, 'endMonth', newValue);
                                    }}
                                    onBlur={() => setEditRowId(null)}
                                />
                            ) : (
                                <Typography>
                                    {endMonth
                                        ? new Date(endMonth + '-01').toLocaleString('default', { month: 'long' })
                                        : '-'}
                                </Typography>
                            )}
                        </td>

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <Input
                                    value={localAopActivity?.[id]?.localTarget?.firstQuarter || ''}
                                    size='sm'
                                    onChange={(e) =>
                                        setLocalAopActivity(prev => ({
                                            ...prev,
                                            [id]: {
                                                ...prev[id],
                                                localTarget: {
                                                    ...prev[id].localTarget,
                                                    firstQuarter: e.target.value
                                                }
                                            }
                                        }))
                                    }
                                    onBlur={() => {
                                        const value = localAopActivity[id]?.localTarget.firstQuarter;
                                        updateActivityField(id, 'target.firstQuarter', value);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>
                                    {target?.firstQuarter || '-'}
                                </Typography>
                            )}
                        </td>


                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <Input
                                    value={localAopActivity?.[id]?.localTarget?.secondQuarter || ''}
                                    size='sm'
                                    onChange={(e) =>
                                        setLocalAopActivity(prev => ({
                                            ...prev,
                                            [id]: {
                                                ...prev[id],
                                                localTarget: {
                                                    ...prev[id].localTarget,
                                                    secondQuarter: e.target.value
                                                }
                                            }
                                        }))
                                    }
                                    onBlur={() => {
                                        const value = localAopActivity[id]?.localTarget.secondQuarter;
                                        updateActivityField(id, 'target.secondQuarter', value);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>
                                    {target?.secondQuarter || '-'}
                                </Typography>
                            )}
                        </td>

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <Input
                                    value={localAopActivity?.[id]?.localTarget?.thirdQuarter || ''}
                                    size='sm'
                                    onChange={(e) =>
                                        setLocalAopActivity(prev => ({
                                            ...prev,
                                            [id]: {
                                                ...prev[id],
                                                localTarget: {
                                                    ...prev[id].localTarget,
                                                    thirdQuarter: e.target.value
                                                }
                                            }
                                        }))
                                    }
                                    onBlur={() => {
                                        const value = localAopActivity[id]?.localTarget.thirdQuarter;
                                        updateActivityField(id, 'target.thirdQuarter', value);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>
                                    {target?.thirdQuarter || '-'}
                                </Typography>
                            )}
                        </td>

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <Input
                                    value={localAopActivity?.[id]?.localTarget?.fourthQuarter || ''}
                                    size='sm'
                                    onChange={(e) =>
                                        setLocalAopActivity(prev => ({
                                            ...prev,
                                            [id]: {
                                                ...prev[id],
                                                localTarget: {
                                                    ...prev[id].localTarget,
                                                    fourthQuarter: e.target.value
                                                }
                                            }
                                        }))
                                    }
                                    onBlur={() => {
                                        const value = localAopActivity[id]?.localTarget.fourthQuarter;
                                        updateActivityField(id, 'target.fourthQuarter', value);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>
                                    {target?.fourthQuarter || '-'}
                                </Typography>
                            )}
                        </td>

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <Input
                                    value={localAopActivity[id]?.localCost}
                                    size='sm'
                                    onChange={(e) =>
                                        setLocalAopActivity((prev) => ({
                                            ...prev,
                                            localCost: e.target.value,
                                        }))
                                    }
                                    onBlur={() => {
                                        updateActivityField(id, 'cost', localAopActivity.localCost);
                                        setEditRowId(null);
                                    }}
                                    disabled
                                />
                            ) : (
                                <Typography>{cost}</Typography>
                            )}
                        </td>

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <Select
                                    size='sm'
                                    value={localAopActivity?.[id]?.isGadRelated || false}
                                    onChange={(e, newValue) => updateActivityField(id, "isGadRelated", newValue)}
                                >
                                    <Option value={true}>Yes</Option>
                                    <Option value={false}>No</Option>
                                </Select>
                            ) : (
                                <Typography>
                                    {localAopActivity?.[id]?.isGadRelated}
                                    {isGadRelated ? 'Yes' : 'No'}
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

                                <Link
                                    component="button"
                                    onClick={() => {

                                        // const resources = findResourcesByActivityID(id)
                                        // console.log(resources)

                                        navigate(resources.length !== 0 ? `resources/${rowId}` : `items/${rowId}`, {
                                            state: {
                                                parentId: id,
                                                objectiveRowId: objectiveRowId,
                                                activityRowId: rowId,
                                                cost: cost
                                            }
                                        })
                                    }}
                                    fontSize={12}
                                >
                                    Resources
                                </Link>

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

                                <IconButtonComponent
                                    onClick={() => removeActivity(id)}
                                    icon={<Trash size={14} />}
                                    size={'sm'}
                                    // color={'danger'}
                                    variant={'text'}
                                />
                            </Stack>
                        </td>
                    </tr>
                )
            })}
        </Fragment >
    )
}

export default TableRow
