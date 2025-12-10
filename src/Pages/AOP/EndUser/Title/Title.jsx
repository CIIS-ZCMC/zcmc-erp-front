import React from "react";

import { Stack, Typography } from "@mui/joy";

import { AOP } from "../../../../Data/constants";
import PageTitle from "@Components/Common/PageTitle";

const Title = () => {
  const { PAGE_TITLE, PAGE_DESCRIPTION } = AOP;

  return <PageTitle title={PAGE_TITLE} description={PAGE_DESCRIPTION} />;
};

export default Title;
