import QueryString from "@/app/api/params_function/QueryString";
import Link from "next/link";

export async function Pagination(
    {pagination, page, pageNumbers, slug, params} : 
    {
        pagination: number, 
        page: number, 
        pageNumbers: any[], 
        slug: string,
        params: any
    },
) {
    delete params.page
    let query_params:any = null 
    if(Object.keys(params).length >= 1){
        query_params = '?'+QueryString(params)+'&page='
    } else {
        query_params = '?page='
    }
    return (
        <>
            <nav>
                <ul className="flex justify-center items-center lg:space-x-6 space-x-5 flex-wrap lg:pt-[60px] pt-[40px]">
                    {page > 1 && (
                        <li>
                            <Link href={`/${slug}?page=${Number(page)-1}`} className="h-10 w-10 border-primary-1 border text-primary-1 hover:bg-primary-1 hover:text-white duration-200 inline-flex justify-center items-center"><i className="bi bi-chevron-left" /></Link>
                        </li>
                    )}
                    {pageNumbers?.map((data:any, index) => (
                        <li>
                            <Link key={data} href={`/${slug}${query_params}${data}`} className={`font-medium lg:text-base text-sm ${page == data ? "text-primary-1": "text-dark-1"} duration-150 hover:text-primary-1 inline-block`}>{data}</Link>
                        </li> 
                    ))}
                    {page != pagination && pagination > 1 && (
                        <li>
                            <Link href={`/${slug}?page=${Number(page)+1}`} className="h-10 w-10 border-primary-1 border text-primary-1 hover:bg-primary-1 hover:text-white duration-200 inline-flex justify-center items-center"><i className="bi bi-chevron-right" /></Link>
                        </li>
                    )}
                </ul>
            </nav>
        </>
    );
}

export default Pagination;