import React, { Fragment } from 'react'

import { useNavigate } from 'react-router-dom'
import { Typography, Input, Stack, Link } from '@mui/joy'
import { ExternalLink, Trash } from 'lucide-react'

import ButtonComponent from '../../../../../../Components/Common/ButtonComponent'

const TableRow = ({
    rows,
    handleEdit,
    handleBlur,
    editRowId,
    setEditRowId,
    editField
}) => {

    const navigate = useNavigate()

    return (
        <Fragment>
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
                                    editField.field === "item_name" ? editField.value : row.item_name
                                }
                                onChange={(e) => handleEdit(row.id, "item_name", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{row.item_name}</Typography>
                        )}
                    </td >


                    {/* Editable Name Field */}
                    < td onClick={() => setEditRowId(row.id)}>
                        {editRowId === row.id ? (
                            <Input
                                size='sm'
                                autoFocus
                                value={
                                    editField.field === "resource_type" ? editField.value : row.resource_type
                                }
                                onChange={(e) => handleEdit(row.id, "resource_type", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{row.resource_type}</Typography>
                        )}
                    </td >

                    {/* Editable Name Field */}
                    < td onClick={() => setEditRowId(row.id)}>
                        {editRowId === row.id ? (
                            <Input
                                size='sm'
                                autoFocus
                                value={
                                    editField.field === "expense_class" ? editField.value : row.expense_class
                                }
                                onChange={(e) => handleEdit(row.id, "expense_class", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{row.expense_class}</Typography>
                        )}
                    </td >

                    {/* Editable Name Field */}
                    <td onClick={() => setEditRowId(row.id)}>
                        {editRowId === row.id ? (
                            <Input
                                size='sm'
                                autoFocus
                                value={
                                    editField.field === "procurement_mode" ? editField.value : row.procurement_mode
                                }
                                onChange={(e) => handleEdit(row.id, "procurement_mode", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{row.procurement_mode}</Typography>
                        )}
                    </td>

                    <td>
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
                                onClick={() => navigate(`person/1`)}
                                endDecorator={<ExternalLink size={16} />}
                            >
                                Responsible Person
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