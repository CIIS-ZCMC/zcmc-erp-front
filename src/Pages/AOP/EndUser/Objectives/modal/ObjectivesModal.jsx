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
  useSuccessIndicatorByObjective,
} from "../../../../../Store/ObjectivesStore";

import { OBJECTIVES } from "../../../../../Data/constants";
import useObjectivesHook from "../../../../../Hooks/AOP/ObjectivesHook";
import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";

const ObjectivesModal = ({
  isLoading,
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
  const successIndicatorByObjective = useSuccessIndicatorByObjective();

  const {
    setFunctionType,
    setObjective,
    setSuccessIndicator,
    setOtherObjective,
    setOtherSuccessIndicator,
  } = useObjectivesActions();

  const { getFunctionType } = FunctionTypeHook();
  const { getObjectivesByFunctionType, getSuccessIndicatorsByObjective } =
    useObjectivesHook();

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
    if (functionType?.id) {
      getObjectivesByFunctionType(functionType.id);
    }
  }, [functionType?.id]);

  useEffect(() => {
    if (objective?.id) {
      getSuccessIndicatorsByObjective(objective.id);
    }
  }, [objective?.id]);

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
          placeholder="Select objective"
          label={"Objective"}
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

        <Stack width={"100%"} sx={{ display: objective ? "block" : "none" }}>
          <Typography level="body-xs">Description:</Typography>
          <Typography level="body-xs" fontWeight={600}>
            {objective?.description}
          </Typography>
        </Stack>

        {objective?.is_other && (
          <>
            <TextareaComponent
              label={"Other objective"}
              placeholder={"Input other objective"}
              value={otherObjective || ""}
              onChange={(e) => setOtherObjective(e.target.value)}
            />

            {/* <TextareaComponent
              label={"Others success indicator"}
              placeholder={"Input other success indicator"}
              value={otherSuccessIndicator || ""}
              onChange={(e) => setOtherSuccessIndicator(e.target.value)}
            /> */}
          </>
        )}

        <AutocompleteComponent
          placeholder="Select success indicator"
          label={"Success Indicator"}
          size="md"
          value={successIndicator}
          setValue={(val) => {
            setSuccessIndicator(val);
          }}
          options={successIndicatorByObjective}
          getOptionLabel={(opt) => opt?.description || ""}
        />

        <Stack sx={{ display: successIndicator ? "block" : "none" }}>
          <Typography level="body-xs">Description:</Typography>
          <Typography level="body-xs" fontWeight={600}>
            {successIndicator?.description}
          </Typography>
        </Stack>

        <Alert color="warning" startDecorator={<TriangleAlert />}>
          {OBJECTIVE_ALERT}
        </Alert>
      </Stack>
    </>
  );
};

export default ObjectivesModal;
