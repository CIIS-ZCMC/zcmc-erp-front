import { useEffect, useState } from "react";

import {
  Stack,
  Divider,
  Typography,
  Breadcrumbs,
  CardActions,
  Card,
  CardContent,
  Chip,
} from "@mui/joy";

import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";

import { Pencil, Trash, ArrowRight, Check } from "lucide-react";

import BoxComponent from "../../Components/Common/Card/BoxComponent";
import SearchBarComponent from "../../Components/SearchBarComponent";
import ButtonComponent from "../../Components/Common/ButtonComponent";
import IconButtonComponent from "@Components/Common/IconButtonComponent";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import ObjectivesModal from "./modal/ObjectivesModal";
import ChipComponent from "@Components/Common/ChipComponent";

import { OBJECTIVES } from "../../Data/constants";

import {
  useFunctionType,
  useObjective,
  useSuccessIndicator,
  useObjectives,
} from "../../Store/ObjectivesStore";

const Objectives = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenObjectivesModal, setIsOpenObjectivesModal] = useState(false);

  const functionType = useFunctionType();
  const objective = useObjective();
  const successIndicator = useSuccessIndicator();
  const objectives = useObjectives();

  const {
    OBJECTIVES_EMPTY_STATE_TITLE,
    OBJECTIVES_CREATE_NEW,
    ADD_OBJECTIVE,
    ADD_OBJECTIVE_SUBHEADING,
    AOP_EMPTY_STATE_TITLE,
    AOP_CREATE_NEW_AOP,
    MANAGE_OBJECTIVES_HEADER,
    MANAGE_OBJECTIVES_SUBHEADER,
  } = OBJECTIVES;

  function handleClick(event) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
  }

  const breadcrumbs = [
    <Typography key="3" sx={{ color: "text.primary" }}>
      Objectives
    </Typography>,
  ];

  const handleOpenObjectivesModal = () => {
    setIsOpenObjectivesModal(true);
  };

  const handleSaveObjectives = () => {
    if (!functionType || !objective || !successIndicator) {
      alert("Please fill all the fields");
      return;
    }

    const payload = {
      functionType,
      objective,
      successIndicator,
    };

    console.log("Submitted data:", payload);
  };

  useEffect(() => {
    console.log(functionType);
    console.log(objective);
    console.log(successIndicator);
    console.log(objectives.length);
  }, [functionType, objective, successIndicator, objectives]);

  return (
    <div>
      <Stack spacing={2}>
        <Stack direction={"row"} alignItems={"center"} alignContent={"start"}>
          <Typography level="h2" fontWeight={700}>
            AOP #2025-0031 for Fiscal Year 2026
          </Typography>

          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>

        <Typography level="body-xs" fontWeight={400}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis
          officiis totam quis atque voluptates similique commodi,
        </Typography>
      </Stack>

      <BoxComponent mt={2} p={2}>
        <Stack direction={"column"} spacing={1}>
          <Typography fontWeight={600}>{MANAGE_OBJECTIVES_HEADER}</Typography>

          <Typography level="body-xs" fontWeight={400}>
            {MANAGE_OBJECTIVES_SUBHEADER}
          </Typography>
        </Stack>

        <Divider sx={{ my: 1 }} />

        <Stack
          direction={"row"}
          spacing={1}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <SearchBarComponent placeholder="search objectives" />

          <ButtonComponent
            onClick={() => handleOpenObjectivesModal()}
            label={"Add an Objective"}
            // endDecorator={<Plus size={16} />}
            // disabled={!show || disabledEditMode(APPLICATION_OBJECTIVE_ID, remarks, comments, disabled)}
          />
        </Stack>
      </BoxComponent>

      {objectives.length === 1 || objectives.length === null ? (
        <>
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            textAlign={"center"}
            my={2}
            height={"65vh"}
          >
            <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
              {OBJECTIVES_EMPTY_STATE_TITLE}
            </Typography>

            <Typography mb={2} sx={{ fontSize: 20, fontWeight: 400 }}>
              {OBJECTIVES_CREATE_NEW}
            </Typography>

            <ButtonComponent
              onClick={() => handleOpenObjectivesModal()}
              label={"Add an Objective"}
              // endDecorator={<Plus size={16} />}
            />
          </Stack>
        </>
      ) : (
        <Stack my={3} direction={"row"} spacing={1}>
          <Card
            sx={{
              textAlign: "center",
              overflow: "auto",
              width: "450px",
              borderLeft: "6px solid #2E7D32",
              borderRadius: "md",
            }}
          >
            <CardContent>
              <Stack
                direction={"row"}
                alignItems={"end"}
                justifyContent={"end"}
              >
                <IconButtonComponent size={"sm"} icon={<Check size={18} />} />

                <IconButtonComponent size={"sm"} icon={<Pencil size={18} />} />

                <IconButtonComponent size={"sm"} icon={<Trash size={18} />} />
              </Stack>

              <Stack
                direction={"row"}
                alignItems={"start"}
                justifyContent={"space-between"}
                gap={5}
              >
                <Stack alignItems={"start"}>
                  <Typography level={"body-sm"} sx={{ flex: 1 }}>
                    Function Type
                  </Typography>

                  <Typography level={"title-lg"} sx={{ flex: 1 }}>
                    Objective Name #1
                  </Typography>
                </Stack>

                <Typography
                  level="body-sm"
                  sx={{
                    flex: 1,
                    // whiteSpace: 'nowrap',
                    // overflow: 'hidden',
                    // textOverflow: 'ellipsis',
                    // maxWidth: '50%',
                  }}
                >
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Veritatis perspiciatis maiores amet atque ducimus expedita
                  tempora Voluptas, illo.
                </Typography>
              </Stack>
            </CardContent>

            <Divider inset="none" />

            <CardActions
              sx={{
                justifyContent: "flex-end",
              }}
            >
              <Stack direction={"column"} alignItems={"center"}>
                <Chip
                  variant="soft"
                  color="primary"
                  size="lg"
                  p={2}
                  startDecorator={10}
                  endDecorator={<ArrowRight size={18} />}
                  onClick={() => alert("You clicked the Joy Chip!")}
                >
                  Activities
                </Chip>
                {/* 
                                <ButtonComponent
                                    variant={'soft'}
                                    color={'primary'}
                                    label={`${10} Activities`}
                                    size={'sm'}
                                    endDecorator={<ArrowRight size={18} />}
                                >
                                    chip
                                </ButtonComponent> */}
              </Stack>
            </CardActions>
          </Card>
        </Stack>
      )}

      <ModalComponent
        isOpen={isOpenObjectivesModal}
        handleClose={() => setIsOpenObjectivesModal(false)}
        title={ADD_OBJECTIVE}
        description={ADD_OBJECTIVE_SUBHEADING}
        content={
          <ObjectivesModal
            functionType={functionType}
            objective={objective}
            successIndicator={successIndicator}
          />
        }
        hasActionButtons={true}
        rightButtonLabel={"Save Objective"}
        rightButtonAction={() => handleSaveObjectives()}
      />
    </div>
  );
};

export default Objectives;
