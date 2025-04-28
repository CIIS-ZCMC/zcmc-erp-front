import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import PageTitle from "../../../Components/Common/PageTitle";
import { AOP_CONSTANTS } from "../../../Data/constants";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import { Grid, Stack } from "@mui/joy";
import InputComponent from "../../../Components/Form/InputComponent";
import DatePickerComponent from "../../../Components/Form/DatePickerComponent";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useAOPApplications,
  useAOPApplicationsActions,
} from "../../../Hooks/AOP/AOPApplicationsHook";
import AOPCardComponent from "../../../Components/Common/Card/AOPCardComponent";
import { toCapitalize } from "../../../Utils/Typography";
const AOPApproval = () => {
  // HOOKS
  const { getAOPApplications, getAOPApplicationById } =
    useAOPApplicationsActions();

  const AOPApplications = useAOPApplications();

  const navigate = useNavigate();

  const handleClickCard = (id) => {
    getAOPApplicationById(id, () => navigate(`/aop-approval/objectives/${id}`));
  };

  useEffect(() => {
    getAOPApplications(() => {});
  }, []);

  return (
    <Fragment>
      <Stack gap={3}>
        <PageTitle
          title={AOP_CONSTANTS?.AOP_TITLE}
          description={AOP_CONSTANTS?.AOP_SUBHEADING}
        />

        <ContainerComponent
          title={"List of AOP requests"}
          description={
            "This is a subheading. It should add more context to the interaction."
          }
        >
          <Stack gap={3}>
            Tab component
            <Stack direction={"row"} justifyContent={"space-between"}>
              <InputComponent
                label={"Search"}
                width={400}
                startDecorator={<Search size={14} />}
              />

              <div>
                <DatePickerComponent label={"Select year"} />
              </div>
            </Stack>
            {/* LIST */}
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ sm: 4, md: 8, xl: 12 }}
              sx={{
                flexGrow: 1,
                minHeight: "40vh",
                maxHeight: "60vh",
                overflow: "auto",
              }}
            >
              {AOPApplications?.map(
                ({ id, created_on, date_approved, status }, index) => (
                  <Grid key={index} item="true" xs={4}>
                    <AOPCardComponent
                      date_requested={created_on}
                      date_approved={date_approved}
                      status={status}
                      statusLabel={toCapitalize(status)}
                      onClick={() => handleClickCard(id)}
                    />
                  </Grid>
                )
              )}
            </Grid>
          </Stack>
        </ContainerComponent>
      </Stack>
    </Fragment>
  );
};

AOPApproval.propTypes = {};

export default AOPApproval;
