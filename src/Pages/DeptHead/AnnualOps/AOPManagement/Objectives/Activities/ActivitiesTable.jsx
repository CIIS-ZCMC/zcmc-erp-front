import { Fragment, useEffect, useState } from 'react'

import { Chip, Stack, Link, Typography, Input } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { Trash } from 'lucide-react';

import useResourceHook from '../../../../../../Hooks/ResourceHook';
import useResponsiblePeopleHook from '../../../../../../Hooks/ResponsiblePeopleHook';
import AutocompleteComponent from '../../../../../../Components/Form/AutocompleteComponent';
import IconButtonComponent from '../../../../../../Components/Common/IconButtonComponent';

import { FormattedLongDate } from '../../../../../../Utils/FormattedLongDate';

const gadRelatedOptions = [
    { id: 1, label: 'Yes', value: true },
    { id: 2, label: 'No', value: false }
]

const ActivitiesTable = ({
    rows,
    handleChange,
    deleteRow,
    parentId,
    objectiveRowId,
}) => {
    const navigate = useNavigate();

    useEffect(() => {
        console.log(rows)
    }, [rows])

    const { resources, findResourcesByActivityID, totalCost } = useResourceHook();
    const { responsible_people } = useResponsiblePeopleHook();

    const resourceCountPerActivity = resources.reduce((acc, resource) => {
        const { parentId } = resource;

        if (parentId) {
            acc[parentId] = (acc[parentId] || 0) + 1;
        }

        return acc;
    }, {});

    const responsibleCountPerActivity = responsible_people.reduce((acc, responsible) => {

        const { activityId, areas, designations, users } = responsible

        const count =
            (areas?.length || 0) +
            (designations?.length || 0) +
            (users?.length || 0);

        acc[activityId] = count;
        return acc;

    }, {});

    //local state
    const [editRowId, setEditRowId] = useState(null);

    const nextYearDefault = `${new Date().getFullYear() + 1}-01`;

    const handleOnRowClick = (id) => {
        setEditRowId(id);
    };

    return (
        <Fragment>
            {rows?.filter(value => value?.parentId === parentId)?.map(({ rowId, id, name, isGadRelated, cost, startMonth, endMonth, target: { firstQuarter, secondQuarter, thirdQuarter, fourthQuarter } }, index) => {

                const isEditing = editRowId === id;

                return (

                    <tr key={id}>
                        <td>
                            <Typography>
                                {index + 1}
                            </Typography>
                        </td>

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <Input
                                    value={name}
                                    size='sm'
                                    placeholder='name'
                                    onChange={(e) =>
                                        handleChange(id, 'name', e.target.value)
                                    }
                                    onBlur={() => {
                                        handleChange(id, 'name', name);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>{name || '-'}</Typography>
                            )}
                        </td>

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <>
                                    <Input
                                        size='sm'
                                        type='month'
                                        value={startMonth || nextYearDefault}
                                        onChange={(e) => handleChange(id, 'startMonth', e.target.value)}
                                        onBlur={() => setEditRowId(null)}
                                    />

                                </>
                            ) : (
                                <Typography>
                                    {startMonth
                                        ?
                                        FormattedLongDate(startMonth + '-01')
                                        :
                                        FormattedLongDate(nextYearDefault)
                                    }
                                </Typography>
                            )}
                        </td>

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <Input
                                    size='sm'
                                    type='month'
                                    value={endMonth || nextYearDefault}
                                    onChange={(e) => handleChange(id, 'endMonth', e.target.value)}
                                    onBlur={() => setEditRowId(null)}
                                />

                            ) : (
                                <Typography>
                                    {endMonth
                                        ?
                                        FormattedLongDate(endMonth + '-01')
                                        :
                                        FormattedLongDate(nextYearDefault)
                                    }
                                </Typography>
                            )}
                        </td>

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <Input
                                    value={firstQuarter}
                                    size='sm'
                                    onChange={(e) => handleChange(id, 'target.firstQuarter', e.target.value)
                                    }
                                    onBlur={() => {
                                        const value = firstQuarter;
                                        handleChange(id, 'target.firstQuarter', value);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>
                                    {firstQuarter || '-'}
                                </Typography>
                            )}
                        </td>

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <Input
                                    value={secondQuarter}
                                    size='sm'
                                    onChange={(e) =>
                                        handleChange(id, 'target.secondQuarter', e.target.value)}
                                    onBlur={() => {
                                        const value = secondQuarter;
                                        handleChange(id, 'target.secondQuarter', value);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>
                                    {secondQuarter || '-'}
                                </Typography>
                            )}
                        </td>

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <Input
                                    value={thirdQuarter}
                                    size='sm'
                                    onChange={(e) =>
                                        handleChange(id, 'target.thirdQuarter', e.target.value)
                                    }
                                    onBlur={() => {
                                        const value = thirdQuarter;
                                        handleChange(id, 'target.thirdQuarter', value);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>
                                    {thirdQuarter}
                                </Typography>
                            )}
                        </td>

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (
                                <Input
                                    value={fourthQuarter}
                                    size='sm'
                                    onChange={(e) =>
                                        handleChange(id, 'target.fourthQuarter', e.target.value)
                                    }
                                    onBlur={() => {
                                        const value = fourthQuarter;
                                        handleChange(id, 'target.fourthQuarter', value);
                                        setEditRowId(null);
                                    }}
                                />
                            ) : (
                                <Typography>
                                    {fourthQuarter}
                                </Typography>
                            )}
                        </td>

                        <td >
                            <Typography>
                                {cost}
                            </Typography>
                        </td>

                        <td onClick={() => handleOnRowClick(id)}>
                            {isEditing ? (

                                <AutocompleteComponent
                                    placeholder="is GAD related activity"
                                    value={isGadRelated === true ? 'Yes' : 'No'}
                                    setValue={(val) =>
                                        handleChange(id, "isGadRelated", val.value)}
                                    options={gadRelatedOptions}
                                />
                            ) : (
                                <Typography>
                                    {console.info(isGadRelated)}
                                    {isGadRelated
                                        ? 'Yes'
                                        : 'No'
                                    }
                                </Typography>
                            )}
                        </td>

                        <td >

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
                                        onClick={() => {
                                            const resources = findResourcesByActivityID(id);
                                            navigate(resources.length > 0 ? `resources/${rowId}` : `items/${rowId}`, {
                                                state: {
                                                    parentId: id,
                                                    objectiveRowId: objectiveRowId,
                                                    activityRowId: rowId,
                                                    cost: cost
                                                }
                                            })
                                        }}
                                        fontSize={12}
                                    >
                                        Resources
                                    </Link>

                                    <Chip
                                        variant="outlined"
                                        color="success"
                                    >
                                        {resourceCountPerActivity[id] || 0}
                                    </Chip>

                                </Stack>


                                <Stack
                                    direction={'row'}
                                    alignItems={'center'}
                                    gap={1}
                                >
                                    <Link
                                        component="button"
                                        onClick={() => navigate(`person/${rowId}`, {
                                            state:
                                            {
                                                parentId: id,
                                                objectiveId: parentId,
                                                activityrowId: rowId,
                                            }
                                        })}
                                        fontSize={12}
                                    >

                                        Responsible Person
                                    </Link>


                                    <Chip
                                        variant="outlined"
                                        color="success"
                                    >
                                        {responsibleCountPerActivity[id] || 0}
                                    </Chip>
                                </Stack>


                                <IconButtonComponent
                                    onClick={() => deleteRow(id)}
                                    icon={<Trash size={14} />}
                                    size={'sm'}
                                    variant={'text'}
                                />
                            </Stack>
                        </td>
                    </tr>
                )
            })}
        </Fragment >
    )
}

export default ActivitiesTable