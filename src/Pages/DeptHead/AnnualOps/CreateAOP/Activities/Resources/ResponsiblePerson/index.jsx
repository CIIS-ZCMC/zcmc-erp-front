import React, { Fragment } from 'react'

import { Stack } from '@mui/joy'

import ButtonComponent from '../../../../../../../Components/Common/ButtonComponent'
import ContainerComponent from '../../../../../../../Components/Common/ContainerComponent'

import { AOP_CONSTANTS } from '../../../../../../../Data/constants'

const ResponsiblePerson = () => {
    return (
        <Fragment>
            <ContainerComponent
                title={AOP_CONSTANTS.TABLE_PERSON_HEADER}
                description={AOP_CONSTANTS.TABLE_PERSON_SUBHEADING}
            >

                Responsible Person here

                <Stack
                    mt={2}
                    direction={'flex'}
                    alignItems={'center'}
                    justifyContent={'start'}
                    gap={1}
                >
                    <ButtonComponent
                        label={'Cancel Selection'}
                        size={'md'}
                        variant={'outlined'}
                    // onClick={() => navigate(`/aop-create`)}
                    />

                    <ButtonComponent
                        label={'Save Assignment'}
                        size={'md'}
                        variant={'solid'}
                    // onClick={() => navigate(`/aop-create`)}
                    />
                </Stack>
            </ContainerComponent>
        </Fragment>
    )
}

export default ResponsiblePerson