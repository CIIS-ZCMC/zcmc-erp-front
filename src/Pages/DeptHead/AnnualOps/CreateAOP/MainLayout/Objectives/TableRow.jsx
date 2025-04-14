import { useEffect, useState } from "react";
import { Typography, Input, Select, Option, Stack, Link } from "@mui/joy";
import { Trash, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ButtonComponent from "../../../../../../Components/Common/ButtonComponent";
import AutoCompleteComponent from '../../../../../../Components/Form/AutocompleteComponent'

import useFunctionTypeHook from "../../../../../../Hooks/FunctionTypeHook";

const TableRow = ({
  function_types,
  functionType,
  setFunctionType,
  objective,
  setObjective,
  successIndicator,
  setSuccessIndicator
}) => {
  const navigate = useNavigate();

  return (

    <tr>
      <td>
        <Typography>
          1
        </Typography>
      </td>

      <td>
        <AutoCompleteComponent
          placeholder="Select type of function"
          value={functionType}
          setValue={(val) => setFunctionType(val)}
          options={function_types}
        />
      </td>

      <td>
        <AutoCompleteComponent
          placeholder="Select type of function"
          value={objective}
          setValue={(val) => setObjective(val)}
          options={functionType?.objectives ?? []}
        />
      </td>

      <td>
        <AutoCompleteComponent

          placeholder="Select type of function"
          value={successIndicator}
          setValue={(val) => setSuccessIndicator(val)}
          options={objective?.success_indicators ?? []}
        />
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
            // onClick={() => navigate(`activities/${row.id}`)}
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

    </tr >

    /* <td
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
          onClick={() => navigate(`activities/${row.id}`)}
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
    </td> */

    // <tr key={row.id}>

    //   {row.id}

    //   <td>
    //     <Typography>
    //       {SUCCESS_INDICATOR_OPTION.find((obj) => obj.value === row.id)?.name ||
    //         row.id}
    //     </Typography>
    //   </td>

    //   <td onClick={() => setEditRowId(row.id)}>
    //     {editRowId === row.id ? (
    //       <Select
    //         value={
    //           editField.field === "functionType"
    //             ? editField.value
    //             : row.functionType
    //         }
    //         onChange={(e, newValue) =>
    //           handleEdit(row.id, "functionType", newValue)
    //         }
    //         onBlur={handleBlur}
    //       >
    //         {FUNCTION_TYPE_OPTION.map(({ id, value, name }) => (
    //           <Option key={id} value={value}>
    //             {name}
    //           </Option>
    //         ))}
    //       </Select>
    //     ) : (
    //       <Typography>{row.functionType}</Typography>
    //     )}
    //   </td>

    //   {/* Editable Age Field with Dropdown */}
    //   <td onClick={() => setEditRowId(row.id)}>
    //     {editRowId === row.id ? (
    //       <Select
    //         value={
    //           editField.field === "objectives"
    //             ? editField.value
    //             : row.objectives
    //         }
    //         onChange={(e, newValue) =>
    //           handleEdit(row.id, "objectives", newValue)
    //         }
    //         onBlur={handleBlur}
    //       >
    //         {OBJECTIVE_OPTION.map(({ id, value, name }) => (
    //           <Option key={id} value={value}>
    //             {name}
    //           </Option>
    //         ))}
    //       </Select>
    //     ) : (
    //       <Typography>{row.objectives}</Typography>
    //     )}
    //   </td>

    //   <td onClick={() => setEditRowId(row.id)} style={{ cursor: "pointer" }}>
    //     {editRowId === row.id ? (
    //       <Select
    //         value={
    //           editField.field === "successIndicator"
    //             ? editField.value
    //             : row.successIndicator
    //         }
    //         onChange={(e, newValue) =>
    //           handleEdit(row.id, "successIndicator", newValue)
    //         }
    //         onBlur={handleBlur}
    //         autoFocus
    //         slotProps={{
    //           listbox: {
    //             placement: "bottom-start",
    //           },
    //         }}
    //       >
    //         {SUCCESS_INDICATOR_OPTION.map(({ id, value, name }) => (
    //           <Option key={id} value={value}>
    //             {name}
    //           </Option>
    //         ))}
    //       </Select>
    //     ) : (
    //       <Typography>
    //         {SUCCESS_INDICATOR_OPTION.find(
    //           (obj) => obj.value === row.successIndicator
    //         )?.name || row.successIndicator}
    //       </Typography>
    //     )}
    //   </td>



    //   {/* Editable Name Field */}
    //   {/* < td onClick={() => setEditRowId(row.id)}>
    //                 {editRowId === row.id ? (
    //                     <Input
    //                         autoFocus
    //                         value={
    //                             editField.field === "name" ? editField.value : row.name
    //                         }
    //                         onChange={(e) => handleEdit(row.id, "name", e.target.value)}
    //                         onBlur={handleBlur}
    //                     />
    //                 ) : (
    //                     <Typography>{row.name}</Typography>
    //                 )}
    //             </td > */}
    // </tr>
  );
};

export default TableRow;
