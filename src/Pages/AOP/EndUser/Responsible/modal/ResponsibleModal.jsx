import React, { useEffect, useMemo } from "react";

import { Tabs, TabList, Tab, TabPanel, Stack, Typography } from "@mui/joy";

import { X } from "lucide-react";

import AutocompleteComponent from "@Components/Form/AutocompleteComponent";
import ChipComponent from "@Components/Common/ChipComponent";

import useUserHook from "../../../../../Hooks/UserHook";
import useJobPositionsHook from "../../../../../Hooks/JobPositionsHook";

import useResponsibleStore, {
  useResponsiblePeopleActions,
} from "../../../../../Store/ResponsibleStore";
import useUsersStore from "../../../../../Store/UsersStore";
import useJobPositionStore from "../../../../../Store/JobPositionsStore";
import { grey } from "@mui/material/colors";

const ResponsibleModal = () => {
  const { selectedPeople } = useResponsibleStore();
  const { setSelectedPeople, removeResponsiblePerson } =
    useResponsiblePeopleActions();

  const { users } = useUsersStore();
  const { jobPositions } = useJobPositionStore();

  const { getUsers } = useUserHook();
  const { getJobPositions } = useJobPositionsHook();

  // useEffect(() => {
  //     console.log(setResponsiblePeople)
  // }, [setResponsiblePeople])

  useEffect(() => {
    getUsers((status, message) => {
      if (!(status >= 200 && status < 300)) {
        // if status not success
        return; //Toast error
      }
      // setIsLoading(false);
    });

    getJobPositions((status, message) => {
      if (!(status >= 200 && status < 300)) {
        // if status not success
        return; //Toast error
      }
      // setIsLoading(false);
    });
  }, []);

  // Filter out users that are already selected
  const availableUsers = useMemo(() => {
    return users.filter(
      (user) => !selectedPeople?.filter(Boolean).some((p) => p.id === user.id)
    );
  }, [users, selectedPeople]);

  // Filter out job positions that are already selected
  const availableJobPositions = useMemo(() => {
    return (jobPositions || []).filter(
      (position) =>
        !selectedPeople?.filter(Boolean).some((p) => p.id === position.id)
    );
  }, [jobPositions, selectedPeople]);

  const userCount = selectedPeople.filter((user) => user.sector_id).length;
  const jobPositionCount = selectedPeople.filter(
    (position) => !position.sector_id
  ).length;

  return (
    <>
      <Tabs aria-label="Basic tabs" defaultValue={0}>
        <TabList tabFlex={1}>
          <Tab>People ({userCount})</Tab>
          <Tab>Job Position({jobPositionCount})</Tab>
        </TabList>

        <TabPanel value={0}>
          <AutocompleteComponent
            label={"Select Person/People"}
            size={"lg"}
            placeholder="Search by name or department"
            setValue={(value) => setSelectedPeople(value)}
            options={availableUsers}
            // disabled={!isEditing}
          />
        </TabPanel>

        <TabPanel value={1}>
          <AutocompleteComponent
            label={"Select job position"}
            placeholder="Search by position or department"
            size={"lg"}
            setValue={(value) => setSelectedPeople(value)}
            options={availableJobPositions}
            // disabled={!isEditing}
          />
        </TabPanel>
      </Tabs>

      <Stack
        direction="row"
        spacing={1}
        gap={1}
        flexWrap="wrap"
        sx={{
          border: `1px dashed ${grey[400]}`,
          padding: 2,
          borderRadius: 10,
          mx: 2,
        }}
      >
        {selectedPeople.map(({ id, label, sector_id }) => (
          <ChipComponent
            key={id}
            variant="soft"
            color={sector_id ? "primary" : "success"}
            label={label}
            endDecorator={true}
            onClick={() => removeResponsiblePerson(id)}
            status={"error"}
          />
        ))}
      </Stack>
    </>
  );
};

export default ResponsibleModal;
