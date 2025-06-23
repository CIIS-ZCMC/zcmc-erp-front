export const formattedPrice = (price) => {
    return price.toLocaleString(undefined, {
        style: 'currency',
        currency: 'PHP',  // assuming Philippine Peso
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}