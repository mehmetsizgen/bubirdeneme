import PackageSidebarFilter from '@/components/forms/PackageSidebar'
import Pagination from "@/components/HomeOne/ui/Pagination";
import PackageCardOne from '@/components/HomeOne/ui/PackageCardOne'
import Breadcrumb from '@/components/layout/Breadcrumb'
import { Metadata } from 'next'
import { notFound } from "next/navigation";



export const metadata: Metadata = {
    title: 'Villa Type | Arid - Travel & Tourism HTML/Tailwind CSS Template',
    description: 'Welcome, Arid - Travel & Tourism HTML/Tailwind CSS Template',
    keywords: ['tour', 'travel', 'booking', 'rental', 'nextJs', 'tailwind', 'trip', 'beach', 'holidy', 'cruise', 'vacation' ]
}

const DestinationsParent = async ({
        searchParams, params
    }: {
        searchParams: Promise<{
            page: number, 
        }>,
        params : Promise<{
            categorys: string, 
        }>
    }
) => {
    const slug = (await params).categorys
    const page_name = `villa-type/${slug}`
    let totalcount = 0;
    const response_categorys = await fetch(
        `${process.env.SITE_URL}/api/categorys_function?slug=${slug}&token=${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
        {
          //   cache: 'force-cache',
            method: 'GET',
            headers : {
              "Content-Type": "application/json"
            },
        }
    )
    let get_categorys:any = await response_categorys.json()
    totalcount = get_categorys?.pagination?.total || 0;
    if (totalcount == 0){ 
        notFound()
    }
    const categorys_id = get_categorys.data.categorys_data[0].id
    const categorys = [categorys_id]
    let take = Number(process.env.DEFAULT_PAGINATION)
    const page:number = (await searchParams).page?(await searchParams).page:1
    const skip:number = page == 1 ? 0: take*(page-1)
    const response = await fetch(
        `${process.env.SITE_URL}/api/villas_function?take=${take}&skip=${skip}&categorys=${categorys}&token=${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
        {
          //   cache: 'force-cache',
            method: 'GET',
            headers : {
              "Content-Type": "application/json"
            },
        }
    )

    let get_villas:any = await response.json()
    totalcount = get_villas?.pagination?.total || 0;
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
                page='Package Sidebar'
                pageTitle='Arid Most Popular Tours'
            />
            <div className="bg-gradient-to-t to-[#FFF1EC] from-white z-1 relative lg:pt-10 pt-10 ">
                <div className="absolute top-[10%] right-0 max-w-[14%] z-minus lg:inline-block hidden">
                    <img src="../../assets/images/illustration/tree-illustration.png" alt="leaf" />
                </div>
                <div className="absolute top-[5%] left-[1%] max-w-[9%] z-minus lg:inline-block hidden">
                    <img src="../../assets/images/illustration/bird-illustration.png" alt="leaf" />
                </div>
                <div className="container">
                    <div className="flex flex-wrap justify-between pb-3 mb-8 border-b border-stock-1">
                        <div className="pt-0">
                            <h3 className="lg:text-2xl md:text-xl text-lg text-dark-1 leading-[1.42] font-medium">
                                {totalcount} adet villa bulundu.
                            </h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 lg:gap-12 gap-base">
                      
                        <div className="lg:col-span-8 col-span-12 grid md:grid-cols-2 grid-cols-1 gap-base">
                            {get_villas.data.map((item:any, index:number) => (
                                <>
                                    <PackageCardOne
                                        key={index+1}
                                        title={item.villas_data.json.detail?.name}
                                        // img={`/assets/images/emlak/${item.villas_data.json.detail?.image.poster.src}`}
                                        img={`/assets/images/emlak/villa.jpg`}
                                        // img={`https://www.villaburada.com/media/villaburada/emlak/large_${item.villas_data.json.detail?.image.poster.src}`}
                                        price={item.total_price?Number(item.total_price):Number(item.prices_data?.min || 0) || 0}
                                        duration={item.villas_data.json.detail?.min_stay}
                                        people={item.villas_data.json.detail?.capacity}
                                        slug={item.villas_data.json.seo?.slug}
                                        region={item.regions_data[0]?.json?.detail.name || 'Belirtilmemiş'}
                                        loop_text_view={item.villas_data.json.loop_text.view || 'Belirtilmemiş'}
                                    />
                                </>
                            ))}
                        </div>
                        <div className="lg:col-span-4 col-span-12 ">
                            <PackageSidebarFilter 
                                params={{categorys : String(categorys_id)}}
                            />
                        </div>
                    </div>
                    {pagination > 1 && (
                        <Pagination 
                            pagination={pagination}
                            page={page}
                            pageNumbers={pageNumbers}
                            slug={page_name}
                            params={categorys_id}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export default DestinationsParent