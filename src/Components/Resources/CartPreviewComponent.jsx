import BoxComponent from "@Components/Common/Card/BoxComponent";
import { Grid, Stack, Typography } from "@mui/joy";
import React, { Fragment } from "react";

export default function CartPreviewComponent() {
  return (
    <Fragment>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={6}>
          <BoxComponent>
            <Typography>Sample</Typography>
          </BoxComponent>
        </Grid>
        <Grid>
          <BoxComponent>
            <Typography>Sample 2</Typography>
          </BoxComponent>
        </Grid>
      </Grid>
    </Fragment>
  );
}
