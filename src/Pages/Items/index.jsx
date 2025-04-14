import React, { Fragment, useState } from 'react';

import { Box, Stack, Grid, Typography, Modal, List, ListItem, Divider } from '@mui/joy';

import { useNavigate } from 'react-router-dom';

import BoxComponent from '../../Components/Common/Card/BoxComponent';
import SearchBarComponent from '../../Components/SearchBarComponent';
import ButtonComponent from '../../Components/Common/ButtonComponent';
import ContainerComponent from '../../Components/Common/ContainerComponent';
import PageTitle from '../../Components/Common/PageTitle';
import ModalComponent from '../../Components/Common/Dialog/ModalComponent';

import ModalContent from './Item';

import QuantityControlComponent from '../../Components/Cart/QuantityControlComponent';

import ItemsList from '../../Layout/Items/ItemsList';
import ItemsCart from '../../Layout/Items/ItemsCart';

import { AOP_CONSTANTS } from '../../Data/constants';
import { CART_ITEMS } from '../../Data';

const Items = () => {

    const navigate = useNavigate()

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleOpenItemDialog = () => {
        setIsDialogOpen(true)
    }

    const handleCloseItemDialog = () => {
        setIsDialogOpen(false)
    }

    return (
        <Fragment>

            <PageTitle
                title={AOP_CONSTANTS.CREATE_AOP_TITLE}
                description={AOP_CONSTANTS.CREATE_AOP_SUBHEADING}
            />

            <ContainerComponent
                title={`${AOP_CONSTANTS.ITEMS_HEADER}: Sample activity..."`
                }
                description={AOP_CONSTANTS.ITEMS_SUBHEADER}
                actions={
                    <Fragment>
                        <Stack direction={'row'} gap={1}>
                            <ButtonComponent
                                label={'Cancel Selection'}
                                size={'md'}
                                variant={'outlined'}
                            />

                            <ButtonComponent
                                label={'Save items'}
                                size={'md'}
                                variant={'solid'}
                                onClick={() => navigate('/aop-create/activities/1/resources/1')}
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
                            <ItemsList
                                handleOpenItemDialog={handleOpenItemDialog}
                            />
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

            {/* Item Modal layout */}
            <ModalComponent
                handleClose={handleCloseItemDialog}
                hasActionButtons={false}
                isOpen={isDialogOpen}
                title={'Preview Item'}
                description={'Select a request status and reasons (if returned) to continue. You may add remarks if necessary.'}
                content={
                    <>
                        <ModalContent />
                    </>
                }
            />

        </Fragment >
    )
}

export default Items