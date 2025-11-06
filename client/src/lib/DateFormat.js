export const DateFormat = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-US', {
        weekday: 'short',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
