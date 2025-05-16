import React, { Fragment } from 'react'

import { useNavigate } from 'react-router-dom'
import { Typography, Input, Stack, Link } from '@mui/joy'
import { ExternalLink, Trash } from 'lucide-react'

import ButtonComponent from '../../../../../../../../Components/Common/ButtonComponent'

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
            {rows.map((row, index) => (
                <tr key={row.id}>
                    <td>
                        <Typography>
                            {index + 1}
                        </Typography>
                    </td>

                    {/* Editable Name Field */}
                    < td onClick={() => setEditRowId(id)}>
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
                            <Typography>{row.name}</Typography>
                        )}
                    </td >

                    {/* Editable Name Field */}
                    < td onClick={() => setEditRowId(id)}>
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
                            <Typography>{row.typeOfResources}</Typography>
                        )}
                    </td >

                    {/* Editable Name Field */}
                    < td onClick={() => setEditRowId(id)}>
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
                            <Typography>{row.quantity}</Typography>
                        )}
                    </td >

                    {/* Editable Name Field */}
                    < td onClick={() => setEditRowId(id)}>
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
                            <Typography>{row.individualPrice}</Typography>
                        )}
                    </td >

                    {/* Editable Name Field */}
                    < td onClick={() => setEditRowId(id)}>
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
                            <Typography>{row.totalCost}</Typography>
                        )}
                    </td >

                    < td onClick={() => setEditRowId(id)}>
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
                            <Typography>{row.expenseClass}</Typography>
                        )}
                    </td >

                    {/* Editable Name Field */}
                    < td onClick={() => setEditRowId(id)}>
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
                            <Typography>{row.purchaseType}</Typography>
                        )}
                    </td >




                    <td>
                        <Stack
                            size='sm'
                            direction={'flex'}
                            alignItems={'center'}
                            justifyContent={'space-between'}
                            gap={1}
                        >

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