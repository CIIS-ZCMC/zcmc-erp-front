import React, { Fragment } from "react";
import PropTypes from "prop-types";
import PageTitle from "../../../Components/Common/PageTitle";
import { AOP_CONSTANTS } from "../../../Data/constants";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import { Grid, Stack } from "@mui/joy";
import InputComponent from "../../../Components/Form/InputComponent";
import DatePickerComponent from "../../../Components/Form/DatePickerComponent";
import { Search } from "lucide-react";
import CardComponent from "../../../Components/Common/Card/CardComponent";
import { useNavigate } from "react-router-dom";

const AOPApproval = () => {
  const navigate = useNavigate();

  const handleClickCard = (id) => {
    navigate(`/aop-approval/objectives/${id}`);
  };

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
              spacing={{ xs: 2, md: 4 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
              sx={{
                flexGrow: 1,
                minHeight: "40vh",
                maxHeight: "60vh",
                overflow: "auto",
              }}
            >
              {Array(9)
                .fill(null)
                .map((_, index) => (
                  <Grid
                    key={index}
                    item="true"
                    xs={12} // Full width on extra small screens
                    sm={6} // 2 items on small screens
                    md={4} // 3 items on medium screens
                  >
                    <CardComponent onClick={() => handleClickCard(index)} />
                  </Grid>
                ))}
            </Grid>
          </Stack>
        </ContainerComponent>
      </Stack>
    </Fragment>
  );
};

AOPApproval.propTypes = {};

export default AOPApproval;
