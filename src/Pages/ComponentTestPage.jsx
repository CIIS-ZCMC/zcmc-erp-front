import React, { Fragment, useState } from "react";
import ModalComponent from "../Components/Common/Dialog/ModalComponent";
import { Button } from "@mui/joy";
import ButtonComponent from "../Components/Common/ButtonComponent";
import { AOP_CONSTANTS } from "../Data/constants";

export default function ComponentTestPage() {
  const [open, setOpen] = useState(false);

  const { AOP_TITLE, AOP_SUBHEADING } = AOP_CONSTANTS;
  return (
    <Fragment>
      {/* Test Modal */}
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <ModalComponent
        isOpen={open}
        handleClose={() => setOpen(false)}
        title={AOP_TITLE}
        description={AOP_SUBHEADING}
        content={<Fragment>This is a content</Fragment>}
      />

      {/* Test Confirmation Modal */}
    </Fragment>
  );
}
