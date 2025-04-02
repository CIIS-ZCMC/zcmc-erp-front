import { Fragment } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Stack, Box, useTheme } from '@mui/joy';
import { ExternalLink } from 'lucide-react';

import Header from '../../../Layout/Header';

import ContainerComponent from '../../../Components/Common/ContainerComponent';
import ButtonComponent from '../../../Components/Common/ButtonComponent';
import TabsComponent from '../../../Components/Common/TabsComponent';
import SearchBarComponent from '../../../Components/SearchBarComponent';
import DatePickerComponent from '../../../Components/Form/DatePickerComponent';
import PageTitle from '../../../Components/Common/PageTitle';

import { AOP_CONSTANTS } from '../../../Data/constants';
import { AOPPathMap } from '../../../Data';

const AnnualOps = () => {

    // const theme = useTheme();
    const navigate = useNavigate()
    // const location = useLocation()

    return (
        <Fragment>
            <PageTitle
                title={AOP_CONSTANTS.AOP_TITLE}
                description={AOP_CONSTANTS.AOP_SUBHEADING}
            />

            <ContainerComponent
                title={AOP_CONSTANTS.TABLE_TITLE}
                description={AOP_CONSTANTS.TABLE_SUBHEADING}
                // sx={{ mt: 3 }}
                actions={
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
                }
            >

                {/* 
                <TabsComponent
                    tabs={['View all', 'Pending', 'Returned', 'Approved']}
                    pathMap={AOPPathMap}
                /> */}

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

            </ContainerComponent>

        </Fragment>

    )
}

export default AnnualOps