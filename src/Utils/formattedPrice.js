export const formattedPrice = (price) => {
    return price?.toLocaleString(undefined, {
        style: 'currency',
        currency: 'PHP',  // Philippine Peso
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

export default formattedPrice;