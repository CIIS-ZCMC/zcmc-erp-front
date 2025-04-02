import { useEffect } from 'react';
import { Typography, Input, Select, Option, Stack, Link } from '@mui/joy';
import { Trash, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import ButtonComponent from '../../../../Components/Common/ButtonComponent';
import { FUNCTION_TYPE_OPTION, OBJECTIVE_OPTION, SUCCESS_INDICATOR_OPTION } from '../../../../Data'

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
        rows.map((row) => (
            <tr key={row.id}>

                <td>
                    <Typography>
                        {SUCCESS_INDICATOR_OPTION.find(
                            (obj) => obj.value === row.id
                        )?.name || row.id}
                    </Typography>
                </td>

                <td onClick={() => setEditRowId(row.id)}>
                    {editRowId === row.id ? (
                        <Select
                            value={editField.field === "functionType" ? editField.value : row.functionType}
                            onChange={(e, newValue) => handleEdit(row.id, "functionType", newValue)}
                            onBlur={handleBlur}
                        >
                            {FUNCTION_TYPE_OPTION.map(({ id, value, name }) => (
                                <Option
                                    key={id}
                                    value={value}
                                >
                                    {name}
                                </Option>
                            ))}
                        </Select>
                    ) : (
                        <Typography>{row.functionType}</Typography>
                    )}
                </td>

                {/* Editable Age Field with Dropdown */}
                <td onClick={() => setEditRowId(row.id)}>
                    {editRowId === row.id ? (
                        <Select
                            value={
                                editField.field === "objectives"
                                    ? editField.value
                                    : row.objectives
                            }
                            onChange={(e, newValue) =>
                                handleEdit(row.id, "objectives", newValue)
                            }
                            onBlur={handleBlur}
                        >
                            {OBJECTIVE_OPTION.map(({ id, value, name }) => (
                                <Option key={id} value={value}>
                                    {name}
                                </Option>
                            ))}
                        </Select>
                    ) : (
                        <Typography>{row.objectives}</Typography>
                    )}
                </td>

                <td onClick={() => setEditRowId(row.id)} style={{ cursor: "pointer" }}>
                    {editRowId === row.id ? (
                        <Select
                            value={
                                editField.field === "successIndicator"
                                    ? editField.value
                                    : row.successIndicator
                            }
                            onChange={(e, newValue) =>
                                handleEdit(row.id, "successIndicator", newValue)
                            }
                            onBlur={handleBlur}
                            autoFocus
                            slotProps={{
                                listbox: {
                                    placement: "bottom-start",
                                },
                            }}
                        >
                            {SUCCESS_INDICATOR_OPTION.map(({ id, value, name }) => (
                                <Option key={id} value={value}>
                                    {name}
                                </Option>
                            ))}
                        </Select>
                    ) : (
                        <Typography>
                            {SUCCESS_INDICATOR_OPTION.find(
                                (obj) => obj.value === row.successIndicator
                            )?.name || row.successIndicator}
                        </Typography>
                    )}
                </td>

                <td
                    onClick={() => setEditRowId(row.id)}
                    style={{ cursor: 'pointer' }}
                >

                    <Stack
                        direction={'flex'}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                        gap={1}
                    >
                        <Link
                            component="button"
                            onClick={() => navigate(`activities/1`)}
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

                {/* Editable Name Field */}
                {/* < td onClick={() => setEditRowId(row.id)}>
                    {editRowId === row.id ? (
                        <Input
                            autoFocus
                            value={
                                editField.field === "name" ? editField.value : row.name
                            }
                            onChange={(e) => handleEdit(row.id, "name", e.target.value)}
                            onBlur={handleBlur}
                        />
                    ) : (
                        <Typography>{row.name}</Typography>
                    )}
                </td > */}

            </tr >
        ))
    )
}

export default TableRow


