import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/db";

function parseGetQueryParams(searchParams: URLSearchParams) {
    return {
        id: Number(searchParams.get('id')) || 0,
        slug: searchParams.get('slug') || '',
        array_id: searchParams.get('array_id')?.split(',').map(Number) || [],
        token: searchParams.get('token') || '',
    };
}
async function enrichGetCategoryData(category: any, company_slug: string) {
    const [villas]: any = await Promise.all([
        prisma.villas.count({ 
            where: { 
                categorys: { array_contains: category.id },
                company_slug, 
                status: 1 
            },
        }),
    ]);
    return {
        ...category,
        villas_count : villas,
    };
}
export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const { id, slug, array_id, token} = parseGetQueryParams(searchParams);
    const company_slug = process.env.FIRMA_SLUG;
    if (!company_slug) {
        return NextResponse.json({ error: "Firma Slug Tanımlı Değil." }, { status: 500 });
    }
    const expectedToken = process.env.NEXT_PUBLIC_BEARER_TOKEN
    if (!token || token !== expectedToken) {
        return NextResponse.json({ error: 'Token Hatasi.' , status: 0}, { status: 401, statusText: 'Token Hatasi.' });
    }
    try {
        const categorysQuery: any = {
            where: {
                company_slug,
                status: 1,
            }
        };

        if (id || slug || array_id.length >= 1) {
            categorysQuery.where.OR = [
                { id },
                { json: { path: '$.seo.slug', equals: slug } },
                { id: { in: array_id } },
            ];
        } 
        const categorysData = await prisma.categorys.findMany(categorysQuery);

        if (categorysData.length === 0) {
            return NextResponse.json({ pagination: { total: 0 } }, { status: 200 });
        }
        const enrichedCategorys: any = (await Promise.all(
            categorysData.map((category: any) => enrichGetCategoryData(category, company_slug))
        )).filter(Boolean); // null olanları kaldır
        return NextResponse.json(
            {
                data: { categorys_data : enrichedCategorys },
                pagination: { total: enrichedCategorys.length },
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