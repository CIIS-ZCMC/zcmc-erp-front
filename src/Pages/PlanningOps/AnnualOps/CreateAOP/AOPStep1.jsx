import { useState } from 'react';
import { Typography, Input, Select, Option } from '@mui/joy';

import { AOP_STEP_HEADER, FUNCTION_TYPE_OPTION, OBJECTIVE_OPTION, SUCCESS_INDICATOR_OPTION } from '../../../../Data';
import EditableTableComponent from '../../../../Components/Common/EditableTableComponent';


const AOPStep1 = () => {

    const [editRowId, setEditRowId] = useState(null);
    const [editField, setEditField] = useState({});

    const handleEdit = (id, field, value) => {
        setEditField({ id, field, value });
    };

    const handleBlur = () => {
        if (editField.id !== undefined) {
            setRows((prev) =>
                prev.map((row) =>
                    row.id === editField.id
                        ? { ...row, [editField.field]: editField.value }
                        : row
                )
            );
            setEditRowId(null);
            setEditField({});
        }
    };

    const [rows, setRows] = useState([
        { id: 1, functionType: "Strategic", objectives: 'Objective 1', successIndicator: 'Success Indicator 1' },
        { id: 2, functionType: "Core", objectives: 'Objective 2', successIndicator: 'Success Indicator 2' },
        { id: 3, functionType: "Support", objectives: 'Objective 3', successIndicator: 'Success Indicator 3' },
    ]);

    const TableRow = ({ rows }) => (
        rows.map((row) => (
            <tr key={row.id}>
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
                            value={editField.field === "objectives" ? editField.value : row.objectives}
                            onChange={(e, newValue) => handleEdit(row.id, "objectives", newValue)}
                            onBlur={handleBlur}
                        >
                            {OBJECTIVE_OPTION.map(({ id, value, name }) => (
                                <Option
                                    key={id}
                                    value={value}
                                >
                                    {name}
                                </Option>
                            ))}
                        </Select>
                    ) : (
                        <Typography>{row.objectives}</Typography>
                    )}
                </td>

                <td
                    onClick={() => setEditRowId(row.id)}
                    style={{ cursor: 'pointer' }}
                >
                    {editRowId === row.id ? (
                        <Select
                            value={editField.field === "successIndicator" ? editField.value : row.successIndicator}
                            onChange={(e, newValue) => handleEdit(row.id, "successIndicator", newValue)}
                            onBlur={handleBlur}
                            autoFocus
                            slotProps={{
                                listbox: {
                                    placement: 'bottom-start'
                                }
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
                            {SUCCESS_INDICATOR_OPTION.find(obj => obj.value === row.successIndicator)?.name || row.successIndicator}
                        </Typography>
                    )}
                </td>

                <td
                    onClick={() => setEditRowId(row.id)}
                    style={{ cursor: 'pointer' }}
                >
                    LINK AND REMOVE BUTTON HERE
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

    return (
        <>
            <EditableTableComponent
                tableHeader={AOP_STEP_HEADER}
                tableRow={<TableRow rows={rows} />}
            />
        </>
    )
}

export default AOPStep1