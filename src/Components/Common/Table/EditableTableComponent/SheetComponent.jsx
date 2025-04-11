import React, { Fragment } from 'react'
import { Sheet } from '@mui/joy'

const SheetComponent = ({
    children,
    columns,
    lastColumnWidthm,
}) => {
    return (
        <Fragment>
            <Sheet
                variant="outlined"
                sx={() => ({
                    "--TableCell-height": "40px",
                    // the number is the amount of the header rows.
                    "--TableHeader-height": "calc(1 * var(--TableCell-height))",
                    // "--Table-firstColumnWidth": columns[0]?.width, //set the width of the first column in px
                    // "--Table-lastColumnWidth": lastColumnWidth, //set the width of the first column in px
                    // background needs to have transparency to show the scrolling shadows
                    "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
                    "--TableRow-hoverBackground": "rgba(0 0 0 / 0.08)",
                    overflow: "auto",
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: "local, local, scroll, scroll",
                    backgroundPosition:
                        "var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height), var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height)",
                    backgroundColor: "background.surface",
                })}
            >
                {children}
            </Sheet>

        </Fragment>
    )
}

export default SheetComponent