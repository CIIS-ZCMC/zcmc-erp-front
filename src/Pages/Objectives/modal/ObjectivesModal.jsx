import { useState, useEffect } from 'react';

import { Stack, Alert, Typography, } from '@mui/joy';
import { TriangleAlert } from 'lucide-react';

import AutocompleteComponent from '@Components/Form/AutocompleteComponent';

import FunctionTypeHook from '../../../Hooks/FunctionTypeHook';

// Store
import { useFunctionTypes } from '../../../Store/functionTypesStore';
import { useObjectivesActions } from '../../../Store/objectivesStore';

import { OBJECTIVES } from '../../../Data/constants';

const ObjectivesModal = ({
    functionType,
    objective,
    successIndicator,
    isEditMode,
}) => {

    const { OBJECTIVE_ALERT } = OBJECTIVES;

    const function_types = useFunctionTypes()
    const { setFunctionType, setObjective, setSuccessIndicator } = useObjectivesActions()
    const { getFunctionType } = FunctionTypeHook()

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true);
        const params = { with_sub_data: 1 }

        getFunctionType(params, (status, message) => {
            if (!(status >= 200 && status < 300)) {
                // if status not success
                return; //Toast error
            }
            setIsLoading(false);
        });
    }, [])

    return (
        <>
            <Stack spacing={2}>
                <AutocompleteComponent
                    placeholder="Select function type"
                    label={'Function type'}
                    size='md'
                    value={functionType}
                    setValue={(val) =>
                        setFunctionType(val)
                    }
                    options={function_types}
                />

                <AutocompleteComponent
                    placeholder="Select objectives"
                    label={'Objectives'}
                    size='md'
                    value={objective}
                    setValue={(val) => {
                        setObjective(val);
                    }}
                    options={functionType?.objectives ?? []}
                />

                <Stack>
                    {objective?.description && (
                        <>
                            <Typography level="body-xs">Description:</Typography>
                            <Typography level="body-xs" fontWeight={600}>
                                {objective?.description}
                            </Typography>
                        </>
                    )}
                </Stack>

                <AutocompleteComponent
                    placeholder="Select success indicators"
                    label={'Success Indicators'}
                    size='md'
                    value={successIndicator}
                    setValue={(val) => {
                        setSuccessIndicator(val);
                    }}
                    options={objective?.success_indicators ?? []}
                />

                <Stack>
                    {successIndicator?.description && (
                        <>
                            <Typography level="body-xs">Description:</Typography>
                            <Typography level="body-xs" fontWeight={600}>
                                {successIndicator?.description}
                            </Typography>
                        </>
                    )}
                </Stack>

                {!isEditMode
                    &&
                    <Alert
                        color="warning"
                        startDecorator={<TriangleAlert />}
                    >
                        {OBJECTIVE_ALERT}
                    </Alert>
                }

            </Stack >
        </>
    )
}

export default ObjectivesModal