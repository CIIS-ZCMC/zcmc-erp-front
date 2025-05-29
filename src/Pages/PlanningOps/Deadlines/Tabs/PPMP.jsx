import { Fragment, useEffect } from 'react'

import { Stack, Link } from '@mui/joy';
import { ExternalLink, Trash } from 'lucide-react';
import { IoOpenOutline } from 'react-icons/io5';

import useModalHook from '../../../../Hooks/ModalHook';
import ScrollableTableComponent from '../../../../Components/Common/Table/ScrollableTableComponent'

const PPMP = () => {

    const { openModal, setOpenModal } = useModalHook();

    useEffect(() => {
        if (openModal.isNew) {
            setUpdateData(null);
            resetInput();
        }
    }, [openModal]);

    const data = [
        {
            id: 1,
            fiscalYear: '2025',
            beginOn: "10/10/2023",
            closesIn: "10/10/2023",
            created: "10/10/2023",
            updated: "10/10/2023",
        },

    ];

    const objHeaders = [
        { field: "id", name: "Row #", align: "center", width: "50px" },
        { field: "fiscalYear", name: "Fiscal year", width: 200, align: "left" },
        { field: "beginOn", name: "Begins on", width: 200, align: "left" },
        { field: "closesIn", name: "closes in", width: 200, align: "left" },
        {
            field: "created",
            name: "Created at",
            width: 200,
            align: "left",
        },
        {
            field: "updated",
            name: "Updated at",
            width: 200,
            align: "left",
        },

        {
            field: "action",
            name: "Actions",
            position: "sticky",
            width: "150px",
            right: 0,
            align: "center",
            render: (params) => {
                return (
                    <>
                        <Stack
                            direction="row"
                            sx={{ justifyContent: "space-between", alignItems: "center" }}
                        >
                            <Link
                                onClick={() => {
                                    setUpdateData(params);
                                    setOpenModal(false, false, true);
                                    resetInput();
                                }}
                                size="md"
                                variant="plain"
                                color="primary"
                                underline="hover"
                                fontSize={14}
                                endDecorator={<ExternalLink size={14} />}
                            >
                                Update
                            </Link>
                            <Link
                                onClick={() => {
                                    setOpenModal(false, true, true);
                                    // alert(`Action clicked for ID: ${params.id}`)
                                }}
                                size="md"
                                variant="plain"
                                color="danger"
                                underline="hover"
                                fontSize={14}
                                endDecorator={<Trash size={14} />}
                            >
                                Delete
                            </Link>
                        </Stack>
                    </>
                );
            },
        },
    ];

    return (
        <Fragment>
            <ScrollableTableComponent
                data={data}
                columns={objHeaders}
                pageSize={5}
                stripe="even"
                bordered
                hoverRow
                isLoading={false}
                stickLast
            />
        </Fragment>
    )
}

export default PPMP