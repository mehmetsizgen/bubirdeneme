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
async function enrichGetRegionData(region: any, company_slug: string) {
    const [villas]: any = await Promise.all([
        prisma.villas.count({ 
            where: { 
                AND: [
                    {
                        OR: [
                            {regions: { array_contains: region.id }},
                            {regions_up: { array_contains: region.id }},
                        ],
                    },
                ],
                company_slug, 
                status: 1 
            },
        }),
    ]);
    return {
        ...region,
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
        const regionsQuery: any = {
            where: {
                company_slug,
                status: 1,
            },
            orderBy: {
                order: 'asc'
            }
        };

        if (id || slug || array_id.length >= 1) {
            regionsQuery.where.OR = [
                { id },
                { json: { path: '$.seo.slug', equals: slug } },
                { id: { in: array_id } },
            ];
        } 
        const regionsData = await prisma.regions.findMany(regionsQuery);

        if (regionsData.length === 0) {
            return NextResponse.json({ pagination: { total: 0 } }, { status: 200 });
        }
        const enrichedRegions: any = (await Promise.all(
            regionsData.map((region: any) => enrichGetRegionData(region, company_slug))
        )).filter(Boolean); // null olanları kaldır
        return NextResponse.json(
            {
                data: { regions_data : enrichedRegions},
                pagination: { total: enrichedRegions.length },
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