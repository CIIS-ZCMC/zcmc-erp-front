import { useEffect } from 'react'

import { Stack, Typography } from '@mui/joy'

import TextareaComponent from '@Components/Form/TextareaComponent'
import InputComponent from '@Components/Form/InputComponent'

import { ThreeDotsLoader } from '@Components/Common/Loading/ThreeDotsLoader'

const CardBody = ({
    status,
    success_indicator,
    objective,
}) => {

    if (!objective) {
        return <ThreeDotsLoader />; // Still loading or not yet selected
    }

    const { description, type_of_function } = objective;

    return (
        <>
            <Stack
                alignItems={'start'}
            >
                {!status ?
                    <Typography
                        level={'body-sm'}
                    // sx={{ flex: 1 }}
                    >
                        {type_of_function?.type}
                    </Typography>
                    :
                    <InputComponent
                        placeholder={'Function Type'}
                    />
                }

                {!status ?
                    <Typography
                        level={'title-md'}
                        sx={{
                            // flex: 1,
                            textAlign: 'left',
                        }}

                    >
                        {description}
                    </Typography>
                    :
                    <InputComponent
                        placeholder={'Objective Name'}
                    />
                }
            </Stack>

            {!status ?
                <Typography
                    level="body-sm"
                    sx={{
                        // flex: 1,
                        textAlign: 'right',
                        // whiteSpace: 'nowrap',
                        // overflow: 'hidden',
                        // textOverflow: 'ellipsis',
                        // maxWidth: '50%',
                    }}
                >
                    {success_indicator?.description}
                </Typography>
                :
                <TextareaComponent
                    placeholder={'Success indicator'}
                />
            }

        </>
    )
}

export default CardBody