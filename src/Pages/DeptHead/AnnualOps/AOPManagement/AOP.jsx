import { Fragment } from 'react'
import { Outlet } from 'react-router-dom';

import { AOP_CONSTANTS } from '../../../../Data/constants';
import PageTitle from '../../../../Components/Common/PageTitle';

const AOP = () => {
    return (
        <Fragment>
            <PageTitle
                title={AOP_CONSTANTS.CREATE_AOP_TITLE}
                description={AOP_CONSTANTS.CREATE_AOP_SUBHEADING}
            />
            <Outlet />
        </Fragment>
    );
}

export default AOP;
