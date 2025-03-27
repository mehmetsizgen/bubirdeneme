import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/db"

export async function GET(request: NextRequest) {
    const url:any = new URL(request.url)
    const searchParams:any = new URLSearchParams(url.searchParams)
    const id:number|any = Number(searchParams.get('id'))
    const slug:string|any = searchParams.get('slug')
    const company_slug:string|any = process.env.FIRMA_SLUG
    if (!company_slug) {
        return NextResponse.json({ error: "Firma Slug Tanımlı Değil." }, { status: 500 });
    }
    try {
        let features_data: any  = []
        let object:any[] = []
        let json:any[] = []
        if(id || slug){
            features_data = await prisma.features.findMany({
                where: {
                    OR : [
                        {
                            id : id,
                        },
                        {
                            json: {
                                path: '$.slug',
                                equals: slug,
                            },
                        },
                    ], 
                    AND: {
                        company_slug: company_slug,
                        status: 1,
                    }
                },
            })
        } else {
            features_data = await prisma.features.findMany({
                where: {
                    company_slug: company_slug,
                    status: 1,
                }
            })
        }
        if(Object.keys(features_data).length >= 1){
            for(let v = 0; v <= Object.keys(features_data).length-1; v++){
                let villas_data: any = []
                const element = features_data[v]
                if(villas_data = await prisma.villas.findMany({
                    where: {
                        features: {
                            array_contains: features_data[v].id
                        },
                        company_slug: company_slug,
                        status: 1,
                    },
                })){
                    villas_data = villas_data
                }
                object[v] = {
                    villas_data : {
                        data : villas_data,
                        pagination : {
                            total : Object.keys(villas_data).length
                        }
                    },
                    features_data : {
                        data : element,
                        pagination : {
                            total : Object.keys(features_data).length
                        }
                    },
                }
            }
        }
        json.push(
            {
                object : object,
                pagination : {
                    total : Object.keys(features_data).length
                },
            }
        )
        return NextResponse.json(json[0], { status: 200 })
    } catch (error) {
        return NextResponse.json(null, { status: 500 })
    }
}
