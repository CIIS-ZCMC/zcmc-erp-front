import { useState, Fragment, useEffect } from "react";

import { Outlet, useLocation, useParams, useNavigate } from "react-router-dom";

import { Box, Stack } from "@mui/joy";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";

import ButtonComponent from "../../../../../../../Components/Common/ButtonComponent";
import SheetComponent from "../../../../../../../Components/Common/SheetComponent";
import IconButtonComponent from "../../../../../../../Components/Common/IconButtonComponent";
import ContainerComponent from "../../../../../../../Components/Common/ContainerComponent";
import EditableTableComponent from "../../../../../../../Components/Common/Table/EditableTableComponent";

import TableRow from "./TableRow";

import { AOP_CONSTANTS } from "../../../../../../../Data/constants";
import { AOP_ACTIVITIES_HEADER } from "../../../../../../../Data/Columns";

import useAOPObjectivesHooks from "../../../../../../../Hooks/AOP/AOPObjectivesHook";
import useActivitiesHook from "../../../../../../../Hooks/ActivitiesHook";
import useObjectivesHook from "../../../../../../../Hooks/ObjectivesHook";

const Activities = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const parentId = location.state?.parentId;
  const objectiveRowId = location.state?.rowId;

  const { objectiveId } = params; //objective Id lang for url path pero yung value is from row
  const currentPath = location.pathname;
  const childPath = currentPath === `/aop-create/activities/${objectiveId}`;

  const {
    current_parent_id,
    setCurrentObjective,
    current_row_id,
    setCurrentRowId,
  } = useObjectivesHook();
  const {
    activities,
    addActivity,
    initialRender,
    setInitialRender,
    updateActivityField,
    removeActivity,
  } = useActivitiesHook();

  useEffect(() => {
    console.log(activities);
    const hasActivitiesForParent = activities.some(
      (act) => act.parentId === parentId
    );
    if (!hasActivitiesForParent && parentId && initialRender) {
      addActivity(parentId ?? current_parent_id);
    }
  }, [activities, parentId]);

  useEffect(() => {
    if (current_parent_id !== null) {
      if (current_parent_id !== parentId && !!parentId) {
        setCurrentObjective(parentId);
      }
    } else {
      setCurrentObjective(parentId);
    }

    if (current_row_id !== null) {
      if (current_parent_id !== objectiveRowId && !!objectiveRowId) {
        console.log(current_row_id);
        setCurrentRowId(objectiveRowId);
      }
    } else {
      setCurrentRowId(objectiveRowId);
    }
  }, []);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapseClick = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <Fragment>
      {childPath && (
        <>
          <ContainerComponent
            title={AOP_CONSTANTS.MANAGE_ACTIVITIES_HEADER}
            description={AOP_CONSTANTS.MANAGE_ACTIVITIES_SUBHEADER}
            isTable={false}
            actions={
              <Stack>
                <IconButtonComponent
                  variant={"text"}
                  icon={isCollapsed ? <ChevronUp /> : <ChevronDown />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCollapseClick();
                  }}
                />
              </Stack>
            }
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {isCollapsed && (
                <Box>
                  <Stack direction={"row"} gap={2}>
                    <SheetComponent variant={"outlined"}>
                      Content 1
                    </SheetComponent>

                    <SheetComponent variant={"outlined"}>
                      Content 2
                    </SheetComponent>

                    <SheetComponent variant={"outlined"}>
                      Content 3
                    </SheetComponent>
                  </Stack>
                </Box>
              )}
            </Box>
          </ContainerComponent>

          <Box sx={{ m: 3 }} />

          <ContainerComponent
            title={AOP_CONSTANTS.TABLE_ACTIVITY_HEADER}
            description={AOP_CONSTANTS.TABLE_ACTIVITY_SUBHEADING}
            isTable={true}
            actions={
              <Stack>
                <ButtonComponent
                  onClick={() => addActivity(parentId)}
                  label={"Add an Activity"}
                  endDecorator={<Plus size={16} />}
                />
              </Stack>
            }
          >
            <EditableTableComponent
              columns={AOP_ACTIVITIES_HEADER}
              tableRow={
                <TableRow
                  handleChange={updateActivityField}
                  parentId={parentId ?? current_parent_id}
                  objectiveRowId={objectiveRowId ?? current_row_id}
                  deleteRow={removeActivity}
                  rows={activities}
                />
              }
            />

            <Stack
              mt={2}
              direction={"flex"}
              alignItems={"center"}
              justifyContent={"start"}
              gap={1}
            >
              <ButtonComponent
                label={"Back"}
                size={"md"}
                variant={"outlined"}
                onClick={() => {
                  navigate(`/aop-create`);
                  setInitialRender(true);
                }}
              />
            </Stack>
          </ContainerComponent>
        </>
      )}
      <Outlet />
    </Fragment>
  );
};

export default Activities;
