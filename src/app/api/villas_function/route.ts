import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/db";
import getNightDifference from "../prices_function/GetNights";
import calculatePriceForDates from "../prices_function/CalculatePrice";
import CheckAvailabilitiy from "../availabilitys_function/CheckAvailabilitiy";


function parseGetQueryParams(searchParams: URLSearchParams) {
    return {
        id: Number(searchParams.get('id')) || 0,
        slug: searchParams.get('slug') || '',
        regions: searchParams.get('regions')?.split(',').map(Number) || [],
        regions_up: searchParams.get('regions_up')?.split(',').map(Number) || [],
        categorys: searchParams.get('categorys')?.split(',').map(Number) || [],
        features: searchParams.get('features')?.split(',').map(Number) || [],
        agencys: searchParams.get('agencys')?.split(',').map(Number) || [],
        owners: searchParams.get('owners')?.split(',').map(Number) || [],
        prices: searchParams.get('prices')?.split(',').map(Number) || [0, 9999999],
        take: Number(searchParams.get('take')) || 10,
        skip: Number(searchParams.get('skip')) || 0,
        capacity: Number(searchParams.get('capacity')) || 0,
        check_in: searchParams.get('check_in'),
        check_out: searchParams.get('check_out'),
        orders: (() => {
            const orders = searchParams.get('orders');
            if (!orders) return { id: "asc" };
            const [key, value] = orders.split(',');
            return { [key]: value };
        })(),
        token: searchParams.get('token') || '',
    };
}

async function enrichGetVillaData(villa: any, get_prices: any, company_slug: string, index: number, check_in:any, check_out:any) {
    const [regions, regions_up, categorys, prices, distances, features, comments, availability]: any = await Promise.all([
        prisma.regions.findMany({ 
            where: { 
                id: { 
                    in: villa.regions || [] 
                }, 
                company_slug, status: 1 
            },
        }),
        prisma.regions.findMany({ 
            where: { 
                id: { 
                    in: villa.regions_up || [] 
                }, 
                company_slug, status: 1 
            },
        }),
        prisma.categorys.findMany({ where: { id: { in: villa.categorys || [] }, company_slug, status: 1 } }),
        prisma.prices.findMany({ where: { id: { in: villa.prices || [] }, company_slug, status: 1 } }),
        prisma.distances.findMany({ where: { id: { in: villa.distances || [] }, company_slug, status: 1 } }),
        prisma.features.findMany({ where: { id: { in: villa.features || [] }, company_slug, status: 1 } }),
        prisma.comments.findMany({ where: { json: { path: '$.villa', equals: villa.id }, company_slug, status: 1 }, select: { json: true} }),
        prisma.availabilitys.findMany({ where: { json: { path: '$.villa', equals: villa.id }, company_slug, status: 1 }, select: { json: true} }),
    ]);


    
    if(categorys.length < 1) return null
    if(regions.length < 1) return null
    if(prices.length < 1) return null
    let prices_data:any = null
    const data_min = Math.min(...prices[0].json?.map((data:any) => Number(data.price) )) || 0
    const data_max = Math.max(...prices[0].json?.map((data:any) => Number(data.price) )) || 0
    if(data_min >= get_prices[0] && data_min <= get_prices[1] && prices[0]?.json.length >= 1){
        prices_data = {
            ...prices[0],
            min : data_min || 0,
            max : data_max || 0,
        }
    } else {
       return null
    }
    if(prices_data.length < 1 || data_min == null || data_max == null) return null
    let nightDifference = 0
    let totalPrice:any = 0
    let array:any = null
    let average_point = { average_point : 10}
   
    if (check_in || check_out) {
        const checkInDate = new Date(check_in);
        const checkOutDate = new Date(check_out);
        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) return null
        nightDifference = getNightDifference(check_in, check_out);
        if (nightDifference <= villa.json.detail?.min_stay) return null
        const check_availabilitiy:any = CheckAvailabilitiy(availability, checkInDate, checkOutDate)
        if(check_availabilitiy === null) return null
        array = calculatePriceForDates(prices[0].json, String(check_in), String(check_out)), false;
        if(array === null){ 
            totalPrice = 0
        } else {
            totalPrice = array.totalPrice
        }
        if(totalPrice == 0 || totalPrice == null) return null
    }
    return {
        villas_data: villa,
        regions_data: regions,
        regions_up_data: regions_up,
        categorys_data: categorys,
        prices_data : prices_data,
        distances_data: distances,
        features_data: features,
        comments_data: comments,
        availability_data: availability,
        total_price: totalPrice,
        nights: nightDifference,
    }
}

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const { id, slug, regions, regions_up, categorys, features, agencys, owners, prices, take, skip, capacity, orders, check_in, check_out, token} = parseGetQueryParams(searchParams);
    const company_slug = process.env.FIRMA_SLUG;
    if (!company_slug) {
        return NextResponse.json(
            {
                error: "Firma Slug Tanımlı Değil." 
            }, 
            { 
                status: 500 
            }
        );
    }
    const expectedToken = process.env.NEXT_PUBLIC_BEARER_TOKEN
    if (!token || token !== expectedToken) {
        return NextResponse.json({ error: 'Token Hatasi.' , status: 0}, { status: 401, statusText: 'Token Hatasi.' });
    }
    try {
        const villasQuery: any = {
            where: {
                AND : [
                    {
                        OR: [
                            {regions: { array_contains: regions.includes(0) ? [] : regions },},
                            {regions_up: { array_contains: regions.includes(0) ? [] : regions },},
                        ]
                    },
                ],
                json: { path: '$.detail.capacity', gte: capacity },
                // regions: { array_contains: regions.includes(0) ? [] : regions },
                categorys: { array_contains: categorys.includes(0) ? [] : categorys },
                features: { array_contains: features.includes(0) ? [] : features },
                agency: { array_contains: agencys.includes(0) ? [] : agencys },
                company_slug,
                status: 1,
            },
            // take: 50, // Önce daha fazla çek, sonra filtrele
            skip: 0,
            orderBy: orders,
        };

        if (id || slug) {
            villasQuery.where.OR = [
                { id },
                { json: { path: '$.seo.slug', equals: slug } },
               
            ];
        }

        let villasData: any = await prisma.villas.findMany(villasQuery);

        if (villasData.length === 0) {
            return NextResponse.json(
                { 
                    pagination: { 
                        total: 0 
                    } 
                }, 
                { 
                    status: 200 
                }
            );
        }

        const enrichedVillas: any = (await Promise.all(
            villasData.map((villa: any, index: number) => enrichGetVillaData(villa, prices, company_slug, index, check_in, check_out))
        )).filter(Boolean); // null olanları kaldır

        const paginatedVillas = enrichedVillas.slice(skip, skip + take); // Pagination uygula

        return NextResponse.json(
            {
                data: paginatedVillas,
                pagination: { total: enrichedVillas.length },
            },
            { 
                status: 200 
            }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { 
                error: "Internal Server Error" 
            }, 
            { 
                status: 500 
            }
        );
    }
}

export async function POST(request: NextRequest) { }
