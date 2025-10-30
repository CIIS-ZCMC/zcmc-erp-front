import ButtonComponent from "@Components/Common/ButtonComponent";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import IconButtonComponent from "@Components/Common/IconButtonComponent";
import PageTitle from "@Components/Common/PageTitle";
import useItemsHook from "../../../Hooks/ItemsHook";
import { Divider, Grid, Stack, Typography, useTheme } from "@mui/joy";
import { X } from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";
import ContainerComponent from "@Components/Common/ContainerComponent";
import { useNavigate } from "react-router-dom";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";
import ItemCardComponent from "@Components/Resources/ItemCardComponent";

export default function AddResources() {
  const theme = useTheme();
  const color = theme.palette;
  const navigate = useNavigate();

  const { items, getItems } = useItemsHook();

  const currentYear = new Date().getFullYear();
  const currentFiscalYear = currentYear + 1;

  const [displayLoading, setDisplayLoading] = useState(false);

  useEffect(() => {
    setDisplayLoading(true);

    getItems((status, message, data) => {
      if (status !== 200) {
        console.error("Failed to fetch items:", message);
      }
      setDisplayLoading(false);
    });
  }, []);
  return (
    <Fragment>
      <PageTitle
        title={`AOP for Fiscal Year ${currentFiscalYear}`}
        description={
          "The following below serves as the summary of your AOP request. You can open and update your request before the deadline as set by the administrators."
        }
        items={[
          { label: "Objectives", path: "/objectives" },
          { label: "Activities", path: "/activities" },
          { label: "Resources", path: "/manage-resources" },
          {
            label: "Select Resources",
            path: "/select-resources",
            current: true,
          },
        ]}
      />
      <Stack mt={2}>
        <ContainerComponent>
          <Stack direction={"row"} justifyContent="space-between">
            <Stack>
              <Typography level="body-md" fontWeight={600}>
                Select resources (items) to add
              </Typography>
              <Typography level="body-sm">
                All resources you'll select here only applies to this selected
                activity
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <ButtonComponent label="Cancel Selection" variant={"outlined"} />
              <ButtonComponent label={"Save items"} />
              <IconButtonComponent
                icon={<X />}
                size={"sm"}
                onClick={() => navigate("/manage-resources")}
              />
            </Stack>
          </Stack>
          <Divider sx={{ my: 2, bgcolor: color.primary.fontLight }} />
          <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            <Grid xs={8}>
              <BoxComponent boxShadow="sm">
                <Stack direction={"row"}>
                  <SearchBarComponentv2 />
                </Stack>
              </BoxComponent>
              <BoxComponent mt={2} boxShadow="sm" height={"64vh"}>
                <Grid container spacing={2} padding={1}>
                  {items.map((item, index) => (
                    <Grid
                      xs={12}
                      sm={6}
                      md={4}
                      key={index}
                      sx={{ cursor: "pointer" }}
                    >
                      <ItemCardComponent
                        key={index}
                        item={item}
                        // btnAction={() => addToCart(item)}
                        // itemInfoAction={() => handleOpenItemDialog(item)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </BoxComponent>
            </Grid>
            <Grid xs={4}>
              <Typography> Grid 2</Typography>
            </Grid>
          </Grid>
        </ContainerComponent>
      </Stack>
    </Fragment>
  );
}
