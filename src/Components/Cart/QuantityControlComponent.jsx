import React from 'react';

import { Stack, Typography, Input } from '@mui/joy';
import { Minus, Plus } from 'lucide-react';

import IconButtonComponent from '../../Components/Common/IconButtonComponent';
import InputComponent from '../../Components/Form/InputComponent';

const QuantityControlComponent = ({ quantity }) => {
    return (
        <Stack direction="row" alignItems="center" spacing={1}>

            <IconButtonComponent
                size={'sm'}
                variant={'outlined'}
                color={'nuetral'}
                icon={<Minus size={14} />}
            // disabled={quantity <= 1}
            // onClick={onDecrease}
            />

            <Input
                variant="outlined"
                size="sm"
                value={100}
                // onChange={handleChange}
                // onBlur={handleBlur}
                // onKeyDown={handleKeyDown}
                sx={{
                    width: 60
                }}
                autoFocus
            />

            {/* <Typography level="body-md" width="2rem" textAlign="center">
                {quantity}
            </Typography> */}

            <IconButtonComponent
                size={'sm'}
                variant={'outlined'}
                color={'nuetral'}
                icon={<Plus size={14} />}
            // disabled={quantity <= 1}
            // onClick={onDecrease}
            />
        </Stack>
    )
}

export default QuantityControlComponent
