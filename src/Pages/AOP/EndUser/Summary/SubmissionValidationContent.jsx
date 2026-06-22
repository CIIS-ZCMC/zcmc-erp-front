import ChipComponent from "@Components/Common/ChipComponent";
import { WarningAmber } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/joy";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function SubmissionValidationContent({ data }) {
  const navigate = useNavigate();

  const AlertHeader = ({ title }) => (
    <Box
      sx={{
        bgcolor: "#fde7e7",
        borderLeft: "4px solid #D32F2F",
        px: 2,
        py: 1.2,
        mb: 0,
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <WarningAmber color="danger" sx={{ fontSize: 18 }} />
      <Typography level="body-xs" color="danger">
        {title}
      </Typography>
    </Box>
  );

  const IssueRow = ({ label, buttonLabel, onClick }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        px: 2,
        py: 1,
        borderBottom: "1px solid #eee",
      }}
    >
      <Typography level="body-xs" width={"70%"}>
        {label}
      </Typography>

      <ChipComponent
        variant="soft"
        label={buttonLabel}
        status={"next"}
        color={"primary"}
        fontWeight={500}
        endDecorator
        onClick={onClick}
      />
    </Box>
  );

  const IssueSection = ({ title, items, buttonLabel, onClick }) => {
    if (!items?.length) return null;

    return (
      <Box
        sx={{
          border: "1px solid #eee",
          borderRadius: "8px",
          overflow: "hidden",
          mb: 1.5,
        }}
      >
        <AlertHeader title={title} />

        {items.map((item, index) => (
          <IssueRow
            key={index}
            label={item.name || item.description || item}
            buttonLabel={buttonLabel}
            onClick={() => navigate(item.path)}
          />
        ))}
      </Box>
    );
  };

  if (!data) return null;

  const {
    objectives_without_activities = [],
    activities_without_resources = [],
    activities_without_responsible_people = [],
    activities_without_target = [],
    aop_without_obj = {},
  } = data;

  const flattenActivities = (items = []) =>
    items.flatMap((x) => x.activities || []);
  return (
    <Stack spacing={2}>
      {aop_without_obj && Object.keys(aop_without_obj).length > 0 && (
        <Box>
          <AlertHeader title="No objectives defined." />

          <IssueRow
            label={aop_without_obj.description}
            buttonLabel="Add Objective"
            onClick={() => navigate(aop_without_obj.path)}
          />
        </Box>
      )}
      <IssueSection
        title="These objectives do not contain any activities:"
        items={objectives_without_activities}
        buttonLabel="Add Activity"
      />

      <IssueSection
        title="These activities do not contain any resources:"
        items={flattenActivities(activities_without_resources)}
        buttonLabel="Add Resources"
        onClick={(activity) =>
          navigate(`/aop/activities/${activity.activity_id}/resources`)
        }
      />

      <IssueSection
        title="These activities do not contain any responsible persons:"
        items={flattenActivities(activities_without_responsible_people)}
        buttonLabel="Assign Person"
        onClick={(activity) =>
          navigate(`/aop/activities/${activity.activity_id}/people`)
        }
      />

      <IssueSection
        title="These activities do not contain any target quarter:"
        items={flattenActivities(activities_without_target)}
        buttonLabel="Add Target"
      />
    </Stack>
  );
}
