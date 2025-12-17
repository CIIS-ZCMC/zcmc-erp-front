import React from 'react'

import IconButtonComponent from '@Components/Common/IconButtonComponent'
import { Pencil, Trash } from 'lucide-react'

const CardHeader = ({ status, handleEdit, handleDelete }) => {
    return (
        <>
            <IconButtonComponent
                disabled={status === 2 || status === 4}
                size={'sm'}
                icon={<Pencil size={18} />}
                onClick={handleEdit}
            />

            <IconButtonComponent
                disabled={status === 2 || status === 4}
                size={'sm'}
                icon={<Trash size={18} />}
                onClick={handleDelete}
            />
        </>
    )
}

export default CardHeader