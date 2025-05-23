import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Textarea,
  Tooltip,
  Typography,
} from "@mui/joy";
import { MdInfoOutline } from "react-icons/md";
import useLibrariesHook from "../../../Hooks/Libraries/LibHooks";
import useModalHook from "../../../Hooks/ModalHook";
import useVariantHooks from "../../../Hooks/Libraries/LibVarianHooks";

export const VariantModalContent = () => {
  const {
    inputs,
    setInputs,
    resetInput,
    isloading,
    hasError,
    type,
    setLoading,
    selectedData,
  } = useVariantHooks();
  const { openModal, setOpenModal, setSuccessDialog } = useModalHook();

  const MetaData = {
    create: {
      title: "Create a new Variant",
      desc: "Name your Variant to create it.",
      plholder: "Name the Variant you wish to create",
      action: "Confirm and save",
    },
    update: {
      title: "Update a Variant",
      desc: "Keep the Variant up-to-date",
      plholder: "Name the Variant you wish to update",
      action: "Update and save",
    },
    delete: {
      title: "Archive the Variant",
      action: "Archive and save",
      desc: "This action will archive the Variant.",
    },
  };

  const getStateOfModal = () => MetaData[type];

  return (
    <>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Box>
          <Typography level="title-lg" mr={type === "delete" ? 3 : 0}>
            {getStateOfModal().title}
            {type === "delete" && (
              <>
                {" ("}
                <Typography level="title-lg" textColor={"danger.500"}>
                  {selectedData?.clName}
                </Typography>
                {" )"}
              </>
            )}
          </Typography>
          <Typography level="body-sm" textColor="text.secondary">
            {getStateOfModal().desc}
          </Typography>
        </Box>
      </Box>

      {/* Name input */}
      {type !== "delete" && (
        <>
          <FormControl sx={{ mt: 2 }}>
            <FormLabel>Name of Variant</FormLabel>
            <Input
              placeholder={getStateOfModal().plholder}
              variant="outlined"
              size="md"
              onChange={(e) => setInputs("currentLibName", e.target.value)}
              value={inputs.currentLibName}
            />
            <Typography
              level="body-xs"
              textColor="text.tertiary"
              sx={{ mt: 0.5 }}
            >
              Use a specific and descriptive naming convention for best results.
            </Typography>
          </FormControl>
          <FormControl sx={{ mt: 2 }}>
            <FormLabel>Code</FormLabel>
            <Textarea
              placeholder="Enter unique code identifier"
              variant="outlined"
              size="md"
              minRows={1}
              onChange={(e) => setInputs("currentLibCode", e.target.value)}
              value={inputs.currentLibCode}
              sx={{ minHeight: 60, maxHeight: 120 }}
            />
            <Typography
              level="body-xs"
              textColor="text.tertiary"
              sx={{ mt: 0.5 }}
            >
              Use short, unique codes for easier reference (e.g., CAT001).
            </Typography>
          </FormControl>
        </>
      )}

      {/* Authorization PIN input */}
      <FormControl sx={{ mt: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <FormLabel>Authorization PIN</FormLabel>
          <Tooltip title="Used to confirm sensitive actions.">
            <IconButton size="sm" variant="plain" color="neutral">
              <MdInfoOutline />
            </IconButton>
          </Tooltip>
        </Box>
        <Input
          placeholder="******"
          type="password"
          variant="outlined"
          size="md"
          error={hasError}
          sx={{
            ...(hasError && {
              animation:
                "errorFlashBounce 0.8s ease-out, errorIdleGlow 1.5s ease-in-out 0.8s infinite",
              borderColor: "danger.400",
            }),
          }}
        />
        <Typography
          level="body-xs"
          textColor={hasError ? "danger.500" : "text.tertiary"}
          sx={{ mt: 0.5 }}
        >
          {hasError
            ? "Invalid PIN. Please try again."
            : "Confirm your action by typing-in your authorization PIN."}
        </Typography>
      </FormControl>

      {/* Buttons */}
      <Box sx={{ display: "flex", gap: 1.5, mt: 4 }}>
        <Button
          onClick={() => {
            setOpenModal(false, false, false);
          }}
          variant="outlined"
          color="neutral"
          disabled={isloading}
          sx={{ flex: 1 }}
        >
          Cancel
        </Button>
        <Button
          sx={{ flex: 1 }}
          onClick={() => setSuccessDialog(true)}
          variant="solid"
          color={type === "delete" ? "danger" : "primary"}
          disabled={isloading}
          startDecorator={
            isloading && (
              <Box
                component="span"
                sx={{
                  width: 16,
                  height: 16,
                  border: "2px solid",
                  borderColor: "primary",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 1.5s linear infinite",
                }}
              />
            )
          }
        >
          {isloading ? "Saving..." : getStateOfModal().action}
        </Button>
      </Box>
    </>
  );
};
