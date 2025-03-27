function getOverlappingDays(
    selectedStart: Date, 
    selectedEnd: Date, 
    discountStart: Date, 
    discountEnd: Date
  ): number {
    const overlapStart = new Date(Math.max(selectedStart.getTime(), discountStart.getTime()));
    const overlapEnd = new Date(Math.min(selectedEnd.getTime(), discountEnd.getTime()));
  
    if (overlapStart > overlapEnd) return 0;
  
    const timeDiff = overlapEnd.getTime() - overlapStart.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1; // Gün sayısı
  }