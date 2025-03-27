const GetFeatures = async (id:number = 0, slug:string = "") => {
    const response = await fetch(
        `${process.env.SITE_URL}/api/features_function?id=${id}&slug=${slug}`,
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

export default GetFeatures