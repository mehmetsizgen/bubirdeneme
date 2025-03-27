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
async function enrichGetRegionUpData(region_up: any, company_slug: string) {
    const [villas]: any = await Promise.all([
        prisma.villas.count({ 
            where: { 
                regions: { array_contains: region_up.id },
                company_slug, status: 1 
            },
        }),
    ]);
    return {
        ...region_up,
        villas_count : villas
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
        const regionsUpQuery: any = {
            where: {
                company_slug,
                status: 1,
                // NOT: {
                //     json: { path: '$.parents', equals: [0] }
                // }
                json: { path: '$.parents', equals: [0] }
            }
        };

        if (id || slug || array_id.length >= 1) {
            regionsUpQuery.where.OR = [
                { id },
                { json: { path: '$.seo.slug', equals: slug } },
                { id: { in: array_id } },
            ];
        } 
        const regionsUpData = await prisma.regions.findMany(regionsUpQuery);

        if (regionsUpData.length === 0) {
            return NextResponse.json({ pagination: { total: 0 } }, { status: 200 });
        }
        const enrichedRegionsUp: any = (await Promise.all(
            regionsUpData.map((region_up: any) => enrichGetRegionUpData(region_up, company_slug))
        )).filter(Boolean); // null olanları kaldır
        return NextResponse.json(
            {
                data: { regions_up_data : enrichedRegionsUp},
                pagination: { total: enrichedRegionsUp.length },
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