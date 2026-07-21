import {
  InsertLinkOutlined,
  ListOutlined,
  PersonOutline,
} from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";
import React, { Fragment } from "react";

export default function ItemDetailsRow({ row }) {
  return (
    <Fragment>
      <Stack
        direction={"row"}
        spacing={3}
        sx={{
          p: 3,
          alignItems: "stretch",
          overflowX: "auto",
        }}
      >
        <Stack
          sx={{
            width: 180,
            minWidth: 180,
            p: 2,
            border: "2px solid",
            borderColor: "divider",
            borderRadius: "lg",
            bgcolor: "background.surface",
          }}
          spacing={3}
        >
          <Typography
            level="title-md"
            startDecorator={
              <PersonOutline sx={{ fontSize: 25, color: "black" }} />
            }
          >
            Requester
          </Typography>
          <Stack>
            <Typography level="body-sm">Requester Name</Typography>
            <Typography level="title-sm">
              {row?.requested_by?.name || "N/A"}
            </Typography>
          </Stack>
          <Stack>
            <Typography level="body-sm">Requesting Office</Typography>
            <Typography level="title-sm">
              {row?.requested_by?.area_name || "N/A"}
            </Typography>
          </Stack>
        </Stack>
        <Stack
          sx={{
            width: {
              xs: "100%",
              md: 350,
              lg: 520,
            },
            minWidth: {
              md: 350,
              lg: 520,
            },
            p: 2,
            border: "2px solid",
            borderColor: "divider",
            borderRadius: "lg",
            bgcolor: "background.surface",
          }}
          spacing={2}
        >
          <Typography
            level="title-md"
            startDecorator={
              <ListOutlined sx={{ fontSize: 25, color: "black" }} />
            }
          >
            Specifications
          </Typography>

          <Stack direction="row" gap={3} flexWrap="wrap">
            {row.item_specifications?.length ? (
              row.item_specifications.map((spec) => (
                <Stack
                  key={spec.id}
                  sx={{
                    width: 110, // same width for all specs
                    p: 1.25,
                    border: "2px solid",
                    borderColor: "divider",
                    borderRadius: "lg",
                    justifyContent: "flex-start",
                  }}
                >
                  <Typography
                    level="title-sm"
                    sx={{
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {spec.description}
                  </Typography>
                </Stack>
              ))
            ) : (
              <Typography level="body-sm">No specifications</Typography>
            )}
          </Stack>
        </Stack>
        <Stack
          sx={{
            flex: 1,
            minWidth: 520,
            p: 2,
            border: "2px solid",
            borderColor: "divider",
            borderRadius: "lg",
            bgcolor: "background.surface",
          }}
          spacing={2}
        >
          <Typography
            level="title-md"
            startDecorator={
              <InsertLinkOutlined sx={{ fontSize: 25, color: "black" }} />
            }
          >
            Document Links
          </Typography>

          <Stack direction={"row"} spacing={2}>
            <Stack
              sx={{
                flex: 1,
                minHeight: 82,
                p: 1.5,
                border: "2px solid",
                borderColor: "divider",
                borderRadius: "md",
                overflow: "hidden",
              }}
              spacing={2}
            >
              <Typography level="body-sm">Market Scoping Link</Typography>
              <Typography
                component="a"
                href={row.market_scoping_link}
                target="_blank"
                rel="noopener noreferrer"
                level="body-sm"
                color="primary"
                fontStyle={"italic"}
                sx={{
                  wordBreak: "break-all",
                  textDecoration: "underline",
                }}
              >
                {row.market_scoping_link || "N/A"}
              </Typography>
            </Stack>
            <Stack
              sx={{
                flex: 1,
                minHeight: 82,
                p: 1.5,
                border: "2px solid",
                borderColor: "divider",
                borderRadius: "md",
                overflow: "hidden",
              }}
              spacing={2}
            >
              <Typography level="body-sm">Technical Specifications </Typography>
              <Typography
                component="a"
                href={row.tech_specs_link}
                target="_blank"
                rel="noopener noreferrer"
                level="body-sm"
                color="primary"
                fontStyle={"italic"}
                sx={{
                  wordBreak: "break-all",
                  textDecoration: "underline",
                }}
              >
                {row.tech_specs_link || "N/A"}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Fragment>
  );
}
