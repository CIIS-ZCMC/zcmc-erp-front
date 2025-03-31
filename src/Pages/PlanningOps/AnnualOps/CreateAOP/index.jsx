import { Outlet } from 'react-router-dom'
import Header from '../../../../Layout/Header'

import { AOP_CONSTANTS } from '../../../../Data/constants'

const CreateAOP = () => {

    const pageDetails = {
        title: AOP_CONSTANTS.CREATE_AOP_TITLE,
        description: AOP_CONSTANTS.CREATE_AOP_SUBHEADING
    }

    return (
        <>
            <Header
                pageDetails={pageDetails}
            />

            <Outlet />
        </>
    )
}

export default CreateAOP