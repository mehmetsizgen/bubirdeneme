import { NextRequest, NextResponse } from "next/server";

const ImageCheck = async (image:string) => {
    const response = await fetch(
        `${process.env.SITE_URL}/${image}`,
        {
            // cache: 'force-cache',
            method: 'HEAD'
        }
    )
    if(response.status === 200){
        return true
    } else {
        return false
    }
}

export default ImageCheck