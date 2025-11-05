import React from 'react'

import PageTitle from '@Components/Common/PageTitle';

import { RESPONSIBLE } from '../../../../Data/constants';

const ResponsibleTitle = () => {

    const { PAGE_TITLE, PAGE_DESCRIPTION } = RESPONSIBLE;

    return (
        <>
            <PageTitle
                title={PAGE_TITLE} //ADD YEAR HERE
                description={PAGE_DESCRIPTION}
                items={[
                    { label: "Objectives", path: "/objectives" },
                    { label: "Activities", path: "/activities" },
                    { label: "Responsible Persons", current: true },
                ]}
            />
        </>
    )
}

export default ResponsibleTitle