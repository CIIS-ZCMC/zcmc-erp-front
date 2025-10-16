import { Stack, Typography } from '@mui/joy'

import TextareaComponent from '@Components/Form/TextareaComponent'
import InputComponent from '@Components/Form/InputComponent'

const CardBody = ({
    status
}) => {
    return (
        <>
            <Stack
                alignItems={'start'}
            >
                {!status ?
                    <Typography
                        level={'body-sm'}
                        sx={{ flex: 1 }}
                    >
                        Function Type
                    </Typography>
                    :
                    <InputComponent
                        placeholder={'Function Type'}
                    />
                }

                {!status ?
                    <Typography
                        level={'title-lg'}
                        sx={{ flex: 1 }}
                    >
                        Objective Name #1
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
                        flex: 1,
                        textAlign: 'left',
                        // whiteSpace: 'nowrap',
                        // overflow: 'hidden',
                        // textOverflow: 'ellipsis',
                        // maxWidth: '50%',
                    }}
                >
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis perspiciatis maiores amet atque ducimus expedita tempora Voluptas, illo.
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