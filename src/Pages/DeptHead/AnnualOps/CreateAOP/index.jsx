import { Fragment, useState } from 'react';

//custom components
import PageTitle from '../../../../Components/Common/PageTitle';
import SheetComponent from '../../../../Components/Common/SheetComponent';
import EditableTableComponent from '../../../../Components/Common/Table/EditableTableComponent';
import TableRow from './TableRow'

//data related
import { AOP_CONSTANTS } from '../../../../Data/constants';
import { AOP_STEP_HEADER } from '../../../../Data';

const CreateAOP = () => {

    const [rows, setRows] = useState([
        { id: 1, functionType: "Strategic", objectives: 'Objective 1', successIndicator: 'Success Indicator 1' },
        { id: 2, functionType: "Core", objectives: 'Objective 2', successIndicator: 'Success Indicator 2' },
        { id: 3, functionType: "Support", objectives: 'Objective 3', successIndicator: 'Success Indicator 3' },
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
        <Fragment>
            {
                <>
                    <PageTitle
                        title={AOP_CONSTANTS.CREATE_AOP_TITLE}
                        description={AOP_CONSTANTS.CREATE_AOP_SUBHEADING}
                    />

                    <SheetComponent
                        variant={"outlined"}
                    >
                        <EditableTableComponent
                            // columns={AOP_STEP_HEADER}
                            tableHeader={AOP_STEP_HEADER}
                            stripe={'odd'}
                            hoverRow
                            isLoading={false}
                            tableRow={
                                <TableRow
                                    rows={rows}
                                    handleEdit={handleEdit}
                                    handleBlur={handleBlur}
                                    editField={editField}
                                    editRowId={editRowId}
                                    setEditRowId={setEditRowId}
                                />
                            }
                        />
                    </SheetComponent>
                </>

            }
        </Fragment>
    )
}

export default CreateAOP