function CalculatePromotion(promotion: string, check_in: any, check_out: any, villa_id: number = 0){
    const get_promotion:any = [
        {
            json: {
                discount: {
                    icon: "",
                    image: {
                        poster: {
                            src: "",
                            width: "500",
                            height: "500"
                        }
                    },
                    discount: 30,
                    discount_end: "2025-04-30",
                    discount_start: "2025-04-01",
                    discount_status: 1,
                    discount_message: "Promosyon Kodu İndirimi",
                    discount_min_price: 5000,
                    villa_id: 2256,
                    promotion_code: '123-456',
                },
            },
        },
    ]
    let check_promotion:any = null
    for (const check of get_promotion) {
        const res = check.json.discount; 
        if(res.promotion_code == promotion && res.villa_id == villa_id && res.discount_status == 1){
            const resStart= new Date(res.discount_start);
            const resEnd = new Date(res.discount_end);
            const checkStart= new Date(check_in);
            const checkEnd = new Date(check_out);
            if (checkStart >= resStart && checkEnd <= resEnd){
                check_promotion = res
                break
            }
        }
    } 
    return check_promotion
}

export default CalculatePromotion