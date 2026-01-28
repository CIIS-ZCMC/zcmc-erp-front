import React, { Fragment, useEffect, useRef, useState } from "react";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import PageTitle from "../../../Components/Common/PageTitle";
import { objHeaders, successIndicator } from "../../../Data/Columns";
import ScrollableTableComponent from "../../../Components/Common/Table/ScrollableTableComponent";
import ModalComponent from "../../../Components/Common/Dialog/ModalComponent";
import AutocompleteComponent from "../../../Components/Form/AutocompleteComponent";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Input,
  Link,
  Stack,
  Textarea,
  Typography,
  useTheme,
} from "@mui/joy";
import TextareaComponent from "../../../Components/Form/TextareaComponent";
import { BiPlus } from "react-icons/bi";
import { CgRemove } from "react-icons/cg";
import InputComponent from "../../../Components/Form/InputComponent";
import useManageObjHook from "../../../Hooks/ManageObjectivesHook";
import TableComponent from "../../../Components/Common/Table/TableComponent";
import useModalHook from "../../../Hooks/ModalHook";
import AlertDialogComponent from "../../../Components/Common/Dialog/AlertDialogComponent";
import PageLoader from "../../../Components/Loading/PageLoader";
import ConfirmationModalComponent from "../../../Components/Common/Dialog/ConfirmationModalComponent";
import useFunctionTypeHook from "../../../Hooks/FunctionTypeHook";
import ServerTableComponent from "../../../Components/Common/Table/ServerTableComponent";
import userErrorInputHook from "../../../Hooks/ErrorInputHook";
import ExpandableTable from "@Components/Common/Table/ExpandableTable";
import useFunctionTypesStore, {
  useFunctionTypes,
} from "../../../Store/functionTypesStore";
import { Add } from "@mui/icons-material";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import TabComponent from "@Components/Common/TabComponent";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";
import StatusSwitch from "@Components/StatusSwitchComponent";

function ManageObjectives({ props }) {
  const {
    objectives,
    pagination,
    navLinks,
    getObjectives,
    removeObj,
    postObjective,
    updateObjective,
    setSearchQuery,
    searchQuery,
  } = useManageObjHook();
  const { getFunctionType } = useFunctionTypeHook();
  const function_types = useFunctionTypes();
  const { setAlertDialog, setConfirmationModal, closeConfirmation } =
    useModalHook();
  const { errors, setError, clearErrors } = userErrorInputHook();

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [isView, setIsView] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [obj, setObj] = useState({});
  const [objIndicators, setObjIndicators] = useState([]);
  const [pin, setPin] = useState(null);
  const [selected, setSelected] = useState({});
  const [newObj, setNewObj] = useState({
    function: null,
    objective: "",
    indicators: ["", "", ""],
  });
  const [updateObj, setUpdateObj] = useState({
    function: null,
    objective: "",
    indicators: [],
  });
  const [highlightedRowId, setHighlightedRowId] = useState(null);
  const indicatorsContainerRef = useRef(null);
  const [page, setPage] = useState(1);
  const [index, setIndex] = useState("all");
  const [active, setActive] = useState(true);

  const theme = useTheme();
  const color = theme.palette;

  //PAGINATION
  const totalPages = pagination?.last_page || 1;

  //ADDING SUCCESS INDICATOR
  const addIndicator = (mode = "create") => {
    if (mode === "create") {
      setNewObj((prev) => {
        const newIndicators = [...prev.indicators, ""];
        setTimeout(() => {
          indicatorsContainerRef.current?.lastElementChild?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }, 100);
        return { ...prev, indicators: newIndicators };
      });
    } else if (mode === "update") {
      setUpdateObj((prev) => {
        const newIndicators = [
          ...prev.indicators,
          { code: null, description: "" },
        ];
        setTimeout(() => {
          indicatorsContainerRef.current?.lastElementChild?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }, 100);
        return { ...prev, indicators: newIndicators };
      });
    }
  };

  //REMOVE SUCCESS INDICATOR
  const removeIndicator = (index, mode = "create") => {
    if (mode === "create") {
      setNewObj((prev) => ({
        ...prev,
        indicators:
          prev.indicators.length > 1
            ? prev.indicators.filter((_, i) => i !== index)
            : prev.indicators,
      }));
    } else if (mode === "update") {
      setUpdateObj((prev) => ({
        ...prev,
        indicators:
          prev.indicators.length > 1
            ? prev.indicators.filter((_, i) => i !== index)
            : prev.indicators,
      }));
    }
  };
  const handleChangeIndicator = (index, value, mode = "create") => {
    if (mode === "create") {
      setNewObj((prev) => {
        const newIndicators = [...prev.indicators];
        newIndicators[index] = value;
        return { ...prev, indicators: newIndicators };
      });
    } else if (mode === "update") {
      setUpdateObj((prev) => {
        const newIndicators = [...prev.indicators];
        newIndicators[index] = {
          code: newIndicators[index]?.code || null,
          description: value,
        };
        return { ...prev, indicators: newIndicators };
      });
    }
  };

  const isEmptyObject = (obj) =>
    obj && typeof obj === "object" && Object.keys(obj).length === 0;

  // HANDLE MODAL NEXT
  const handleNext = (mode = "create") => {
    let hasError = false;
    if (mode === "create") {
      if (currentStep === 1) {
        if (!newObj.function) {
          setError("function", true, "Please select a function");
          hasError = true;
        }
        if (!newObj.objective) {
          setError("objective", true, "Please input an objective");
          hasError = true;
        }
        if (hasError) return;
      }
    }

    if (mode === "update") {
      if (currentStep === 1) {
        if (!updateObj.function) {
          setError("function", true, "Please select a function");
          hasError = true;
        }
        if (!updateObj.objective) {
          setError("objective", true, "Please input an objective");
          hasError = true;
        }
        if (hasError) return;
      }
    }

    setCurrentStep((prev) => prev + 1);
    // setIsLoading(false); // STOP LOADING
  };

  // HANDLE MODAL NEXT
  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleClose = () => {
    clearErrors();
    setOpenCreate(false);
    setCurrentStep(1);
  };

  //UPDATE
  const handleOpenUpdate = (row) => {
    setCurrentStep(1);
    setSelected(row);
    setUpdateObj({
      function: row.function,
      objective: row.objective.description,
      indicators: row.success_indicator.map((item) => ({
        code: item.code,
        description: item.description,
      })),
    });
    setOpenUpdate(true);
  };

  const handleOpenDel = (row) => {
    const data = {
      status: "error",
      title: `Archive objective ${row?.objective?.code}?`,
      description: "This action cannot be undone.",
    };
    setSelected(row);
    setConfirmationModal(data);
  };

  const handleDelete = async (row) => {
    setButtonLoader(true);

    const formData = new FormData();
    formData.append("pin", pin);

    try {
      const { status, message } = await new Promise((resolve) => {
        removeObj(row.id, formData, (s, m, d) =>
          resolve({ status: s, message: m }),
        );
      });

      setAlertDialog({
        status: status === 200 ? "success" : "error",
        title: message,
        description: message,
      });

      if (status === 200) {
        fetchAll();
        setSelected({});
      }
    } catch (err) {
      console.error("Delete error:", err);
      setAlertDialog({
        status: "error",
        title: "Unexpected error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setButtonLoader(false);
    }
  };

  //UPDATE
  const update = async () => {
    let hasError = false;

    updateObj.indicators.forEach((i, index) => {
      if (!i?.description?.trim()) {
        setError(
          `indicator-[${index}]`,
          true,
          `Success Indicator ${index + 1} is required.`,
        );
        hasError = true;
      }
    });
    if (!pin?.trim()) {
      setError("pin", true, "Authorization PIN is required.");
      hasError = true;
    }
    if (hasError) return;
    setButtonLoader(true);

    const formData = new FormData();
    formData.append("id", selected.id);
    formData.append("function", JSON.stringify(updateObj.function));
    formData.append("objective", updateObj.objective);
    formData.append("indicators", JSON.stringify(updateObj.indicators));
    formData.append("pin", JSON.stringify(pin));

    try {
      const { status, message, data } = await new Promise((resolve) => {
        updateObjective(formData, (s, m, d) =>
          resolve({ status: s, message: m, data: d }),
        );
      });
      setHighlightedRowId(data?.id);
      setAlertDialog({
        status: status === 200 ? "success" : "error",
        title: message,
        description: message,
      });

      if (status === 200) {
        setOpenUpdate(false);
        setNewObj({
          function: null,
          objective: "",
          indicators: ["", "", ""],
        });
        setPin("");
      }
    } catch (err) {
      console.error("Update error:", err);
      setAlertDialog({
        status: "error",
        title: "Unexpected error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setButtonLoader(false);
    }
  };

  //POST
  const submit = async () => {
    let hasError = false;

    newObj.indicators.forEach((i, index) => {
      if (!i.trim()) {
        setError(
          `indicator-[${index}]`,
          true,
          `Success Indicator ${index + 1} is required.`,
        );
        hasError = true;
      }
    });
    if (!pin?.trim()) {
      setError("pin", true, "Authorization PIN is required.");
      hasError = true;
    }
    if (hasError) return;

    try {
      setButtonLoader(true);

      const formData = new FormData();
      formData.append("function", JSON.stringify(newObj.function));
      formData.append("objective", newObj.objective);
      formData.append("indicators", JSON.stringify(newObj.indicators));
      formData.append("pin", JSON.stringify(pin));
      const result = await new Promise((resolve) => {
        postObjective(formData, (status, message, data) =>
          resolve({ status, message, data }),
        );
      });

      const { status, message, data } = result;

      const alertData = {
        status: status === 201 ? "success" : "error",
        title: message,
        description: message,
      };

      setAlertDialog(alertData);

      if (status === 201) {
        setHighlightedRowId(data?.id);
        const lastPage = pagination?.last_page || 1;
        setCurrentPage(lastPage);
        await getObjectives(lastPage);

        setOpenCreate(false);
        setNewObj({
          function: null,
          objective: "",
          indicators: ["", "", ""],
        });
        setPin("");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setAlertDialog({
        status: "error",
        title: "Unexpected error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setButtonLoader(false);
    }
  };

  //FETCH ALL
  const fetchAll = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        getObjectives({ page, per_page: 10, search: searchQuery, tab: index }),
        getFunctionType({ mode: "selection" }),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  //DISPLAY INDICATORS
  const handleViewIndicators = (row) => {
    setObj(row.objective);
    setObjIndicators(row.success_indicator);
    setIsView(true);
  };

  const tabs = [
    { name: "All", value: "all" },
    { name: "Core", value: "core" },
    { name: "Strategic", value: "strat" },
    { name: "Support", value: "sup" },
  ];

  useEffect(() => {
    fetchAll();
  }, [page, index, searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [index, searchQuery]);

  useEffect(() => {
    if (highlightedRowId) {
      const timeout = setTimeout(() => setHighlightedRowId(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [highlightedRowId]);
  useEffect(() => {
    if (!function_types?.length) {
      getFunctionType({ mode: "selection" });
    }
  }, []);

  return (
    <Fragment>
      <PageTitle
        title="Objectives and Success Indicators"
        description="This is a subheading. It should add more context to the interaction."
      />

      <BoxComponent bgColor={color.background.surface} my={2} p={2}>
        <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
          <Stack>
            <Typography level="body-md" fontWeight={600}>
              List of Objectives and Success Indicators
            </Typography>
            <Typography level="body-xs">
              This is a subheading. It should add more context to the
              interaction.
            </Typography>
          </Stack>
        </Stack>
      </BoxComponent>
      <TabComponent tabs={tabs} index={index} setIndex={setIndex} />

      <Stack
        direction={"row"}
        sx={{
          alignItems: "center",
          justifyContent: index !== "all" ? "space-between" : "flex-end",
          my: 2,
        }}
      >
        {index !== "all" && (
          <StatusSwitch checked={active} onChange={setActive} />
        )}

        <Stack direction={"row"} spacing={2}>
          <SearchBarComponentv2
            placeholder="Search objectives..."
            value={searchQuery}
            setValue={setSearchQuery}
          />
          <ButtonComponent
            label="Create new"
            color="primary"
            onClick={() => {
              clearErrors();
              setCurrentStep(1);
              setOpenCreate(true);
            }}
            startDecorator={<Add />}
          />
        </Stack>
      </Stack>
      <ExpandableTable
        rows={objectives}
        columns={objHeaders({
          active,
          onUpdate: handleOpenUpdate,
          onDelete: handleOpenDel,
          onViewIndicators: handleViewIndicators,
        })}
        currentPage={pagination?.current_page}
        totalPages={pagination?.last_page}
        onNextPage={() => {
          if (page < pagination?.last_page) setPage(page + 1);
        }}
        onPrevPage={() => {
          if (page > 1) setPage(page - 1);
        }}
        totalRows={pagination?.total}
        stickyFooter
        stripe="even"
        highlightedRowId={highlightedRowId}
        withCount={pagination?.total}
        fieldsToSearch={[
          "function.type",
          "function.code",
          "objective.description",
          "objective.code",
        ]}
        isLoading={isLoading}
        bordered
        stickLast
        hoverRow={false}
      />

      {/* //CREATE MODAL */}
      <ModalComponent
        isOpen={openCreate}
        hasActionButtons
        handleClose={() => {
          clearErrors();
          setNewObj({
            function: null,
            objective: "",
            indicators: ["", "", ""],
          });
          setOpenCreate(false);
        }}
        title={"Create a new objective"}
        minWidth={480}
        description={"Add a new function, objective and its success indicators"}
        leftButtonLabel={currentStep === 1 ? "Cancel" : "Back to previous"}
        leftButtonAction={() =>
          currentStep === 1 ? handleClose() : handleBack()
        }
        rightButtonLabel={currentStep === 1 ? "Next step" : "Confirm and save"}
        isLoading={buttonLoader}
        rightButtonAction={() =>
          currentStep === 2 ? submit() : handleNext("create")
        }
        content={
          <Fragment>
            {currentStep === 1 && (
              <Fragment>
                <Stack gap={2}>
                  <AutocompleteComponent
                    label={"Select a function"}
                    name="function"
                    options={function_types}
                    value={newObj.function}
                    getOptionLabel={(option) => option?.type || ""}
                    handleSelect={(val) =>
                      setNewObj((prev) => ({
                        ...prev,
                        function: val,
                      }))
                    }
                  />

                  <TextareaComponent
                    label={"Objective"}
                    name="objective"
                    value={newObj.objective}
                    onChange={(e) =>
                      setNewObj((prev) => ({
                        ...prev,
                        objective: e.target.value,
                      }))
                    }
                  />
                </Stack>
              </Fragment>
            )}
            {currentStep === 2 && (
              <Fragment>
                <Box
                  overflow="auto"
                  maxHeight={300}
                  ref={indicatorsContainerRef}
                >
                  {newObj.indicators.map((indicator, index) => (
                    <Box
                      key={index}
                      sx={{ my: 2, padding: 1 }}
                      bgcolor={"#F9F9F9"}
                    >
                      <Stack
                        direction="row"
                        sx={{
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                        }}
                      >
                        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                          Success indicator {index + 1}
                        </Typography>
                        {newObj.indicators.length > 1 && (
                          <Link
                            onClick={() => removeIndicator(index, "create")}
                            underline="always"
                            color="danger"
                            fontSize={13}
                          >
                            Remove
                          </Link>
                        )}
                      </Stack>

                      <TextareaComponent
                        isRequired={true}
                        value={indicator}
                        name={`indicator-[${index}]`}
                        onChange={(e) =>
                          handleChangeIndicator(index, e.target.value, "create")
                        }
                      />
                    </Box>
                  ))}
                </Box>
                <Divider sx={{ my: 1 }} />

                <Link
                  onClick={() => addIndicator("create")}
                  fontSize={14}
                  endDecorator={<BiPlus />}
                  underline="always"
                  color="success"
                >
                  Add another
                </Link>
                <Divider sx={{ my: 1 }} />
                <InputComponent
                  type="password"
                  name="pin"
                  label="Authorization pin"
                  helperText={
                    "Confirm your action by typing-in your authorization PIN."
                  }
                  setValue={setPin}
                  value={pin}
                />
              </Fragment>
            )}
          </Fragment>
        }
      />

      {/* //UPDATE MODAL */}
      <ModalComponent
        isOpen={openUpdate}
        hasActionButtons
        handleClose={() => {
          clearErrors();
          setUpdateObj({
            function: null,
            objective: "",
            indicators: [],
          });
          setOpenUpdate(false);
        }}
        title={
          <>
            Update objective{" "}
            <span style={{ color: "#C98503" }}>
              {selected?.objective?.code}
            </span>
          </>
        }
        description={"Keep the objective up-to-date."}
        minWidth={480}
        leftButtonLabel={currentStep === 1 ? "Cancel" : "Back to previous"}
        leftButtonAction={() =>
          currentStep === 1 ? handleClose() : handleBack()
        }
        rightButtonLabel={currentStep === 1 ? "Next step" : "Confirm and save"}
        rightButtonAction={() =>
          currentStep === 2 ? update() : handleNext("update")
        }
        isLoading={buttonLoader}
        content={
          <Fragment>
            {currentStep === 1 && (
              <Fragment>
                <Stack gap={2}>
                  <AutocompleteComponent
                    label={"Select a function"}
                    options={function_types}
                    value={updateObj.function}
                    getOptionLabel={(option) => option?.type || ""}
                    handleSelect={(val) =>
                      setUpdateObj((prev) => ({
                        ...prev,
                        function: val,
                      }))
                    }
                  />

                  <TextareaComponent
                    label={"Objective"}
                    value={updateObj.objective}
                    onChange={(e) =>
                      setUpdateObj((prev) => ({
                        ...prev,
                        objective: e.target.value,
                      }))
                    }
                  />
                </Stack>
              </Fragment>
            )}
            {currentStep === 2 && (
              <Fragment>
                <Box
                  overflow="auto"
                  maxHeight={300}
                  ref={indicatorsContainerRef}
                >
                  {updateObj.indicators.map((indicator, index) => (
                    <Box
                      key={index}
                      sx={{ my: 2, padding: 1 }}
                      bgcolor={"#F9F9F9"}
                    >
                      <Stack
                        direction="row"
                        sx={{
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                        }}
                      >
                        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                          Success indicator {index + 1}
                        </Typography>
                        {updateObj.indicators.length > 1 && (
                          <Link
                            onClick={() => removeIndicator(index, "update")}
                            underline="always"
                            color="danger"
                            fontSize={13}
                          >
                            Remove
                          </Link>
                        )}
                      </Stack>

                      <TextareaComponent
                        isRequired={true}
                        value={indicator.description}
                        name={`indicator-[${index}]`}
                        onChange={(e) =>
                          handleChangeIndicator(index, e.target.value, "update")
                        }
                      />
                    </Box>
                  ))}
                </Box>
                <Divider sx={{ my: 1 }} />

                <Link
                  onClick={() => addIndicator("update")}
                  fontSize={14}
                  endDecorator={<BiPlus />}
                  underline="always"
                  color="success"
                >
                  Add another
                </Link>
                <Divider sx={{ my: 1 }} />
                <InputComponent
                  type="password"
                  label="Authorization pin"
                  helperText={
                    "Confirm your action by typing-in your authorization PIN."
                  }
                  name="pin"
                  setValue={setPin}
                  value={pin}
                />
              </Fragment>
            )}
          </Fragment>
        }
      />

      <ModalComponent
        title={`Showing ${obj?.code}'s Success Indicators`}
        description={obj.description}
        isOpen={isView}
        handleClose={() => {
          setObj({});
          setObjIndicators([]);
          setIsView(false);
        }}
        content={
          <Fragment>
            <TableComponent
              columns={successIndicator}
              data={objIndicators}
              stripe="odd"
              bordered
            />
          </Fragment>
        }
      />

      <ConfirmationModalComponent
        rightButtonAction={() => handleDelete(selected)}
        withAuthPin
        setAuthPin={setPin}
        isLoading={isLoading}
      />

      <AlertDialogComponent />
      {/* <PageLoader isLoading={isLoading} /> */}
    </Fragment>
  );
}

export default ManageObjectives;
