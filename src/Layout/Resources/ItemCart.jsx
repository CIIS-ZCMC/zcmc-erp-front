import { Stack, Box, Typography, Divider } from "@mui/joy";
import { LucideDot, Trash } from "lucide-react";

import QuantityControlComponent from "../../Components/Cart/QuantityControlComponent";
import ButtonComponent from "../../Components/Common/ButtonComponent";

import empty_cart from "../../assets/empty-cart.png";

const ItemCart = ({
    totalQty,
    totalPrice,
    filteredCart,
    onRemove,
    onQuantityChange
}) => {
    return (
        <>
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
                {filteredCart?.length > 0 ? (
                    [...filteredCart]
                        .reverse()
                        .map((item) => (
                            <>
                                <Box display={"flex"} gap={1}>
                                    <Box
                                        component="img"
                                        // src={image}
                                        alt={name}
                                        loading="lazy"
                                        sx={{
                                            width: 65,
                                            height: 55,
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                        }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/fallback-image.png";
                                        }}
                                    />

                                    <Box width={"100%"}>
                                        <Typography fontSize={13} fontWeight={600}>
                                            {item?.description}
                                        </Typography>
                                        <Typography
                                            fontSize={12}
                                            fontWeight={400}
                                            display={"flex"}
                                            alignItems={"center"}
                                        >
                                            {item?.variant ? (
                                                <>
                                                    {item?.variant} <LucideDot />
                                                </>
                                            ) : (
                                                ""
                                            )}{" "}
                                            {item?.category}
                                        </Typography>
                                        <Typography fontSize={12} fontWeight={600} textColor={"success.500"}>
                                            &#8369; {item?.estimated_budget?.toLocaleString()}
                                        </Typography>

                                        <Box
                                            display={"flex"}
                                            sx={{
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                mt: 0.5,
                                            }}
                                        >
                                            <QuantityControlComponent
                                                quantity={item?.aop_quantity}
                                                onDecrease={() => onQuantityChange(item.id, item.aop_quantity - 1)}
                                                onIncrease={() => onQuantityChange(item.id, item.aop_quantity + 1)}
                                            />

                                            <ButtonComponent
                                                label={"Remove"}
                                                variant={"plain"}
                                                color="black"
                                                endDecorator={<Trash size={12} style={{ paddingLeft: 3 }} />}
                                                size={"xs"}
                                                onClick={() => onRemove(item.id)}
                                            />
                                        </Box>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 1.5 }} />
                            </>
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
        </>
    )
}

export default ItemCart