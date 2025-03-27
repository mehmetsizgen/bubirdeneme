import { notFound } from 'next/navigation';
import CheckAvailabilitiy from '@/app/api/availabilitys_function/CheckAvailabilitiy';
import calculatePriceForDates from '@/app/api/prices_function/CalculatePrice';
import CalculatePromotion from '@/app/api/prices_function/CalculatePromotion';
import PackagePaymentsForm from '@/components/package/PackagePaymentsForm';



const Payment = async ({params}:any) => {
    const page_name = "payment"
    if(params.params.length < 7) {
        notFound()
    }
    const adult:number = Number(params.params[4])
    const child:number = Number(params.params[5])
    const check_in = params.params[2]
    const check_out = params.params[3]
    const promotion_code = params.params[6]
    const id = params.params[1]
    const reservation = params.params[0]
    if(reservation == 0){
        notFound()
    }
    const totalCapacity:number = adult+child
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())){
        notFound()
    }
    const response_villas = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/villas_function?id=${id}&token=${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
        {
            //   cache: 'force-cache',
            method: 'GET',
            headers : {
                "Content-Type": "application/json"
            },
        }
    )
    let get_villas:any = await response_villas.json()
    let totalcount_villas = get_villas?.pagination?.total || 0;

    const response_reservations = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/reservations_function?id=${reservation}&token=${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
        {
            //   cache: 'force-cache',
            method: 'GET',
            headers : {
                "Content-Type": "application/json"
            },
        }
    )
    let get_reservations:any = await response_reservations.json()
    let totalcount_reservations = get_reservations?.pagination?.total || 0;

    if (totalcount_villas == 0 || totalcount_reservations == 0){ 
        notFound()
    }
    const reservation_detail = get_reservations.data.reservations_data[0].json.detail
    const reservation_settings = get_reservations.data.reservations_data[0].json.settings
    const reservation_payment = get_reservations.data.reservations_data[0].json.payment
    if (
        check_in != reservation_detail.check_in 
        || check_out != reservation_detail.check_out
        || adult != reservation_detail.adult
        || child != reservation_detail.child
        || id != get_villas.data[0].villas_data.id
        || reservation != get_reservations.data.reservations_data[0].id
        || promotion_code != reservation_payment.promotion_code
    ){ 
        notFound()
    }
    const default_comission = 20
    const villas_data = get_villas.data[0].villas_data
    const detail = get_villas.data[0].villas_data.json.detail
    const seo = get_villas.data[0].villas_data.json.seo
    const image = get_villas.data[0].villas_data.json.detail.image
    const prices_data = get_villas.data[0].prices_data
    const regions_data = get_villas.data[0].regions_data[0]
    const regions_up_data = get_villas.data[0].regions_up_data[0]
    const villa_extra = get_villas.data[0].villas_data.json.extra

    const availability_data = get_villas.data[0].availability_data
    if(totalCapacity > detail?.capacity || totalCapacity == 0){
        notFound()
    }
    const check_availabilitiy:any = CheckAvailabilitiy(availability_data, checkInDate, checkOutDate)
    if(check_availabilitiy === null){
        notFound()
    }
    const getPromotion = CalculatePromotion(promotion_code, String(check_in), String(check_out), id)
    const array:any = calculatePriceForDates(prices_data.json, String(check_in), String(check_out), true, get_villas.data[0], getPromotion);
    if(array === null){
        notFound()
    }
    const nightDifference:number = reservation_payment.nightDifference
    if (nightDifference <= detail?.min_stay){
        notFound()
    }
    params.params[7] = reservation_settings.quick_booking // hızlı rezervasyon mu?
    params.params[8] = reservation_settings.payment_status // ödeme seçenekleri kısıtlaması

    const date_options:any = { year: 'numeric', month: 'long', day: 'numeric' };
	return (
		<>
			<div className="lg:pt-20 pt-16">
				<div className="container">
					<ul className="flex items-center justify-between pb-10">
						<li className="single-step-count justify-end step">
							<span className="inline-flex justify-center items-center lg:h-10 lg:w-10 w-9 h-9 rounded-full bg-primary-1 text-white">01</span>
							<p className="text-sm lg:text-base">Personal Details</p>
						</li>
						<li className="flex-grow h-[1px] bg-stock-1 mx-3 sm:block hidden" />
						<li className="single-step-count justify-end step active-count">
							<span className="inline-flex justify-center items-center lg:h-10 lg:w-10 w-9 h-9 rounded-full bg-primary-1 text-white">02</span>
							<p className="text-sm lg:text-base">Payment Details</p>
						</li>
						<li className="flex-grow h-[1px] bg-stock-1 mx-3 sm:block hidden" />
						<li className="single-step-count justify-end step">
							<span className="inline-flex justify-center items-center lg:h-10 lg:w-10 w-9 h-9 rounded-full bg-primary-1 text-white">03</span>
							<p className="text-sm lg:text-base">Final Step</p>
						</li>
					</ul>
                    <div className="tab">
                        <div className="grid grid-cols-12 lg:gap-12 gap-base">
                            <PackagePaymentsForm 
                                params={params}
                                seo={seo}
                                detail={detail}
                                payment={reservation_payment}
                                date_options={date_options}
                            />
                        </div>
                    </div>
				</div>
			</div>
		</>
	)
}

export default Payment