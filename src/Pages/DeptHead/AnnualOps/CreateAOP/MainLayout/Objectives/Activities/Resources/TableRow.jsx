import { Fragment, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { Typography, Input, Select, Option } from '@mui/joy'
import { Trash } from 'lucide-react'

import useResourceHook from '../../../../../../../../Hooks/ResourceHook'
import AutocompleteComponent from '../../../../../../../../Components/Form/AutocompleteComponent'
import IconButtonComponent from '../../../../../../../../Components/Common/IconButtonComponent'


const TableRow = ({
    rows,
    parentId,
    resources,
    handleEdit,
    handleBlur,
}) => {

    const navigate = useNavigate()

    const { removeItemResource, updateResourceField } = useResourceHook();

    const [localResource, setLocalResource] = useState({});
    const [editRowId, setEditRowId] = useState(null);

    const filtered = rows.filter((value) => value.parentId === parentId)

    const handleOnRowClick = (id) => {
        setEditRowId(id)

        if (localResource[id]) return;

        const currentRow = rows.find((row) => row.id === id);
        if (!currentRow) return

        const { name, quantity, expenseClass, individualPrice, totalCost } = currentRow;

        setLocalResource((prev) => ({
            ...prev,
            [id]: {
                // localName: name || '',
                localQuantity: quantity || '',
                localPrice: individualPrice || '',
                localCost: totalCost || '',
                localExpenseClass: expenseClass || false,
            }
        }));
    }

    return (
        <Fragment>
            {filtered?.map(({ id, name, quantity, individualPrice, totalCost, purchaseTypeId, expenseClass }, index) => {

                const isEditing = editRowId === id;

                return (

                    < tr key={id} >
                        <td>
                            <Typography>
                                {index + 1}
                            </Typography>
                        </td>

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <>
                                    <AutocompleteComponent
                                        placeholder="Select item resource"
                                        value={name}
                                        setValue={(val) => { val.name }}
                                        getOptionLabel={(item) => String(item.name)}
                                        options={resources}
                                    />
                                </>

                            ) : (
                                <Typography>{name || '-'}</Typography>
                            )}
                        </td >

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <Input
                                    value={localResource[id]?.localQuantity || ''}
                                    size='sm'
                                    placeholder='Quantity'
                                    onChange={(e) =>
                                        setLocalResource((prev) => ({
                                            ...prev,
                                            [id]: {
                                                ...prev[id],
                                                localQuantity: e.target.value,
                                            },
                                        }))
                                    }
                                    onBlur={() => {
                                        updateResourceField(id, 'quantity', localResource[id]?.localQuantity);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>{quantity || '-'}</Typography>
                            )}
                        </td>

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <Input
                                    value={localResource[id]?.localPrice || ''}
                                    size='sm'
                                    placeholder='Individual Price'
                                    onChange={(e) =>
                                        setLocalResource((prev) => ({
                                            ...prev,
                                            [id]: {
                                                ...prev[id],
                                                localPrice: e.target.value,
                                            },
                                        }))
                                    }
                                    onBlur={() => {
                                        updateResourceField(id, 'individualPrice', localResource[id]?.localPrice);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>{individualPrice || '-'}</Typography>
                            )}
                        </td>

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <Input
                                    // value={localAopActivity[id]?.localName || ''}
                                    size='sm'
                                    placeholder='Total Cost'
                                // onChange={(e) =>
                                //     setLocalAopActivity((prev) => ({
                                //         ...prev,
                                //         [id]: {
                                //             ...prev[id],
                                //             localName: e.target.value,
                                //         },
                                //     }))
                                // }
                                // onBlur={() => {
                                //     handleChange(id, 'name', localAopActivity[id]?.localName);
                                //     setEditRowId(null);
                                // }}
                                />
                            ) : (
                                <Typography>{totalCost || '-'}</Typography>
                            )}
                        </td>

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <>
                                    <AutocompleteComponent
                                        placeholder="Select Purchase"
                                        value={name}
                                        setValue={(val) => { val.name }}
                                        getOptionLabel={(item) => String(item.name)}
                                        options={resources}
                                    />
                                </>

                            ) : (
                                <Typography>{name || '-'}</Typography>
                            )}
                        </td >

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <Select
                                    size='sm'
                                    value={localResource?.[id]?.expenseClass || false}
                                    onChange={(e, newValue) => updateResourceField(id, "expenseClass", newValue)}
                                >
                                    <Option value={true}>MOOE</Option>
                                    <Option value={false}>CO</Option>
                                </Select>
                            ) : (
                                <Typography>
                                    {localResource?.[id]?.expenseClass}
                                    {expenseClass ? 'MOOE' : 'CO'}
                                </Typography>
                            )}
                        </td>

                        <td>
                            <IconButtonComponent
                                onClick={() => removeItemResource(id)}
                                icon={<Trash size={14} />}
                                size={'sm'}
                                // color={'danger'}
                                variant={'text'}
                            />
                        </td>
                    </tr >
                )

            })}
        </Fragment >
    )
}

export default TableRow