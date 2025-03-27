function getNightDifference(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const nightDifference = diffTime / (1000 * 3600 * 24); 
    return Math.floor(nightDifference);
}

export default getNightDifference