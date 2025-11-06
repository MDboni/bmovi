const isoTimeFormat = (dateTime) => {
    const date = new Date(dateTime);
    const localTime = date.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // 12-hour format
        // month: 'short',
        // day: 'numeric',
        // year: 'numeric',
    });
    return localTime;
}

export default isoTimeFormat;
