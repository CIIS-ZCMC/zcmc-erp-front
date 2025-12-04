import React from "react";

import { Stack, Typography, Divider, Card, CardContent } from "@mui/joy";

import BoxComponent from "@Components/Common/Card/BoxComponent";

const StatusCard = ({
  height,
  hasFunction,
  logo,
  count,
  title,
  description,
  functionHandler,
}) => {
  return (
    <>
      <Card
        variant="soft"
        sx={{
          border: "1px solid #F0F0F0",
          borderRadius: 20,
          bgcolor: "white",
          pt: 3,
        }}
      >
        <CardContent>
          <Stack px={2} py={1} spacing={hasFunction ? 1 : 2}>
            <img src={logo} alt="" width={60} />

            <Typography
              level="title-sm"
              color="primary"
              textTransform="uppercase"
            >
              {title}
            </Typography>

            <Typography level="h3">{count}</Typography>

            <Typography level="body-sm">{description}</Typography>

            {hasFunction && (
              <>
                <Divider />

                {functionHandler}
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default StatusCard;
