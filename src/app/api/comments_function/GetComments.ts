const GetComments = async (
    id:number       = 0, 
  ) => {
      const response = await fetch(
          `${process.env.SITE_URL}/api/comments_function?id=${id}`,
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
    
    export default GetComments