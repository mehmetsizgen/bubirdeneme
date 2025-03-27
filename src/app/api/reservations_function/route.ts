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
async function enrichGetReservationData(reservation: any, company_slug: string) {
    return {
        ...reservation,
    };
}
export async function GET(request: NextRequest, response: NextResponse) {
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
        const resrvationsQuery: any = {
            where: {
                company_slug,
                status: 1,
            },
            // take: 50, // Önce daha fazla çek, sonra filtrele
            skip: 0,
            orderBy: orders,
        };

        if (id) {
            resrvationsQuery.where.OR = [
                { id },
            ];
        } 
        const reservationsData = await prisma.reservations.findMany(resrvationsQuery);

        if (reservationsData.length === 0) {
            return NextResponse.json({ pagination: { total: 0 } }, { status: 200 });
        }
        const enrichedReservations: any = (await Promise.all(
            reservationsData.map((reservation: any) => enrichGetReservationData(reservation, company_slug))
        )).filter(Boolean); // null olanları kaldır
        const paginatedReservations = enrichedReservations.slice(skip, skip + take); // Pagination uygula
        return NextResponse.json(
            {
                data: { reservations_data : paginatedReservations},
                pagination: { total: enrichedReservations.length },
            },
            { status: 200 }
        );
      
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function POST(request: NextRequest, response: NextResponse) {
    const company_slug = process.env.FIRMA_SLUG;
    if (!company_slug) {
        return NextResponse.json({ error: "Firma Slug Tanimli Degil." }, { status: 500, statusText: 'Firma Slug Tanimli Değil.' });
    }
    const authHeader = request.headers.get('Authorization');
    const expectedToken = `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`
    if (!authHeader || authHeader !== expectedToken) {
        return NextResponse.json({ error: 'Token Hatasi.' , status: 0}, { status: 401, statusText: 'Token Hatasi.' });
    }
    try {
        const body = await request.json();
        if (!body.detail.name || !body.detail.phone || !body.detail.email) {
            return NextResponse.json({ error: "Eksik veri gönderildi.", status: 0}, { status: 400, statusText: 'Eksik veri gonderildi.' });
        }
        const add_date = new Date();
       
        const newReservation = await prisma.reservations.create({
            data: {
                json: {...body},
                add_date: String(add_date),
                member: [],
                company_slug,
            },
        });
        if(body.extra.quick_booking == 0){
            return NextResponse.json({ error: "Rezervasyon isteginiz basarli bir sekilde gonderildi.", data: newReservation, status: 1}, { status: 201, statusText: 'Rezervasyon isteginiz basarli bir sekilde gonderildi.' });
        } else {
            return NextResponse.json({ error: "Rezervasyon isteginiz basarli bir sekilde gonderildi.", data: newReservation, status: 2}, { status: 201, statusText: 'Rezervasyon isteginiz basarli bir sekilde gonderildi.' });
        }
    } catch (error: any) {
        console.error('Hata:', error.message || error);
        return NextResponse.json({ error: "Sunucu hatasi." }, { status: 500, statusText: 'Sunucu hatasi.' });
    }
}