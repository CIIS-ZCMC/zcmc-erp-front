import PropTypes from 'prop-types';
import { Button } from '@mui/joy';

const ButtonComponent = ({
    size,
    label,
    onClick,
    variant,
    color,
    startDecorator,
    endDecorator,
    fullWidth,
    disabled,
    type
}) => {
    return (
        <Button
            type={type}
            size={size}
            variant={variant}
            color={color}
            onClick={onClick}
            startDecorator={startDecorator}
            endDecorator={endDecorator}
            fullWidth={fullWidth}
            disabled={disabled}
        >
            {label}
        </Button>
    )
}

ButtonComponent.propTypes = {
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    label: PropTypes.string,
    onClick: PropTypes.func,
    variant: PropTypes.oneOf(['solid', 'outlined', 'text']),
    color: PropTypes.string,
    startDecorator: PropTypes.node,
    endDecorator: PropTypes.node,
    fullWidth: PropTypes.bool,
    disabled: PropTypes.bool,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default ButtonComponent


