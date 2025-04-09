import { Fragment, useState } from 'react';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Stack } from '@mui/joy';

import { Trash } from 'lucide-react';

//custom components
import PageTitle from "../../../../Components/Common/PageTitle";
import ButtonComponent from "../../../../Components/Common/ButtonComponent";
import EditableTableComponent from "../../../../Components/Common/Table/EditableTableComponent";
import ContainerComponent from '../../../../Components/Common/ContainerComponent';
import TableRow from "./TableRow";

//data related
import { AOP_CONSTANTS } from '../../../../Data/constants';
import { AOP_HEADER } from '../../../../Data/Columns';

const CreateAOP = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const parentPath = currentPath === '/aop-create';

  const [rows, setRows] = useState([
    {
      id: 1,
      functionType: "Strategic",
      objectives: "Objective 1",
      successIndicator: "Success Indicator 1",
    },
    {
      id: 2,
      functionType: "Core",
      objectives: "Objective 2",
      successIndicator: "Success Indicator 2",
    },
    {
      id: 3,
      functionType: "Support",
      objectives: "Objective 3",
      successIndicator: "Success Indicator 3",
    },
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

      <PageTitle
        title={AOP_CONSTANTS.CREATE_AOP_TITLE}
        description={AOP_CONSTANTS.CREATE_AOP_SUBHEADING}
      />

      {parentPath &&
        <Fragment>
          <ContainerComponent>
            <EditableTableComponent
              columns={AOP_HEADER}
              stripe={'odd'}
              hoverRow
              isLoading={false}
              stickLast
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

            <Stack
              mt={2}
              direction={'flex'}
              alignItems={'center'}
              justifyContent={'start'}
              gap={1}
            >
              <ButtonComponent
                label={'Cancel Request'}
                size={'md'}
                variant={'outlined'}

                onClick={() => navigate(`/aop/all`)}
              />

              <ButtonComponent
                label={'Submit AOP'}
                size={'md'}
                variant={'solid'}
                disabled={true}
              // onClick={} submit aop
              />
            </Stack>

          </ContainerComponent>


        </Fragment>
      }


      <Outlet />

    </Fragment >
  )
}

export default CreateAOP;
