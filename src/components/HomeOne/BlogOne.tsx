import BlogCardOne from './ui/BlogCardOne';


export async function BlogOne() {

    const response = await fetch(
        `${process.env.SITE_URL}/api/blogs_function?token=${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
        {
          //   cache: 'force-cache',
            method: 'GET',
            headers : {
              "Content-Type": "application/json"
            },
        }
    )
    let get_blogs:any = await response.json()
    let totalcount = get_blogs?.pagination?.total || 0;
    if (totalcount == 0){ 
        return false
    }
    return (
        <>
            {get_blogs?.data && 
                <div className="blog_style_one relative z-1 lg:pt-30 pt-24">
                    <div className="absolute top-[5%] left-[1%] max-w-[9%] z-minus lg:inline-block hidden">
                        <img src="./assets/images/illustration/bird-illustration.png" alt="leaf" />
                    </div>
                    <div className="container">
                        <div className="text-center lg:pb-[60px] pb-[40px]">
                            <h5 className="section-sub-title-v1">Blog</h5>
                            <h2 className="section-title-v1">Blog Title</h2>
                        </div>
                        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-base">
                            {get_blogs.data.blogs_data.map((item:any) => (
                                <BlogCardOne
                                    key={item.id}
                                    title={item.json?.detail?.name}
                                    img={item.json?.image?.poster?.src}
                                    slug={item.json?.seo?.slug}
                                    date={item.add_date}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default BlogOne;