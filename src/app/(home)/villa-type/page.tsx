import DestionationCardOne from '@/components/HomeOne/ui/DestinationsCardOne'
import Breadcrumb from '@/components/layout/Breadcrumb'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'



export const metadata: Metadata = {
    title: 'Destination | Arid - Travel & Tourism HTML/Tailwind CSS Template',
    description: 'Welcome, Arid - Travel & Tourism HTML/Tailwind CSS Template',
    keywords: ['tour', 'travel', 'booking', 'rental', 'nextJs', 'tailwind', 'trip', 'beach', 'holidy', 'cruise', 'vacation' ]
}

const Destinations = async () => {
    const page_name = "villa-type"
    const response = await fetch(
        `${process.env.SITE_URL}/api/categorys_function?token=${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
        {
          //   cache: 'force-cache',
            method: 'GET',
            headers : {
              "Content-Type": "application/json"
            },
        }
    )
    let get_categorys:any = await response.json()
    let totalcount = get_categorys?.pagination?.total || 0;
    if (totalcount == 0){ 
        notFound()
    }
    return (
        <>
            <Breadcrumb
                page='All Villa Type'
                pageTitle='A Find Your Most Popular Destination'
            />
            {/*========== DESTINATION STYLE START ==========*/}
            <div className="relative z-1 bg-gradient-to-t to-[#FFF1EC] from-white lg:pt-10 pt-10 ">
                <div className="absolute top-1/2 -translate-y-1/2 right-0 max-w-[14%] z-minus lg:inline-block hidden">
                    <img src="../../assets/images/illustration/tree-illustration.png" alt="leaf" />
                </div>
                <div className="absolute top-[5%] left-[1%] max-w-[9%] z-minus lg:inline-block hidden">
                    <img src="../../assets/images/illustration/bird-illustration.png" alt="leaf" />
                </div>
                <div className="container">

                    <div className="text-center lg:pb-[60px] pb-[40px]">
                        <h5 className="section-sub-title-v1 variant-2">Explore Our Tours</h5>
                        <h2 className="section-title-v1">Top Attractions Destinations</h2>
                    </div>

                    <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-base">
                        {get_categorys.data.categorys_data.map((item:any, index:number) => (
                            <DestionationCardOne 
                                img= {item.json?.image?.src} 
                                title= {item.json?.detail.name} 
                                villas_count = {item.villas_count?item.villas_count:0} 
                                slug= {`${page_name}/${item.json.seo.slug}`}
                                id= {item.id}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Destinations