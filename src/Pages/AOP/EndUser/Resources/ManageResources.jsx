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

import useAOPStore from "../../../../Store/AOPStore";
import { isAopDisabled } from "../../../../Utils/AopStatus";
import ActivityDetailsSection from "../ActivityDetailsSection";
import useAOPIdStore from "@Hooks/AOP/AOPIdStore";
import StatusSwitch from "@Components/StatusSwitchComponent";
import ServerPaginationComponent from "@Components/ServerPaginationComponent";
import BasicTableComponent from "@Components/Common/Table/BasicTableComponent";
import { AOP_RESOURCES_COLUMNS } from "@Data/Columns";
import CartPreviewComponent from "@Components/Resources/CartPreviewComponent";

function ManageResources(props) {
  const location = useLocation();
  const { activityId } = useParams();
  const { objectiveId } = useAOPIdStore();

  const {
    getAOPResources,
    resources,
    updateResourceQty,
    updatePurchaseType,
    deleteResource,
    activity,
    pagination,
  } = useResourcesHook();
  const { getPurchaseType, purchase_types } = usePurchaseTypeHook();

  const theme = useTheme();
  const navigate = useNavigate();
  const breadcrumbs = useAOPBreadcrumbs();

  const { aop } = useAOPStore();
  const status = aop.status.id;

  const [page, setPage] = useState(1);
  const [isCard, setIsCard] = useState(true);

  const color = theme.palette;
  const currentYear = new Date().getFullYear();
  const currentFiscalYear = currentYear + 1;

  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  const perPage = isCard ? 12 : 20;

  // Filter results when search changes
  const filteredResources = useMemo(() => {
    if (!search) return resources;
    return resources.filter((item) =>
      item.item.name.toLowerCase().includes(search.toLowerCase()),
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

      if (status === 200) {
        console.log("✅ Resource updated successfully:", message);
      } else {
        console.error("❌ Failed to update resource:", message);
      }
    });
  };

  const handlePreview = (resource) => {
    setSelectedResource(resource);
    setOpenPreview(true);
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
      <Stack
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <PageTitle
          title={`AOP for Fiscal Year ${currentFiscalYear}`}
          description={
            "The following below serves as the summary of your AOP request. You can open and update your request before the deadline as set by the administrators."
          }
          items={breadcrumbs}
          backTo={`/aop/activities/${objectiveId}`}
        />

        <BoxComponent
          bgColor={color.background.surface}
          boxShadow="xs"
          my={2}
          padding={2}
        >
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
                  wrap
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
                disabled={isAopDisabled(status)}
              />
            </Stack>
          </Stack>

          <ActivityDetailsSection
            start_month={activity?.start_month}
            end_month={activity?.end_month}
            cost={activity?.cost}
            is_gad_related={activity?.is_gad_related}
            target={activity?.target}
          />
          <Stack mt={3} direction={"row"} spacing={2}>
            <StatusSwitch
              activeLabel="Card"
              inactiveLabel="Table"
              activeColor="primary"
              inactiveColor="neutral"
              activeBg="#0086CC"
              inactiveBg="#0086CC"
              checked={isCard}
              onChange={(value) => {
                setIsCard(value);
                setPage(1);
              }}
              size="md"
            />
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
        ) : filteredResources.length > 0 ? (
          isCard ? (
            <Grid container spacing={3}>
              {filteredResources.map((item, index) => (
                <Grid xs={12} sm={6} md={3} key={index}>
                  <ResourceCardComponent
                    status={status}
                    category={item?.item?.category}
                    name={item?.item?.name}
                    resource_id={item.id}
                    price={item?.item?.estimated_budget}
                    quantity={item.quantity}
                    unit={item?.item?.item_unit?.name}
                    specifications={item?.item?.item_specifications}
                    object_category={item?.expense_class}
                    onQtyChange={handleUpdateResource}
                    options={purchase_types}
                    purchase_type={item?.purchase_type}
                    onPurchaseTypeChange={(selectedType) =>
                      handlePurchaseTypeChange(selectedType, item.id)
                    }
                    onDelete={handleDeleteResource}
                    onPreview={() => handlePreview(item)}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <BasicTableComponent
              columns={AOP_RESOURCES_COLUMNS({
                purchaseTypes: purchase_types,
                onPurchaseTypeChange: handlePurchaseTypeChange,
                onQtyChange: handleUpdateResource,
                onDelete: handleDeleteResource,
                onPreview: (item) => handlePreview(item),
                status,
              })}
              rows={filteredResources}
            />
          )
        ) : (
          <BoxComponent
            borderColor={grey[300]}
            height={"55vh"}
            borderRadius={10}
            justifyContent={"center"}
            alignItems={"center"}
            display={"flex"}
            flexDirection={"column"}
          >
            <Typography level="title-md">No resources yet.</Typography>
            <Typography level="body-sm">
              Start by adding the materials, equipment, or other resources
              needed for this activity.
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

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            mt: "auto",
            pt: 3,
          }}
        >
          <ServerPaginationComponent
            page={page}
            setPage={setPage}
            perPage={perPage}
            pagination={pagination}
          />
        </Box>
      </Stack>

      <CartPreviewComponent
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        price={selectedResource?.item?.estimated_budget}
        name={selectedResource?.item?.name}
        category={selectedResource?.item?.category}
        specifications={selectedResource?.item?.item_specifications}
        unit={selectedResource?.item?.item_unit?.name}
        qty={selectedResource?.quantity}
        isAddToCart={false}
      />
    </Fragment>
  );
}

ManageResources.propTypes = {};

export default ManageResources;
