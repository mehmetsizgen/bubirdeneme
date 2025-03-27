import CurrencyCalculate from "./CurrencyCalculate";
import getNightDifference from "./GetNights";

function calculatePriceForDates(prices: any[], check_in: any, check_out: any, calculate: boolean = false, villas_data:any | null = null, promotion: any | null = null): number | null {    
    const nightDifference = getNightDifference(check_in, check_out); 
    if (nightDifference <= 0) return null; 
    let totalPrice = 0;
    let priceFound = false;

    let totalDiscount = 0
    let totalPaymentDiscountState = 1
    let totalPaymentDiscount: number | null = 0;
    let totalPaymentDiscountPrice: number | null = 0;

    let firsExtraCharge: any | null = null;
    let firstMinStay: number | null = null; 
    let firstDamageDeposit: any | null = null;

    let monthsDiscount: number | null = 5;
    let monthsDiscountState: number | null = 0;
    let monthsDiscountMinPrice: number | null = 2000;

    let weeksDiscount: number | null = 2;
    let weeksDiscountState: number | null = 0;
    let weeksDiscountMinPrice: number | null = 2000;

    let currencyType: number | null = 1;
    let MinStaycurrencyType: number | null = 1;
    let DamageDepositcurrencyType: number | null = 1;
    let discountState: number | null = 0;
    let promotionDiscountState: number | null = 0;
    let discount: number | null = 0;
    let villaDiscountState: number | null = 0;
    let regionsDiscountState: number | null = 0;
    let regionsUpDiscountState: number | null = 0;
    let villaDiscount: number | null = 0;
    let regionsDiscount: number | null = 0;
    let regionsUpDiscount: number | null = 0;
    let firstStayIn: number | null = 0; // 1 ekstra ücret en başta fiyata dahil edilsin ve indirime dahil olsun. 0 ekstra ücret son fiyata dahil olsun. 2 ekstra ücret fiyata dahil olmasın.
    let firstDepositIn: number | null = 0; // 1 ekstra ücret en başta fiyata dahil edilsin ve indirime dahil olsun. 0 ekstra ücret son fiyata dahil olsun. 2 ekstra ücret fiyata dahil olmasın.

    // son gün gece sayılmaması için tarihten 1 gün düşülüyor.
    const lastNightCheckOut:any = new Date(check_out);
    lastNightCheckOut.setDate(lastNightCheckOut.getDate() - 1); 

    // komple fiyat tarih aralığı kontrolü yapılıyor.
    for (let i = 0; i < prices.length; i++) {
        const priceData = prices[i];
        const priceCheckIn = priceData.check_in;
        const priceCheckOut = priceData.check_out;
        let pricePerNight = priceData.price;
       
        // eğer seçilen tarih aralığının sonu, diğer fiyattaki tarih aralığının başlangıcına denk geliyorsa, check_out -1 gün oluyor.
        if(check_out == priceCheckIn){
            check_out = lastNightCheckOut
        }
        if (check_in <= priceCheckOut && check_out >= priceCheckIn) {
            
            const isLastMonth = i === prices.length - 1; 
            let nightsInThisRange = getNightDifference(
                check_in < priceCheckIn ? priceCheckIn : check_in,
                check_out > priceCheckOut ? priceCheckOut : check_out
            );
            if (new Date(check_out) > new Date(priceCheckOut)) {
                nightsInThisRange += 1;
            }
            if (check_out > lastNightCheckOut) {
                nightsInThisRange -= 1; 
            }

            // burada belirtilen değişkenler son fiyat aralığının verilerini alıyor.
            let matchedPeriod = priceData.pricing_type;
            currencyType = Number(priceData.price_currency);

            // seçilen tarih aralığı birden fazlaysa, son tarih aralığınının fiyat tipini alıyor ve gecelik fiyata çeviriyor. 2 Haftalık, 3 aylık, 1 günlük
            if (matchedPeriod === 2) {
                totalPrice += (CurrencyCalculate(pricePerNight, currencyType) / 7) * nightsInThisRange
            } 
            else if (matchedPeriod === 3) {
                totalPrice += (CurrencyCalculate(pricePerNight, currencyType) / 30) * nightsInThisRange
            }
            else {
                totalPrice += CurrencyCalculate(pricePerNight, currencyType) * nightsInThisRange;
            }
            if(calculate == true){
                // villa indirimi var ise fiyat periyodu indirimini iptal et diyoruz.
                if(villas_data.villas_data.json.discount.discount_status == 0 && villas_data.regions_data[0].json.discount.discount_status == 0 && villas_data.regions_up_data[0].json.discount.discount_status == 0){
                    // burada indirim kontrolü ve indirim oranı belirleniyor.
                    discountState = Number(priceData.discount_status);
                    discount = Number(priceData.discount);
                    // seçilen tarih aralığında indirim var ise kontrol ediyor ve günlük veya haftalık veya aylık fiyattan indirimi düşüyor.
                    if(discountState == 1){
                        totalDiscount += (totalPrice / 100 * discount)
                        totalPrice = totalPrice-(totalPrice / 100 * discount)
                    }
                } else {
                    discountState = 0
                }  
            }
           
            // fiyat var ve bunu set et.
            priceFound = true;
           
            // temizlik ücretini ilk gördüğü anda set et, ilk tarih aralığına denk geliyor.
            if (firsExtraCharge === null) {
                // temizlik ücreti, minimum gece sayısı ve döviz kuru belirle, sadece son tarih aralığını dikkate alıyor.
                firstStayIn = 2;
                const extraCharge = priceData.min_stay_price;
                MinStaycurrencyType = Number(priceData.min_stay_price_currency);
                firsExtraCharge = CurrencyCalculate(Number(Math.ceil(extraCharge)), MinStaycurrencyType)
            }

            // seçilen tarih aralığı birden fazlaysa, ilk tarih aralığınının minimum gece, temizlik ücret ve hasar depozitosunu alıyor.
            const minStay = priceData.min_stay;
            if (firstMinStay === null) {
                firstMinStay = minStay;
            }
           
            // hasar depozitosunu ilk gördüğü anda set et, ilk tarih aralığına denk geliyor.
            if (firstDamageDeposit === null) {
                // hasar depozitosu ve döviz kurunu belirle, sadece son tarih aralığını dikkate alıyor.
                firstDepositIn = 2
                const damageDeposit = priceData.damage_deposit;
                DamageDepositcurrencyType = 1;
                firstDamageDeposit = CurrencyCalculate(Number(Math.ceil(damageDeposit)), DamageDepositcurrencyType);
            }
        }
    }
    
    // fiyat yok ise null dönüyor.
    if (!priceFound) {
        return null;
    }

    // ekstra ücret fiyata dahil edilerek mi hesaplansın?
    if(firstMinStay && nightDifference < firstMinStay && firstStayIn == 1){
        totalPrice += firsExtraCharge;
    }
    if (firstDepositIn == 1) {
        totalPrice += firstDamageDeposit;
    }
    if(calculate == true){
        
        // villa indirimi var ise villa indirimini 1 sefer uygula diyoruz.
         if(villas_data.villas_data.json.discount.discount_status != 0 && check_in >= villas_data.villas_data.json.discount.discount_start && check_out <= villas_data.villas_data.json.discount.discount_end){
            villaDiscountState = 1
            villaDiscount = Number(villas_data.villas_data.json.discount.discount)
            totalDiscount += (totalPrice / 100 * villaDiscount);
            totalPrice = totalPrice-(totalPrice / 100 * villaDiscount);
        } 
        else if(villas_data.regions_data[0].json.discount.discount_status != 0 && check_in >= villas_data.regions_data[0].json.discount.discount_start && check_out <= villas_data.regions_data[0].json.discount.discount_end){
            regionsDiscountState = 1
            regionsDiscount = Number(villas_data.regions_data[0].json.discount.discount)
            totalDiscount += (totalPrice / 100 * regionsDiscount);
            totalPrice = totalPrice-(totalPrice / 100 * regionsDiscount);
        } 
        else if(villas_data.regions_up_data[0].json.discount.discount_status != 0 && check_in >= villas_data.regions_up_data[0].json.discount.discount_start && check_out <= villas_data.regions_up_data[0].json.discount.discount_end){
            regionsUpDiscountState = 1
            regionsUpDiscount = Number(villas_data.regions_up_data[0].json.discount.discount)
            totalDiscount += (totalPrice / 100 * regionsUpDiscount);
            totalPrice = totalPrice-(totalPrice / 100 * regionsUpDiscount);
        }

        // 7 gece ve 30 gece üzeri rezervasyon indirimi açıksa kontrol ediyor ve indirimi son fiyattan düşüyor.
        if(nightDifference >= 7 && totalPrice >= weeksDiscountMinPrice){
            weeksDiscountState = 1
            totalDiscount += (totalPrice / 100 * weeksDiscount);
            totalPrice = totalPrice-(totalPrice / 100 * weeksDiscount);
        } else if(nightDifference >= 30 && totalPrice >= monthsDiscountMinPrice){
            monthsDiscountState = 1
            totalDiscount += (totalPrice / 100 * monthsDiscount);
            totalPrice = totalPrice-(totalPrice / 100 * monthsDiscount);
        }

        if(promotion != null){
            if(totalPrice >= promotion.discount_min_price){
                promotionDiscountState = 1
                totalDiscount += (totalPrice / 100 * promotion.discount);
                totalPrice = totalPrice-(totalPrice / 100 * promotion.discount);
            }
        }
    }
   

    // ekstra ücret son fiyata mı dahil edilsin?
    if (firstMinStay && nightDifference < firstMinStay && firstStayIn == 0) {
        totalPrice += firsExtraCharge;
    }
    if (firstDepositIn == 0) {
        totalPrice += firstDamageDeposit;
    }
    // calculate true villa detay sayfasının fiyat hesaplaması, false ise villa liste sayfasının fiyat hesaplaması.
    const array:any = {
        nightDifference,
        totalPrice: Number(Math.ceil(totalPrice)),
        firstMinStay: firstMinStay,
        MinStaycurrencyType,
        extraCharge: firsExtraCharge,
        damageDeposit: firstDamageDeposit,
        DamageDepositcurrencyType,
        monthsDiscount,
        monthsDiscountState,
        weeksDiscount,
        weeksDiscountState,
        villaDiscountState,
        regionsDiscountState,
        regionsUpDiscountState,
        villaDiscount,
        regionsDiscount,
        regionsUpDiscount,
        discountState,
        discount,
        firstStayIn,
        firstDepositIn,
        totalDiscount,
        totalPaymentDiscount,
        totalPaymentDiscountPrice,
        totalPaymentDiscountState,
        promotion,
        promotionDiscountState,
    }
    return array
}

export default calculatePriceForDates