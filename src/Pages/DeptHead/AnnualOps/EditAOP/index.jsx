import { Fragment } from 'react';

import { Outlet } from 'react-router-dom';

//custom components
import PageTitle from '../../../../Components/Common/PageTitle';
import { AOP_CONSTANTS } from '../../../../Data/constants';

const EditAOP = () => {
    return (
        <Fragment>

            <PageTitle
                title={AOP_CONSTANTS.EDIT_AOP_TITLE}
                description={AOP_CONSTANTS.EDIT_AOP_SUBHEADING}
            />

            <Outlet />

        </Fragment >
    )
}

export default EditAOP;