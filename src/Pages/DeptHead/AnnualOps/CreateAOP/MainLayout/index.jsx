import { Fragment } from 'react';

import { Outlet } from 'react-router-dom';

//custom components
import PageTitle from '../../../../../Components/Common/PageTitle';

import { AOP_CONSTANTS } from '../../../../../Data/constants';

const CreateAOP = () => {
  return (
    <Fragment>

      <PageTitle
        title={AOP_CONSTANTS.CREATE_AOP_TITLE}
        description={AOP_CONSTANTS.CREATE_AOP_SUBHEADING}
      />
      <Outlet />

    </Fragment >
  )
}

export default CreateAOP;
