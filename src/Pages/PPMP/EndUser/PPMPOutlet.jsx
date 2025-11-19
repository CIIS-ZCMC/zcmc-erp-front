import React, { Fragment, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function PPMPOutlet({ props }) {
  return (
    <Fragment>
      <Outlet />
    </Fragment>
  );
}

export default PPMPOutlet;
