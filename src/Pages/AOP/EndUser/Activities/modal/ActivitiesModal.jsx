import React, { useEffect } from "react";

import {
  Stack,
  Typography,
  FormControl,
  FormLabel,
  Alert,
  Checkbox,
  Input,
} from "@mui/joy";
import { TriangleAlert } from "lucide-react";

import TextareaComponent from "@Components/Form/TextareaComponent";
import InputComponent from "@Components/Form/InputComponent";

import useActivitiesStore, {
  useActivitiesActions,
} from "../../../../../Store/ActivitiesStore";
import { Warning } from "@mui/icons-material";

const ActivitiesModal = ({ selectedActivity }) => {
  const { activity, startMonth, endMonth, isGadRelated, target } =
    useActivitiesStore();
  const { firstQuarter, secondQuarter, thirdQuarter, fourthQuarter } =
    target ?? {};

  const {
    setActivity,
    setStartMonth,
    setEndMonth,
    setIsGadRelated,
    setTarget,
  } = useActivitiesActions();

  useEffect(() => {
    if (selectedActivity) {
      setActivity(selectedActivity.name);
      setStartMonth(selectedActivity.start_month);
      setEndMonth(selectedActivity.end_month);
      setIsGadRelated(selectedActivity.is_gad_related);
      setTarget({
        firstQuarter: selectedActivity.target.first_quarter || "",
        secondQuarter: selectedActivity.target.second_quarter || "",
        thirdQuarter: selectedActivity.target.third_quarter || "",
        fourthQuarter: selectedActivity.target.fourth_quarter || "",
      });
    }
  }, [selectedActivity]);

  useEffect(() => {
    if (!startMonth && !endMonth) {
      const defaultYear = new Date().getFullYear() + 1; //set to next year or + 1
      setStartMonth(`${defaultYear}-01`);
      setEndMonth(`${defaultYear}-01`);
    }
    // console.log(startMonth)
  }, [startMonth]);

  const handleQuarterChange = (quarterKey) => (e) => {
    const value = e.target.value;

    if (
      value === "" ||
      (/^(\d{1,3})?%?$/.test(value) &&
        (value.replace("%", "") === "" ||
          Number(value.replace("%", "")) <= 100))
    ) {
      setTarget({ [quarterKey]: value }); // keep as string to allow typing
    }
  };

  return (
    <>
      <Stack spacing={2} overflow={"hidden"}>
        <TextareaComponent
          label={"Activity name"}
          placeholder="Activity name"
          value={activity || ""}
          onChange={(e) => setActivity(e.target.value)}
        />

        <Stack>
          <Typography>Timeframe</Typography>

          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <InputComponent
              label="FROM"
              type="month"
              value={startMonth || ""}
              setValue={setStartMonth}
            />

            <InputComponent
              label="TO"
              type="month"
              value={endMonth || ""}
              setValue={setEndMonth}
            />
          </Stack>

          <Stack mt={2}>
            <Typography>Target</Typography>
            <Stack
              // mt={3}

              direction={"row"}
              alignItems={"center"}
              spacing={2}
            >
              <InputComponent
                type={"text"}
                label={"Quarter 1"}
                min={0}
                max={100}
                value={firstQuarter || ""}
                onChange={handleQuarterChange("firstQuarter")}
              />

              <InputComponent
                type={"text"}
                label={"Quarter 2"}
                min={0}
                max={100}
                value={secondQuarter || ""}
                onChange={handleQuarterChange("secondQuarter")}
              />
            </Stack>
            <Stack
              // mt={3}
              pt={1}
              spacing={2}
              direction={"row"}
              alignItems={"center"}
            >
              <InputComponent
                type={"text"}
                label={"Quarter 3"}
                min={0}
                max={100}
                value={thirdQuarter || ""}
                onChange={handleQuarterChange("thirdQuarter")}
              />

              <InputComponent
                type={"text"}
                label={"Quarter 4"}
                min={0}
                max={100}
                value={fourthQuarter || ""}
                onChange={handleQuarterChange("fourthQuarter")}
              />
            </Stack>
          </Stack>
        </Stack>

        <Stack mt={10}>
          <Checkbox
            checked={isGadRelated}
            label="GAD related activity"
            onChange={(e) => setIsGadRelated(e.target.checked)}
          />
        </Stack>

        <Alert
          size="sm"
          color="warning"
          startDecorator={<Warning color="warning" />}
          sx={{
            mt: 5,
            p: 1,
            width: 500,
          }}
        >
          Reminder: This activity doesn’t have assigned resources or responsible
          persons yet. After saving, you can add them by opening the full
          details of this activity or through the Manage Activities page.
        </Alert>
      </Stack>
    </>
  );
};

export default ActivitiesModal;
