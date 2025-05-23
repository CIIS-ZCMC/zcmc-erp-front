import { Fragment } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Stack, Box, useTheme } from "@mui/joy";
import { ExternalLink } from "lucide-react";

import Header from "../../../Layout/Header";

import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import SearchBarComponent from "../../../Components/SearchBarComponent";
import DatePickerComponent from "../../../Components/Form/DatePickerComponent";
import PageTitle from "../../../Components/Common/PageTitle";
import BoxComponent from "../../../Components/Common/Card/BoxComponent";

import { AOP_CONSTANTS } from "../../../Data/constants";
import { AOPPathMap } from "../../../Data";

const AnnualOps = () => {
  // const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const parentRoute = currentPath === "/aop/all";

  return (
    <Fragment>
      {parentRoute && (
        <Fragment>
          <ContainerComponent
          // title={AOP_CONSTANTS.TABLE_TITLE}
          // description={AOP_CONSTANTS.TABLE_SUBHEADING}
          // sx={{ mt: 3 }}
          >

            <Stack
              direction={"row"}
              justifyContent={'center'}
              alignItems={'center'}
              gap={2}
            >
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
                onClick={() => navigate("/aop-create")}
              />
            </Stack>

          </ContainerComponent>

          <Box
            marginTop={2}
          >
            <BoxComponent
              height={'70vh'}
            >

            </BoxComponent>

          </Box>

        </Fragment>
      )}
      <Outlet></Outlet>
    </Fragment>
  );
};

export default AnnualOps;
