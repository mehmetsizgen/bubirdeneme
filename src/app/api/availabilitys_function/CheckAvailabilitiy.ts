function CheckAvailabilitiy(availability: any[], checkInDate: any, checkOutDate: any) {
    for (const reservation of availability) {
        const res = reservation.json; 
        const resCheckIn = new Date(res.check_in);
        const resCheckOut = new Date(res.check_out);
        if (
            (checkInDate >= resCheckIn && checkInDate <= resCheckOut) || 
            (checkOutDate >= resCheckIn && checkOutDate <= resCheckOut) ||
            (checkInDate <= resCheckIn && checkOutDate >= resCheckOut) ||
            (checkInDate < resCheckIn && checkOutDate > resCheckOut)
        ) return null
    } 
}

export default CheckAvailabilitiy