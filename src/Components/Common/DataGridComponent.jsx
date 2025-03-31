import { DataGrid } from '@mui/x-data-grid';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// import { Select as JoySelect, Option as  } from '@mui/joy';
import { Select, MenuItem } from '@mui/material';

const DataGridComponent = () => {

    const materialTheme = createTheme();

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'firstName',
            headerName: 'First name',
            width: 150,
            editable: true,
        },
        {
            field: 'lastName',
            headerName: 'Last name',
            width: 150,
            editable: true,
        },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 110,
            editable: true,
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
        },

        {
            field: 'role',
            headerName: 'Role',
            width: 160,
            editable: true,
            renderEditCell: (params) => (
                <Select
                    value={params.value || ''}
                    onChange={(event) => {
                        const newValue = event.target.value;
                        params.api.setEditCellValue({
                            id: params.id,
                            field: params.field,
                            value: newValue,
                        });
                    }}
                    size="sm"
                    sx={{ width: '100%' }}
                >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="User">User</MenuItem>
                    <MenuItem value="Guest">Guest</MenuItem>
                </Select>
            ),
        },
    ];
    const rows = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14, role: 'User' },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31, role: 'Admin' },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31, role: 'User' },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11, role: 'Guest' },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null, role: 'Admin' },
    ];
    return (
        <ThemeProvider theme={materialTheme}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </ThemeProvider>
    )
}


export default DataGridComponent;

