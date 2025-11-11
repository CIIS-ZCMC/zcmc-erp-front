import React, { Fragment, use, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import PageTitle from "@Components/Common/PageTitle";
import {
  Box,
  Breadcrumbs,
  Divider,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/joy";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import { blue, grey, red } from "@mui/material/colors";
import ChipComponent from "@Components/Common/ChipComponent";
import {
  Book,
  CalendarMonth,
  CalendarMonthTwoTone,
  CalendarToday,
  CheckCircle,
} from "@mui/icons-material";
import {
  Calendar1Icon,
  CalendarIcon,
  Circle,
  PhilippinePeso,
  PhilippinePesoIcon,
  PlusIcon,
} from "lucide-react";
import ButtonComponent from "@Components/Common/ButtonComponent";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ResourceCardComponent from "@Components/Resources/ResourceCardComponent";
import useResourcesHook from "../../../../Hooks/AOP/ResourcesHook";
import usePurchaseTypeHook from "../../../../Hooks/PurchaseTypeHook";
import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";
import moment from "moment";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";
import useAOPBreadcrumbs from "../../../../Hooks/AOP/AOpBreadcrumbs";

const QuarterTarget = ({ label = "Q1", value }) => (
  <>
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      bgcolor="#F2F2F2"
      padding={0.5}
      borderRadius={5}
    >
      <Typography level="body-xs">{label}</Typography>
      <Typography sx={{ fontWeight: 600 }}>
        {" "}
        {value === null || value === undefined || value === "" ? "-" : value}
      </Typography>
    </Stack>
  </>
);

function ManageResources(props) {
  const location = useLocation();
  const { activityId } = useParams();

  const {
    getAOPResources,
    resources,
    updateResourceQty,
    updatePurchaseType,
    deleteResource,
    activity,
  } = useResourcesHook();
  const { getPurchaseType, purchase_types } = usePurchaseTypeHook();

  const theme = useTheme();
  const navigate = useNavigate();
  const breadcrumbs = useAOPBreadcrumbs();

  const color = theme.palette;
  const currentYear = new Date().getFullYear();
  const currentFiscalYear = currentYear + 1;

  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Filter results when search changes
  const filteredResources = useMemo(() => {
    if (!search) return resources;
    return resources.filter((item) =>
      item.item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, resources]);

  const handleUpdateResource = async (id, quantity) => {
    const body = { quantity: quantity };

    await updateResourceQty(id, body, (status, message) => {
      // setLoading(false);

      if (status) {
        console.log("✅ Resource updated successfully:", message);
      } else {
        console.error("❌ Failed to update resource:", message);
      }
    });
  };

  const handlePurchaseTypeChange = (selectedType, resourceId) => {
    if (!selectedType) return;

    const formData = new FormData();
    formData.append("purchase_type_id", selectedType.id);

    updatePurchaseType(resourceId, formData, (status, message) => {
      if (status === 200) {
        console.log("Purchase type updated successfully:", message);
      } else {
        console.error("Failed to update purchase type:", message);
      }
    });
  };

  const handleDeleteResource = async (id) => {
    await deleteResource(id, (status, message) => {
      // setLoading(false);

      if (status) {
        console.log("✅ Resource updated successfully:", message);
      } else {
        console.error("❌ Failed to update resource:", message);
      }
    });
  };

  useEffect(() => {
    if (!activityId) return; // prevent calling if id is not ready
    setIsLoading(true);

    getAOPResources((status, message) => {
      if (status !== 200) {
        console.error("Failed to fetch items:", message);
      }
      setIsLoading(false);
    }, activityId);

    getPurchaseType((status, message) => {
      if (status !== 200) {
        console.error("Failed to fetch items:", message);
      }
    });
  }, [activityId]);
  return (
    <Fragment>
      <PageTitle
        title={`AOP for Fiscal Year ${currentFiscalYear}`}
        description={
          "The following below serves as the summary of your AOP request. You can open and update your request before the deadline as set by the administrators."
        }
        items={breadcrumbs}
      />

      <BoxComponent bgColor={"#FAFAF9"} boxShadow="xs" my={2} padding={2}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Stack>
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <Typography level="body-md" sx={{ fontWeight: 600 }}>
                Manage Resources for
              </Typography>
              <ChipComponent
                label={`Activity: ${activity?.name}`} // change to dynamic activity name
                color={"success"}
                variant={"outlined"}
                fontSize={13}
                size={"lg"}
              />
            </Stack>
            <Typography level="body-sm">
              {" "}
              Manage and allocate all resource requirements for this activity.
              Add, edit, or review items to ensure accurate budgeting and
              procurement details.
            </Typography>
          </Stack>

          <Stack>
            <ButtonComponent
              label={"Add a resource"}
              startDecorator={<PlusIcon />}
              onClick={() =>
                navigate(`/aop/select-resources/${activityId}`, {
                  state: { activityId: activityId },
                })
              }
            />
          </Stack>
        </Stack>

        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          spacing={3}
          mt={3}
        >
          <Stack width={"100%"}>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Stack direction={"row"} spacing={1} width="100%">
                <CalendarToday sx={{ fontSize: 30, color: blue[800] }} />{" "}
                <Stack>
                  <Typography level="body-xs">Timeframe</Typography>
                  <Typography level="title-sm">
                    {moment(activity.start_month).format("MMMM")}-{" "}
                    {moment(activity.end_month).format("MMMM")}
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction={"row"} spacing={1} width="100%">
                <Box
                  sx={{ bgcolor: blue[800] }}
                  width={15}
                  height={15}
                  borderRadius={50}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  padding={1}
                >
                  <PhilippinePesoIcon style={{ color: "white" }} />{" "}
                </Box>
                <Stack>
                  <Typography level="body-xs">Total Cost</Typography>
                  <Typography level="title-sm">
                    ₱{" "}
                    {activity?.cost?.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction={"row"} spacing={1} width="100%">
                <CheckCircle sx={{ fontSize: 30, color: blue[800] }} />{" "}
                <Stack>
                  <Typography level="body-xs">GAD-related activity</Typography>
                  <Typography level="title-sm">
                    {activity.is_gad_related ? "Yes" : "No"}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={3} alignItems="center" width={"100%"}>
            <Typography level="body-xs" sx={{ fontWeight: 600 }}>
              Target (by quarter)
            </Typography>
            <QuarterTarget
              label={"Q1"}
              value={activity?.target?.first_quarter}
            />
            <QuarterTarget
              label={"Q2"}
              value={activity?.target?.second_quarter}
            />
            <QuarterTarget
              label={"Q3"}
              value={activity?.target?.third_quarter}
            />
            <QuarterTarget
              label={"Q4"}
              value={activity?.target?.fourth_quarter}
            />
          </Stack>
        </Stack>
        <Stack mt={3} width={"350px"}>
          <SearchBarComponentv2
            value={search}
            setValue={setSearch}
            placeholder="Search resources..."
            fullWidth
          />
        </Stack>
      </BoxComponent>

      {isLoading ? (
        <Stack height="60vh" alignItems="center" justifyContent="center">
          <ThreeDotsLoader />
        </Stack>
      ) : resources.length > 0 ? (
        <Grid container spacing={3}>
          {filteredResources.map((item, index) => (
            <Grid xs={12} sm={6} md={3} key={index}>
              <ResourceCardComponent
                category={item.item.category}
                name={item.item.name}
                resource_id={item.id}
                price={item.item.estimated_budget}
                quantity={item.quantity}
                unit={item.item.item_unit?.name}
                specifications={item.item.item_specifications}
                onQtyChange={handleUpdateResource}
                options={purchase_types}
                purchase_type={item.purchase_type}
                onPurchaseTypeChange={(selectedType) =>
                  handlePurchaseTypeChange(selectedType, item.id)
                }
                onDelete={handleDeleteResource}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <BoxComponent
          borderColor={grey[300]}
          height={"60vh"}
          borderRadius={10}
          justifyContent={"center"}
          alignItems={"center"}
          display={"flex"}
          flexDirection={"column"}
        >
          <Typography level="title-md">No resources yet.</Typography>
          <Typography level="body-sm">
            Start by adding the materials, equipment, or other resources needed
            for this activity.
          </Typography>
          <Typography level="body-sm" mb={1}>
            Click “Add a Resource” to begin.
          </Typography>
          <ButtonComponent
            startDecorator={<PlusIcon />}
            label={"Add a resource"}
            onClick={() =>
              navigate(`/aop/select-resources/${activityId}`, {
                state: { activityId: activityId },
              })
            }
          />
        </BoxComponent>
      )}
    </Fragment>
  );
}

ManageResources.propTypes = {};

export default ManageResources;
