import { Fragment, useState } from 'react'

import { Stack, Link, Typography, Input, Select, Option, Box } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Trash, FunnelX } from 'lucide-react';

import ButtonComponent from '../../../../../../../Components/Common/ButtonComponent';
import InputComponent from '../../../../../../../Components/Form/InputComponent';
import AutoCompleteComponent from '../../../../../../../Components/Form/AutocompleteComponent';

import { AOP_CONSTANTS, MONTHS } from '../../../../../../../Data/constants';

const TableRow = ({
    rows,
    handleEdit,
    handleBlur,
    editRowId,
    setEditRowId,
    editField
}) => {

    const navigate = useNavigate()

    const [openResourcesModal, setOpenResourcesModal] = useState(false)

    return (

        <Fragment>
            {rows?.map(({ id, activityCode, name, isGadRelated, cost, startMonth, endMonth, target }) => (
                <tr key={id}>
                    <td>
                        <Typography>
                            {id}
                        </Typography>
                    </td>

                    {/* Editable Name Field */}
                    <td onClick={() => setEditRowId(id)}>
                        {editRowId === id ? (

                            <InputComponent
                                value={name}
                                placeholder={'Input activity'}
                            />

                            // <Input
                            //     size='sm'
                            //     autoFocus
                            //     value={
                            //         editField.field === "name" ? editField.value : name
                            //     }
                            //     onChange={(e) => handleEdit(id, "name", e.target.value)}
                            //     onBlur={handleBlur}
                            // />
                        ) : (
                            <Typography>{name || '-'}</Typography>
                        )}
                    </td>

                    <td onClick={() => setEditRowId(id)}
                    // style={tableDataStyles}
                    >
                        {editRowId === id ?
                            (
                                <AutoCompleteComponent
                                    placeholder="Select start month"
                                    value={startMonth}
                                    setValue={(val) => {
                                        handleChange(id, 'startMonth', val);
                                        setEditRowId(null);
                                    }}
                                    options={MONTHS}
                                />
                            )
                            :
                            (<Typography>
                                {startMonth || "-"}
                            </Typography>)
                        }
                    </td>

                    <td onClick={() => setEditRowId(id)}
                    // style={tableDataStyles}
                    >
                        {editRowId === id ?
                            (
                                <AutoCompleteComponent
                                    placeholder="Select end month"
                                    value={startMonth}
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
                                autoFocus
                                value={
                                    editField === "target.firstQuarter" ? editField.value : name
                                }
                                // onChange={(e) => handleEdit(id, "target.firstQuarter", e.target.value)}
                                onBlur={handleBlur}
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
                                    editField === "target.secondQuarter" ? editField.value : name
                                }
                                // onChange={(e) => handleEdit(id, "target.secondQuarter", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{target.secondQuarter || '-'}</Typography>
                        )}
                    </td>


                    <td onClick={() => setEditRowId(id)}>
                        {editRowId === id ? (
                            <Input
                                size='sm'
                                autoFocus
                                value={
                                    editField === "target.thirdQuarter" ? editField.value : name
                                }
                                // onChange={(e) => handleEdit(id, "target.thirdQuarter", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{target.thirdQuarter || '-'}</Typography>
                        )}
                    </td>


                    <td onClick={() => setEditRowId(id)}>
                        {editRowId === id ? (
                            <Input
                                size='sm'
                                autoFocus
                                value={
                                    editField === "target.fourthQuarter" ? editField.value : name
                                }
                                // onChange={(e) => handleEdit(id, "target.fourthQuarter", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{target.fourthQuarter || '-'}</Typography>
                        )}
                    </td>

                    <td onClick={() => setEditRowId(id)}>
                        {editRowId === id ? (
                            <Input
                                size='sm'
                                autoFocus
                                disabled
                                value={
                                    editField === "target.cost" ? editField.value : name
                                }
                                // onChange={(e) => handleEdit(id, "target.cost", e.target.value)}
                                onBlur={handleBlur}
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
                                onBlur={handleBlur}
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

                    <td onClick={() => setEditRowId(id)}>
                        {editRowId === id ? (
                            <Input
                                size='sm'
                                autoFocus
                                value={
                                    editField === "cost" ? editField.value : cost
                                }
                                // onChange={(e) => handleEdit(id, "cost", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{cost}</Typography>
                        )}
                    </td >

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
                                label={'Delete'}
                                size={'sm'}
                                variant={'outlined'}
                                color={'danger'}
                                endDecorator={<Trash size={16} />}
                            />
                        </Stack>
                    </td>
                </tr>
            ))}
        </Fragment>
    )
}

export default TableRow