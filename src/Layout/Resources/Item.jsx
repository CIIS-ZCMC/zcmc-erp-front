import React from 'react'

import { Box, Card, CardContent, CardCover, Stack, Typography } from '@mui/joy'
import { CircleSmall } from 'lucide-react'

import ButtonComponent from '../../Components/Common/ButtonComponent'
import ChipComponent from '../../Components/Common/ChipComponent'

const Item = ({
    item,
    image,
    itemInfoAction,
    btnAction
}) => {
    return (
        <>
            <Box
                sx={{
                    height: "auto",
                    width: "100%",
                    padding: 1,
                    border: "2px solid transparent",
                    "&:hover": {
                        transition: "0.3s",
                        border: 2,
                        borderColor: "lightgreen",
                        borderRadius: 10,
                        cursor: "grab",
                    },
                }}
            >
                <Card
                    sx={{
                        border: 1,
                        borderColor: "neutral.50",
                        // backgroundColor: "neutral.300",
                        height: "156px",

                        padding: 0,
                    }}
                    onClick={itemInfoAction}
                >
                    <CardCover>
                        {/* <AspectRatio ratio="1"> */}
                        <img
                            src={item?.image ?? image}
                            srcSet={item?.image}
                            role="button"
                            loading="lazy"
                            alt=""
                        />
                        {/* </AspectRatio> */}
                    </CardCover>

                    <CardContent sx={{ justifyContent: "flex-end", padding: 1 }}>
                        <ChipComponent
                            label={item?.variant}
                            size="sm"
                            color={"success"}
                            startDecorator={<CircleSmall size={12} />}
                        />
                    </CardContent>
                </Card>

                {/* CONTENT */}
                <Stack my={1.2} gap={0.5}>
                    <Typography level="body-xs" fontWeight={400}>
                        {item?.item_category?.description} <CircleSmall size={8} />{" "}
                        {item?.item_unit?.name}
                    </Typography>
                    <Typography sx={{ fontSize: "sm", fontWeight: "lg" }}>
                        {item?.name}
                    </Typography>
                </Stack>

                <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                >
                    <Typography sx={{ fontSize: "md", fontWeight: "lg" }}>
                        &#8369; {item?.estimated_budget.toLocaleString()}
                    </Typography>

                    <ButtonComponent
                        label={"Add to cart"}
                        size={"sm"}
                        variant={"outlined"}
                        onClick={btnAction}
                    />
                </Stack>
            </Box>
        </>
    )
}

export default Item