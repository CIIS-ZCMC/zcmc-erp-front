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

function Objectives({ props }) {
  const {
    objectives,
    pagination,
    navLinks,
    getObjectives,
    removeObj,
    postObjective,
    updateObjective,
  } = useManageObjHook();
  const { function_types, getFunctionType } = useFunctionTypeHook();
  const { setAlertDialog, setConfirmationModal, closeConfirmation } =
    useModalHook();
  const [searchTerm, setSearchTerm] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isView, setIsView] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [obj, setObj] = useState({});
  const [objIndicators, setObjIndicators] = useState([]);
  const [pin, setPin] = useState(null);
  const [selected, setSelected] = useState({});
  const [newObj, setNewObj] = useState({
    function: null,
    objective: "",
    indicators: ["", "", ""],
  });
  const indicatorsContainerRef = useRef(null);

  //PAGINATION
  // Extract these for cleaner access
  const totalPages = pagination?.last_page || 1;

  const addIndicator = () => {
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
  };

  const removeIndicator = (index) => {
    setNewObj((prev) => ({
      ...prev,
      indicators:
        prev.indicators.length > 1
          ? prev.indicators.filter((_, i) => i !== index)
          : prev.indicators,
    }));
  };

  const handleChangeIndicator = (index, value) => {
    setNewObj((prev) => {
      const newIndicators = [...prev.indicators];
      newIndicators[index] = value;
      return { ...prev, indicators: newIndicators };
    });
  };

  // HANDLE MODAL NEXT
  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
    // setIsLoading(false); // STOP LOADING
  };

  // HANDLE MODAL NEXT
  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleClose = () => {
    setOpenCreate(false);
    setCurrentStep(1);
  };

  const handleOpenUpdate = (row) => {
    console.log(row);
    setCurrentStep(1);
    setSelected(row);
    setNewObj({
      function: row.function,
      objective: row.objective.description,
      indicators: row.success_indicator.map((item) => item.description),
    });
    setOpenUpdate(true);
  };

  const handleOpenDel = (row) => {
    const data = {
      status: "error",
      title: ` Are you sure you want to delete objective ${row?.objective?.code}`,
      description:
        "The selected objective will be removed from the table. Please input authorization pin to proceed",
    };
    setSelected(row);
    setConfirmationModal(data);
  };

  const handleDelete = async (row) => {
    const formData = new FormData();
    formData.append("pin", pin);
    await removeObj(row.id, formData, (status, message, data) => {
      //return data then save sa localstorage
      setIsLoading(true);
      if (status === 200) {
        const data = {
          status: "success",
          title: message,
          description: message,
        };
        fetchAll();
        setSelected({});
        setIsLoading(false);
        setAlertDialog(data);
      } else {
        const data = {
          status: "error",
          title: message,
          description: message,
        };
        setIsLoading(false);
        setAlertDialog(data);
      }
    });
  };

  const fetchAll = async () => {
    const wrap = (fn) => new Promise((resolve) => fn(() => resolve()));

    try {
      await Promise.all([
        wrap(getObjectives(currentPage)),
        wrap((done) => getFunctionType({ mode: "selection" }, done)),
      ]);
    } catch (err) {
      console.error("Fetching error:", err);
    }
  };

  const handleViewIndicators = (row) => {
    setObj(row.objective);
    setObjIndicators(row.success_indicator);
    setIsView(true);
  };
  //UPDATE

  const update = async () => {
    const formData = new FormData();
    formData.append("id", selected.id);
    formData.append("function", JSON.stringify(newObj.function));
    formData.append("objective", newObj.objective);
    formData.append("indicators", JSON.stringify(newObj.indicators));

    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`);
    // }

    await updateObjective(formData, (status, message, data) => {
      if (status === 201) {
        const data = {
          status: "success",
          title: message,
          description: message,
        };

        setOpenUpdate(false);
        setNewObj({
          function: null,
          objective: "",
          indicators: ["", "", ""],
        });
        setAlertDialog(data);
      } else {
        const data = {
          status: "error",
          title: message,
          description: message,
        };

        setAlertDialog(data);
      }
    });
  };

  const submit = async () => {
    const formData = new FormData();
    if (openUpdate) {
      formData.append("id", selected.id);
    }
    formData.append("function", JSON.stringify(newObj.function));
    formData.append("objective", newObj.objective);
    formData.append("indicators", JSON.stringify(newObj.indicators));

    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`);
    // }

    await postObjective(formData, (status, message, data) => {
      if (status === 201) {
        const data = {
          status: "success",
          title: message,
          description: message,
        };
        setOpenCreate(false);
        setNewObj({
          function: null,
          objective: "",
          indicators: ["", "", ""],
        });
        setAlertDialog(data);
      } else {
        const data = {
          status: "error",
          title: message,
          description: message,
        };

        setAlertDialog(data);
      }
    });
  };

  useEffect(() => {
    fetchAll();
  }, [currentPage]);
  return (
    <Fragment>
      <PageTitle
        title="Objectives and Success Indicators"
        description="This is a subheading. It should add more context to the interaction."
      />

      <ContainerComponent
        title={"List of Objectives and Success Indicators"}
        description={
          "This is a subheading. It should add more context to the interaction."
        }
        actions={
          <ButtonComponent
            label="Create new"
            color="primary"
            onClick={() => {
              setCurrentStep(1);
              setOpenCreate(true);
            }}
          />
        }
        isTable={true}
        sx={{ mt: 3 }}
      >
        <Stack gap={1} mb={2}>
          <InputComponent
            label="Search"
            width="auto"
            value={searchTerm}
            setValue={setSearchTerm}
          />
        </Stack>
        <ServerTableComponent
          data={objectives}
          columns={objHeaders({
            onUpdate: handleOpenUpdate,
            onDelete: handleOpenDel,
            onViewIndicators: handleViewIndicators,
          })}
          pageSize={pagination?.per_page}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          paginationMeta={pagination}
          stripe="even"
          withCount={pagination?.total}
          fieldsToSearch={["title", "description"]}
          search={""}
          bordered
          hoverRow
          stickLast
        />
      </ContainerComponent>
      <ModalComponent
        isOpen={openCreate}
        hasActionButtons
        handleClose={() => {
          setNewObj({
            function: null,
            objective: "",
            indicators: ["", "", ""],
          });
          setOpenCreate(false);
        }}
        title={"Create a new objective"}
        description={"Add a new function, objective and its success indicators"}
        leftButtonLabel={currentStep === 1 ? "Cancel" : "Back to previous"}
        leftButtonAction={currentStep === 1 ? handleClose : handleBack}
        rightButtonLabel={currentStep === 1 ? "Next step" : "Confirm and save"}
        rightButtonAction={currentStep === 2 ? submit : handleNext}
        content={
          <Fragment>
            {currentStep === 1 && (
              <Fragment>
                <Stack gap={2}>
                  <AutocompleteComponent
                    label={"Select a function"}
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
                            onClick={() => removeIndicator(index)}
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
                        onChange={(e) =>
                          handleChangeIndicator(index, e.target.value)
                        }
                      />
                    </Box>
                  ))}
                </Box>
                <Divider sx={{ my: 1 }} />

                <Link
                  onClick={addIndicator}
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
          setNewObj({
            function: null,
            objective: "",
            indicators: ["", "", ""],
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
        leftButtonLabel={currentStep === 1 ? "Cancel" : "Back to previous"}
        leftButtonAction={currentStep === 1 ? handleClose : handleBack}
        rightButtonLabel={currentStep === 1 ? "Next step" : "Confirm and save"}
        rightButtonAction={currentStep === 2 ? update : handleNext}
        content={
          <Fragment>
            {currentStep === 1 && (
              <Fragment>
                <Stack gap={2}>
                  <AutocompleteComponent
                    label={"Select a function"}
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
                            onClick={() => removeIndicator(index)}
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
                        onChange={(e) =>
                          handleChangeIndicator(index, e.target.value)
                        }
                      />
                    </Box>
                  ))}
                </Box>
                <Divider sx={{ my: 1 }} />

                <Link
                  onClick={addIndicator}
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
      />
      <AlertDialogComponent />
      <PageLoader isLoading={isLoading} />
    </Fragment>
  );
}

export default Objectives;
