import React, { Fragment } from 'react'

import { Box, Stack, Typography, Divider } from '@mui/joy';
import { Trash } from 'lucide-react';

import ButtonComponent from '../../Components/Common/ButtonComponent';
import QuantityControlComponent from '../../Components/Cart/QuantityControlComponent';

const ItemsCart = ({
    name,
    specType,
    category,
    image,
    quantity
}) => {
    return (
        <Fragment>
            <Box
                m={1}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'space-between'}
            >

                <Box
                    display={'flex'}
                    alignItems={'center'}
                >
                    <Box
                        component="img"
                        src={image}
                        alt={name}
                        loading="lazy"
                        sx={{
                            width: 64,
                            height: 64,
                            objectFit: 'cover',
                            borderRadius: '8px',
                        }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/fallback-image.png';
                        }}
                    />

                    <Stack
                        direction={'column'}
                        m={1}
                    >
                        <Typography>
                            {name}
                        </Typography>
                        <Typography
                            level="body-xs"
                            fontWeight={400}
                        >
                            {specType} - {category}
                        </Typography>

                        <Box>
                            <QuantityControlComponent
                                quantity={quantity}
                            />
                        </Box>
                    </Stack>

                </Box>

                <Box>
                    <ButtonComponent
                        label={'Remove'}
                        variant={'text'}
                        endDecorator={<Trash size={12} />}
                        size={'sm'}
                    />
                </Box>
            </Box>

            <Divider />
        </Fragment>
    )
}

export default ItemsCart