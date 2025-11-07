import React from 'react'

import { Stack } from '@mui/joy'

import IconButtonComponent from '@Components/Common/IconButtonComponent'

import { Check, Pencil, Trash } from 'lucide-react'

const CardHeader = (
    {
        handleSave,
        handleEdit,
        handleDelete
    }
) => {
    return (
        <>
            {/* <IconButtonComponent
                size={'sm'}
                icon={<Check size={18} />}
                onClick={handleSave}
            /> */}

            <IconButtonComponent
                size={'sm'}
                icon={<Pencil size={18} />}
                onClick={handleEdit}
            />

            <IconButtonComponent
                size={'sm'}
                icon={<Trash size={18} />}
                onClick={handleDelete}
            />
        </>
    )
}

export default CardHeader