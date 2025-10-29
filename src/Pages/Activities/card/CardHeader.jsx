import React from 'react'

import IconButtonComponent from '@Components/Common/IconButtonComponent'
import { Pencil, Trash } from 'lucide-react'

const CardHeader = ({ handleEdit, handleDelete }) => {
    return (
        <>
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