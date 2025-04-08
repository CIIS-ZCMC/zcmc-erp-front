import React, { Fragment, useRef, useState } from "react";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import PageTitle from "../../../Components/Common/PageTitle";
import { objHeaders } from "../../../Data/Columns";
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

function Objectives({ props }) {
  const [openCreate, setOpenCreate] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [indicators, setIndicators] = useState(["", "", ""]);
  const [pin, setPin] = useState(null);
  const indicatorsContainerRef = useRef(null);

  const data = [
    {
      id: 1,
      function: "Alice Johnson",
      objective: "alice@example.com",
      role: "Admin",
    },
    { id: 2, name: "Bob Smith", objective: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "Editor",
    },
    {
      id: 4,
      name: "Diana Prince",
      objective: "diana@example.com",
      role: "User",
    },
    {
      id: 5,
      name: "Ethan Hunt",
      objective: "ethan@example.com",
      role: "Moderator",
    },
    {
      id: 6,
      name: "Fiona Gallagher",
      objective: "fiona@example.com",
      role: "User",
    },
    {
      id: 7,
      name: "George Bailey",
      objective: "george@example.com",
      role: "Admin",
    },
    {
      id: 8,
      name: "Hannah Montana",
      objective: "hannah@example.com",
      role: "Editor",
    },
    { id: 9, name: "Ian Curtis", objective: "ian@example.com", role: "User" },
    { id: 10, name: "Jane Doe", objective: "jane@example.com", role: "User" },
  ];

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

  const submit = () => { };
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
        <ScrollableTableComponent
          data={data}
          columns={objHeaders}
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
    </Fragment>
  );
}

export default Objectives;
