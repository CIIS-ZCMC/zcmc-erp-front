import React, { Fragment, useEffect, useState } from "react";

import { Outlet, useParams, useLocation, useNavigate } from "react-router-dom";
import { Stack } from "@mui/joy";
import { Plus } from "lucide-react";

import EditableTableComponent from "../../../../../../../Components/Common/Table/EditableTableComponent";
import ContainerComponent from "../../../../../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../../../../../Components/Common/ButtonComponent";
import BoxComponent from "../../../../../../../Components/Common/Card/BoxComponent";
import { ThreeDotsLoader } from "../../../../../../../Components/Common/Loading/ThreeDotsLoader";

import ResourcesTable from './ResourcesTable';

import { AOP_CONSTANTS } from "../../../../../../../Data/constants";
import { AOP_RESOURCE_HEADER } from "../../../../../../../Data/Columns";

import useResourceHook from "../../../../../../../Hooks/ResourceHook";
import useItemsHook from "../../../../../../../Hooks/ItemsHook";
import usePurchaseTypeHook from "../../../../../../../Hooks/PurchaseTypeHook";

const Resources = () => {
    const { resources, addResource } = useResourceHook();
    const { items, getItems } = useItemsHook();
    const { purchase_types, getPurchaseType } = usePurchaseTypeHook();

    const navigate = useNavigate();
    const location = useLocation();
    const parentId = location.state?.parentId; // refers to objectiveId as parent
    const objectiveRowId = location.state?.objectiveRowId;

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getItems((status, message, data) => {
            if (status !== 200) {
                console.error("Failed to fetch items:", message);
            }
        });
    }, []);

    useEffect(() => {
        // console.log(resources)
        setIsLoading(true)
        getPurchaseType((status, message) => {
            setIsLoading(false);
            if (!(status >= 200 && status < 300)) {
                // if status not success
                return; //Toast error
            }
        });
    }, [resources]);

    return (
        <Fragment>
            <ContainerComponent
                title={AOP_CONSTANTS.TABLE_RESOURCES_HEADER}
                description={AOP_CONSTANTS.TABLE_RESOURCES_SUBHEADING}
                actions={
                    <Stack>
                        <ButtonComponent
                            onClick={() => navigate(`/aop-management/activities/${location.state.objectiveRowId}/items/${location.state.activityRowId}`, { state: { ...location.state } })}
                            label={"Add Resource"}
                            endDecorator={<Plus size={16} />}
                        />
                    </Stack>
                }
            >
                {/* {isLoading ?
                    <BoxComponent
                        mt={3}
                        height={"65vh"}
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"center"}
                        alignContent={"center"}
                    >
                        <ThreeDotsLoader />
                    </BoxComponent>
                    :
                    <EditableTableComponent
                        columns={AOP_RESOURCE_HEADER}
                        stripe={"odd"}
                        haverRow
                        tableRow={
                            <ResourcesTable
                                rows={resources.filter((item) => item.parentId === parentId)}
                                parentId={parentId}
                                resources={items}
                                purchase_types={purchase_types}
                            />
                        }
                    />
                } */}

                <EditableTableComponent
                    columns={AOP_RESOURCE_HEADER}
                    stripe={"odd"}
                    haverRow
                    tableRow={
                        <ResourcesTable
                            rows={resources.filter((item) => item.parentId === parentId)}
                            parentId={parentId}
                            resources={items}
                            purchase_types={purchase_types}
                        />
                    }
                />

                <Stack
                    mt={2}
                    direction={"flex"}
                    alignItems={"center"}
                    justifyContent={"start"}
                    gap={1}
                >
                    <ButtonComponent
                        label={"Back"}
                        size={"md"}
                        variant={"outlined"}
                        onClick={() => navigate(`/aop-management/activities/${objectiveRowId}`)}
                    />
                </Stack>
            </ContainerComponent>

            <Outlet />
        </Fragment >
    );
};

export default Resources;
