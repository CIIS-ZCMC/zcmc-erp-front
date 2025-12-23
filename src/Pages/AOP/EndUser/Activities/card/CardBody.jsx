import React from "react";

import { Typography, Stack } from "@mui/joy";
import moment from "moment";

const CardBody = ({ objective, activity, timeframe, cost, comments }) => {



  return (
    <>
      <Stack direction={"column"} textAlign={"left"} width={"80%"} gap={1}>
        {/* <Typography level={"body-sm"}>{objective}</Typography> */}

        <Typography level={"title-lg"} sx={{}}>
          {activity}
        </Typography>

        <Typography level={"body-md"}>{timeframe}</Typography>

        <Stack
          textAlign={"left"}
          width={"156%"}
        >
          {comments.length !== 0 ?
            <>
              <Stack
                display={'flex'}
                flexDirection={'row'}
                alignItems={'start'}
                justifyContent={'space-between'}
                sx={{
                  bgcolor: "#F2F2F2",
                  padding: 1,
                  borderRadius: 10,
                  mt: 1
                }}
              >
                <Stack
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'start'}
                  justifyContent={'start'}
                  gap={.5}
                >
                  <Typography level={"body-xs"}>
                    {comments[0]?.user_name} - {comments[0]?.user_area}
                  </Typography>

                  <Typography level={"body-sm"} fontWeight={600}>
                    {/* Latest Comment: <br /> */}
                    "{comments[0]?.comment}"
                  </Typography>
                </Stack>

                <Typography level={"body-xs"} fontWeight={400}>
                  {moment(comments[0]?.created_at).format("MMMM D, YYYY")}
                </Typography>
              </Stack>

            </>
            :

            <Typography level={"body-sm"}>
              No Comments  <br />
            </Typography>
          }

        </Stack>

      </Stack>

      <Stack
        textAlign={"left"}
        sx={{
          bgcolor: "#F2F2F2",
          padding: 1,
          borderRadius: 10,
        }}
        width={"30%"}
      >
        <Typography level="body-sm">Cost</Typography>
        <Typography
          level="body-md"
          sx={
            {
              // flex: 1,
              // whiteSpace: 'nowrap',
              // overflow: 'hidden',
              // textOverflow: 'ellipsis',
              // maxWidth: '50%',
            }
          }
        >
          ₱{" "}
          {cost
            ? cost?.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
            : "0.00"}
        </Typography>
      </Stack>

    </>
  );
};

export default CardBody;
