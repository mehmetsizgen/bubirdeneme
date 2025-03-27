const GetSettings = async (
  
) => {
    const response = await fetch(
        `${process.env.SITE_URL}/api/settings_function`,
        {
          //   cache: 'force-cache',
            method: 'GET',
            headers : {
              "Content-Type": "application/json"
            },
        }
    )
    return await response.json()
  }
  
  export default GetSettings