import React, { useState } from "react";
import {
  Typography,
  Divider,
  Grid,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  FormHelperText,
  Autocomplete,
  Card,
  Box,
  Select,
  Option,
  Button,
  Stack,
} from "@mui/joy";
import { Fragment } from "react";
import AuthorizationPinComponent from "../../../Components/AuthorizationPinComponent";
export const ItemModalContent = () => {
  const [step, setStep] = useState(1);
  const Step1 = () => {
    return (
      <Fragment>
        <Typography level="body-lg" fontWeight={"bold"}>
          General information
        </Typography>
        <Typography level="body-md">
          Fill-in basic identification of the item you wish to add to the item
          library.
        </Typography>

        <Divider sx={{ marginTop: "20px" }} />
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <FormControl>
              <FormLabel>Item name</FormLabel>
              <Textarea minRows={2} />
              <FormHelperText>
                Use a specific and descriptive naming conventions for best
                results.
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl>
              <FormLabel>Classification</FormLabel>
              <Autocomplete
                required
                freeSolo
                disableClearable
                options={[]}
                onChange={(e, value) => {}}
                onInputChange={(e, value) => {}}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="classification" // this ensures FormData captures it
                    label="Classification"
                    required
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl>
              <FormLabel>Category</FormLabel>
              <Autocomplete
                required
                freeSolo
                disableClearable
                options={[]}
                onChange={(e, value) => {}}
                onInputChange={(e, value) => {}}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="classification" // this ensures FormData captures it
                    label="Classification"
                    required
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box>
              <FormLabel sx={{ mb: 1 }}>Variants</FormLabel>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Card>Low-end</Card>
                </Grid>
                <Grid item xs={4}>
                  <Card>Mid-range</Card>
                </Grid>
                <Grid item xs={4}>
                  <Card>High-end</Card>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <FormLabel sx={{ mb: 1 }}>Unit of measurement</FormLabel>
            <Select placeholder="Click here to select one">
              <Option value="dog">Dog</Option>
              <Option value="cat">Cat</Option>
              <Option value="fish">Fish</Option>
              <Option value="bird">Bird</Option>
            </Select>
          </Grid>

          <Grid item xs={6}>
            <FormLabel sx={{ mb: 1 }}>Estimated Budget</FormLabel>
            <Input type="number" placeholder="PHP 0.00" />
          </Grid>
          {/* */}
        </Grid>
      </Fragment>
    );
  };

  const Step2 = () => {
    return (
      <Fragment>
        <Typography level="body-lg" fontWeight={"bold"}>
          Specifications
        </Typography>
        <Typography level="body-md">
          List down details for the item you want to create to specify it.
        </Typography>

        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <FormControl>
              <FormLabel>Selected Item</FormLabel>
              <FormHelperText>
                Use a specific and descriptive naming conventions for best
                results.
              </FormHelperText>
            </FormControl>
            <Divider sx={{ marginTop: "20px", marginBottom: "10px" }} />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ maxHeight: "200px", overflowY: "scroll" }}>
              {/* MULTI SPECIFICATIONS ITEMS */}
              <FormControl sx={{ mb: 2 }}>
                <FormLabel>Specification 1</FormLabel>
                <Textarea minRows={2} />
              </FormControl>
              {/* MULTI SPECIFICATIONS ITEMS */}
            </Box>
            <Divider sx={{ marginTop: "20px", marginBottom: "10px" }} />
            <Button
              variant="soft"
              sx={{ fontWeight: "normal", fontSize: "13px" }}
            >
              Add another
            </Button>
            <AuthorizationPinComponent />
          </Grid>
        </Grid>
      </Fragment>
    );
  };
  return (
    <Fragment>
      {step == 0 ? <Step1 /> : step == 1 ? <Step2 /> : ""}
      <Divider sx={{ marginTop: "20px", marginBottom: "10px" }} />

      <Stack direction="row" spacing={1}>
        <Button fullWidth variant="outlined" sx={{ fontWeight: "normal" }}>
          Cancel
        </Button>
        <Button fullWidth sx={{ fontWeight: "normal" }}>
          Next Step
        </Button>
      </Stack>
    </Fragment>
  );
};
