import BlogCardOne from '@/components/HomeOne/ui/BlogCardOne'
import Pagination from '@/components/HomeOne/ui/Pagination'
import Breadcrumb from '@/components/layout/Breadcrumb'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'


export const metadata: Metadata = {
    title: 'Blog List | Arid - Travel & Tourism HTML/Tailwind CSS Template',
    description: 'Welcome, Arid - Travel & Tourism HTML/Tailwind CSS Template',
    keywords: ['tour', 'travel', 'booking', 'rental', 'nextJs', 'tailwind', 'trip', 'beach', 'holidy', 'cruise', 'vacation' ]
}

const BlogList = async ({
        searchParams,
    }: {
    searchParams: Promise<{
        page: number, 
        take: string, 
    }>
}) => {
    const page_name = "blog"
    let take = Number(process.env.DEFAULT_PAGINATION)
    const page:number = (await searchParams).page?(await searchParams).page:1
    const skip:number = page == 1 ? 0: take*(page-1)
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/blogs_function?token=${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
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
    const pagination = Math.ceil(totalcount/take)
    if (page > pagination || totalcount == 0){ 
        notFound()
    }
    const pageNumbers:any[] = [];
    for(let i:number = Number(page)-3; i <= Number(page)+3; i++){
        if( i < 1) continue
        if( i > pagination) break
        pageNumbers.push(i)
    }
    return (
        <>
            <Breadcrumb
                page='Blog List'
                pageTitle='A Blog Standard With Sidebar'
            />

            {/*========== BLOG LIST STYLE START ==========*/}
            <div className="lg:pt-30 pt-24 relative z-1 bg-gradient-to-t to-[#FFF1EC] from-white">
                <div className="container">
                    <div className="grid grid-cols-12 lg:gap-12 gap-base">
                        <div className="lg:col-span-12 col-span-12">
                            <div className="grid md:grid-cols-2 grid-cols-1 gap-base">
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
                                {pagination > 1 && (
                                    <Pagination 
                                        pagination={pagination}
                                        page={page}
                                        pageNumbers={pageNumbers}
                                        slug={page_name}
                                        params={await searchParams}
                                    />
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BlogList