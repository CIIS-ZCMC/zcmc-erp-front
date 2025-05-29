import { Fragment, useState, useEffect } from 'react';

import { Box } from '@mui/joy';
import { useNavigate, Outlet } from 'react-router-dom';

import { useDeadlinesActions } from '../../../Hooks/Deadlines/DeadlinesHook';

import PageTitle from '../../../Components/Common/PageTitle';

import ButtonComponent from '../../../Components/Common/ButtonComponent';
import ContainerComponent from '../../../Components/Common/ContainerComponent';
import TabComponent from '../../../Components/Common/TabComponent';
import SearchBarComponent from '../../../Components/SearchBarComponent';

import { deadlineTabs } from '../../../Data/Options';
import { DEADLINES_CONSTANTS } from '../../../Data/constants';

const Deadlines = () => {

    const navigate = useNavigate();

    const [index, setIndex] = useState("");
    const [deadlineType, setDeadlineType] = useState('aop')

    const { getDeadlines } = useDeadlinesActions();

    useEffect(() => {
        //call getDeadlines api
        const params = { types: deadlineType };
        getDeadlines(params, (status, message) => {
            if (!(status >= 200 && status < 300)) {
                //code here api code is not success or 200 response
                return
            }
        })
    }, [index])

    //control for deadlineType
    useEffect(() => {
        if (index !== 'ppmp') {
            setDeadlineType('ppmp')
        } else {
            setDeadlineType('aop')
        }
    }, [index])

    useEffect(() => {
        navigate(index);
    }, [index])

    return (
        <Fragment>
            <PageTitle
                title={DEADLINES_CONSTANTS.DEADLINE_TITLE}
                description={DEADLINES_CONSTANTS.DEADLINE_SUBHEADER}
            />

            <Box sx={{ marginTop: "40px" }}>
                <ContainerComponent
                    title={DEADLINES_CONSTANTS.DEADLINE_TABLE_TITLE}
                    description={DEADLINES_CONSTANTS.DEADLINE_TABLE_SUBHEADER}
                    actions={
                        <ButtonComponent
                            label={"Create new deadline"}
                            variant={"solid"}
                            size={"sm"}
                            onClick={() => {
                                setAllTypes("create");
                                setOpenModal(true, false, true);
                            }}
                        />
                    }
                >

                    <TabComponent tabs={deadlineTabs} index={index} setIndex={setIndex} />

                    <Box
                        sx={{
                            mt: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 2,
                        }}
                    >
                        <SearchBarComponent
                            size="md"
                            placeholder="Find records by document number, year, items, etc."
                        />
                        {/* <DatePickerComponent /> */}
                    </Box>
                    <Outlet />
                </ContainerComponent>
            </Box>

        </Fragment >
    )
}

export default Deadlines