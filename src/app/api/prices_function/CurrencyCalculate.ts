function CurrencyCalculate(price: number, currency: number){
    let kurdoviz = 1
    let kurGbp = 40.50
    let kurEur = 37.50
    let kurUsd = 35.50
    let translationPrice = 1
	//
	if(currency == 2){
		kurdoviz											= kurGbp;
	} else if(currency == 3){
		kurdoviz											= kurEur;
	} else if(currency == 4){
		kurdoviz											= kurUsd;
	}
	//
	let price_tl 											= (price)*kurdoviz; 
	//
	if(translationPrice == 1){
		price											    = price_tl;
	} 
	else if(translationPrice == 2){
		price											    = price_tl/kurGbp;
	} 
	else if(translationPrice == 3){
		price											    = price_tl/kurEur;
	} 
	else if(translationPrice == 4){
		price											    = price_tl/kurUsd;
	} 
    return Number(price)
}

export default CurrencyCalculate