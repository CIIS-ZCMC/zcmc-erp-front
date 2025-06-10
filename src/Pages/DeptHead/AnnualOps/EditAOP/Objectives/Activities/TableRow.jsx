import { Fragment, useState, useEffect } from 'react';

import { Stack, Link, Typography, Input, Select, Option } from '@mui/joy';
import { useNavigate, useLocation, } from 'react-router-dom';
import { Trash } from 'lucide-react';
import { v4 as uuid, validate } from 'uuid';

import useAOPObjectivesHooks from '../../../../../../Hooks/AOP/AOPObjectivesHook';
import useActivitiesHook from '../../../../../../Hooks/ActivitiesHook';
import useResourceHook from '../../../../../../Hooks/ResourceHook';
import useResponsiblePeopleHook from '../../../../../../Hooks/ResponsiblePeopleHook';

import IconButtonComponent from '../../../../../../Components/Common/IconButtonComponent';
import { createJSONStorage } from 'zustand/middleware';

const TableRow = ({
    rows,
    aopRowId,
    parentId, //this will be the parent id for activity
    objectiveRowId,
}) => {

    const navigate = useNavigate();

    const { resources, findResourcesByActivityID } = useResourceHook();
    const { updateActivityField, removeActivity } = useActivitiesHook();
    const { responsible_people } = useResponsiblePeopleHook();

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

    //local state
    const [localAopActivity, setLocalAopActivity] = useState({});
    const [editRowId, setEditRowId] = useState(null);

    const handleOnRowClick = (id) => {
        setEditRowId(id);

        // if (localAopActivity[id]) return;

        // // Find the current row by ID
        // const currentRow = rows.find((row) => row.id === id);
        // if (!currentRow) return;

        // const { name, startMonth, endMonth, target, cost, isGadRelated } = currentRow;

        // setLocalAopActivity((prev) => ({
        //     ...prev,
        //     [id]: {
        //         localName: name || '',
        //         localStartMonth: startMonth || '',
        //         localEndMonth: endMonth || '',
        //         localTarget: {
        //             firstQuarter: target?.firstQuarter || '',
        //             secondQuarter: target?.secondQuarter || '',
        //             thirdQuarter: target?.thirdQuarter || '',
        //             fourthQuarter: target?.fourthQuarter || '',
        //         },
        //         localCost: cost || 0,
        //         localIsGadRelated: isGadRelated || false
        //     },
        // }));

    };

    return (
        <Fragment>

            {rows?.filter(value => value?.parentId === parentId)?.map(({ rowId, id, name, isGadRelated, cost, startMonth, endMonth, target: { firstQuarter, secondQuarter, thirdQuarter, fourthQuarter } }, index) => {

                const isEditing = editRowId === id;

                return (

                    <tr key={id}>
                        <td>
                            <Typography>
                                {index + 1}
                            </Typography>
                        </td>

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <Input
                                    // value={localAopActivity[id]?.localName || ''}
                                    value={name}
                                    size='sm'
                                    placeholder='name'
                                    onChange={(e) =>
                                        updateActivityField(id, 'name', e.target.value)
                                        // setLocalAopActivity((prev) => ({
                                        //     ...prev,
                                        //     [id]: {
                                        //         ...prev[id],
                                        //         localName: e.target.value,
                                        //     },
                                        // }))
                                    }
                                    onBlur={() => {
                                        updateActivityField(id, 'name', name);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>
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
                                        value={startMonth}
                                        // value={localAopActivity?.[id]?.localStartMonth || ''}
                                        onChange={(e) => {
                                            const newValue = e.target.value
                                            // setLocalAopActivity((prev) => ({
                                            //     ...prev,
                                            //     [id]: {
                                            //         ...prev[id],
                                            //         localStartMonth: newValue
                                            //     },
                                            // }));
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
                                    value={endMonth}
                                    // value={localAopActivity?.[id]?.localEndMonth || ''}
                                    onChange={(e) => {
                                        const newValue = e.target.value
                                        // setLocalAopActivity((prev) => ({
                                        //     ...prev,
                                        //     [id]: {
                                        //         ...prev[id],
                                        //         localEndMonth: newValue
                                        //     },
                                        // }));
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
                                    value={firstQuarter}
                                    // value={localAopActivity?.[id]?.localTarget?.firstQuarter || ''}
                                    size='sm'
                                    onChange={(e) =>
                                        // setLocalAopActivity(prev => ({
                                        //     ...prev,
                                        //     [id]: {
                                        //         ...prev[id],
                                        //         localTarget: {
                                        //             ...prev[id].localTarget,
                                        //             firstQuarter: e.target.value
                                        //         }
                                        //     }
                                        // }))
                                        updateActivityField(id, 'target.firstQuarter', e.target.value)
                                    }
                                    onBlur={() => {
                                        const value = firstQuarter
                                        // const value = localAopActivity[id]?.localTarget.firstQuarter;
                                        updateActivityField(id, 'target.firstQuarter', value);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>
                                    {firstQuarter || '-'}
                                </Typography>
                            )}
                        </td>


                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <Input
                                    value={localAopActivity?.[id]?.localTarget?.secondQuarter || ''}
                                    size='sm'
                                    onChange={(e) =>
                                        updateActivityField(id, 'target.secondQuarter', e.target.value)
                                        // setLocalAopActivity(prev => ({
                                        //     ...prev,
                                        //     [id]: {
                                        //         ...prev[id],
                                        //         localTarget: {
                                        //             ...prev[id].localTarget,
                                        //             secondQuarter: e.target.value
                                        //         }
                                        //     }
                                        // }))
                                    }
                                    onBlur={() => {
                                        // const value = localAopActivity[id]?.localTarget.secondQuarter;
                                        const value = secondQuarter
                                        updateActivityField(id, 'target.secondQuarter', value);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>
                                    {secondQuarter || '-'}
                                </Typography>
                            )}
                        </td>

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <Input
                                    // value={localAopActivity?.[id]?.localTarget?.thirdQuarter || ''}
                                    value={thirdQuarter}
                                    size='sm'
                                    onChange={(e) =>
                                        updateActivityField(id, 'target.thirdQuarter', e.target.value)
                                        // setLocalAopActivity(prev => ({
                                        //     ...prev,
                                        //     [id]: {
                                        //         ...prev[id],
                                        //         localTarget: {
                                        //             ...prev[id].localTarget,
                                        //             thirdQuarter: e.target.value
                                        //         }
                                        //     }
                                        // }))
                                    }
                                    onBlur={() => {
                                        // const value = localAopActivity[id]?.localTarget.thirdQuarter;
                                        const value = thirdQuarter;
                                        updateActivityField(id, 'target.thirdQuarter', value);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>
                                    {thirdQuarter || '-'}
                                </Typography>
                            )}
                        </td>

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <Input
                                    value={fourthQuarter}
                                    // value={localAopActivity?.[id]?.localTarget?.fourthQuarter || ''}
                                    size='sm'
                                    onChange={(e) =>
                                        updateActivityField(id, 'target.fourthQuarter', e.target.value)
                                        // setLocalAopActivity(prev => ({
                                        //     ...prev,
                                        //     [id]: {
                                        //         ...prev[id],
                                        //         localTarget: {
                                        //             ...prev[id].localTarget,
                                        //             fourthQuarter: e.target.value
                                        //         }
                                        //     }
                                        // }))
                                    }
                                    onBlur={() => {
                                        const value = localAopActivity[id]?.localTarget.fourthQuarter;
                                        updateActivityField(id, 'target.fourthQuarter', value);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>
                                    {fourthQuarter || '-'}
                                </Typography>
                            )}
                        </td>

                        <td onClick={() => handleOnRowClick(id)}>
                            <Typography>{cost}</Typography>
                        </td>


                        {/* Alternative */}
                        {/* <td onClick={() => handleOnRowClick(id)}>
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
                                    {console.info(isGadRelated)}
                                    {isGadRelated
                                        ? 'Yes'
                                        : 'No'
                                    }
                                </Typography>
                            )}
                        </td> */}

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <Select
                                    size='sm'
                                    value={isGadRelated}
                                    onChange={(e, newValue) => {
                                        updateActivityField(id, "isGadRelated", newValue)
                                    }}
                                >
                                    <Option value={true}>Yes</Option>
                                    <Option value={false}>No</Option>
                                </Select>
                            ) : (
                                <Typography>
                                    {console.info(isGadRelated)}
                                    {isGadRelated ? 'Yes' : 'No'}
                                </Typography>
                            )}
                        </td>

                        {/* 
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
                        </td> */}

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
