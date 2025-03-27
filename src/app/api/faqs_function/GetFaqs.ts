const GetFaqs = async (distinct:string = "*") => {
    const response = await fetch(
        `${process.env.SITE_URL}/api/faqs_function?distinct=${distinct}`,
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

export default GetFaqs