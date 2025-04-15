import { useEffect, useState, Fragment } from "react";
import { Typography, Input, Select, Option, Stack, Link } from "@mui/joy";
import { Trash, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ButtonComponent from "../../../../../../Components/Common/ButtonComponent";
import AutoCompleteComponent from '../../../../../../Components/Form/AutocompleteComponent'

import useFunctionTypeHook from "../../../../../../Hooks/FunctionTypeHook";

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
        rows?.map(({ id, functionType, objective, successIndicator }) => (
          <tr key={id}>
            <td>
              <Typography>
                {id}
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
                  {functionType?.name || "-"}
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
                      handleChange(id, 'objective_id', val);
                      setEditRowId(null);
                    }}
                    options={functionType?.objectives ?? []}
                  />
                )
                :
                (
                  <Typography>
                    {objective?.id || "-"}
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
                      handleChange(id, 'success_indicator_id', val);
                      setEditRowId(null);
                    }}
                    options={objective?.success_indicators ?? []}
                  />
                )
                :
                (
                  <Typography>
                    {successIndicator?.name || "-"}
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
                <Link
                  component="button"
                  onClick={() => navigate(`activities/${id}`)}
                  endDecorator={<ExternalLink size={16} />}
                >
                  Manage Activities
                </Link>

                <ButtonComponent
                  onClick={() => deleteRow(id)}
                  label={'Delete'}
                  size={'sm'}
                  variant={'outlined'}
                  color={'danger'}
                  endDecorator={<Trash size={16} />}
                />
              </Stack>
            </td>

          </tr >
        ))
      }
    </Fragment >
  );
};

export default TableRow;
