import React, { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import ButtonComponent from "@Components/Common/ButtonComponent";

import ObjectivesLogo from "../../../../assets/dashboard/Objectives.svg";

import StatusCard from "./StatusCard";

const ObjectivesCard = ({
  hasFunction = false,
  objectiveCount,
  handleNavigate,
  height,
  successIndicatorCount,
}) => {
  return (
    <>
      <StatusCard
        hasFunction={hasFunction}
        logo={ObjectivesLogo}
        count={objectiveCount}
        title={"objectives"}
        description={`Contains (${successIndicatorCount}) success indicators in total on this request`}
        functionHandler={
          <ButtonComponent
            label={"Go to Objectives"}
            size={"sm"}
            onClick={hasFunction ? handleNavigate : null}
            endDecorator={<ArrowRight />}
            fullWidth={true}
          />
        }
      />
    </>
  );
};

export default ObjectivesCard;
