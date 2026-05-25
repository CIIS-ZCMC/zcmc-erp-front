import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  IconButton,
} from "@mui/joy";
import { Fragment } from "react";
import useUserHook from "../Hooks/UserHook";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
export default function AuthorizationPinComponent({ setIsAuthorized, setPin }) {
  const { getAuthorized } = useUserHook();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Fragment>
      <FormControl sx={{ mt: "20px" }}>
        <FormLabel>Authorization PIN</FormLabel>
        <Input
          type={showPassword ? "text" : "password"}
          onChange={(e) => {
            setPin(e.target.value);
            // getAuthorized(e.target.value, (res) => {
            //   setIsAuthorized(res);
            // });
          }}
          endDecorator={
            <IconButton
              variant="plain"
              color="neutral"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <VisibilityOutlined />
              ) : (
                <VisibilityOffOutlined />
              )}
            </IconButton>
          }
        />
      </FormControl>
      <FormHelperText sx={{ fontSize: "12px" }}>
        Confirm your action by typing-in your authorization PIN.
      </FormHelperText>
    </Fragment>
  );
}
