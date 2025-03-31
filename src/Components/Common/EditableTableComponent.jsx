import React, { useState } from "react";
import { Table, Sheet, Typography, Input, Select, Option } from "@mui/joy";

const EditableTableComponent = () => {
  const [rows, setRows] = useState([
    { id: 1, name: "Alice", age: 25 },
    { id: 2, name: "Bob", age: 30 },
  ]);
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

  return (
    <Sheet variant="outlined" sx={{ p: 2, borderRadius: "md" }}>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {/* Editable Name Field */}
              <td onClick={() => setEditRowId(row.id)}>
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
              </td>

              {/* Editable Age Field with Dropdown */}
              <td onClick={() => setEditRowId(row.id)}>
                {editRowId === row.id ? (
                  <Select
                    value={
                      editField.field === "age" ? editField.value : row.age
                    }
                    onChange={(e, newValue) =>
                      handleEdit(row.id, "age", newValue)
                    }
                    onBlur={handleBlur}
                  >
                    <Option value={20}>20</Option>
                    <Option value={25}>25</Option>
                    <Option value={30}>30</Option>
                    <Option value={35}>35</Option>
                    <Option value={40}>40</Option>
                  </Select>
                ) : (
                  <Typography>{row.age}</Typography>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
};

export default EditableTableComponent;
