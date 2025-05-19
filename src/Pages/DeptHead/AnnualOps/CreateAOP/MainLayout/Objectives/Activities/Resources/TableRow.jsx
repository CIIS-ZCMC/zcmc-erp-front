import { Fragment, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'
import { Typography, Input, } from '@mui/joy'
import { Trash } from 'lucide-react'

import useResourceHook from '../../../../../../../../Hooks/ResourceHook'

import IconButtonComponent from '../../../../../../../../Components/Common/IconButtonComponent'

const TableRow = ({
    rows,
    parentId,
    handleEdit,
    handleBlur,
    editRowId,
    setEditRowId,
    editField
}) => {

    const navigate = useNavigate()

    const { removeItemResource } = useResourceHook();

    const filtered = rows.filter((value) => value.parentId === parentId)

    useEffect(() => {
        console.log(parentId)
        console.log(filtered)
    }, [parentId, filtered])

    return (
        <Fragment>
            {filtered?.map((row, index) => (
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
                        <IconButtonComponent
                            onClick={() => removeItemResource(row.id)}
                            icon={<Trash size={14} />}
                            size={'sm'}
                            // color={'danger'}
                            variant={'text'}
                        />
                    </td>
                </tr>
            ))}
        </Fragment>
    )
}

export default TableRow