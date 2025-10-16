import { Fragment } from 'react'

import { Stack, Typography, } from '@mui/joy'
import BoxComponent from '../../../Components/Common/Card/BoxComponent'

const SummaryCard = ({ title, content }) => {
    return (
        <Fragment>
            < BoxComponent
                p={2}
            >
                <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                    {title}
                </Typography>
                <Stack
                    mt={2}
                    direction={'row'}
                    alignItems={'start'}
                    gap={1}
                >
                    {/* <MousePointerClick size={20} /> */}
                    <Typography sx={{ fontSize: 14, fontWeight: 400 }}>
                        {content}
                    </Typography>
                </Stack>
            </BoxComponent >
        </Fragment>

    )
}
export default SummaryCard

