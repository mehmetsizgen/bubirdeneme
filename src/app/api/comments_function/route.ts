import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/db";

function parseGetQueryParams(searchParams: URLSearchParams) {
    return {
        id: Number(searchParams.get('id')) || 0,
        token: searchParams.get('token') || '',
    };
}
async function enrichGetCommentData(comment: any, company_slug: string) {
    const [villas]: any = await Promise.all([
        prisma.villas.count({ 
            where: { 
                comments: { array_contains: comment.id },
                company_slug, 
                status: 1 
            },
        }),
    ]);
    return {
        ...comment,
        villas_count : villas,
    };
}
export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const { id, token } = parseGetQueryParams(searchParams);
    const company_slug = process.env.FIRMA_SLUG;
    if (!company_slug) {
        return NextResponse.json({ error: "Firma Slug Tanımlı Değil." }, { status: 500 });
    }
    const expectedToken = process.env.NEXT_PUBLIC_BEARER_TOKEN
    if (!token || token !== expectedToken) {
        return NextResponse.json({ error: 'Token Hatasi.' , status: 0}, { status: 401, statusText: 'Token Hatasi.' });
    }
    try {
        const commentsQuery: any = {
            where: {
                company_slug,
                status: 1,
            }
        };

        if (id) {
            commentsQuery.where.OR = [
                { id },
            ];
        } 
        const commentsData = await prisma.comments.findMany(commentsQuery);

        if (commentsData.length === 0) {
            return NextResponse.json({ pagination: { total: 0 } }, { status: 200 });
        }
        const enrichedComments: any = (await Promise.all(
            commentsData.map((comment: any) => enrichGetCommentData(comment, company_slug))
        )).filter(Boolean); // null olanları kaldır
        return NextResponse.json(
            {
                data: { comments_data : enrichedComments },
                pagination: { total: enrichedComments.length },
            },
            { status: 200 }
        );
      
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}




export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        if (!body.name || !body.phone || !body.email || !body.subject) {
            return NextResponse.json({ error: "Eksik veri gönderildi." }, { status: 400 });
        }
        const company_slug = process.env.FIRMA_SLUG
        const add_date = new Date();
        const newComment = await prisma.comments.create({
            data: {
                json: {...body},
                add_date: String(add_date),
                member: [],
                company_slug,
            },
        });
        return NextResponse.json({ message: "Yorum başarıyla eklendi", data: newComment, status: 1}, { status: 201 });
    } catch (error: any) {
        console.error('Hata:', error.message || error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}