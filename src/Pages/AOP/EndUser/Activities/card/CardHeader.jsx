import React from 'react'

import IconButtonComponent from '@Components/Common/IconButtonComponent'
import { Pencil, Trash } from 'lucide-react'

import { isAopDisabled } from '../../../../../Utils/AopStatus'

const CardHeader = ({ status, handleEdit, handleDelete }) => {
    return (
        <>
            <IconButtonComponent
                disabled={isAopDisabled(status)}
                size={'sm'}
                icon={<Pencil size={18} />}
                onClick={handleEdit}
            />

            <IconButtonComponent
                disabled={isAopDisabled(status)}
                size={'sm'}
                icon={<Trash size={18} />}
                onClick={handleDelete}
            />
        </>
    )
}

export default CardHeader