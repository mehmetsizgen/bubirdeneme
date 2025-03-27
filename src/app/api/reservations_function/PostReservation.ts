const PostReservations = async (
    params:any = null 
  ) => {
      const response = await fetch(
          `${process.env.SITE_URL}/api/reservations_function`,
          {
            //   cache: 'force-cache',
              method: 'POST',
              headers : {
                "Content-Type": "application/json"
              },
          }
      )
      return await response.json()
    }
    
    export default PostReservations