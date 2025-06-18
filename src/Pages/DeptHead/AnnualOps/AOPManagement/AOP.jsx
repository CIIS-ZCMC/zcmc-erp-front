import { Fragment, useEffect } from 'react'
import { Outlet } from 'react-router-dom';

import { AOP_CONSTANTS } from '../../../../Data/constants';
import PageTitle from '../../../../Components/Common/PageTitle';

const AOP = () => {

    const aopApplicationId = localStorage.getItem('aop-application-id')

    return (
        <Fragment>
            <PageTitle
                title={aopApplicationId ? AOP_CONSTANTS.EDIT_AOP_TITLE : AOP_CONSTANTS.CREATE_AOP_TITLE}
                description={aopApplicationId ? AOP_CONSTANTS.EDIT_AOP_SUBHEADING : AOP_CONSTANTS.CREATE_AOP_SUBHEADING}
            />
            <Outlet />
        </Fragment>
    );
}

export default AOP;
