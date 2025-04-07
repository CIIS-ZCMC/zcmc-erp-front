import React, { Fragment } from 'react';

import { Box, Stack, Grid, Typography } from '@mui/joy';

import BoxComponent from '../../Components/Common/Card/BoxComponent';
import SearchBarComponent from '../../Components/SearchBarComponent';
import ButtonComponent from '../../Components/Common/ButtonComponent';
import ContainerComponent from '../../Components/Common/ContainerComponent';
import PageTitle from '../../Components/Common/PageTitle';

import ItemsList from '../../Layout/Items/ItemsList';
import ItemsCart from '../../Layout/Items/ItemsCart';

import { AOP_CONSTANTS } from '../../Data/constants';
import { CART_ITEMS } from '../../Data';

const Items = () => {

    return (
        <Fragment>

            <PageTitle
                title={AOP_CONSTANTS.CREATE_AOP_TITLE}
                description={AOP_CONSTANTS.CREATE_AOP_SUBHEADING}
            />

            <ContainerComponent
                title={
                    "Select resources (items) for activity Activity: Sample activity..."
                }
                description="Select a request status and reasons (if returned) to continue. You may add remarks if necessary."
                actions={
                    <Fragment>
                        <Stack direction={'row'} gap={1}>
                            <ButtonComponent
                                label={'Cancel Selection'}
                                size={'sm'}
                                variant={'outlined'}
                            />

                            <ButtonComponent
                                label={'Save items'}
                                size={'sm'}
                                variant={'solid'}
                            />
                        </Stack>
                    </Fragment>
                }
            >
                <Grid
                    container
                    spacing={3}
                    columns={{ xs: 12, sm: 12, md: 12 }}
                    sx={{
                        flexGrow: 1,
                        width: "auto",
                        p: 1,
                    }}
                >
                    {/* ITEMS VIEW */}
                    <Grid
                        item
                        // width={{ sm: "100%", lg: "60%" }}
                        xs={12} // Full width on extra small screens
                        sm={2} // 2 items on small screens
                        md={8}
                    >
                        <Stack gap={2}>
                            <BoxComponent>
                                <Stack
                                    direction={{ sm: "column", lg: "row" }}
                                    alignItems={{ sm: "start", lg: "center" }}
                                    gap={2}
                                >
                                    <SearchBarComponent
                                        placeholder={'search here to find item fast'}
                                    />

                                    <Typography level="body-xs">
                                        Showing 16 of 16 Items
                                    </Typography>
                                </Stack>
                            </BoxComponent>
                            <ItemsList />
                        </Stack>
                    </Grid>

                    <Grid
                        item
                        xs={12}  // Full width on mobile
                        sm={4}    // 4/12 on small screens
                        md={4}    // 4/12 on medium screens
                    >
                        <Stack gap={2}>

                            <BoxComponent>
                                <Box
                                    m={1}
                                >
                                    <Typography
                                        fontWeight={600}
                                        fontSize={{ sm: "sm", md: "md", lg: "lg" }}
                                    >
                                        {CART_ITEMS.length} distinct item on cart
                                    </Typography>
                                </Box>

                                {CART_ITEMS.map(({ id, name, specType, category, image, quantity }) => (
                                    <ItemsCart
                                        key={id}
                                        name={name}
                                        specType={specType}
                                        category={category}
                                        image={image}
                                        quantity={quantity}
                                    />
                                ))}

                            </BoxComponent>
                        </Stack>


                    </Grid>
                </Grid>

            </ContainerComponent>


        </Fragment >
    )
}

export default Items