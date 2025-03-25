import React from 'react'

import { Sheet, Typography, Stack, Link } from '@mui/joy';
import { ExternalLink } from 'lucide-react';

const Footer = () => {
    return (
        <div>
            <Sheet sx={{
                p: 1.5,
                borderRadius: '10px',
                backgroundColor: '#0A223E',
                mt: 2,
            }}>
                <Typography
                    level="title-sm"
                    sx={{
                        color: '#E6E6E6',
                        mb: 1,
                    }}
                >
                    Help and Support
                </Typography>
                <Typography
                    level="body-sm"
                    fontSize={12}
                    sx={{
                        color: '#E6E6E6'
                    }}
                >
                    Let us know about your experience.
                    Your feedback is invaluable in ensuring the stability of the new AOP and PPMP Management System.
                </Typography>

                <Stack mt={2} direction={'row'} alignItems={'center'}>
                    <Link>
                        <Stack direction={'row'} alignItems={'center'}>
                            <Typography mr={1} fontSize={12} sx={{ color: '#E6E6E6', }}>
                                Chat with support
                            </Typography>
                            <ExternalLink color="#E6E6E6" size={16} />
                        </Stack>
                    </Link>

                </Stack>
            </Sheet>

        </div>
    )
}

export default Footer;