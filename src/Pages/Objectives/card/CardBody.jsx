import { Stack, Typography } from '@mui/joy'

import TextareaComponent from '@Components/Form/TextareaComponent'
import InputComponent from '@Components/Form/InputComponent'

const CardBody = ({
    status,
    success_indicator,
    objective,
}) => {

    const { description, type_of_function } = objective

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
                        level={'title-lg'}
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