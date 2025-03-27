function formatDate(dateStr: string): string {
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`; // YYYY-MM-DD formatına dönüştür
}
export default formatDate