import React from 'react'

import { IconButton } from '@mui/joy'

const IconButtonComponent = ({ disabled, variant, onClick, icon, size, color }) => {
    return (
        <div>
            <IconButton
                disabled={disabled}
                variant={variant}
                onClick={onClick}
                size={size}
                color={color}
            >
                {icon}
            </IconButton>
        </div>
    )
}

export default IconButtonComponent