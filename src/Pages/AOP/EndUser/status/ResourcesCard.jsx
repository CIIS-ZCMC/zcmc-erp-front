import React, { useEffect, useState } from "react";

import ResourcesLogo from "../../../../assets/dashboard/Resources.svg";

import StatusCard from "./StatusCard";
import formattedPrice from "../../../../Utils/formattedPrice";
import { Select } from "@mui/joy";
import AutocompleteComponent from "@Components/Form/AutocompleteComponent";
import { FileDownload, FileDownloadOutlined } from "@mui/icons-material";
import usePurchaseTypeHook from "@Hooks/PurchaseTypeHook";
import useAOPHook from "@Hooks/AOP/AOPHook";
import useSnackbarHook from "@Hooks/SnackbarHook";

const ResourcesCard = ({
  resourcesCount,
  totalCost,
  aop,
  hasFunction = false,
}) => {
  const formattedCost = formattedPrice(totalCost);
  const { getPurchaseType, purchase_types } = usePurchaseTypeHook();
  const { updateAOP, exportAOP } = useAOPHook();
  const { showSnack } = useSnackbarHook();

  const [selectedPurchaseType, setSelectedPurchaseType] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportResources = (purchaseType) => {
    if (!purchaseType) return;

    setSelectedPurchaseType(purchaseType);
    setIsExporting(true);

    const callback = (status, message) => {
      if (status === 200) {
        // Success - show success message
        showSnack(status, message);
      } else {
        // Error - show error message
        showSnack(status, message);
      }
      setIsExporting(false);
    };

    if (purchaseType.id === 0) {
      // Export all resources
      exportAOP(callback, aop);
    } else {
      // Export filtered resources
      exportAOP(callback, aop, {
        purchase_type: purchaseType.id,
      });
    }
  };

  const purchaseTypeOptions = [
    {
      id: 0,
      description: "All",
    },
    ...purchase_types,
  ];
  useEffect(() => {
    getPurchaseType((status, message) => {
      if (status !== 200) {
        console.error("Failed to fetch purchase types:", message);
      }
    });
  }, []);

  return (
    <>
      <StatusCard
        logo={ResourcesLogo}
        title={"resources"}
        count={resourcesCount}
        description={`With (${formattedCost}) total allocated budget`}
        hasFunction={hasFunction}
        functionHandler={
          <>
            <AutocompleteComponent
              placeholder={"Export Resources"}
              size="md"
              startDecorator={<FileDownloadOutlined color="primary" />}
              color="primary"
              options={purchaseTypeOptions}
              value={selectedPurchaseType}
              handleSelect={handleExportResources}
              getOptionLabel={(opt) => opt?.description || ""}
              disabled={isExporting}
            />
          </>
        }
      />
    </>
  );
};

export default ResourcesCard;
