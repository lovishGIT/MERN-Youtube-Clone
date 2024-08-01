export function getTimeDiffString(createdAt) {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();

    // @ts-ignore
    const timeDifferenceMs = currentDate - createdDate;
    const secondsDifference = Math.floor(timeDifferenceMs / 1000);
    const minutesDifference = Math.floor(timeDifferenceMs / (1000 * 60));
    const hoursDifference = Math.floor(timeDifferenceMs / (1000 * 60 * 60));
    const daysDifference = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));

    if (daysDifference > 0) {
        return daysDifference + ' days ago';
    } else if (hoursDifference > 0) {
        return hoursDifference + ' hours ago';
    } else if (minutesDifference > 0) {
        return minutesDifference + ' minutes ago';
    } else if (secondsDifference > 0) {
        return secondsDifference + ' seconds ago';
    }
}