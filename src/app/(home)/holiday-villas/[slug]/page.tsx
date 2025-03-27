import dynamic from 'next/dynamic';

import PackageDetailsSlider from '@/components/package/PackageDetailsSlider';
import PackageBookingForm from '@/components/package/PackageBookingForm';
import PackageGallary from '@/components/package/PackageGallary';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PackageDateRange from '@/components/package/PackageDateRange';
import PackageCommentsForm from '@/components/package/PackageCommentsForm';
import AccordionSingle from '@/components/HomeOne/ui/AccordionSingle';
import FaqData from '@/constant/common/FaqData';


const DynamicMap = dynamic(() => import('@/components/package/PackageMap'), {
  ssr: false
});


export const metadata: Metadata = {
    title: 'Package Details | Arid - Travel & Tourism HTML/Tailwind CSS Template',
    description: 'Welcome, Arid - Travel & Tourism HTML/Tailwind CSS Template',
    keywords: ['tour', 'travel', 'booking', 'rental', 'nextJs', 'tailwind', 'trip', 'beach', 'holidy', 'cruise', 'vacation' ]
}

const PackageDetails = async ({
    params,
}: {
    params: Promise<{ slug: string }>
}) => {
    const slug = (await params).slug
    const page_name = "holiday-villas"
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/villas_function?slug=${slug}&token=${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
        {
          //   cache: 'force-cache',
            method: 'GET',
            headers : {
              "Content-Type": "application/json"
            },
        }
    )
    let get_villas:any = await response.json()
    let totalcount = get_villas?.pagination?.total || 0;
    if (totalcount == 0){ 
        notFound()
    }
    const default_comission = 20
    const villas_data = get_villas.data[0].villas_data
    const detail = get_villas.data[0].villas_data.json.detail
    const price_includes = get_villas.data[0].villas_data.json.price_includes
    const price_excludes = get_villas.data[0].villas_data.json.price_excludes
    const rules = get_villas.data[0].villas_data.json.rules
    const seo = get_villas.data[0].villas_data.json.seo
    const image = get_villas.data[0].villas_data.json.detail.image
    const prices_data = get_villas.data[0].prices_data
    const regions_data = get_villas.data[0].regions_data[0]
    const regions_up_data = get_villas.data[0].regions_up_data[0]
    const availability_data = get_villas.data[0].availability_data
    const comments_data = get_villas.data[0].comments_data
    const features_data = get_villas.data[0].features_data
    const distances_data = get_villas.data[0].distances_data[0]
    let points:any = []
    if(comments_data.length != 0){
      for(let p = 0; p <= 10-1; p++){
        points[p] = true
      }
    } else {
      points = null
    }
  return (
    <>
      <div className="bg-gradient-to-t to-[#FFF1EC] from-white">
        <PackageDetailsSlider
          slider_images={image?.slider.slice(0, 5)}
        />
        <div className="container">
          <div className="flex flex-wrap justify-between pb-8 pt-6 mb-8 border-b border-stock-1">
            <div className="pt-2">
              <h3 className="lg:text-2xl md:text-xl text-lg text-dark-1 leading-[1.42] font-medium">
                {detail?.name}
              </h3>
              <div className="flex items-center mt-2">
                {points != null && (
                  <>
                    <ul className="flex lg:gap-3 gap-2 text-primary-1 mr-3 text-sm">
                      {points.map((data:any, index:number) => 
                        <li key={index+1}><i key={index+1} className="bi bi-star-fill" /></li>
                      )}
                    </ul>
                    <span className="text-primary-1 lg:text-2md text-md">({comments_data.length} review)</span>
                  </>
                )}
              </div>
            </div>
            <div className="pt-2">
              <h2 className="font-sans lg:text-[45px] leading-1.2 md:text-xl text-lg font-semibold">{process.env.CURRENCY_SYMBOL}{prices_data.min}
              </h2>
              <div className="text-md font-normal ml-1">per person</div>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-base">
            <div className="lg:col-span-8 col-span-12">
              <div className="pack__disc">
                <h5 className="lg:text-2md text-md text-dark-2 font-medium leading-[1.5] font-sans mb-6">Lorem omnes
                  impedit ius, vel et hinc agam fabulas. Ut audiam invenire iracundia vim. Tn eam dimo diam
                  ea. Piber Korem sit amet.</h5>
                <p>Al elit omnes impedit ius, vel et hinc agam fabulas. Ut audiam invenire iracundia vim. En eam
                  dico similique, ut sint posse sit, eum sumo diam ea. Liber consectetuer in mei, sea in
                  imperdiet assueverit contentiones, an his cibo blandit tacimates. Iusto iudicabit similique
                  id velex, in sea rebum deseruisse appellantur. Lorem ipsum Alienum phaedrum torquatos nec
                  eu, vis detraxit pericu in mei, vix aperiri vix at,dolor sit amet.
                  <br /><br />
                  Iusto iudicabit similique
                  id velex, in sea rebum deseruisse appellantur. Lorem ipsum Alienum phaedrum torquatos nec
                  eu, vis detraxit pericu in mei, vix aperiri vix at,dolor sit amet.
                </p>
                <ul className="pack__list">
                  <li><i className="bi bi-clock" /> Min Stay : {detail?.min_stay}</li>
                  <li> <i className="bi bi-person" />Max People : {detail?.capacity}</li>
                  <li><i className="bi bi-map" />
                    <Link href={`/destinations/${regions_up_data?.json?.seo?.slug}`} target='_blank'>
                      {regions_up_data?.json?.detail?.name}
                    </Link>
                    /
                    <Link href={`/destinations/${regions_data?.json?.seo?.slug}`} target='_blank'>
                      {regions_data?.json?.detail?.name}
                    </Link>
                  </li>
                </ul>
                <div className="lg:pt-10 pt-8">
                  <PackageDateRange 
                    prices={prices_data}
                    availability={availability_data}
                    set_month= {2}
                  />
                </div>
                {(distances_data.json.length >= 1) && (
                  <div className="lg:pt-10 pt-8">
                    <h3>Distances</h3>
                    <p>Duis id interdum ex, eu accumsan massa. Fusce vel nibh diam. Nulla ultrices ex at erat
                      pharetra, vitae viverra mauris condimentum. Sed ullamcorper dignissim enim, vel egestas
                      lacus tincidunt ac. Duis id interdum ex, eu accumsan massa. Fusce vel nibh diam.</p>
                    <div className="grid grid-cols-3 gap-base">
                      {distances_data?.json?.map((data:any, index:number) =>(
                         <div key={index} className="flex items-center space-x-4 p-4 bg-white shadow-md rounded-lg">
                          <i className={`${data.icon} text-primary-500 text-2xl`}></i>
                          <div>
                            <h6 className="text-sm font-medium text-gray-800 my-0 ">
                              {data.name} {data.parent_name && <span className="text-gray-500">({data.parent_name})</span>}
                            </h6>
                            <span className="text-gray-600">{data.distance}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {features_data && (
                  <div className="pt-2">
                    <h3>Features</h3>
                    <p>Duis id interdum ex, eu accumsan massa. Fusce vel nibh diam. Nulla ultrices ex at erat
                      pharetra, vitae viverra mauris condimentum. Sed ullamcorper dignissim enim, vel egestas
                      lacus tincidunt ac. Duis id interdum ex, eu accumsan massa. Fusce vel nibh diam.</p>
                    <ul className="mt-base">
                      <li className="lg:flex">
                        <div className="lg:w-3/3 lg:mt-0 mt-0">
                          <ul className="lg:grid flex flex-wrap grid-cols-3 lg:gap-y-5 gap-y-3 gap-x-3">
                            {features_data.map((data:any, index:number) => 
                              <>
                                <li className="col-span-1 text-dark-3 text-sm lg:text-base flex items-center">
                                  <div className="text-primary-1 lg:text-md text-base mr-2">
                                    <i className="bi bi-check2" />
                                  </div>
                                  <span>{data.json?.detail?.name}</span>
                                </li>
                              </>
                            )}
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
                {image?.slider && (
                  <div className="lg:pt-10 pt-8">
                    <h3>Gallery</h3>
                    <p>Duis id interdum ex, eu accumsan massa. Fusce vel nibh diam. Nulla ultrices ex at erat
                      pharetra, vitae viverra mauris condimentum. Sed ullamcorper dignissim enim, vel egestas
                      lacus tincidunt ac. Duis id interdum ex, eu accumsan massa. Fusce vel nibh diam.</p>

                    <PackageGallary 
                      photos={image?.slider.slice(0, 5)}
                    />
                  </div>
                )}
                {(price_excludes?.list?.length >= 1 || price_includes?.list?.length >= 1 || rules?.list?.length >= 1 || regions_data.json.discount.discount_status == 1 || regions_up_data.json.discount.discount_status == 1 || villas_data.json.discount.discount_status == 1) && (
                   <ul className="mt-base">
                     {(price_includes.list.length >= 1) && (
                      <li className="lg:flex lg:pt-6 pt-5 pb-5 lg:pb-6 border-t border-stock-1 last:border-b">
                        <div className="lg:w-1/3 lg:text-2md text-md text-dark-2 font-medium">
                          {price_includes.title}
                        </div>
                        <div className="lg:w-2/3 lg:mt-0 mt-4">
                          <ul className="lg:grid flex flex-wrap grid-cols-2 lg:gap-y-5 gap-y-3 gap-x-3">
                            {price_includes.list?.map((data:any, index:number) =>
                              <li key={index+1} className="col-span-1 text-dark-3 text-sm lg:text-base flex items-center">
                                <div className="text-primary-1 lg:text-md text-base mr-2">
                                  <i className="bi bi-check2" />
                                </div>
                                <span>{data}</span>
                              </li>
                            )}
                          </ul>
                        </div>
                      </li>
                     )}
                    {(price_excludes.list.length >= 1) && (
                      <li className="lg:flex lg:pt-6 pt-5 pb-5 lg:pb-6 border-t border-stock-1 last:border-b">
                        <div className="lg:w-1/3 lg:text-2md text-md text-dark-2 font-medium">
                          {price_excludes.title}
                        </div>
                        <div className="lg:w-2/3 lg:mt-0 mt-4">
                          <ul className="lg:grid flex flex-wrap grid-cols-2 lg:gap-y-5 gap-y-3 gap-x-3">
                            {price_excludes.list?.map((data:any, index:number) =>
                              <li key={index+1} className="col-span-1 text-dark-3 text-sm lg:text-base flex items-center">
                                <div className="text-primary-1 lg:text-md text-base mr-2">
                                  <i className="bi bi-x" />
                                </div>
                                <span>{data}</span>
                              </li>
                            )}
                          </ul>
                        </div>
                      </li>
                    )}
                    {(rules.list.length >= 1) && (
                      <li className="lg:flex lg:pt-6 pt-5 pb-5 lg:pb-6 border-t border-stock-1 last:border-b">
                        <div className="lg:w-1/3 lg:text-2md text-md text-dark-2 font-medium">
                          {rules.title}
                        </div>
                        <div className="lg:w-2/3 lg:mt-0 mt-4">
                          <ul className="lg:grid flex flex-wrap grid-cols-2 lg:gap-y-5 gap-y-3 gap-x-3">
                            {rules.list?.map((data:any, index:number) =>
                              <li key={index+1} className="col-span-1 text-dark-3 text-sm lg:text-base flex items-center">
                                <div className="text-primary-1 lg:text-md text-base mr-2">
                                  <i className="bi bi-info" />
                                </div>
                                <span>{data}</span>
                              </li>
                            )}
                          </ul>
                        </div>
                      </li>
                     )}
                    {(villas_data.json.discount.discount_status == 1 || regions_data.json.discount.discount_status == 1 || regions_up_data.json.discount.discount_status == 1) && (
                      <li className="lg:flex lg:pt-6 pt-5 pb-5 lg:pb-6 border-t border-stock-1 last:border-b">
                        <div className="lg:w-1/3 lg:text-2md text-md text-dark-2 font-medium">
                          İndirimler
                        </div>
                        <div className="lg:w-2/3 lg:mt-0 mt-4">
                          <ul className="lg:grid flex flex-wrap grid-cols-2 lg:gap-y-5 gap-y-3 gap-x-3">
                            {villas_data.json.discount.discount_status == 1 && (
                              <li key={villas_data.id} className="col-span-1 text-dark-3 text-sm lg:text-base flex items-center">
                                <div className="text-primary-1 lg:text-md text-base mr-2">
                                  <i className="bi bi-info" />
                                </div>
                                <span>Villa İndirimi %{villas_data.json.discount.discount}</span>
                              </li>
                            )}
                            {regions_data.json.discount.discount_status == 1 && villas_data.json.discount.discount_status == 0 && (
                              <li key={regions_data.id} className="col-span-1 text-dark-3 text-sm lg:text-base flex items-center">
                                <div className="text-primary-1 lg:text-md text-base mr-2">
                                  <i className="bi bi-info" />
                                </div>
                                <span>Bölge İndirimi %{regions_data.json.discount.discount}</span>
                              </li>
                            )}
                            {regions_up_data.json.discount.discount_status == 1 && villas_data.json.discount.discount_status == 0 && regions_data.json.discount.discount_status == 0 && (
                              <li key={regions_up_data.id} className="col-span-1 text-dark-3 text-sm lg:text-base flex items-center">
                                <div className="text-primary-1 lg:text-md text-base mr-2">
                                  <i className="bi bi-info" />
                                </div>
                                <span>Üst Bölge İndirimi %{regions_up_data.json.discount.discount}</span>
                              </li>
                            )}
                          </ul>
                        </div>
                      </li>
                    )}
                  </ul>
                )}
                {FaqData?.faqs.length >= 1 && (
                  <div className="pt-2">
                    <h3>Some FAQ This Place</h3>
                    <p>Duis id interdum ex, eu accumsan massa. Fusce vel nibh diam. Nulla ultrices ex at erat
                      pharetra, vitae viverra mauris condimentum. Sed ullamcorper dignissim enim, vel egestas
                      lacus tincidunt ac. Duis id interdum ex, eu accumsan massa. Fusce vel nibh diam.</p>
                      <div className='grid grid-cols-1 gap-[30px]'>
                        <div className='flex flex-col gap-[30px]'>
                            {FaqData?.faqs?.slice(0, 5).map((item, index) => (
                                <AccordionSingle
                                    index={index}
                                    content={item.content}
                                    question={item.question}
                                    key={item.id}
                                />
                            ))}
                        </div>
                    </div>
                  </div>
                )}
                {detail?.position && (
                  <div className="lg:pt-10 pt-8">
                    <h3>Location</h3>
                    <p>Duis id interdum ex, eu accumsan massa. Fusce vel nibh diam. Nulla ultrices ex at erat
                      pharetra, vitae viverra mauris condimentum. Sed ullamcorper dignissim enim, vel egestas
                      lacus tincidunt ac. Duis id interdum ex, eu accumsan massa. Fusce vel nibh diam.</p>
                    <DynamicMap position={detail?.position.join(',').split(',').map((positions:number) => Number(positions))} />
                  </div>
                )}
                {comments_data.length >= 1 && (
                  <div className="lg:pt-10 pt-8">
                    <h3 className="lg:text-2xl md:text-xl text-lg text-dark-1 leading-[1.42] font-medium mt-[10px] !mb-base">
                    {comments_data.length} Comment’s</h3>
                    {comments_data?.slice(0, 5).map((data:any, index:number) => 
                      <>
                        <ul>
                          <li className="bg-[#FFE3EB] bg-opacity-50 lg:px-base px-5 lg:py-base py-5 flex md:flex-row flex-col mt-10">
                            <div className="md:mr-5 mb-4 md:mb-0 lg:w-[100px] w-16 shrink-0">
                              {image.poster && (
                                <img src={image.poster.src} alt={data.json?.name} className="w-full" />
                              )}
                            </div>
                            <div className="grow">
                              <div className="flex justify-between items-center">
                                <h5 className="text-dark-1 lg:text-2md text-md font-medium !mt-0 !mb-0">{data.json?.title}</h5>
                              </div>
                              <p className="regular-text-v1 lg:mt-3 mt-2 !leading-[1.6] !pb-0">{data.json?.subject}</p>
                            </div>
                          </li>
                            {data.json?.reply && (
                              <ul className="lg:mt-[35px] mt-7 lg:ml-10 ml-8">
                                <li className="bg-[#FFE3EB] bg-opacity-50 lg:px-base px-5 lg:py-base py-5 flex md:flex-row flex-col">
                                  <div className="md:mr-5 mb-4 md:mb-0 lg:w-[100px] w-16 shrink-0">
                                    <img src="../../assets/images/blog/com-1.webp" alt={data.json?.reply} className="w-full" />
                                  </div>
                                  <div className="grow">
                                    <div className="flex justify-between items-center">
                                      <h5 className="text-dark-1 lg:text-2md text-md font-medium !mt-0 !mb-0">
                                        Firma Adı
                                      </h5>
                                    </div>
                                    <p className="regular-text-v1 lg:mt-3 mt-2 !leading-[1.6] !pb-0">{data.json?.reply}</p>
                                  </div>
                                </li>
                              </ul>
                            )}
                        </ul>
                      </>
                    )}
                  </div>
                )}
                <PackageCommentsForm 
                  villa_id={get_villas.data[0].villas_data?.id}
                />
              </div>
            </div>
            <div className="lg:col-span-4 col-span-12 relative">
              {/* <div className="lg:sticky top-[108px]"> */}
              <div className="top-[108px]">
                <PackageBookingForm 
                  start_price = {`${process.env.CURRENCY_SYMBOL}${prices_data.min}`}
                  prices = {prices_data}
                  availability = {availability_data}
                  min_stay = {detail?.min_stay}
                  comission_status = {detail?.commission_status}
                  comission = {detail?.commission}
                  default_comission = {default_comission}
                  villas = {get_villas.data[0]}
                  capacity = {detail?.capacity}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PackageDetails