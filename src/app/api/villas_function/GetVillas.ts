const GetVillas = async (
  id:number         = 0, 
  slug:string       = "",
  take:number       = Number(process.env.DEFAULT_PAGINATION), 
  skip:number       = 0, 
  order:string      = "desc", 
  prices:string     = "0,9999999", 
  check_in:any      = null, 
  check_out:any     = null, 
) => {
    const response = await fetch(
        `${process.env.SITE_URL}/api/villas_function?id=${id}&slug=${slug}&take=${take}&skip=${skip}&order=${order}&prices=${prices}&check_in=${check_in}&check_out=${check_out}`,
        {
          //   cache: 'force-cache',
            method: 'GET',
            headers : {
              "Content-Type": "application/json"
            },
            signal: AbortSignal.timeout(5000)
        },
        
    )
    return await response.json()
  }
  
  export default GetVillas