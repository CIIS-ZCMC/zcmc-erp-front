import React from "react";
import { FormControl, FormLabel, FormHelperText, Input } from "@mui/joy";
import { Fragment } from "react";
export default function AuthorizationPinComponent() {
  return (
    <Fragment>
      <FormControl sx={{ mt: "20px" }}>
        <FormLabel>Authorization PIN</FormLabel>
        <Input type="password" />
      </FormControl>
      <FormHelperText sx={{ fontSize: "12px" }}>
        Confirm your action by typing-in your authorization PIN.
      </FormHelperText>
    </Fragment>
  );
}
