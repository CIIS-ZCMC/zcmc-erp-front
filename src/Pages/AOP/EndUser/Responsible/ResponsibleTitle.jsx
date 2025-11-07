import React, { useEffect } from 'react'

import PageTitle from '@Components/Common/PageTitle';

import { RESPONSIBLE } from '../../../../Data/constants';

const ResponsibleTitle = (
    { activity }
) => {

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
                items={[
                    { label: "Objectives", path: "/objectives" },
                    { label: "Activities", path: `/activities/${application_objective_id}` },
                    { label: "Responsible Persons", current: true },
                ]}
            />
        </>
    )
}

export default ResponsibleTitle