import React from 'react'

import { IconButton } from '@mui/joy'

const IconButtonComponent = ({ disabled, variant, onClick, icon }) => {
    return (
        <div>
            <IconButton
                disabled={disabled}
                variant={variant}
                onClick={onClick}
            >
                {icon}
            </IconButton>
        </div>
    )
}

export default IconButtonComponent