import React, { useEffect } from "react";

import PageTitle from "@Components/Common/PageTitle";

import { RESPONSIBLE } from "../../../../Data/constants";
import useAOPBreadcrumbs from "../../../../Hooks/AOP/AOPBreadcrumbs";

const ResponsibleTitle = ({ activity, objectiveId }) => {
  const { PAGE_TITLE, PAGE_DESCRIPTION } = RESPONSIBLE;

  const { application_objective_id } = activity || {};

  const breadcrumbs = useAOPBreadcrumbs();

  // useEffect(() => {
  //   console.log(application_objective_id);
  // }, [activity]);

  return (
    <>
      <PageTitle
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        items={breadcrumbs}
        withArrowBack
        backTo={`/aop/activities/${objectiveId}`}
      />
    </>
  );
};

export default ResponsibleTitle;
