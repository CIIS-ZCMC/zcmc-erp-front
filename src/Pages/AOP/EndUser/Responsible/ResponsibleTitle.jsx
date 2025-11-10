import React, { useEffect } from 'react'

import { useParams } from 'react-router-dom';

import PageTitle from '@Components/Common/PageTitle';
import useAOPBreadcrumbs from '../../../../Hooks/AOP/AOPBreadcrumbs';
import { RESPONSIBLE } from '../../../../Data/constants';

const ResponsibleTitle = (
    { activity }
) => {

    const breadcrumbs = useAOPBreadcrumbs();

    const { PAGE_TITLE, PAGE_DESCRIPTION } = RESPONSIBLE;

    const { application_objective_id
    } = activity || {}

    useEffect(() => {
        console.log(application_objective_id)
    }, [activity])

    return (
        <>
            <PageTitle
                title={PAGE_TITLE}
                description={PAGE_DESCRIPTION}
                items={breadcrumbs}
            />
        </>
    )
}

export default ResponsibleTitle