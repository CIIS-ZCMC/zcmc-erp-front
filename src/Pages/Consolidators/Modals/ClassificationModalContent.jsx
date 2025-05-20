import { Box, Button, FormControl, FormLabel, IconButton, Input, Textarea, Tooltip, Typography } from "@mui/joy";
import React from "react";
import { MdInfoOutline } from "react-icons/md";
import useclassificationHook from "../../../Hooks/Libraries/LibclassificationHook";
import useModalHook from "../../../Hooks/ModalHook";

export const ClassificationModalContent = () => {
  const {inputs, setInputs, resetInput } = useclassificationHook();
  const { openModal, setOpenModal,setSuccessDialog } = useModalHook();
  return  (
    <>
     {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box>
          <Typography level="title-lg">Create a new classification</Typography>
          <Typography level="body-sm" textColor="text.secondary">
            Name your classification to create it.
          </Typography>
        </Box>
      </Box>

      {/* Name input */}
      <FormControl sx={{ mt: 2 }}>
        <FormLabel>Name of classification</FormLabel>
        <Textarea
          placeholder="Name the classification you wish to create"
          variant="outlined"
          size="md"
          minRows={2}
          onChange={(e) => setInputs("classificationName", e.target.value)}
          value={inputs.classificationName}
          sx={{ minHeight: 100, maxHeight: 200 }}
        />
        <Typography level="body-xs" textColor="text.tertiary" sx={{ mt: 0.5 }}>
          Use a specific and descriptive naming convention for best results.
        </Typography>
      </FormControl>

      {/* Authorization PIN input */}
      <FormControl sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        />
        <Typography level="body-xs" textColor="text.tertiary" sx={{ mt: 0.5 }}>
          Confirm your action by typing-in your authorization PIN.
        </Typography>
      </FormControl>

      {/* Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 4 }}>
        <Button onClick={()=>{
          setOpenModal(false, true, true);
        }} variant="outlined" color="neutral">
          Cancel
        </Button>
        <Button onClick={()=>{setSuccessDialog(true)}} variant="solid" color="primary">
          Confirm and save
        </Button>
    </Box>
    </>
     );
};
