import React from 'react'

import AccordionSummary from '../Activities/AccordionSummary';
import AccordionDetails from '../Activities/AccordionDetails';

import BoxComponent from '@Components/Common/Card/BoxComponent';
import AccordionComponent from '@Components/Common/AccordionComponent';

import PeopleIcon from '../../../../../assets/responsible_people/People.svg';
import ResourcesIcon from '../../../../../assets/dashboard/Resources.svg';

const ActivityAccordion = ({ activities }) => {
    return (
        <>
            {activities.map(({ name, start_month, end_month, is_gad_related, counts, target }, index) => {

                const { total_cost, resources_count, responsible_people_count } = counts

                const {
                    first_quarter,
                    second_quarter,
                    third_quarter,
                    fourth_quarter
                } = target;

                const activityIndex = index + 1

                return <>
                    <AccordionComponent
                        defaultExpanded={false}
                        accordionSummary={
                            <AccordionSummary
                                activityIndex={activityIndex}
                                name={name}
                                startMonth={start_month}
                                endMonth={end_month}
                                isGadRelated={is_gad_related}
                                totalCost={total_cost}
                                resourcesCount={resources_count}
                                peopleCount={responsible_people_count}
                            />}
                        accordionDetails={
                            <AccordionDetails
                                first_quarter={first_quarter}
                                second_quarter={second_quarter}
                                third_quarter={third_quarter}
                                fourth_quarter={fourth_quarter}
                            />}
                    />
                </>

            })}

        </>
    )
}

export default ActivityAccordion