import { useState } from 'react'

import { Input, IconButton, Box, FormControl, FormLabel } from '@mui/joy'
import { Search, X } from 'lucide-react';

const SearchBarComponent = (
    {
        placeholder = 'Search...',
        debounceTime = 300,
        onSearch,
        loading = false,
        fullWidth = true,
        size = 'md',
        variant = 'outlined',
        sx = {},
        startDecorator,
        endDecorator,
        label
    }
) => {

    const [searchTerm, setSearchTerm] = useState('');
    const [displayTerm, setDisplayTerm] = useState('');

    const handleClear = () => {
        setSearchTerm('');
        setDisplayTerm('');
    };

    return (
        <>
            <FormControl>
                <FormLabel>{label}</FormLabel>
                <Input
                    size={size}
                    variant={variant}
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    startDecorator={startDecorator || <Search />}
                    endDecorator={
                        <>
                            {loading && <CircularProgress size="sm" />}
                            {searchTerm && !loading && (
                                <IconButton onClick={handleClear} size="sm">
                                    <X />
                                </IconButton>
                            )}
                            {endDecorator}
                        </>
                    }
                    fullWidth={fullWidth}
                />
                {displayTerm && (
                    <Typography level="body-xs" sx={{ mt: 1 }}>
                        Searching for: {displayTerm}
                    </Typography>
                )}

            </FormControl>
        </>
    )
}

export default SearchBarComponent