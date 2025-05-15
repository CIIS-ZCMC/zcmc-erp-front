
import { Grid } from '@mui/joy';

import useResourceHook from '../../Hooks/ResourceHook';

//custom components
import BoxComponent from '../../Components/Common/Card/BoxComponent';
import SearchBarComponent from '../../Components/SearchBarComponent';
import Item from './Item';

const ItemList = ({
    quantity,
    displayedItems,
    activityId,
    handleOpenItemDialog,
}) => {

    const { addResourceToCart } = useResourceHook();

    return (
        <>
            <BoxComponent sx={{ position: "sticky", top: 0 }}>
                <SearchBarComponent />
            </BoxComponent>

            <Grid
                container
                columns={{ xs: 12, sm: 6, md: 12 }}
                gap={4}
                sx={{
                    flexGrow: 1,
                    mt: 2,
                    p: 1,
                    border: 1,
                    borderColor: "neutral.100",
                    borderRadius: 10,
                    height: "50vh",
                    overflowY: "auto",
                }}
            >
                {displayedItems.map((item, index) => (
                    <Grid
                        key={index}
                        item="true"
                        xs={12}
                        sm={2}
                        md={6}
                        lg={4}
                        xl={3.6}
                        sx={{
                            cursor: "pointer",
                        }}
                    >
                        <Item
                            key={index}
                            item={item}
                            btnAction={() => addResourceToCart(item, activityId, quantity)}
                            itemInfoAction={() => {
                                handleOpenItemDialog(item);
                            }}
                        />
                    </Grid>
                ))}
                {/* <div ref={loadMoreRef}>Loading more items...</div> */}
            </Grid>
        </>
    )
}

export default ItemList