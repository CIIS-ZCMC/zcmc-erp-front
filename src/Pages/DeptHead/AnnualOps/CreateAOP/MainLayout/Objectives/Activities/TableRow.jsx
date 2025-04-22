import { Fragment, useEffect, useRef, useState } from 'react'

import { Stack, Link, Typography, Input, Select, Option, Autocomplete } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Trash, FunnelX } from 'lucide-react';

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
            {rows?.map(({ id, activityCode, name, isGadRelated, cost, start_month, endMonth, target }) => {

                const isEditing = editRowId === id;

                const [localAopActivity, setLocalAopActivity] = useState({
                    localName: name,
                    localStartMonth: start_month || '',
                    localEndMonth: endMonth,
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
                                    onChange={(_, newValue) => {
                                        setLocalAopActivity((prev) => ({
                                            ...prev,
                                            localStartMonth: newValue,
                                        }));

                                        // Also update Zustand immediately
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

                        {/* 
                        <td onClick={() => setEditRowId(id)}>
                            {isEditing ?
                                (
                                    <Autocomplete
                                        placeholder="Select start month"
                                        value={localAopActivity.localStartMonth}
                                        options={MONTHS}
                                        handleChange={(newValue) => {
                                            // setLocalAopActivity((prev) => ({
                                            //     ...prev,
                                            //     localStartMonth: newValue,
                                            // }));
                                            handleChange(objectiveId, id, 'start_month', newValue);
                                        }}
                                        onBlur={() => { setEditRowId(null); }}
                                    />
                                )
                                :
                                (<Typography>
                                    {start_month || "-"}
                                </Typography>)
                            }
                        </td> */}

                        <td onClick={() => setEditRowId(id)}
                        // style={tableDataStyles}
                        >
                            {editRowId === id ?
                                (
                                    <AutoCompleteComponent
                                        placeholder="Select end month"
                                        value={endMonth}
                                        setValue={(val) => {
                                            handleChange(id, 'endMonth', val);
                                            setEditRowId(null);
                                        }}
                                        options={MONTHS}
                                    />
                                )
                                :
                                (<Typography>
                                    {endMonth || "-"}
                                </Typography>)
                            }
                        </td>

                        <td onClick={() => setEditRowId(id)}>
                            {editRowId === id ? (
                                <Input
                                    size='sm'
                                    // inputRef={inputRef}
                                    value={
                                        editField === "target.firstQuarter" ? editField.value : target.firstQuarter
                                    }
                                // onChange={(e) => handleEdit(id, "target.firstQuarter", e.target.value)}
                                />
                            ) : (
                                <Typography>{target.firstQuarter || '-'}</Typography>
                            )}
                        </td>

                        <td onClick={() => setEditRowId(id)}>
                            {editRowId === id ? (
                                <Input
                                    size='sm'
                                    autoFocus
                                    value={
                                        editField === "target.secondQuarter" ? editField.value : target.secondQuarter
                                    }
                                // onChange={(e) => handleEdit(id, "target.secondQuarter", e.target.value)}
                                />
                            ) : (
                                <Typography>{target.secondQuarter || '-'}</Typography>
                            )}
                        </td>

                        <td onClick={() => setEditRowId(id)}>
                            {editRowId === id ? (
                                <Input
                                    size='sm'
                                    // autoFocus
                                    value={
                                        editField === "target.thirdQuarter" ? editField.value : target.thirdQuarter
                                    }
                                // onChange={(e) => handleEdit(id, "target.thirdQuarter", e.target.value)}
                                />
                            ) : (
                                <Typography>{target.thirdQuarter || '-'}</Typography>
                            )}
                        </td>

                        <td onClick={() => setEditRowId(id)}>
                            {editRowId === id ? (
                                <Input
                                    size='sm'
                                    // autoFocus
                                    value={
                                        editField === "target.fourthQuarter" ? editField.value : target.fourthQuarter
                                    }
                                // onChange={(e) => handleEdit(id, "target.fourthQuarter", e.target.value)}
                                />
                            ) : (
                                <Typography>{target.fourthQuarter || '-'}</Typography>
                            )}
                        </td>

                        <td onClick={() => setEditRowId(id)}>
                            {editRowId === id ? (
                                <Input
                                    size='sm'
                                    // autoFocus
                                    disabled
                                // value={
                                //     editField === "target.cost" ? editField.value : name
                                // }
                                // onChange={(e) => handleEdit(id, "target.cost", e.target.value)}
                                />
                            ) : (
                                <Typography>{target.cost || '-'}</Typography>
                            )}
                        </td>

                        <td onClick={() => setEditRowId(id)}>
                            {editRowId === id ? (
                                <Select
                                    size='sm'
                                    value={editField === "isGadRelated" ? editField.value : isGadRelated}
                                // onChange={(e, newValue) => handleEdit(id, "isGadRelated", newValue)}
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
                                {/* //trigger modal */}
                                <Link
                                    component="button"
                                    onClick={() => navigate(`/items`)}
                                    endDecorator={<ExternalLink size={16} />}
                                >
                                    Manage Resources
                                </Link>

                                <ButtonComponent
                                    onClick={() => deleteRow(id)}
                                    label={'Delete'}
                                    size={'sm'}
                                    variant={'outlined'}
                                    color={'danger'}
                                    endDecorator={<Trash size={16} />}
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