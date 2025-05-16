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

function Objectives({ props }) {
  const { objectives, getObjectives, removeObj } = useManageObjHook();
  const { setAlertDialog } = useModalHook();
  const [openCreate, setOpenCreate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isView, setIsView] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [indicators, setIndicators] = useState(["", "", ""]);
  const [obj, setObj] = useState({});
  const [objIndicators, setObjIndicators] = useState([]);
  const [pin, setPin] = useState(null);
  const indicatorsContainerRef = useRef(null);

  const addIndicator = () => {
    setIndicators((prevIndicators) => {
      const newIndicators = [...prevIndicators, ""];
      setTimeout(() => {
        if (indicatorsContainerRef.current) {
          indicatorsContainerRef.current.lastElementChild.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }
      }, 100); // Delay to allow the DOM to update
      return newIndicators;
    });
  };

  const removeIndicator = (index) => {
    if (indicators.length > 1) {
      setIndicators(indicators.filter((_, i) => i !== index));
    }
  };

  const handleChangeIndicator = (index, value) => {
    setIndicators((prevIndicators) => {
      const newIndicators = [...prevIndicators];
      newIndicators[index] = value; // Update the specific field
      return newIndicators;
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

  const handlePinInput = (value) => {
    setPin(value);
  };

  const handleUpdate = (row) => {
    console.log("Update clicked:", row);
  };

  const handleDelete = async (row) => {
    await removeObj(row.id, (status, message, data) => {
      //return data then save sa localstorage
      setIsLoading(true);
      if (status === 201) {
        const data = {
          status: "success",
          title: message,
          description: message,
        };
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

  const handleViewIndicators = (row) => {
    setObj(row.objective);
    setObjIndicators(row.success_indicator);
    setIsView(true);
  };

  const submit = () => {};

  useEffect(() => {
    async function fetchAll() {
      // Step 2: Wrap callbacks in Promises for async/await
      const wrap = (fn) => new Promise((resolve) => fn(() => resolve()));

      try {
        // Step 3: Fetch all other needed data
        await Promise.all([wrap(getObjectives)]);
      } catch (err) {
        console.error("Fetching error:", err);
      }
    }

    fetchAll();
  }, []);
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
            color="success"
            onClick={() => setOpenCreate(true)}
          />
        }
        isTable={true}
        sx={{ mt: 3 }}
      >
        {console.log(objectives)}
        <ScrollableTableComponent
          data={objectives}
          columns={objHeaders({
            onUpdate: handleUpdate,
            onDelete: handleDelete,
            onViewIndicators: handleViewIndicators,
          })}
          pageSize={5}
          stripe="even"
          bordered
          hoverRow
          isLoading={false}
          stickLast
        />
      </ContainerComponent>
      <ModalComponent
        isOpen={openCreate}
        handleClose={() => setOpenCreate(false)}
        title={"Create a new objective"}
        description={"Add a new function, objective and its success indicators"}
        leftButtonLabel={currentStep === 1 ? "Cancel" : "Back to previous"}
        leftButtonAction={currentStep === 1 ? handleClose : handleBack}
        rightButtonLabel={currentStep === 1 ? "Next step" : "Confirm and save"}
        rightButtonAction={currentStep === 2 ? handleClose : handleNext}
        content={
          <Fragment>
            {currentStep === 1 && (
              <Fragment>
                <Stack gap={2}>
                  <AutocompleteComponent label={"Select a function"} />
                  <TextareaComponent label={"Objective"} />
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
                  {indicators.map((indicator, index) => (
                    <Box
                      key={index}
                      sx={{ mt: 2, padding: 1 }}
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
                        {indicators.length > 1 && (
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
                        handleInput={(e) =>
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
                  setValue={handlePinInput}
                  value={pin}
                />
              </Fragment>
            )}
          </Fragment>
        }
      />
      <ModalComponent
        title={`Showing ${obj.code}'s Success Indicators`}
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
      <AlertDialogComponent />
      <PageLoader isLoading={isLoading} />
    </Fragment>
  );
}

export default Objectives;
