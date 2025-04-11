import React, { Fragment, useState } from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { BiPlus } from "react-icons/bi";
import { Autocomplete, Divider, Stack, Typography } from "@mui/joy";
import ScrollableEditableTableComponent from "../../../Components/Common/Table/ScrollableEditableTable";
import { ppmpHeaders } from "../../../Data/Columns";
import ModalComponent from "../../../Components/Common/Dialog/ModalComponent";
import AutocompleteComponent from "../../../Components/Form/AutocompleteComponent";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function EditPPMP({ props }) {
  return (
    <Fragment>
      <PageTitle
        title={"Edit PPMP"}
        description={"Edit you unit's Project Procurement Management Plan"}
      />
      <Fragment>
        <Outlet />
      </Fragment>
    </Fragment>
  );
}

export default EditPPMP;
