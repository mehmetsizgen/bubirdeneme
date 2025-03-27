import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/db";

function parseGetQueryParams(searchParams: URLSearchParams) {
    return {
        id: Number(searchParams.get('id')) || 0,
        min : Number(searchParams.get('min')),
        max : Number(searchParams.get('max')),
        token: searchParams.get('token') || '',
    };
}
async function enrichGetPriceData(price: any, min: number, max: number, company_slug: string) {
    const data_min = Math.min(...price.json?.map((data:any) => data.price )) || 0
    const data_max = Math.max(...price.json?.map((data:any) => data.price )) || 0
    if(data_min >= min && data_min <= max && price?.json.length >= 1){
        return {
            prices_data : {
                ...price,
                min : data_min || 0,
                max : data_max || 0,
            },
        };
    } else {
        return {
            prices_data : [],
        }
    }
   
}
export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const { id, min, max, token } = parseGetQueryParams(searchParams);
    const company_slug = process.env.FIRMA_SLUG;
    if (!company_slug) {
        return NextResponse.json({ error: "Firma Slug Tanımlı Değil." }, { status: 500 });
    }
    const expectedToken = process.env.NEXT_PUBLIC_BEARER_TOKEN
    if (!token || token !== expectedToken) {
        return NextResponse.json({ error: 'Token Hatasi.' , status: 0}, { status: 401, statusText: 'Token Hatasi.' });
    }
    try {
        const pricesQuery: any = {
            where: {
                company_slug,
                status: 1,
            }
        };

        if (id) {
            pricesQuery.where = {
                id
            };
        }
        const pricesData = await prisma.prices.findMany(pricesQuery);

        if (pricesData.length === 0) {
            return NextResponse.json({ pagination: { total: 0 } }, { status: 200 });
        }
        const enrichedPrices = await Promise.all(pricesData.map((price: any) => 
            enrichGetPriceData(price, min, max, company_slug)
        ));
        return NextResponse.json(
            {
                data: enrichedPrices || [],
                pagination: { total: enrichedPrices.length },
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