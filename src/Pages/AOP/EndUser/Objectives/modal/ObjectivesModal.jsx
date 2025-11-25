import { useEffect } from "react";

import { Stack, Alert, Typography } from "@mui/joy";
import { TriangleAlert } from "lucide-react";

import AutocompleteComponent from "@Components/Form/AutocompleteComponent";
import TextareaComponent from "@Components/Form/TextareaComponent";
import InputComponent from "@Components/Form/InputComponent";

import FunctionTypeHook from "../../../../../Hooks/FunctionTypeHook";

// Store
import { useFunctionTypes } from "../../../../../Store/functionTypesStore";
import { useObjectivesActions } from "../../../../../Store/ObjectivesStore";

import { OBJECTIVES } from "../../../../../Data/constants";

const ObjectivesModal = ({
  functionType,
  objective,
  successIndicator,
  otherSuccessIndicator,
  applicationObjective
}) => {
  const { OBJECTIVE_ALERT } = OBJECTIVES;

  const function_types = useFunctionTypes();
  const {
    setFunctionType,
    setObjective,
    setSuccessIndicator,
    setOtherSuccessIndicator
  } = useObjectivesActions();
  const { getFunctionType } = FunctionTypeHook();

  // useEffect(() => {
  // }, [function_types, applicationObjective, otherSuccessIndicator])

  useEffect(() => {
    // setIsLoading(true);
    const params = { with_sub_data: 1 };

    getFunctionType(params, (status, message) => {
      if (!(status >= 200 && status < 300)) {
        // if status not success
        return; //Toast error
      }
      // setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (applicationObjective) {

      setFunctionType(applicationObjective);

      const selectedObjectiveId = applicationObjective.selected_objective.id;
      const selectedObjective = applicationObjective?.objectives?.filter(({ id }) => id === selectedObjectiveId);
      setObjective(selectedObjective?.[0] || null);

      const selectedSuccessIndicatorId = applicationObjective.selected_success_indicator.id;
      const selectedSuccessIndicator = selectedObjective.flatMap(({ success_indicators }) =>
        success_indicators.filter(({ id }) => id === selectedSuccessIndicatorId
        ))

      // console.log(selectedObjective)
      // console.log(selectedSuccessIndicator)

      setSuccessIndicator(selectedSuccessIndicator?.[0] || null)
      setOtherSuccessIndicator(selectedSuccessIndicator?.[0].name || null)

    }
  }, [applicationObjective]);

  return (
    <>
      <Stack spacing={2}>
        <AutocompleteComponent
          placeholder="Select function type"
          label={"Function type"}
          size="md"
          value={functionType}
          setValue={(val) => {
            setFunctionType(val)
            setObjective(null);
            setSuccessIndicator(null)
            setOtherSuccessIndicator(null)
          }}
          options={function_types}
        />

        <AutocompleteComponent
          placeholder="Select objectives"
          label={"Objectives"}
          size="md"
          value={objective}
          setValue={(val) => {
            // console.log(val)
            setObjective(val);
            setSuccessIndicator(null)
            setOtherSuccessIndicator(null)
          }}
          options={functionType?.objectives ?? []}
        />


        {/* 31, 87, 55*/}

        <Stack>
          <Typography level="body-xs">Description:</Typography>
          <Typography level="body-xs" fontWeight={600}>
            {objective?.description}
          </Typography>
        </Stack>


        {objective?.id === 31 || objective?.id === 55 || objective?.id === 87 ?
          <>
            <TextareaComponent
              label={'Others'}
              placeholder={'Input other success indicator'}
              value={otherSuccessIndicator || ""}
              onChange={(e) => setOtherSuccessIndicator(e.target.value)}
            />
          </>
          :
          <>
            <AutocompleteComponent
              placeholder="Select success indicators"
              label={"Success Indicators"}
              size="md"
              value={successIndicator}
              setValue={(val) => {
                setSuccessIndicator(val);
              }}
              options={objective?.success_indicators ?? []}
            />

            <Stack>
              <Typography level="body-xs">Description:</Typography>
              <Typography level="body-xs">
                {successIndicator?.description}
              </Typography>
            </Stack>

            <Alert color="warning" startDecorator={<TriangleAlert />}>
              {OBJECTIVE_ALERT}
            </Alert>
          </>
        }


      </Stack>
    </>
  );
};

export default ObjectivesModal;
