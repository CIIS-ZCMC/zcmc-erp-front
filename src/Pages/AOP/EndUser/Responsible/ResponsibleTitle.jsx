import React from "react";
import PageTitle from "@Components/Common/PageTitle";
import { RESPONSIBLE } from "../../../../Data/constants";
import useAOPBreadcrumbs from "../../../../Hooks/AOP/AOPBreadcrumbs";
import useAOPStore from "@Store/AOPStore";

const ResponsibleTitle = ({ activity, objectiveId }) => {
  const { PAGE_TITLE, PAGE_DESCRIPTION } = RESPONSIBLE;
  const { fiscalYear } = useAOPStore();

  const { application_objective_id } = activity || {};

  const breadcrumbs = useAOPBreadcrumbs();

  return (
    <>
      <PageTitle
        title={PAGE_TITLE + fiscalYear}
        description={PAGE_DESCRIPTION}
        items={breadcrumbs}
        withArrowBack
        backTo={`/aop/activities/${objectiveId}`}
      />
    </>
  );
};

export default ResponsibleTitle;
