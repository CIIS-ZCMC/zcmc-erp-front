import AutocompleteComponent from "@Components/Form/AutocompleteComponent";
import InputComponent from "@Components/Form/InputComponent";
import { TodayOutlined } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";
import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";

export default function ProcurementTimeline({
  timelines = { start: [], end: [], delivery: [] },
  onChange, // callback to parent
  value, // initial value from parent
  editing = false,
}) {
  const [values, setValues] = useState({
    start_date: value?.start_date || "",
    end_date: value?.end_date || "",
    delivery_date: value?.delivery_date || "",
  });

  const formatMonthYear = (date) => {
    if (!date) return "";

    const m = moment(date, "MM/YYYY", true);

    return m.isValid() ? m.format("MMMM YYYY") : "";
  };

  // Whenever values change, notify parent
  useEffect(() => {
    if (onChange) {
      onChange(values);
    }
  }, [values, onChange]);
  return (
    <Fragment>
      <Typography
        level="title-md"
        startDecorator={
          <TodayOutlined color="success" style={{ fontSize: 20 }} />
        }
      >
        Timeline of Procurement Activity{" "}
      </Typography>
      <Stack gap={3}>
        <Stack
          spacing={1}
          mt={editing ? 1 : 3}
          direction="row"
          width="100%"
          sx={{ minWidth: 0 }}
        >
          {!editing ? (
            <>
              <Stack spacing={1}>
                <InputComponent
                  label={"Start"}
                  value={formatMonthYear(values?.start_date)}
                  width="100%"
                  readOnly
                />
              </Stack>
              <Stack spacing={1}>
                <InputComponent
                  label={"End"}
                  value={formatMonthYear(values?.end_date)}
                  width="100%"
                  readOnly
                />
              </Stack>
            </>
          ) : (
            <>
              <AutocompleteComponent
                label={"Start"}
                placeholder="Select start date"
                options={timelines.start || []}
                value={values?.start_date || null}
                handleSelect={(val) =>
                  setValues({ ...values, start_date: val })
                }
                disabled={!editing}
                size="md"
                color={editing ? "danger" : "neutral"}
                sx={{ flex: 1, minWidth: 0 }}
              />
              <AutocompleteComponent
                label={"End"}
                placeholder="Select end date"
                options={timelines.end || []}
                value={values?.end_date || null}
                handleSelect={(val) => setValues({ ...values, end_date: val })}
                disabled={!editing}
                size="md"
                color={editing ? "danger" : "neutral"}
                sx={{ flex: 1, minWidth: 0 }}
              />
            </>
          )}
        </Stack>

        {!editing ? (
          <Stack spacing={1}>
            <InputComponent
              label="Delivery"
              value={formatMonthYear(values?.delivery_date)}
              readOnly
            />
          </Stack>
        ) : (
          <AutocompleteComponent
            label={"Delivery"}
            placeholder="Select delivery date"
            options={timelines.delivery || []}
            value={values?.delivery_date || null}
            handleSelect={(val) => setValues({ ...values, delivery_date: val })}
            size="md"
            width="auto"
            color={editing ? "danger" : "neutral"}
          />
        )}
      </Stack>
    </Fragment>
  );
}
