import { Sheet } from "@mui/joy";

const SheetComponent = ({ variant, children, width }) => {

    const sheetStyles = {
        borderRadius: '20px',
        padding: '1rem',
        width: width
    }

    return (
        <>
            <Sheet
                sx={{ ...sheetStyles }}
                variant={variant}
            >
                {children}
            </Sheet>
        </>
    )
}

export default SheetComponent