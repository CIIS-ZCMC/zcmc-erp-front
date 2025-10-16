import { Fragment } from 'react';

import { Stack, Box, Typography } from '@mui/joy';

const Header = ({ year, mission }) => {
    return (
        <Fragment>
            <Stack>
                <Box
                    bgcolor="#006599"
                    padding={3}
                    sx={{ borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
                >
                    <Typography sx={{ color: "white", fontSize: 32, fontWeight: 600 }}>
                        AOP year {year}
                    </Typography>
                    <Typography sx={{ color: "white", fontSize: 14 }}>
                        {mission}
                    </Typography>
                </Box>
            </Stack>
        </Fragment>
    )
}

export default Header