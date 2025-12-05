import React, { useState } from 'react'

import TabComponent from '@Components/Common/TabComponent'
import ExpandableTable from '@Components/Common/Table/ExpandableTable'

import { submittedRequestsTabs } from '../../../../../Data/Options'

import { ITEMS_REQUESTS } from '../../../../../Data/Columns'

const ExpandedTable = ({ row }) => {
    <>
        <Typography
            level="body-sm"
            startDecorator={
                <ExtensionOutlined color="primary" sx={{ fontSize: 20 }} />
            }
            alignItems={"center"}
            mb={2}
            fontWeight={600}
            sx={{ color: grey[800] }}
        >
            Specifications
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
            {row?.item_specifications?.map((spec, i) => (
                <Sheet
                    key={i}
                    variant="outlined"
                    sx={{ p: 2, borderRadius: 15, minWidth: 260 }}
                >
                    {spec.description}
                </Sheet>
            ))}
        </Box>
    </>
}

const Content = () => {

    const [index, setIndex] = useState('')

    return (
        <>
            <TabComponent
                tabs={submittedRequestsTabs}
                index={index}
                setIndex={setIndex}
            />

            <ExpandableTable
                columns={ITEMS_REQUESTS}
                // rows={}
                // isLoading={}
                renderExpanded={(row) => (
                    <>
                        <ExpandedTable row={row} />
                    </>
                )}
            />

        </>
    )
}

export default Content