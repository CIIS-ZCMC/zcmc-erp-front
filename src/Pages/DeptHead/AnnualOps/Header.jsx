import { Fragment } from 'react';

import { Stack, Box, Typography } from '@mui/joy';

const Header = () => {
    return (
        <Fragment>
            <Stack>
                <Box
                    bgcolor="#006599"
                    padding={3}
                    sx={{ borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
                >
                    <Typography sx={{ color: "white", fontSize: 32, fontWeight: 600 }}>
                        PPMP #2023-0031 for Fiscal year 2026
                    </Typography>
                    <Typography sx={{ color: "white", fontSize: 14 }}>
                        Mission: This is a sample mission written by the requesting body.
                        This could be as short as a
                        <br></br>
                        single sentence but could be as long
                        as two sentences if necessary.
                    </Typography>
                </Box>
            </Stack>
        </Fragment>
    )
}

export default Header