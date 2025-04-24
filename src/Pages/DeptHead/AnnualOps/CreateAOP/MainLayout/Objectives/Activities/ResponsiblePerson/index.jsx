import React, { Fragment, useState, useEffect } from 'react';
import { Stack, Grid, } from '@mui/joy';

//Custom Components
import ButtonComponent from '../../../../../../../../Components/Common/ButtonComponent';
import ContainerComponent from '../../../../../../../../Components/Common/ContainerComponent';

// Layouts
import PersonSection from '../../../../../../../../Layout/ResponsiblePerson/PersonSection';
import JobPositionsSection from '../../../../../../../../Layout/ResponsiblePerson/JobPositionsSection';
import AreasSection from '../../../../../../../../Layout/ResponsiblePerson/AreasSection';

//data related
import { AOP_CONSTANTS } from '../../../../../../../../Data/constants';

const ResponsiblePerson = () => {

    //  local states
    const [users, setUsers] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [areas, setAreas] = useState([]);

    const [user, setUser] = useState({
        id: null,
        name: '',
        designation: ''
    });

    const [designation, setDesignation] = useState({
        id: null,
        umis_designation_id: null,
        name: '',
        code: '',
        probation: null,
    })

    const handleSaveAssignmentClick = () => {
        console.log('Selected Users:', users);
        console.log('Selected Designations:', designations);
        console.log('Selected Areas:', areas);
    }

    //add item t odata array 
    const handleSelectedData = (selectedValue, setData, isMultiple = false) => {
        if (!selectedValue) return;

        if (isMultiple) {
            setData(prev => {
                const alreadyExists = prev?.some(item => item.id === selectedValue.id);
                return alreadyExists ? prev : [...prev, selectedValue];
            });
        } else {
            setData(selectedValue);
        }
    };

    //remove item from array
    const handleRemove = (id, data, setData) => {
        const filteredData = data.filter((data) => data.id !== id)
        setData(filteredData)
    }

    return (
        <Fragment>
            <ContainerComponent
                title={AOP_CONSTANTS.TABLE_PERSON_HEADER}
                description={AOP_CONSTANTS.TABLE_PERSON_SUBHEADING}
            >

                <Grid
                    container
                    spacing={3}
                    columns={{ xs: 12, sm: 12, md: 12 }}
                    sx={{
                        flexGrow: 1,
                        width: "auto",
                        p: 1,
                    }}
                >
                    <Grid
                        item
                        xs={12}
                        sm={2}
                        md={4}
                    >
                        <PersonSection
                            users={users}
                            setUsers={setUsers}
                            handleSelectedData={handleSelectedData}
                            handleRemove={handleRemove}
                        />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={2}
                        md={4}
                    >
                        <JobPositionsSection
                            designations={designations}
                            setDesignations={setDesignations}
                            handleSelectedData={handleSelectedData}
                            handleRemove={handleRemove}
                        />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={2}
                        md={4}
                    >
                        <AreasSection
                            areas={areas}
                            setAreas={setAreas}
                            handleSelectedData={handleSelectedData}
                            handleRemove={handleRemove}
                        />

                    </Grid>

                </Grid>

                <Stack
                    mt={2}
                    direction={'flex'}
                    alignItems={'center'}
                    justifyContent={'start'}
                    gap={1}
                >
                    <ButtonComponent
                        label={'Cancel Selection'}
                        size={'md'}
                        variant={'outlined'}
                    // onClick={() => navigate(`/aop-create`)}
                    />

                    <ButtonComponent
                        label={'Save Assignment'}
                        size={'md'}
                        variant={'solid'}
                        onClick={() => handleSaveAssignmentClick()}
                    // onClick={(e) => console.log(e)}
                    />
                </Stack>
            </ContainerComponent>
        </Fragment>
    )
}

export default ResponsiblePerson