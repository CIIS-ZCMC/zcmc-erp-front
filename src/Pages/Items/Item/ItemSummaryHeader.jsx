import { Stack, Box, Typography } from '@mui/joy';
import { ChevronDown, ChevronUp } from 'lucide-react';

// custom components
import ContainerComponent from '../../../Components/Common/ContainerComponent';
import IconButtonComponent from '../../../Components/Common/IconButtonComponent';
import BoxComponent from '../../../Components/Common/Card/BoxComponent';

import { AOP_CONSTANTS } from '../../../Data/constants';
import formattedPrice from '../../../Utils/formattedPrice';

const ItemSummaryHeader = ({
    isCollapsed,
    rowNumber,
    cost,
    handleCollapseClick,
    activityName,
}) => {
    return (
        <>
            <ContainerComponent
                title={`${AOP_CONSTANTS.MANAGE_HEADER} ACTIVITY : ${activityName}`}
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
                                        <Typography fontSize={12} color="primary">
                                            {activityName}
                                        </Typography>
                                    </Box>
                                </BoxComponent>

                                <BoxComponent variant={"outlined"}>
                                    <Typography fontSize={14} fontWeight={600}>
                                        Cost:
                                    </Typography>
                                    <Box width={"200px"} mt={1}>
                                        <Typography fontSize={12} color="primary">
                                            {formattedPrice(cost)}
                                        </Typography>
                                    </Box>
                                </BoxComponent>
                            </Stack>
                        </Box>
                    )}
                </Box>
            </ContainerComponent>
        </>
    )
}

export default ItemSummaryHeader