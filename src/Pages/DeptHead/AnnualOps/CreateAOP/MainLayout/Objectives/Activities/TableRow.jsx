import { Fragment, useEffect, useRef, useState } from 'react'

import { Stack, Link, Typography, Input, Select, Option, Autocomplete } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Trash, FunnelX } from 'lucide-react';

import IconButtonComponent from '../../../../../../../Components/Common/IconButtonComponent';
import ButtonComponent from '../../../../../../../Components/Common/ButtonComponent';
import InputComponent from '../../../../../../../Components/Form/InputComponent';
import AutoCompleteComponent from '../../../../../../../Components/Form/AutocompleteComponent';

import { AOP_CONSTANTS, MONTHS } from '../../../../../../../Data/constants';

const TableRow = ({
    rows,
    handleChange,
    deleteRow,
    objectiveId,
    editRowId,
    setEditRowId,
    editField,
}) => {

    const navigate = useNavigate();

    return (

        <Fragment>
            {rows?.map(({ id, activityCode, name, isGadRelated, cost, start_month, end_month, target }) => {

                const isEditing = editRowId === id;

                const [localAopActivity, setLocalAopActivity] = useState({
                    localName: name,
                    localStartMonth: start_month || '',
                    localEndMonth: end_month,
                    localTarget: {
                        firstQuarter: target.first_quarter,
                        secondQuarter: target.second_quarter,
                        thirdQuarter: target.third_quarter,
                        fourthQuarter: target.fourth_quarter,
                    },
                    localCost: cost
                })

                return (

                    <tr key={id}>
                        <td>
                            <Typography>
                                {id}
                            </Typography>
                        </td>

                        <td onClick={() => setEditRowId(id)}>
                            {isEditing ? (
                                <Input
                                    value={localAopActivity.localName}
                                    size='sm'
                                    onChange={(e) =>
                                        setLocalAopActivity((prev) => ({
                                            ...prev,
                                            localName: e.target.value,
                                        }))
                                    }
                                    onBlur={() => {
                                        handleChange(objectiveId, id, 'name', localAopActivity.localName);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>{name || '-'}</Typography>
                            )}
                        </td>


                        <td onClick={() => setEditRowId(id)}>
                            {isEditing ? (
                                <Autocomplete
                                    placeholder="Select start month"
                                    options={MONTHS}
                                    value={localAopActivity.localStartMonth || ''}
                                    size='sm'
                                    onChange={(_, newValue) => {
                                        setLocalAopActivity((prev) => ({
                                            ...prev,
                                            localStartMonth: newValue,
                                        }));

                                        handleChange(objectiveId, id, 'start_month', newValue);
                                    }}
                                    onBlur={() => setEditRowId(null)}
                                    isOptionEqualToValue={(option, value) => option === value}
                                    renderInput={(params) => <Input {...params} />}
                                />
                            ) : (
                                <Typography>{start_month || "-"}</Typography>
                            )}
                        </td>

                        <td onClick={() => setEditRowId(id)}>
                            {isEditing ? (
                                <Autocomplete
                                    placeholder="Select start month"
                                    options={MONTHS}
                                    value={localAopActivity.localEndMonth || ''}
                                    size='sm'
                                    onChange={(_, newValue) => {
                                        setLocalAopActivity((prev) => ({
                                            ...prev,
                                            localEndMonth: newValue,
                                        }));

                                        handleChange(objectiveId, id, 'end_month', newValue);
                                    }}
                                    onBlur={() => setEditRowId(null)}
                                    isOptionEqualToValue={(option, value) => option === value}
                                    renderInput={(params) => <Input {...params} />}
                                />
                            ) : (
                                <Typography>{end_month || "-"}</Typography>
                            )}
                        </td>

                        <td onClick={() => setEditRowId(id)}>
                            {isEditing ? (
                                <Input
                                    value={localAopActivity.localTarget.firstQuarter}
                                    size='sm'
                                    onChange={(e) =>
                                        setLocalAopActivity(prev => ({
                                            ...prev,
                                            localTarget: {
                                                ...prev.localTarget,
                                                firstQuarter: e.target.value
                                            }
                                        }))
                                    }
                                    onBlur={() => {
                                        handleChange(objectiveId, id, 'target.first_quarter', localAopActivity.localTarget.firstQuarter);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>{target?.first_quarter || '-'}</Typography>
                            )}

                        </td>

                        <td onClick={() => setEditRowId(id)}>
                            {isEditing ? (
                                <Input
                                    value={localAopActivity.localTarget.secondQuarter}
                                    size='sm'
                                    onChange={(e) =>
                                        setLocalAopActivity(prev => ({
                                            ...prev,
                                            localTarget: {
                                                ...prev.localTarget,
                                                secondQuarter: e.target.value
                                            }
                                        }))
                                    }
                                    onBlur={() => {
                                        handleChange(objectiveId, id, 'target.second_quarter', localAopActivity.localTarget.secondQuarter);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>{target?.second_quarter || '-'}</Typography>
                            )}
                        </td>

                        <td onClick={() => setEditRowId(id)}>
                            {isEditing ? (
                                <Input
                                    value={localAopActivity.localTarget.thirdQuarter}
                                    size='sm'
                                    onChange={(e) =>
                                        setLocalAopActivity(prev => ({
                                            ...prev,
                                            localTarget: {
                                                ...prev.localTarget,
                                                thirdQuarter: e.target.value
                                            }
                                        }))
                                    }
                                    onBlur={() => {
                                        handleChange(objectiveId, id, 'target.third_quarter', localAopActivity.localTarget.thirdQuarter);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>{target?.third_quarter || '-'}</Typography>
                            )}
                        </td>

                        <td onClick={() => setEditRowId(id)}>
                            {isEditing ? (
                                <Input
                                    value={localAopActivity.localTarget.fourthQuarter}
                                    size='sm'
                                    onChange={(e) =>
                                        setLocalAopActivity(prev => ({
                                            ...prev,
                                            localTarget: {
                                                ...prev.localTarget,
                                                fourthQuarter: e.target.value
                                            }
                                        }))
                                    }
                                    onBlur={() => {
                                        handleChange(objectiveId, id, 'target.fourth_quarter', localAopActivity.localTarget.fourthQuarter);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>{target?.fourth_quarter || '-'}</Typography>
                            )}
                        </td>

                        <td onClick={() => setEditRowId(id)}>
                            {editRowId === id ? (
                                <Input
                                    value={localAopActivity.localCost}
                                    size='sm'
                                    onChange={(e) =>
                                        setLocalAopActivity((prev) => ({
                                            ...prev,
                                            localCost: e.target.value,
                                        }))
                                    }
                                    onBlur={() => {
                                        handleChange(objectiveId, id, 'cost', localAopActivity.localCost);
                                        setEditRowId(null);
                                    }}
                                    disabled
                                />
                            ) : (
                                <Typography>{cost || '-'}</Typography>
                            )}
                        </td>

                        <td onClick={() => setEditRowId(id)}>
                            {editRowId === id ? (
                                <Select
                                    size='sm'
                                    value={editField === "isGadRelated" ? editField.value : isGadRelated}
                                    onChange={(e, newValue) => handleEdit(objectiveId, id, "isGadRelated", newValue)}
                                >
                                    <Option value="true">Yes</Option>
                                    <Option value="false">No</Option>
                                </Select>
                            ) : (
                                <Typography>
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
                                    onClick={() => navigate(`/items`)}
                                    fontSize={12}
                                >
                                    Resources
                                </Link>

                                <Link
                                    component="button"
                                    onClick={() => navigate(`person/${id}`)}
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
        </Fragment>
    )
}

export default TableRow