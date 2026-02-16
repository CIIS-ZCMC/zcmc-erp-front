import { useEffect } from "react";

import { Stack, Alert, Typography } from "@mui/joy";
import { TriangleAlert } from "lucide-react";

import AutocompleteComponent from "@Components/Form/AutocompleteComponent";
import TextareaComponent from "@Components/Form/TextareaComponent";
import InputComponent from "@Components/Form/InputComponent";

import FunctionTypeHook from "../../../../../Hooks/FunctionTypeHook";

// Store
import { useFunctionTypes } from "../../../../../Store/functionTypesStore";
import {
  useObjectiveByType,
  useObjectivesActions,
} from "../../../../../Store/ObjectivesStore";

import { OBJECTIVES } from "../../../../../Data/constants";
import useObjectivesHook from "../../../../../Hooks/AOP/ObjectivesHook";

const ObjectivesModal = ({
  functionType,
  objective,
  successIndicator,
  otherObjective,
  otherSuccessIndicator,
  applicationObjective,
}) => {
  const { OBJECTIVE_ALERT } = OBJECTIVES;

  const function_types = useFunctionTypes();
  const objectiveByType = useObjectiveByType();

  const {
    setFunctionType,
    setObjective,
    setSuccessIndicator,
    setOtherObjective,
    setOtherSuccessIndicator,
  } = useObjectivesActions();

  const { getFunctionType } = FunctionTypeHook();
  const { getObjectivesByFunctionType } = useObjectivesHook();

  // useEffect(() => {
  // }, [function_types, applicationObjective, otherSuccessIndicator])

  useEffect(() => {
    // setIsLoading(true);
    const params = {};

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

      const selectedObjectiveId = applicationObjective?.selected_objective?.id;
      const selectedObjective = applicationObjective?.objectives?.filter(
        ({ id }) => id === selectedObjectiveId,
      );
      setObjective(selectedObjective?.[0] || null);
      // setOtherObjective(selectedObjective?.[0]?.code || null)

      const selectedSuccessIndicatorId =
        applicationObjective?.selected_success_indicator?.id;
      const selectedSuccessIndicator = selectedObjective.flatMap(
        ({ success_indicators }) =>
          success_indicators.filter(
            ({ id }) => id === selectedSuccessIndicatorId,
          ),
      );

      setSuccessIndicator(selectedSuccessIndicator?.[0] || null);
      setOtherSuccessIndicator(selectedSuccessIndicator?.[0]?.name || null);

      // console.log('application success indicator id', applicationObjective.selected_success_indicator.id)
      // console.log('selected success indicator id', selectedSuccessIndicatorId)
      console.log(selectedObjective);
      // console.log('success indicator', selectedSuccessIndicator)
    }
  }, [applicationObjective]);

  useEffect(() => {
    if (functionType) {
      getObjectivesByFunctionType(functionType?.id, (status, message) => {
        if (!(status >= 200 && status < 300)) {
          // if status not success
          return; //Toast error
        }
        // setIsLoading(false);
      });
    }
  }, [functionType]);

  // useEffect(() => {
  //   console.log(functionType)
  // }, [functionType])

  return (
    <>
      <Stack spacing={2} width={"100%"}>
        <AutocompleteComponent
          placeholder="Select function type"
          label={"Function type"}
          size="md"
          value={functionType}
          setValue={(val) => {
            setFunctionType(val);
            setObjective(null);
            setSuccessIndicator(null);
            setOtherSuccessIndicator(null);
          }}
          options={function_types}
          getOptionLabel={(opt) => opt?.type || ""}
        />

        <AutocompleteComponent
          placeholder="Select objectives"
          label={"Objectives"}
          size="md"
          value={objective}
          setValue={(val) => {
            // console.log(val)
            setObjective(val);
            setSuccessIndicator(null);
            setOtherSuccessIndicator(null);
          }}
          options={objectiveByType}
          getOptionLabel={(opt) => opt?.description || ""}
          width="100%"
        />

        {/* 31, 87, 55*/}

        <Stack width={"100%"}>
          <Typography level="body-xs">Description:</Typography>
          <Typography level="body-xs" fontWeight={600}>
            {objective?.label}
          </Typography>
        </Stack>

        {objective?.id === 31 ||
        objective?.id === 55 ||
        objective?.id === 87 ? (
          <>
            <TextareaComponent
              label={"Other objective"}
              placeholder={"Input other objective"}
              value={otherObjective || ""}
              onChange={(e) => setOtherObjective(e.target.value)}
            />

            <TextareaComponent
              label={"Others success indicator"}
              placeholder={"Input other success indicator"}
              value={otherSuccessIndicator || ""}
              onChange={(e) => setOtherSuccessIndicator(e.target.value)}
            />
          </>
        ) : (
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
              <Typography level="body-xs" fontWeight={600}>
                {successIndicator?.description}
              </Typography>
            </Stack>

            <Alert color="warning" startDecorator={<TriangleAlert />}>
              {OBJECTIVE_ALERT}
            </Alert>
          </>
        )}
      </Stack>
    </>
  );
};

export default ObjectivesModal;
