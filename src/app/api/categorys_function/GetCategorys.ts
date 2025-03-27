const GetCategorys = async (
  id:number       = 0, 
  slug:string     = "",
  array_id:any    = [], 
) => {
    const response = await fetch(
        `${process.env.SITE_URL}/api/categorys_function?id=${id}&slug=${slug}&array_id=${array_id}`,
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
  
  export default GetCategorys