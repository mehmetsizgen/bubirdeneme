const GetBlogDetails = async (distinct:string = "*", id:string="", url:string= "") => {
  const response = await fetch(
      `${process.env.SITE_URL}/api/blogs_function?distinct=${distinct}&id=${id}&url=${url}`,
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

export default GetBlogDetails