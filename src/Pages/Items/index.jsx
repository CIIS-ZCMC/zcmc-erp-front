import React, { Fragment, useEffect, useState } from 'react';

import { Box, Stack, Grid, Typography, Modal, List, ListItem, Divider } from '@mui/joy';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';

import BoxComponent from '../../Components/Common/Card/BoxComponent';
import SearchBarComponent from '../../Components/SearchBarComponent';
import ButtonComponent from '../../Components/Common/ButtonComponent';
import ContainerComponent from '../../Components/Common/ContainerComponent';
import PageTitle from '../../Components/Common/PageTitle';
import ModalComponent from '../../Components/Common/Dialog/ModalComponent';
import IconButtonComponent from '../../Components/Common/IconButtonComponent';
import ItemCardComponent from '../../Components/Resources/ItemCardComponent';

import useItemsHook from '../../Hooks/ItemsHook';
import useResourceHook from '../../Hooks/ResourceHook';
import useItemCartHook from '../../Hooks/ItemCartHook';

import Item from './Item';

import QuantityControlComponent from '../../Components/Cart/QuantityControlComponent';

import ItemsList from '../../Layout/Items/ItemsList';
import ItemsCart from '../../Layout/Items/ItemsCart';

import { AOP_CONSTANTS } from '../../Data/constants';
import { CART_ITEMS } from '../../Data';

import empty_cart from '../../assets/empty-cart.png';

const Items = () => {

    const navigate = useNavigate()
    const location = useLocation()

    const { items, getItems } = useItemsHook();
    const { cart, addResourceToCart, removeFromCart, updateQuantity } = useResourceHook();

    const [displayedItems, setDisplayedItems] = useState([]);

    const rowNumber = location.state?.activityrowId;
    const cost = location.state?.cost;

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const totalQty = cart.reduce((sum, item) => sum + item.aop_quantity, 0);
    const totalPrice = cart.reduce(
        (sum, item) => sum + item.aop_quantity * item.estimated_budget,
        0
    );

    // useEffect(() => {
    //     console.log(cart)
    // }, [cart])

    useEffect(() => {
        getItems((status, message, data) => {
            if (status !== 200) {
                console.error('Failed to fetch items:', message)
            }
        })
    }, []);

    useEffect(() => {
        if (items.length) {
            setDisplayedItems(items)
        }
    }, [items])

    const handleOpenItemDialog = (item) => {
        setSelectedItem(item);
        setIsDialogOpen(true)
    }

    const handleCloseItemDialog = () => {
        setIsDialogOpen(false)
        setSelectedItem(null);
    }

    const handleCollapseClick = () => {
        setIsCollapsed((prev) => !prev);
    };

    const add = () => {
        addResourceToCart(selectedItem, quantity);
        handleCloseItemDialog();
    };

    return (
        <Fragment>

            <PageTitle
                title={AOP_CONSTANTS.CREATE_AOP_TITLE}
                description={AOP_CONSTANTS.CREATE_AOP_SUBHEADING}
            />

            <ContainerComponent
                title={`${AOP_CONSTANTS.MANAGE_HEADER} ACTIVITY : Sample activity..."`}
                description={`${AOP_CONSTANTS.MANAGE_SUBHEADER} activity`}
                sx={{ mt: 2 }}
                actions={
                    <Stack>
                        <IconButtonComponent
                            variant={'text'}
                            icon={isCollapsed ? <ChevronUp /> : <ChevronDown />}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCollapseClick();
                            }}
                        />
                    </Stack>
                }
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    {isCollapsed && (
                        <Box>
                            <Stack
                                direction={"row"}
                                gap={2}
                                sx={{
                                    justifyContent: "space-between",
                                }}
                            >
                                <BoxComponent variant={"outlined"}>
                                    <Typography fontSize={14} fontWeight={600}>
                                        Row number:
                                    </Typography>
                                    <Box width={"200px"} mt={1}>
                                        <Typography fontSize={12} color="primary">
                                            {rowNumber}
                                        </Typography>
                                    </Box>
                                </BoxComponent>

                                <BoxComponent variant={"outlined"}>
                                    <Typography fontSize={14} fontWeight={600}>
                                        Activity:
                                    </Typography>
                                    <Box width={"80%"} mt={1}>
                                        <Typography fontSize={12}>
                                            Lorem Ipsum is simply dummy text of the printing and
                                            typesetting industry. Lorem Ipsum has been the industry's
                                            standard dummy text ever since the 1500s, when an unknown
                                            printer took a galley of type and scrambled it to make a
                                            type specimen book.
                                        </Typography>
                                    </Box>
                                </BoxComponent>

                                <BoxComponent variant={"outlined"}>
                                    <Typography fontSize={14} fontWeight={600}>
                                        Cost:
                                    </Typography>
                                    <Box width={"200px"} mt={1}>
                                        <Typography fontSize={12}>
                                            {cost}
                                        </Typography>
                                    </Box>
                                </BoxComponent>
                            </Stack>
                        </Box>
                    )}
                </Box>
            </ContainerComponent>

            <ContainerComponent
                title={`${AOP_CONSTANTS.TABLE_ITEMS_HEADER}`}
                description={`${AOP_CONSTANTS.TABLE_ITEMS_SUBHEADER}`}
                sx={{ mt: 2, height: "67vh" }}
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
                    columns={{ xs: 12, sm: 12, md: 12 }}
                    sx={{
                        flexGrow: 1,
                        width: "auto",
                        p: 1,
                    }}
                    gap={3}
                >

                    {/* Left: Scrollable Item Cards */}
                    <Grid
                        item
                        xs={12} // Full width on extra small screens
                        sm={2} // 2 items on small screens
                        md={8.1}
                    >
                        <BoxComponent sx={{ position: "sticky", top: 0 }}>
                            <SearchBarComponent />
                        </BoxComponent>
                        <Grid
                            container
                            columns={{ xs: 12, sm: 6, md: 12 }}
                            gap={4}
                            sx={{
                                flexGrow: 1,
                                mt: 2,
                                p: 1,
                                border: 1,
                                borderColor: "neutral.100",
                                borderRadius: 10,
                                height: "50vh",
                                overflowY: "auto",
                            }}
                        >
                            {displayedItems.map((item, index) => (
                                <Grid
                                    key={index}
                                    item="true"
                                    xs={12}
                                    sm={2}
                                    md={6}
                                    lg={4}
                                    xl={3.6}
                                    sx={{
                                        cursor: "pointer",
                                    }}
                                >
                                    <ItemCardComponent
                                        key={index}
                                        item={item}
                                        btnAction={() => addResourceToCart(item)}
                                        itemInfoAction={() => {
                                            handleOpenItemDialog(item);
                                        }}
                                    />
                                </Grid>
                            ))}
                            {/* <div ref={loadMoreRef}>Loading more items...</div> */}
                        </Grid>
                    </Grid>

                    {/* Right: Cart */}
                    <Grid
                        item
                        xs={12} // Full width on mobile
                        sm={4} // 4/12 on small screens
                        md={3.7}
                        // xs={4}
                        sx={{
                            width: 350,
                            height: "59vh",
                            position: "sticky",
                            border: 1,
                            borderColor: "neutral.100",
                            borderRadius: 10,
                            bgcolor: "white",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
                            <Typography level="h6">
                                {" "}
                                <Typography fontSize={14} fontWeight={600}>
                                    {totalQty === 0
                                        ? "No items"
                                        : `${totalQty} Item${totalQty > 1 ? "s" : ""}`}{" "}
                                    in cart
                                </Typography>
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                flex: 1,
                                overflowY: "auto",
                                p: 2,
                            }}
                        >
                            {cart?.length > 0 ? (
                                [...cart]
                                    .reverse()
                                    .map((item) => (
                                        <ItemsCart
                                            key={item.id}
                                            item={item}
                                            id={item.id}
                                            onQuantityChange={updateQuantity}
                                            onRemove={() => removeFromCart(item.id)}
                                        />
                                    ))
                            ) : (
                                <Stack
                                    sx={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "100%",
                                    }}
                                >
                                    <img
                                        src={empty_cart}
                                        alt="Not found"
                                        style={{ width: 140 }}
                                    />
                                    <Typography
                                        fontSize={14}
                                        fontWeight={600}
                                        sx={{ color: "gray" }}
                                    >
                                        Your cart is empty
                                    </Typography>
                                    <Typography
                                        fontSize={13}
                                        sx={{ color: "gray" }}
                                        textAlign={"center"}
                                    >
                                        Looks like you haven't added any items yet.
                                    </Typography>
                                </Stack>
                            )}
                        </Box>

                        <Box sx={{ p: 2, borderTop: "1px solid #eee" }}>
                            <Typography
                                textAlign={"right"}
                                sx={{
                                    color: "gray",
                                }}
                                fontSize={13}
                                fontWeight={600}
                            >
                                Total cost:
                            </Typography>
                            <Typography fontSize={20} fontWeight="lg" textAlign={"right"}>
                                &#8369; {totalPrice.toLocaleString()}
                            </Typography>
                        </Box>
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
                    <Box overflow={"hidden"}>
                        <Item
                            addAction={() => add()}
                            item={selectedItem}
                            quantity={quantity}
                            onDecrease={() => setQuantity(quantity - 1)}
                            onIncrease={() => setQuantity(quantity + 1)}
                        />
                    </Box>
                }
            />

        </Fragment >
    )
}

export default Items