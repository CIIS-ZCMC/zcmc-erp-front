import { Fragment, useEffect } from 'react'
import { Outlet } from 'react-router-dom';

import { AOP_CONSTANTS } from '../../../../Data/constants';
import PageTitle from '../../../../Components/Common/PageTitle';

import { localStorageGetter } from '../../../../Utils/LocalStorage';

const AOP = () => {

    const AOP_APPLICATION_ID = localStorageGetter('aop-app-id')

    return (
        <Fragment>
            <PageTitle
                title={AOP_APPLICATION_ID ? AOP_CONSTANTS.EDIT_AOP_TITLE : AOP_CONSTANTS.CREATE_AOP_TITLE}
                description={AOP_APPLICATION_ID ? AOP_CONSTANTS.EDIT_AOP_SUBHEADING : AOP_CONSTANTS.CREATE_AOP_SUBHEADING}
            />
            <Outlet />
        </Fragment>
    );
}

export default AOP;
