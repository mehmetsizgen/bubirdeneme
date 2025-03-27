const GetRegions = async (
    id:number       = 0, 
    slug:string     = '',
    array_id:any    = [], 
  ) => {
      const response = await fetch(
          `${process.env.SITE_URL}/api/regions_function?id=${Number(id)}&slug=${slug}&array_id=${array_id}`,
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
    
    export default GetRegions