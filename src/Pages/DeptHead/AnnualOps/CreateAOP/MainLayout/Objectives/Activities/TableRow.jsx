import { Fragment, useEffect, useRef, useState } from 'react'

import { Stack, Link, Typography, Input, Select, Option, Autocomplete } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Trash, FunnelX } from 'lucide-react';
import useAOPObjectivesHooks from '../../../../../../../Hooks/AOP/AOPObjectivesHook';

import IconButtonComponent from '../../../../../../../Components/Common/IconButtonComponent';
import ButtonComponent from '../../../../../../../Components/Common/ButtonComponent';
import InputComponent from '../../../../../../../Components/Form/InputComponent';
import AutoCompleteComponent from '../../../../../../../Components/Form/AutocompleteComponent';

import { AOP_CONSTANTS, MONTHS } from '../../../../../../../Data/constants';

const TableRow = ({
    rows,
    handleChange,
    deleteRow,
    parentId,
    objectiveRowId,
}) => {

    const navigate = useNavigate();

    //local state
    const [localAopActivity, setLocalAopActivity] = useState({});
    const [editRowId, setEditRowId] = useState(null);

    // useEffect(() => {
    //     console.log(rows)
    // }, [rows])

    const handleOnRowClick = (id) => {
        setEditRowId(id);

        if (localAopActivity[id]) return;

        // Find the current row by ID
        const currentRow = rows.find((row) => row.id === id);
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
            {rows?.filter(value => value?.parentId === parentId)?.map(({ rowId, id, name, isGadRelated, cost, startMonth, endMonth, target }, index) => {

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
                                        handleChange(id, 'name', localAopActivity[id]?.localName);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>{name || '-'}</Typography>
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
                                            console.log(newValue)
                                            handleChange(id, 'startMonth', newValue);
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
                                        console.log(newValue)

                                        handleChange(id, 'endMonth', newValue);
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
                                        handleChange(id, 'target.firstQuarter', value);
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
                                        handleChange(id, 'target.secondQuarter', value);
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
                                        handleChange(id, 'target.thirdQuarter', value);
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
                                        handleChange(id, 'target.fourthQuarter', value);
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
                                        handleChange(id, 'cost', localAopActivity.localCost);
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
                                    onChange={(e, newValue) => handleChange(id, "isGadRelated", newValue)}
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

                        <td
                            onClick={() => setEditRowId(id)}
                            style={{ cursor: 'pointer' }}
                        >

                            <Stack
                                size='sm'
                                direction={'flex'}
                                alignItems={'center'}
                                justifyContent={'space-between'}
                                gap={1}
                            >

                                <Link
                                    component="button"
                                    onClick={() => navigate(`items/${rowId}`, {
                                        state: {
                                            parentId: id,
                                            objectiveRowId: objectiveRowId,
                                            activityRowId: rowId,
                                            cost: cost
                                        }
                                    })}
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
                                    onClick={() => deleteRow(id)}
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