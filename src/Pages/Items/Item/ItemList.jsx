import { useState, useMemo, useEffect, useCallback, useRef, Fragment, } from 'react';
import { Grid, Skeleton } from '@mui/joy';

import useResourceHook from '../../../Hooks/ResourceHook';
import useItemsHook from '../../../Hooks/ItemsHook';

//custom components
import { ThreeDotsLoader } from '../../../Components/Common/Loading/ThreeDotsLoader';
import BoxComponent from '../../../Components/Common/Card/BoxComponent';
import SearchBarComponent from '../../../Components/SearchBarComponent';
import Item from './Item';

const ITEMS_PER_BATCH = 12;

const ItemList = ({
    isLoading,
    quantity,
    displayedItems,
    activityId,
    setDisplayedItems,
    handleOpenItemDialog,
}) => {

    const { items, getItems } = useItemsHook();
    const { addResourceToCart } = useResourceHook();

    const loadMoreRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    useEffect(() => {
        console.log('items', items)
        console.log('displayed Items', displayedItems)
    }, [items, displayedItems])

    const filteredItems = useMemo(() => {
        return searchTerm.trim()
            ? items.filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : items;
    }, [items, searchTerm]);

    const fetchMoreItems = useCallback(() => {
        if (!filteredItems.length) return;

        setIsFetchingMore(true); // Start loading

        setTimeout(() => {
            setDisplayedItems((prev) => {
                const nextItems = filteredItems.slice(
                    prev.length,
                    prev.length + ITEMS_PER_BATCH
                );
                if (nextItems.length === 0) {
                    setHasMore(false);
                }
                return [...prev, ...nextItems];
            });
            setIsFetchingMore(false); // End loading
        }, 500);
    }, [filteredItems]);

    // Observe loadMoreRef
    useEffect(() => {
        const target = loadMoreRef.current; // ✅ Capture current value
        if (!target) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
                    fetchMoreItems();
                }
            },
            { threshold: 1.0 }
        );

        observer.observe(target);

        return () => {
            observer.disconnect(); // ✅ Safely disconnect
        };
    }, [fetchMoreItems, hasMore, isFetchingMore]);

    useEffect(() => {
        setDisplayedItems(filteredItems.slice(0, ITEMS_PER_BATCH));
        setHasMore(filteredItems.length > ITEMS_PER_BATCH);
    }, [filteredItems])

    return (
        <Fragment>

            <BoxComponent sx={{ position: "sticky", top: 0 }}>
                <SearchBarComponent onSearch={(term) => setSearchTerm(term)} />
            </BoxComponent>

            {isLoading ? <ThreeDotsLoader />
                :
                <Fragment>
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

                        <Grid item xs={12}>
                            <div ref={loadMoreRef}>
                                {hasMore && isFetchingMore && (
                                    <Grid container spacing={2}>
                                        {[...Array(3)].map((_, idx) => (
                                            <Grid
                                                item
                                                xs={12}
                                                sm={2}
                                                md={6}
                                                lg={4}
                                                xl={3.6}
                                                key={idx}
                                            >
                                                <Skeleton
                                                    variant="rectangular"
                                                    animation="wave"
                                                    height={180}
                                                    sx={{ borderRadius: 10 }}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </div>
                        </Grid>

                        {/* <div ref={loadMoreRef}>Loading more items...</div> */}
                    </Grid>
                </Fragment>
            }
        </Fragment>
    )
}

export default ItemList