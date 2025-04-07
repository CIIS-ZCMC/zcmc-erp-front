import React, { Fragment } from 'react'

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
                    < td onClick={() => setEditRowId(row.id)}>
                        {editRowId === row.id ? (
                            <Input
                                size='sm'
                                autoFocus
                                value={
                                    editField.field === "jan" ? editField.value : row.jan
                                }
                                onChange={(e) => handleEdit(row.id, "jan", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{row.jan}</Typography>
                        )}
                    </td >

                    {/* Editable Name Field */}
                    < td onClick={() => setEditRowId(row.id)}>
                        {editRowId === row.id ? (
                            <Input
                                size='sm'
                                autoFocus
                                value={
                                    editField.field === "feb" ? editField.value : row.feb
                                }
                                onChange={(e) => handleEdit(row.id, "feb", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{row.feb}</Typography>
                        )}
                    </td >

                    {/* Editable Name Field */}
                    < td onClick={() => setEditRowId(row.id)}>
                        {editRowId === row.id ? (
                            <Input
                                size='sm'
                                autoFocus
                                value={
                                    editField.field === "mar" ? editField.value : row.mar
                                }
                                onChange={(e) => handleEdit(row.id, "mar", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{row.mar}</Typography>
                        )}
                    </td >

                    {/* Editable Name Field */}
                    < td onClick={() => setEditRowId(row.id)}>
                        {editRowId === row.id ? (
                            <Input
                                size='sm'
                                autoFocus
                                value={
                                    editField.field === "apr" ? editField.value : row.apr
                                }
                                onChange={(e) => handleEdit(row.id, "apr", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{row.apr}</Typography>
                        )}
                    </td >

                    {/* Editable Name Field */}
                    < td onClick={() => setEditRowId(row.id)}>
                        {editRowId === row.id ? (
                            <Input
                                size='sm'
                                autoFocus
                                value={
                                    editField.field === "may" ? editField.value : row.may
                                }
                                onChange={(e) => handleEdit(row.id, "may", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{row.may}</Typography>
                        )}
                    </td >

                    {/* Editable Name Field */}
                    < td onClick={() => setEditRowId(row.id)}>
                        {editRowId === row.id ? (
                            <Input
                                size='sm'
                                autoFocus
                                value={
                                    editField.field === "jun" ? editField.value : row.jun
                                }
                                onChange={(e) => handleEdit(row.id, "jun", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{row.jun}</Typography>
                        )}
                    </td >

                    {/* Editable Name Field */}
                    < td onClick={() => setEditRowId(row.id)}>
                        {editRowId === row.id ? (
                            <Input
                                size='sm'
                                autoFocus
                                value={
                                    editField.field === "jul" ? editField.value : row.jul
                                }
                                onChange={(e) => handleEdit(row.id, "jul", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{row.jul}</Typography>
                        )}
                    </td >

                    {/* Editable Name Field */}
                    < td onClick={() => setEditRowId(row.id)}>
                        {editRowId === row.id ? (
                            <Input
                                size='sm'
                                autoFocus
                                value={
                                    editField.field === "aug" ? editField.value : row.aug
                                }
                                onChange={(e) => handleEdit(row.id, "aug", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{row.aug}</Typography>
                        )}
                    </td >

                    {/* Editable Name Field */}
                    < td onClick={() => setEditRowId(row.id)}>
                        {editRowId === row.id ? (
                            <Input
                                size='sm'
                                autoFocus
                                value={
                                    editField.field === "sep" ? editField.value : row.sep
                                }
                                onChange={(e) => handleEdit(row.id, "sep", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{row.sep}</Typography>
                        )}
                    </td >

                    {/* Editable Name Field */}
                    < td onClick={() => setEditRowId(row.id)}>
                        {editRowId === row.id ? (
                            <Input
                                size='sm'
                                autoFocus
                                value={
                                    editField.field === "oct" ? editField.value : row.oct
                                }
                                onChange={(e) => handleEdit(row.id, "oct", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{row.oct}</Typography>
                        )}
                    </td >

                    {/* Editable Name Field */}
                    < td onClick={() => setEditRowId(row.id)}>
                        {editRowId === row.id ? (
                            <Input
                                size='sm'
                                autoFocus
                                value={
                                    editField.field === "nov" ? editField.value : row.nov
                                }
                                onChange={(e) => handleEdit(row.id, "nov", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{row.nov}</Typography>
                        )}
                    </td >

                    {/* Editable Name Field */}
                    < td onClick={() => setEditRowId(row.id)}>
                        {editRowId === row.id ? (
                            <Input
                                size='sm'
                                autoFocus
                                value={
                                    editField.field === "dec" ? editField.value : row.dec
                                }
                                onChange={(e) => handleEdit(row.id, "dec", e.target.value)}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Typography>{row.dec}</Typography>
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
                                onClick={() => navigate(`/`)}
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