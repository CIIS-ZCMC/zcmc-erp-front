export function FormattedLongDate(dateString, showYear = false) {
    try {
        // Handle both "YYYY-MM" and "YYYY-MM-DD" formats
        const date = new Date(dateString.includes('-') ? dateString : `${dateString}-01`);

        // Validate the date
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
        }

        const options = { month: 'long' };
        if (showYear) {
            options.year = 'numeric';
        }

        return date.toLocaleString('default', options);
    } catch (error) {
        console.error('Date formatting error:', error);
        return 'Invalid date';
    }
}