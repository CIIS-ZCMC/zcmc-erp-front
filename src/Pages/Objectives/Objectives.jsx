import { useEffect, useState } from 'react';

import { Stack, Divider, Typography, Breadcrumbs } from '@mui/joy';

import { ThreeDotsLoader } from '@Components/Common/Loading/ThreeDotsLoader';

import BoxComponent from '../../Components/Common/Card/BoxComponent';
import SearchBarComponent from '../../Components/SearchBarComponent';
import ButtonComponent from '../../Components/Common/ButtonComponent';
import ModalComponent from '@Components/Common/Dialog/ModalComponent';
import ObjectivesModal from './modal/ObjectivesModal';

import { OBJECTIVES } from '../../Data/constants';

import { useFunctionType, useObjective, useSuccessIndicator } from '../../Store/objectivesStore';

const Objectives = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenObjectivesModal, setIsOpenObjectivesModal] = useState(false);

    const functionType = useFunctionType()
    const objective = useObjective()
    const successIndicator = useSuccessIndicator()

    const {
        OBJECTIVES_EMPTY_STATE_TITLE,
        OBJECTIVES_CREATE_NEW,
        ADD_OBJECTIVE,
        ADD_OBJECTIVE_SUBHEADING,
        AOP_EMPTY_STATE_TITLE,
        AOP_CREATE_NEW_AOP,
        MANAGE_OBJECTIVES_HEADER,
        MANAGE_OBJECTIVES_SUBHEADER,
    } = OBJECTIVES

    function handleClick(event) {
        event.preventDefault();
        console.info('You clicked a breadcrumb.');
    }

    const breadcrumbs = [
        <Typography key="3" sx={{ color: 'text.primary' }}>
            Objectives
        </Typography>,
    ];

    const handleOpenObjectivesModal = () => {
        setIsOpenObjectivesModal(true);
    }

    const handleSaveObjectives = () => {

    }

    useEffect(() => {
        console.log(functionType)
        console.log(objective)
        console.log(successIndicator)
    }, [functionType, objective, successIndicator])


    return (
        <div>
            <Stack spacing={2}>
                <Stack
                    direction={'row'}
                    alignItems={'center'}
                    alignContent={'start'}
                >
                    <Typography
                        level="h2"
                        fontWeight={700}
                    >
                        AOP #2025-0031 for Fiscal Year 2026
                    </Typography>

                    <Breadcrumbs
                        separator="›"
                        aria-label="breadcrumb"
                    >
                        {breadcrumbs}
                    </Breadcrumbs>
                </Stack>

                <Typography level="body-xs" fontWeight={400}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis officiis totam quis atque voluptates similique commodi,
                </Typography>

            </Stack>

            <BoxComponent
                mt={2}
                p={2}
            >
                <Stack direction={'column'} spacing={1}>
                    <Typography fontWeight={600}>
                        {MANAGE_OBJECTIVES_HEADER}
                    </Typography>

                    <Typography level="body-xs" fontWeight={400}>
                        {MANAGE_OBJECTIVES_SUBHEADER}
                    </Typography>
                </Stack>

                <Divider sx={{ my: 1 }} />

                <Stack
                    direction={'row'}
                    spacing={1}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                >

                    <SearchBarComponent
                        placeholder="search objectives"
                    />

                    <ButtonComponent
                        onClick={() => handleOpenObjectivesModal()}
                        label={"Add an Objective"}
                    // endDecorator={<Plus size={16} />}
                    // disabled={!show || disabledEditMode(APPLICATION_OBJECTIVE_ID, remarks, comments, disabled)}
                    />
                </Stack>


            </BoxComponent>

            {isLoading
                ?
                <BoxComponent
                    mt={3}
                    height={"65vh"}
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"center"}
                    alignContent={"center"}
                >
                    <ThreeDotsLoader />
                </BoxComponent>
                :
                <BoxComponent
                    mt={3}
                    height={"65vh"}
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"center"}
                    alignContent={"center"}
                >
                    <Stack
                        direction={"column"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        textAlign={"center"}
                        m={2}
                    >
                        <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
                            {OBJECTIVES_EMPTY_STATE_TITLE}
                        </Typography>

                        <Typography sx={{ fontSize: 20, fontWeight: 400 }}>
                            {OBJECTIVES_CREATE_NEW}
                        </Typography>
                    </Stack>

                    <Stack
                        direction={"row"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        gap={2}
                    >
                        <ButtonComponent
                            onClick={() => handleOpenObjectivesModal()}
                            label={"Add an Objective"}
                        // endDecorator={<Plus size={16} />}
                        />
                    </Stack>

                    {/* <ThreeDotsLoader /> */}
                </BoxComponent>
            }

            <ModalComponent
                isOpen={isOpenObjectivesModal}
                handleClose={() => setIsOpenObjectivesModal(false)}
                title={ADD_OBJECTIVE}
                description={ADD_OBJECTIVE_SUBHEADING}
                content={
                    <ObjectivesModal
                        functionType={functionType}
                        objective={objective}
                        successIndicator={successIndicator}
                    />
                }
                hasActionButtons={true}
                rightButtonLabel={'Save Objective'}
                rightButtonAction={() => handleSaveObjectives()}
            />

        </div>
    )
}

export default Objectives