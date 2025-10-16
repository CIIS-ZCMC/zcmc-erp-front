import { Fragment } from "react";

import { Grid, Typography, Stack } from "@mui/joy";

import SearchBarComponent from "../../Components/SearchBarComponent";
import BoxComponent from "../../Components/Common/Card/BoxComponent";
import ItemCardComponent from "../../Components/Resources/ItemCardComponent";

const ItemsList = ({
  handleOpenItemDialog
}
) => {
  return (
    <Fragment>
      <BoxComponent maxHeight={"65vh"}>
        <Grid
          container
          spacing={3}
          columns={{ xs: 12, sm: 6, md: 12 }}
          sx={{
            flexGrow: 1,
            width: "auto",
            p: 1,
          }}
        >
          {Array(40)
            .fill(null)
            .map((_, index) => (
              <Grid key={index} item="true" xs={12} sm={2} md={6} lg={4} xl={3}
                sx={{
                  cursor: 'pointer'
                }}
                onClick={handleOpenItemDialog}
              >
                <ItemCardComponent />
              </Grid>
            ))}
        </Grid>
      </BoxComponent>
    </Fragment>
  );
};

export default ItemsList;
