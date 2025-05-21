
import {
  Box,
  Typography,
  Button,
  IconButton,
  Sheet,
} from '@mui/joy';

export default function IndicatorDialog({children}) {
  return (
    <Box
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 'sm',
        width: 360,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      {children}
    </Box>
  );
}
