import { useEffect, Fragment } from "react";
import { Typography, Stack, Link, Chip } from "@mui/joy";
import { Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AutoCompleteComponent from '../../../../../../Components/Form/AutocompleteComponent'
import IconButtonComponent from "../../../../../../Components/Common/IconButtonComponent";

const TableRow = ({
  rows,
  handleChange,
  deleteRow,
  function_types,
  editRowId,
  setEditRowId,
}) => {
  const navigate = useNavigate();

  const tableDataStyles = { cursor: 'pointer' }

  return (
    <Fragment>
      {
        rows?.map(({ id, rowId, functionType, objective, successIndicator }) => {

          // const activitiesCount = getActivitiesCount(id)
          // console.log(activitiesCount)

          return (
            <tr key={id}>
              <td>
                <Typography>
                  {rowId}
                </Typography>
              </td>

              <td onClick={() => setEditRowId(id)}
                style={tableDataStyles}>
                {editRowId === id ?
                  (
                    <AutoCompleteComponent
                      placeholder="Select function type"
                      value={functionType}
                      setValue={(val) => {
                        handleChange(id, 'functionType', val);
                        setEditRowId(null);
                      }}
                      options={function_types}
                    />
                  )
                  :
                  (<Typography>
                    {functionType?.label || "-"}
                  </Typography>)
                }
              </td>

              <td onClick={() => setEditRowId(id)}>
                {editRowId === id ?
                  (
                    <AutoCompleteComponent
                      placeholder="Select objective"
                      value={objective}
                      setValue={(val) => {
                        handleChange(id, 'objective', val);
                        setEditRowId(null);
                      }}
                      options={functionType?.objectives ?? []}
                    />
                  )
                  :
                  (
                    <Typography>
                      {objective?.code || "-"}
                    </Typography>
                  )
                }
              </td>

              <td onClick={() => setEditRowId(id)}>
                {editRowId === id ?
                  (
                    <AutoCompleteComponent
                      placeholder="Select success indicator"
                      value={successIndicator}
                      setValue={(val) => {
                        handleChange(id, 'successIndicator', val);
                        setEditRowId(null);
                      }}
                      options={objective?.success_indicators ?? []}
                    />
                  )
                  :
                  (
                    <Typography>
                      {successIndicator?.code || "-"}
                    </Typography>
                  )
                }
              </td>

              <td>
                <Stack
                  direction={'flex'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  gap={1}
                >

                  <Stack
                    direction={'row'}
                    alignItems={'center'}
                    gap={1}
                  >
                    <Link
                      component="button"
                      onClick={() => navigate(`activities/${rowId}`, { state: { parentId: id } })}
                      fontSize={14}
                    >
                      Manage Activities
                    </Link>

                    <Chip
                      variant="outlined"
                      color="success"
                    >
                      {/* {currentObjectiveActivitiesCount} */}
                    </Chip>
                  </Stack>

                  <IconButtonComponent
                    onClick={() => deleteRow(id)}
                    icon={<Trash size={14} />}
                    // color={'danger'}
                    size={'sm'}
                    variant={'text'}
                  />

                </Stack>
              </td>

            </tr >
          )
        })
      }
    </Fragment >
  );
};

export default TableRow;
