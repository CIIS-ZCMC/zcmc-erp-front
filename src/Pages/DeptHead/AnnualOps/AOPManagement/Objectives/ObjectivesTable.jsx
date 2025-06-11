import { useEffect, useState, Fragment } from "react";
import { Typography, Stack, Link, Chip, Tooltip, } from "@mui/joy";
import { Trash } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import AutocompleteComponent from "../../../../../Components/Form/AutocompleteComponent";
import IconButtonComponent from "../../../../../Components/Common/IconButtonComponent";

import useObjectivesHook from "../../../../../Hooks/ObjectivesHook";

const ObjectivesTable = ({
    rows,
    handleChange,
    deleteRow,
    function_types,
    activitiesCount,
}) => {
    const navigate = useNavigate();

    const tableDataStyles = { cursor: 'pointer' }

    const { deleteObjective } = useObjectivesHook();

    const [editRowId, setEditRowId] = useState(null);

    const handleRemoveObjective = (id) => {
        localStorage.removeItem('activities-storage');
        deleteObjective(id)
    }

    return (
        <Fragment>
            {
                rows?.map(({ id, rowId, functionType, objective, successIndicator }, index) => {

                    const isEnableRemove = !functionType && !objective && !successIndicator

                    return (
                        <tr key={id}>
                            <td>
                                <Typography>
                                    {index + 1}
                                </Typography>
                            </td>

                            <td onClick={() => setEditRowId(id)}
                                style={tableDataStyles}
                            >
                                {editRowId === id ?
                                    (
                                        <AutocompleteComponent
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
                                    (

                                        <Typography>
                                            {functionType?.label || "-"}
                                        </Typography>)
                                }
                            </td>

                            <td onClick={() => setEditRowId(id)}
                                style={tableDataStyles}
                            >

                                {editRowId === id ?
                                    (
                                        <AutocompleteComponent
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
                                    (<>
                                        <Tooltip title={objective ? objective?.description : ''} variant="solid">
                                            <Typography >
                                                {objective?.code || "-"}
                                            </Typography>
                                        </Tooltip>
                                    </>

                                    )
                                }
                            </td>

                            <td onClick={() => setEditRowId(id)}
                                style={tableDataStyles}
                            >
                                {editRowId === id ?
                                    (
                                        <AutocompleteComponent
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
                                        <>
                                            <Tooltip title={successIndicator ? successIndicator?.description : ''} variant="solid">
                                                <Typography >
                                                    {successIndicator?.code || "-"}
                                                </Typography>
                                            </Tooltip>
                                        </>
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
                                            onClick={() => navigate(`activities/${rowId}`, { state: { parentId: id, rowId: rowId, objectId: id } })}
                                            fontSize={14}
                                        >
                                            Manage Activities
                                        </Link>

                                        <Chip
                                            variant="outlined"
                                            color="success"
                                        >
                                            {activitiesCount[index]?.length || 0}
                                        </Chip>
                                    </Stack>

                                    <Stack>
                                        <IconButtonComponent
                                            onClick={() => handleRemoveObjective(id)}
                                            icon={<Trash size={14} />}
                                            // color={'danger'}
                                            disabled={isEnableRemove}
                                            size={'sm'}
                                            variant={'text'}
                                        />
                                    </Stack>


                                </Stack>
                            </td>

                        </tr >
                    )
                })
            }
        </Fragment >
    );
};

export default ObjectivesTable;
