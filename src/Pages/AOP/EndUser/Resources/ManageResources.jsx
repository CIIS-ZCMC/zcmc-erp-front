import React, { Fragment, use, useEffect, useMemo, useState } from "react";
import PageTitle from "@Components/Common/PageTitle";
import { Box, Grid, Stack, Typography, useTheme } from "@mui/joy";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import { grey } from "@mui/material/colors";
import ChipComponent from "@Components/Common/ChipComponent";
import { PlusIcon } from "lucide-react";
import ButtonComponent from "@Components/Common/ButtonComponent";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ResourceCardComponent from "@Components/Resources/ResourceCardComponent";
import useResourcesHook from "../../../../Hooks/AOP/ResourcesHook";
import usePurchaseTypeHook from "../../../../Hooks/PurchaseTypeHook";
import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";
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
import SelectComponent from "@Components/Form/YearSelectComponent";
import AutocompleteComponent from "@Components/Form/AutocompleteComponent";
import { FileDownload } from "@mui/icons-material";
import useAOPHook from "@Hooks/AOP/AOPHook";
import useSnackbarHook from "@Hooks/SnackbarHook";
import useSwitchViewHook from "@Hooks/AOP/SwitchViewHook";
import usePageNumberHook from "@Hooks/PageNumberHook";

function ManageResources(props) {
  const { activityId } = useParams();
  const { objectiveId } = useAOPIdStore();

  const {
    getAOPResources,
    resources,
    updateResourceQty,
    updatePurchaseType,
    deleteResource,
    downloadResource,
    activity,
    pagination,
  } = useResourcesHook();
  const { getPurchaseType, purchase_types } = usePurchaseTypeHook();
  const { showSnack } = useSnackbarHook();

  const theme = useTheme();
  const navigate = useNavigate();
  const breadcrumbs = useAOPBreadcrumbs();

  const { aop } = useAOPStore();
  const status = aop.status.id;

  const color = theme.palette;
  const currentYear = new Date().getFullYear();
  const currentFiscalYear = currentYear + 1;

  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedPurchaseType, setSelectedPurchaseType] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const isCard = useSwitchViewHook((state) => state.isCard);
  const setIsCard = useSwitchViewHook((state) => state.setIsCard);
  const perPage = isCard ? 12 : 20;

  const page =
    usePageNumberHook((state) => state.pages[`resources-${activityId}`]) || 1;

  const setPageStore = usePageNumberHook((state) => state.setPage);

  const setPage = (value) => setPageStore(`resources-${activityId}`, value);

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

  const handleExportResources = () => {
    if (!selectedPurchaseType?.id) {
      showSnack(400, "Please select a purchase type before exporting.");
      return;
    }

    setIsExporting(true);

    downloadResource(
      {
        id: activityId,
        purchase_type: selectedPurchaseType.id,
        file_name: `AOP_${selectedPurchaseType.description}-Resources_${new Date().toISOString().split("T")[0]}.xlsx`,
      },
      (status, message) => {
        setIsExporting(false);
        showSnack(status, message);
      },
    );
  };

  useEffect(() => {
    if (!activityId) return; // prevent calling if id is not ready
    setIsLoading(true);

    getAOPResources(
      (status, message) => {
        if (status !== 200) {
          console.error("Failed to fetch items:", message);
        }
        setIsLoading(false);
      },
      {
        activity_id: activityId,
        purchase_type: selectedPurchaseType?.id,
        search: search,
      },
    );

    getPurchaseType((status, message) => {
      if (status !== 200) {
        console.error("Failed to fetch items:", message);
      }
    });
  }, [activityId, selectedPurchaseType, search]);
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
          <Stack
            direction={"row"}
            alignItems="flex-start"
            justifyContent={"space-between"}
            spacing={5}
          >
            <Stack>
              <Stack direction={"row"} spacing={1} alignItems={"flex-start"}>
                <Typography
                  level="title-md"
                  sx={{
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  Manage Resources for
                </Typography>
                <Box sx={{ minWidth: 0 }}>
                  <ChipComponent
                    label={`Activity: ${activity?.name}`}
                    color="success"
                    variant="outlined"
                    fontSize={13}
                    wrap
                  />
                </Box>
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
            <AutocompleteComponent
              options={purchase_types}
              value={selectedPurchaseType}
              setValue={(val) => {
                setSelectedPurchaseType(val);
              }}
              getOptionLabel={(opt) => opt?.description || ""}
              placeholder="Select type"
              width="200px"
              size="md"
            />{" "}
            <ButtonComponent
              label={"Export"}
              startDecorator={<FileDownload />}
              isLoading={isExporting}
              loadingLabel={"Exporting..."}
              onClick={() => handleExportResources()}
              disabled={resources.length === 0}
            />
          </Stack>
        </BoxComponent>

        {isLoading ? (
          <Stack height="60vh" alignItems="center" justifyContent="center">
            <ThreeDotsLoader />
          </Stack>
        ) : resources.length > 0 ? (
          isCard ? (
            <Grid container spacing={3}>
              {resources.map((item, index) => (
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
              rows={resources}
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
