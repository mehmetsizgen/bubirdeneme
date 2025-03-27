import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/db";

function parseGetQueryParams(searchParams: URLSearchParams) {
    return {
        id: Number(searchParams.get('id')) || 0,
        slug: searchParams.get('slug') || '',
        take: Number(searchParams.get('take')) || 10,
        skip: Number(searchParams.get('skip')) || 0,
        orders: (() => {
            const orders = searchParams.get('orders');
            if (!orders) return { id: "asc" };
            const [key, value] = orders.split(',');
            return { [key]: value };
        })(),
        token: searchParams.get('token') || '',
    };
}
async function enrichGetBlogData(blog: any, company_slug: string) {
    return {
        ...blog,
    };
}
export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const { id, slug, take, skip, orders, token} = parseGetQueryParams(searchParams);
    const company_slug = process.env.FIRMA_SLUG;
    if (!company_slug) {
        return NextResponse.json({ error: "Firma Slug Tanımlı Değil." }, { status: 500 });
    }
    const expectedToken = process.env.NEXT_PUBLIC_BEARER_TOKEN
    if (!token || token !== expectedToken) {
        return NextResponse.json({ error: 'Token Hatasi.' , status: 0}, { status: 401, statusText: 'Token Hatasi.' });
    }
    try {
        const blogsQuery: any = {
            where: {
                company_slug,
                status: 1,
            },
            // take: 50, // Önce daha fazla çek, sonra filtrele
            skip: 0,
            orderBy: orders,
        };

        if (id || slug ) {
            blogsQuery.where.OR = [
                { id },
                { json: { path: '$.seo.slug', equals: slug } },
            ];
        } 
        const blogsData = await prisma.blogs.findMany(blogsQuery);

        if (blogsData.length === 0) {
            return NextResponse.json({ pagination: { total: 0 } }, { status: 200 });
        }
        const enrichedBlogs: any = (await Promise.all(
            blogsData.map((blog: any) => enrichGetBlogData(blog, company_slug))
        )).filter(Boolean); // null olanları kaldır
        const paginatedBlogs = enrichedBlogs.slice(skip, skip + take); // Pagination uygula
        return NextResponse.json(
            {
                data: { blogs_data : paginatedBlogs},
                pagination: { total: enrichedBlogs.length },
            },
            { status: 200 }
        );
      
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}




export async function POST(request: NextRequest){

}