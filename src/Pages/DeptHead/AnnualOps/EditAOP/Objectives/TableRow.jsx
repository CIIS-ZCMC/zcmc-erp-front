import { Fragment, useState, useEffect } from 'react'

import { Typography, Stack, Link, Chip } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { Trash } from 'lucide-react';

import useFunctionTypeHook from '../../../../../Hooks/FunctionTypeHook';
import useObjectivesHook from '../../../../../Hooks/ObjectivesHook';

import AutoCompleteComponent from '../../../../../Components/Form/AutocompleteComponent';
import IconButtonComponent from '../../../../../Components/Common/IconButtonComponent';

const TableRow = ({
    rows,
}) => {

    const { updateObjectiveField, deleteRow } = useObjectivesHook();
    const { function_types } = useFunctionTypeHook();

    const navigate = useNavigate();

    const tableDataStyles = { cursor: 'pointer' }

    const [editRowId, setEditRowId] = useState(null);
    const [isLoading, setisLoading] = useState(false);

    useEffect(() => {
        console.log(function_types)
    }, [])

    return (
        <Fragment>
            {
                rows?.map(({ id, rowId, functionType, objective, successIndicator }, index) => {
                    return (
                        <tr key={id}>
                            <td>
                                <Typography>
                                    {index + 1}
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
                                                updateObjectiveField(id, 'functionType', val);
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
                                                updateObjectiveField(id, 'objective', val);
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
                                                updateObjectiveField(id, 'successIndicator', val);
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
                                            onClick={() => navigate(`activities/${rowId}`, { state: { parentId: id, rowId: rowId } })}
                                            fontSize={14}
                                        >
                                            Manage Activities
                                        </Link>


                                        <Chip
                                            variant="outlined"
                                            color="success"
                                        >
                                            0
                                            {/* {activitiesCount[index]?.length || 0} */}
                                        </Chip>

                                        <IconButtonComponent
                                            onClick={() => deleteRow(id)}
                                            icon={<Trash size={14} />}
                                            // color={'danger'}
                                            size={'sm'}
                                            variant={'text'}
                                        />

                                    </Stack>

                                </Stack>

                            </td>
                        </tr>
                    )
                })
            }


        </Fragment>
    )
}

export default TableRow
