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
        <Stack spacing={editing ? 1 : 5} mt={editing ? 2 : 4} direction={"row"}>
          {!editing ? (
            <>
              <Stack spacing={1}>
                <Typography level="title-sm">Start</Typography>

                <InputComponent
                  level="body-md"
                  fontWeight={500}
                  value={
                    values?.start_date
                      ? moment(values.start_date, "MM/YYYY").format("MMMM YYYY")
                      : ""
                  }
                />
              </Stack>
              <Stack spacing={1}>
                <Typography level="title-sm">End</Typography>

                <InputComponent
                  level="body-md"
                  fontWeight={500}
                  value={
                    values?.end_date
                      ? moment(values.end_date, "MM/YYYY").format("MMMM YYYY")
                      : ""
                  }
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
              />
            </>
          )}
        </Stack>

        {!editing ? (
          <Stack spacing={1}>
            <Typography level="title-sm">Delivery</Typography>

            <InputComponent
              level="body-md"
              fontWeight={500}
              value={
                values?.end_date
                  ? moment(values.delivery_date, "MM/YYYY").format("MMMM YYYY")
                  : ""
              }
            />
          </Stack>
        ) : (
          <AutocompleteComponent
            label={"Delivery"}
            placeholder="Select delivery date"
            options={timelines.delivery || []}
            value={values?.delivery_date || null}
            handleSelect={(val) => setValues({ ...values, delivery_date: val })}
            disabled={!editing}
            size="md"
            width="auto"
            color={editing ? "danger" : "neutral"}
          />
        )}
      </Stack>
    </Fragment>
  );
}
