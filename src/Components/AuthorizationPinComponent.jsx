import React from "react";
import { FormControl, FormLabel, FormHelperText, Input } from "@mui/joy";
import { Fragment } from "react";
import useUserHook from "../Hooks/UserHook";
export default function AuthorizationPinComponent({ setIsAuthorized }) {
  const { getAuthorized } = useUserHook();
  return (
    <Fragment>
      <FormControl sx={{ mt: "20px" }}>
        <FormLabel>Authorization PIN</FormLabel>
        <Input
          type="password"
          onChange={(e) => {
            getAuthorized(e.target.value, (res) => {
              setIsAuthorized(res);
            });
          }}
        />
      </FormControl>
      <FormHelperText sx={{ fontSize: "12px" }}>
        Confirm your action by typing-in your authorization PIN.
      </FormHelperText>
    </Fragment>
  );
}
