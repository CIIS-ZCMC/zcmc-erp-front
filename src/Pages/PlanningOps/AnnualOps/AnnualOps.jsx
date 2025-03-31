import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Stack, Box, Typography, Divider, useTheme } from '@mui/joy';
import { ExternalLink } from 'lucide-react';

import Header from '../../../Layout/Header';

import SheetComponent from '../../../Components/Common/SheetComponent';
import ButtonComponent from '../../../Components/Common/ButtonComponent';
import TabsComponent from '../../../Components/Common/TabsComponent';
import SearchBarComponent from '../../../Components/SearchBarComponent';
import DatePickerComponent from '../../../Components/Form/DatePickerComponent';

import { AOP_CONSTANTS } from '../../../Data/constants';
import { AOPPathMap } from '../../../Data';

const AnnualOps = () => {

    const theme = useTheme();
    const navigate = useNavigate()
    const location = useLocation()

    const pageDetails = {
        title: AOP_CONSTANTS.AOP_TITLE,
        description: AOP_CONSTANTS.AOP_SUBHEADING,
    };

    return (
        <>
            <Header
                pageDetails={pageDetails}
            />

            {/* Content */}
            <Stack gap={2} mt={2}>
                <SheetComponent
                    variant={"outlined"}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Stack
                            direction={'column'}
                        >
                            <Typography
                                fontSize={18} fontWeight={600}
                            >
                                {AOP_CONSTANTS.TABLE_TITLE}
                            </Typography>
                            <Typography
                                level="body-sm"
                                sx={{ color: theme.palette.custom.fontReg }}
                            >
                                {AOP_CONSTANTS.TABLE_SUBHEADING}
                            </Typography>
                        </Stack>

                        <Stack
                            direction={'row'}
                            gap={2}
                        >
                            <ButtonComponent
                                label={'Request new item'}
                                variant={'outlined'}
                                endDecorator={<ExternalLink />}
                                size={'sm'}
                            />
                            <ButtonComponent
                                label={'Create AOP'}
                                variant={'solid'}
                                size={'sm'}
                                onClick={() => navigate('/aop-create')}
                            />
                        </Stack>
                    </Box>

                    <Divider sx={{ mt: 2, mb: 2 }} />

                    <TabsComponent
                        tabs={['View all', 'Pending', 'Returned', 'Approved']}
                        pathMap={AOPPathMap}
                    />

                    <Box
                        sx={{
                            mt: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <SearchBarComponent
                            size='md'
                            placeholder='Find records by document number, year, items, etc.'
                        />
                        <DatePickerComponent />
                    </Box>

                    <Outlet />

                </SheetComponent>
            </Stack>
        </>

    )
}

export default AnnualOps