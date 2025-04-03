import { useState } from 'react'

import { Stack, Link, Typography, Input, Select, Option } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Trash } from 'lucide-react';

import ButtonComponent from '../../../../../Components/Common/ButtonComponent';
import ModalComponent from '../../../../../Components/Common/Dialog/ModalComponent';

import { MONTHS } from '../../../../../Data/constants';

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

        <>
            {rows.map((row) => (
                <tr key={row.id}>
                    <td>
                        <Typography>
                            {row.id}
                        </Typography>
                    </td>

                    {/* Editable Name Field */}
                    < td onClick={() => setEditRowId(row.id)}>
                        {editRowId === row.id ? (
                            <Input
                                size='sm'
                                autoFocus
                                value={
                                    editField.field === "activities" ? editField.value : row.activities
                                }
                                onChange={(e) => handleEdit(row.id, "activities", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{row.activities}</Typography>
                        )}
                    </td >

                    <td onClick={() => setEditRowId(row.id)}>
                        {editRowId === row.id ? (
                            <Select
                                size='sm'
                                value={editField.field === "startMonth" ? editField.value : row.startMonth}
                                onChange={(e, newValue) => handleEdit(row.id, "startMonth", newValue)}
                                onBlur={handleBlur}
                            >
                                {MONTHS.map((month) => (
                                    <Option
                                        key={month}
                                        value={month}
                                    >
                                        {month}
                                    </Option>
                                ))}
                            </Select>
                        ) : (
                            <Typography>{row.startMonth}</Typography>
                        )}
                    </td>

                    <td onClick={() => setEditRowId(row.id)}>
                        {editRowId === row.id ? (
                            <Select
                                size='sm'
                                value={editField.field === "endMonth" ? editField.value : row.endMonth}
                                onChange={(e, newValue) => handleEdit(row.id, "endMonth", newValue)}
                                onBlur={handleBlur}
                            >
                                {MONTHS.map((month) => (
                                    <Option
                                        key={month}
                                        value={month}
                                    >
                                        {month}
                                    </Option>
                                ))}
                            </Select>
                        ) : (
                            <Typography>{row.endMonth}</Typography>
                        )}
                    </td>

                    <td onClick={() => setEditRowId(row.id)}>
                        {editRowId === row.id ? (
                            <Input
                                autoFocus
                                size='sm'
                                value={
                                    editField.field === "quarter1" ? editField.value : row.quarter1
                                }
                                onChange={(e) => handleEdit(row.id, "quarter1", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{row.quarter1}</Typography>
                        )}
                    </td >

                    <td onClick={() => setEditRowId(row.id)}>
                        {editRowId === row.id ? (
                            <Input
                                size='sm'
                                autoFocus
                                value={
                                    editField.field === "quarter2" ? editField.value : row.quarter2
                                }
                                onChange={(e) => handleEdit(row.id, "quarter2", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{row.quarter2}</Typography>
                        )}
                    </td >

                    <td onClick={() => setEditRowId(row.id)}>
                        {editRowId === row.id ? (
                            <Input
                                size='sm'
                                autoFocus
                                value={
                                    editField.field === "quarter3" ? editField.value : row.quarter3
                                }
                                onChange={(e) => handleEdit(row.id, "quarter3", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{row.quarter3}</Typography>
                        )}
                    </td >

                    <td onClick={() => setEditRowId(row.id)}>
                        {editRowId === row.id ? (
                            <Input
                                size='sm'
                                autoFocus
                                value={
                                    editField.field === "quarter4" ? editField.value : row.quarter4
                                }
                                onChange={(e) => handleEdit(row.id, "quarter4", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{row.quarter4}</Typography>
                        )}
                    </td >

                    <td onClick={() => setEditRowId(row.id)}>
                        {editRowId === row.id ? (
                            <Input
                                size='sm'
                                autoFocus
                                value={
                                    editField.field === "cost" ? editField.value : row.cost
                                }
                                onChange={(e) => handleEdit(row.id, "cost", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{row.cost}</Typography>
                        )}
                    </td >

                    <td onClick={() => setEditRowId(row.id)}>
                        {editRowId === row.id ? (
                            <Select
                                size='sm'
                                value={editField.field === "isGadRelated" ? editField.value : row.isGadRelated}
                                onChange={(e, newValue) => handleEdit(row.id, "isGadRelated", newValue)}
                                onBlur={handleBlur}
                            >
                                <Option value="true">Yes</Option>
                                <Option value="false">No</Option>
                            </Select>
                        ) : (
                            <Typography>
                                {row.isGadRelated ? 'Yes' : 'No'}
                            </Typography>
                        )}
                    </td>

                    <td>
                        <Typography>
                            {row.responsiblePerson}
                        </Typography>
                    </td>

                    <td
                        onClick={() => setEditRowId(row.id)}
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
                                onClick={() => setOpenResourcesModal(true)}
                                endDecorator={<ExternalLink size={16} />}
                            >
                                Manage Activities
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

            <ModalComponent
                isOpen={openResourcesModal}
                handleClose={() => setOpenResourcesModal(false)}
            />

        </>

    )
}

export default TableRow