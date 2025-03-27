const GetPrices = async (
    id:number = 0,
    min:number = 0,
    max:number = 5000000,
) => {
    const response = await fetch(
        `${process.env.SITE_URL}/api/prices_function?id=${id}&min=${min}&max=${max}`,
        {
            // cache: 'force-cache',
            method: 'GET',
            headers : {
                "Content-Type": "application/json"
            }
        }
    )
    return await response.json()
}

export default GetPrices