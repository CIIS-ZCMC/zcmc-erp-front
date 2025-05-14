import React from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import { Fragment } from "react";
import { AOP_CONSTANTS } from "../../../Data/constants";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { ExternalLink } from "lucide-react";
import { Stack, Box } from "@mui/joy";
import { Outlet } from "react-router-dom";
const ItemLibrary = () => {
  return (
    <Fragment>
      <PageTitle
        title={AOP_CONSTANTS.LIBRARY_TITLE}
        description={AOP_CONSTANTS.LIBRARY_SUBTITLE}
      />

      <ContainerComponent
        title={AOP_CONSTANTS.TABLE_TITLE}
        description={AOP_CONSTANTS.TABLE_SUBHEADING}
        // sx={{ mt: 3 }}
        actions={
          <Stack direction={"row"} gap={2}>
            <ButtonComponent
              label={"Request new item"}
              variant={"outlined"}
              endDecorator={<ExternalLink />}
              size={"sm"}
            />
            <ButtonComponent
              label={"Create AOP"}
              variant={"solid"}
              size={"sm"}
              onClick={() => {}}
            />
          </Stack>
        }
      >
        {/* 
                <TabsComponent
                    tabs={['View all', 'Pending', 'Returned', 'Approved']}
                    pathMap={AOPPathMap}
                /> */}

        <Box
          sx={{
            mt: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* <SearchBarComponent
            size="md"
            placeholder="Find records by document number, year, items, etc."
          />
          <DatePickerComponent /> */}
        </Box>

        <Outlet />
      </ContainerComponent>
    </Fragment>
  );
};

export default ItemLibrary;
