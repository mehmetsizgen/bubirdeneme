'use client';

import CheckAvailabilitiy from "@/app/api/availabilitys_function/CheckAvailabilitiy";
import calculatePriceForDates from "@/app/api/prices_function/CalculatePrice";
import Link from "next/link";
import { useEffect, useRef, useState } from "react"
import "react-datepicker/dist/react-datepicker.css";
import PackageDateRange from "./PackageDateRange";
import CalculatePromotion from "@/app/api/prices_function/CalculatePromotion";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const PackageBookingForm = (
    {prices, availability, start_price, min_stay, comission_status, comission, default_comission, villas, capacity} : 
    {
        prices: any, 
        availability: any, 
        start_price: string, 
        min_stay: number, 
        comission_status: number, 
        comission: number, 
        default_comission: number, 
        villas: any, 
        capacity: number, 
    },
) => {

    interface Guest {
        adult: number;
        child: number;
        room: number;
    }
    const [activeIndex, setActiveIndex] = useState(null);

    const handleClickDrop = (index: any) => {
        if (index === activeIndex) {
            setActiveIndex(null);
        } else {
            setActiveIndex(index);
        }
    }
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [startDate, endDate]:any = dateRange;
    const [messageArea, setMessageArea] = useState(false);
    const [messageError, setMessageError] = useState('');
    const [reservationButton, setReservationButton] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [monthsDiscountState, setMonthsDiscountState] = useState(0);
    const [monthsDiscount, setMonthsDiscount] = useState(0);
    const [weeksDiscountState, setWeeksDiscountState] = useState(0);
    const [discountState, setDiscountState] = useState(0);
    const [villaDiscountState, setVillaDiscountState] = useState(0);
    const [regionsDiscountState, setRegionsDiscountState] = useState(0);
    const [regionsUpDiscountState, setRegionsUpDiscountState] = useState(0);
    const [villaDiscount, setVillaDiscount] = useState(0);
    const [regionsDiscount, setRegionsDiscount] = useState(0);
    const [regionsUpDiscount, setRegionsUpDiscount] = useState(0);
    const [weeksDiscount, setWeeksDiscount] = useState(0);
    const [promotionDiscountState, setPromotionDiscountState] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [promotion, setPromotion]:any = useState(null);
    const [promotionCode, setPromotionCode] = useState('');
    const [balancePrice, setBalancePrice] = useState(0);
    const [doorPrice, setDoorPrice] = useState(0);
    const [cleaninFee, setCleaninFee] = useState(0);
    const [depositFee, setDepositFee] = useState(0);
    const [firstMinStay, setFirstMinStay] = useState(0);
    const [nightDifference, setNightDifference] = useState(0);
    const [dateClick, setDateClick] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null); 
    const [activTab, setActiveTab] = useState('booking');
    const [dropdownActive, setDropdownActive] = useState(false);
    const date_options:any = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateClickChange = () => {
        setDateClick((prev) => !prev);
    };
    const handleDateRangeChange = (startDate: Date, endDate: Date) => {
        setDateRange([startDate, endDate]);
        if(startDate && endDate && startDate != endDate){
            handleDateChange([startDate, endDate],);
        }
    };
    const handleClick = (e: any) => {
        const {value}:any  = document.getElementById("promotion");
        const state  = e.target.getAttribute("data-state");
        if(value != ''){
            if(state == 0){
                if(startDate && endDate && startDate != endDate){
                    handleDateChange([startDate, endDate], null);
                }
                (document.getElementById("promotion") as HTMLInputElement).value = '';
            } else {
                if(startDate && endDate && startDate != endDate){
                    handleDateChange([startDate, endDate], value);
                }
            }
        } else {
            withReactContent(Swal).fire({
                title: 'HATA!',
                text: 'Promosyon kodu alanını boş bırakmayınız.',
                icon: 'error',
                confirmButtonColor: '#cccccc',
                timer: 2000
            });
        }
    }
    const handleDateChange = (update: [Date | null, Date | null], promotion_code:any | null = null) => {
        setDropdownActive(false)
        setDateClick(false)
        setDateRange(update);
        setMessageArea(false);
        setReservationButton(false);
        setPromotion(null)
        setMessageError('');
        let check_in:any = null
        let check_out:any = null
        let array:any = null
        let getPromotion:any = null
        if (update[0] && update[1]) {
            check_in = update[0].getFullYear() + "-" + (update[0].getMonth() + 1).toString().padStart(2,"0") + "-" + update[0].getDate().toString().padStart(2,"0");
            check_out = update[1].getFullYear() + "-" + (update[1].getMonth() + 1).toString().padStart(2,"0") + "-" + update[1].getDate().toString().padStart(2,"0");
        }
        if((update[0] && update[1])){
            const checkInDate = new Date(check_in);
            const checkOutDate = new Date(check_out);
            setMessageArea(true);
            if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())){
                withReactContent(Swal).fire({
                    title: 'HATA!',
                    text: 'Seçtiğiniz tarih formatı geçersizdir.',
                    icon: 'error',
                    confirmButtonColor: '#cccccc',
                    timer: 2000
                });
                setMessageError('Seçtiğiniz tarih formatı geçersizdir.')
                return false
            }
            const check_availabilitiy:any = CheckAvailabilitiy(availability, checkInDate, checkOutDate)
            if(check_availabilitiy === null){
                withReactContent(Swal).fire({
                    title: 'HATA!',
                    text: 'Seçtiğiniz tarihler müsait değildir.',
                    icon: 'error',
                    confirmButtonColor: '#cccccc',
                    timer: 2000
                });
                setMessageError('Seçtiğiniz tarihler müsait değildir.')
                return false
            }
            if(promotion_code != null){
                getPromotion = CalculatePromotion(promotion_code, String(check_in), String(check_out), villas.villas_data.id)
                if (getPromotion == null) {
                    setPromotion(null);
                    withReactContent(Swal).fire({
                        title: 'HATA!',
                        text: 'Girdiğiniz promosyon kodu geçersizdir.',
                        icon: 'error',
                        confirmButtonColor: '#cccccc',
                        timer: 2000
                    });
                    // (document.getElementById("promotion") as HTMLInputElement).value = '';
                } else {
                    setPromotion(getPromotion)
                    setPromotionCode(promotion_code)
                }
            }
            array = calculatePriceForDates(prices.json, String(check_in), String(check_out), true, villas, getPromotion);
            if(array === null){
                withReactContent(Swal).fire({
                    title: 'HATA!',
                    text: 'Fiyat hesaplanırken bir hata ile karşılaşıldı.',
                    icon: 'error',
                    confirmButtonColor: '#cccccc',
                    timer: 2000
                })
                setMessageError('Fiyat hesaplanırken bir hata ile karşılaşıldı.')
                return false
            }
            if (array.nightDifference <= min_stay){
                withReactContent(Swal).fire({
                    title: 'HATA!',
                    text: 'Seçtiğiniz tarihler minimum gece süresinden düşüktür, minimum gece: '+min_stay,
                    icon: 'error',
                    confirmButtonColor: '#cccccc',
                    timer: 2000
                });
                setMessageError('Seçtiğiniz tarihler minimum gece süresinden düşüktür, minimum gece: '+min_stay)
                return false
            }
            if(array.promotion != null && array.promotionDiscountState == 0){
                setPromotion(null);
                withReactContent(Swal).fire({
                    title: 'HATA!',
                    text: 'Girdiğiniz promosyon kodu minimum tutar eşiğinden düşüktür. Minimum, '+(array.promotion.discount_min_price).toLocaleString()+' tutarında rezervasyon oluşturmanız gerekmektedir.',
                    icon: 'error',
                    confirmButtonColor: '#cccccc',
                    timer: 5000
                });
            }
            console.log(array)
            setTotalPrice(array.totalPrice)
            const balance = array.totalPrice/100*(comission_status == 0 ? comission : default_comission)
            setBalancePrice(balance)
            setDoorPrice(array.totalPrice-balance)
            setCleaninFee(array.extraCharge)
            setDepositFee(array.damageDeposit)
            setFirstMinStay(array.firstMinStay)
            setNightDifference(array.nightDifference)
            setMonthsDiscountState(Number(array.monthsDiscountState))
            setTotalDiscount(Number(array.totalDiscount))
            setDiscount(Number(array.discount))
            setWeeksDiscountState(Number(array.weeksDiscountState))
            setVillaDiscountState(Number(array.villaDiscountState))
            setRegionsDiscountState(Number(array.regionsDiscountState))
            setRegionsUpDiscountState(Number(array.regionsUpDiscountState))
            setVillaDiscount(Number(array.villaDiscount))
            setRegionsDiscount(Number(array.regionsDiscount))
            setRegionsUpDiscount(Number(array.regionsUpDiscount))
            setDiscountState(Number(array.discountState))
            setWeeksDiscount(Number(array.weeksDiscount))
            setMonthsDiscount(Number(array.monthsDiscount))
            setPromotionDiscountState(Number(array.promotionDiscountState))
            setReservationButton(true)
        } else if(!update[0] && !update[1]){
            setMessageArea(false);
        }
    };
    const [guest, setGuest] = useState<Guest>({
        adult: 2,
        child: 0,
        room: 0
    });
    const incrementGuest = (key: keyof Guest) => {
        setGuest(prev => ({
            ...prev,
            [key]: prev[key] + 1
        }));
    }
    const minusGuest = (key: keyof Guest) => {
        if (guest[key] > 0) {
            setGuest(prev => ({
                ...prev,
                [key]: prev[key] - 1
            }));
        }
    }
    let url:string = '#'
    if(startDate && endDate){
        url = `/reservation/0/${villas.villas_data.id}/${startDate?.getFullYear() + "-" + (startDate?.getMonth() + 1).toString().padStart(2,"0") + "-" + startDate?.getDate().toString().padStart(2,"0")}/${endDate?.getFullYear() + "-" + (endDate?.getMonth() + 1).toString().padStart(2,"0") + "-" + endDate?.getDate().toString().padStart(2,"0")}/${guest.adult}/${guest.child}/${promotion != null ? promotionCode : 0}`
    }
    let totalCapacity = guest.adult+guest.child
    if(totalCapacity > capacity || totalCapacity == 0){
        setMessageArea(true);
        withReactContent(Swal).fire({
            title: 'HATA!',
            text: 'Seçtiğiniz kapasite villa kapasitesine uygun değildir. Lütfen yeniden tarih seçiniz. Maksimum kapasite : '+capacity+', minimum kapasite : 1',
            icon: 'error',
            confirmButtonColor: '#cccccc',
            timer: 2000
        });
        setMessageError('Seçtiğiniz kapasite villa kapasitesine uygun değildir. Lütfen yeniden tarih seçiniz. Maksimum kapasite : '+capacity+', minimum kapasite : 1')
        setReservationButton(false)
        setDateRange([null, null])
        if(totalCapacity == 0){
            capacity = 1
        }
        setGuest({
            adult : capacity,
            child: 0,
            room: 0
        })
        url = '#'
    }
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setDateClick(false); // Takvim dışına tıklandığında kapat
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
       
    }, [datePickerRef]);
    
    return (
        <>
            <div>
                <ul id="tabs-nav" className="booking-tabs flex gap-4 pb-6">
                    <li onClick={() => setActiveTab('booking')} className={`tab-link basis-1/2 ${activTab === 'booking' ? 'active' : ''}`} data-tab={3}>Booking</li>
                    <li onClick={() => setActiveTab('enquiry')} className={`tab-link basis-1/2 ${activTab === 'enquiry' ? 'active' : ''}`} data-tab={4}>Enquiry</li>
                </ul>
                <div id="tab-3" className={`tab-content ${activTab === 'booking' ? 'active' : ''}`}>
                    <div className="lg:px-base px-5 lg:pt-6 lg:pb-base pt-4 pb-5 bg-white border-primary-1 border">
                        <h4 className="lg:text-xl text-lg text-dark-1 font-semibold"><span className="text-md font-sans font-normal text-dark-3">Start from</span>{start_price}</h4>
                        <div className="mt-5 lg:mt-6 relative">
                            <label htmlFor="tourTime" className="mb-2 text-dark-3 capitalize block">Date</label>
                            <button type="button" className="p-[15px] border flex justify-between items-center text-dark-main mt-[5px] w-full" onClick={dateClickChange}>
                                {/* <i className="bi bi-calendar-event"></i> */}

                                <div className="flex items-center gap-1 uppercase">
                                    <span className="text-sm leading-4">{startDate ? startDate.toLocaleDateString('en-US', date_options) :  new Date().toLocaleDateString('en-US', date_options)}</span>
                                </div>
                            
                                <i className="bi bi-dash-lg"></i>
                                <div className="flex items-center gap-1 uppercase">
                                    <span className="text-sm leading-4">{endDate ? endDate.toLocaleDateString('en-US', date_options) :  new Date().toLocaleDateString('en-US', date_options)}</span>
                                </div>
                            </button>
                            <div ref={datePickerRef} onClick={(e) => e.stopPropagation()} className={`right-0 ${dateClick == false ? 'hidden' : 'flex'} transition transform-gpu duration-200 absolute top-full origin-top lg:w-150 w-full z-[60] -ml-3 bg-white rounded-lg sm:px-3 pt-2 shadow-lg`}>
                                <PackageDateRange
                                    prices={prices}
                                    availability={availability}
                                    set_month={1}
                                    onDateRangeChange={handleDateRangeChange}
                                />
                            </div>
                        </div>
                        <div className="js-form-counters lg:mt-6 mt-5 relative">
                            <label htmlFor="tourTime" className="mb-2 text-dark-3 capitalize block">Number of travelers</label>
                            <button aria-label="count button" onClick={() => setDropdownActive(!dropdownActive)} type="button" className="w-full bg-transparent border border-stock-1 lg:h-[54px] h-12 px-5 py-2 text-dark-2 focus:border-primary-1 flex items-center common_dropdown__btn">
                                <div>
                                    <span className="js-count-adult">{guest.adult}</span> adults - <span className="js-count-child">{guest.child}</span> childeren
                                </div>
                            </button>
                            {/* count dropdown */}
                            <div
                                className={`common__dropdown person-dropdown space-y-4 opacity-0 absolute w-full left-0 top-full invisible bg-white translate-y-3 duration-200 z-10 ${dropdownActive ? 'common_dropdown__active' : ''}`}>

                                {/* adult count */}
                                <div className="js-counter flex justify-between items-center" data-value-change=".js-count-adult">
                                    <p className="text-dark-1">Adult</p>
                                    <div className="flex items-center space-x-4">
                                        <button onClick={()=> minusGuest('adult')} type="button" className="js-down h-[38px] w-[38px] border border-primary-1 flex items-center justify-center rounded-full text-dark-1 hover:bg-primary-1 hover:text-white duration-150">
                                            <i className="bi bi-dash-lg" />
                                        </button>
                                        <div className="js-count text-dark-1 lg:ext-md">{guest.adult}</div>
                                        <button aria-label="count button" onClick={() => incrementGuest('adult')} type="button" className="js-up h-[38px] w-[38px] border border-primary-1 flex items-center justify-center rounded-full text-dark-1 hover:bg-primary-1 hover:text-white duration-150">
                                            <i className="bi bi-plus-lg" />
                                        </button>
                                    </div>
                                </div>

                                {/* children count  */}
                                <div className="js-counter flex justify-between items-center" data-value-change=".js-count-child">
                                    <p className="text-dark-1">Childeren</p>
                                    <div className="flex items-center space-x-4">
                                        <button onClick={()=> minusGuest('child')} type="button" className="js-down h-[38px] w-[38px] border border-primary-1 flex items-center justify-center rounded-full text-dark-1 hover:bg-primary-1 hover:text-white duration-150">
                                            <i className="bi bi-dash-lg" />
                                        </button>
                                        <div className="js-count text-dark-1 lg:ext-md">{guest.child}</div>
                                        <button aria-label="count button" onClick={() => incrementGuest('child')} type="button" className="js-up h-[38px] w-[38px] border border-primary-1 flex items-center justify-center rounded-full text-dark-1 hover:bg-primary-1 hover:text-white duration-150">
                                            <i className="bi bi-plus-lg" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`mt-6 ${messageArea === true ? 'block': 'hidden'}`}>
                            {messageError != '' && (
                                <>
                                    <div className="flex items-center p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                                        <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                                        </svg>
                                        <span className="sr-only">Info</span>
                                        <div>
                                            <span className="font-medium">{messageError}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                            {reservationButton === true && (
                                <>
                                    <label htmlFor="tourTime" className="col-span-2 mb-2 text-dark-3 capitalize block">Promosyon Kodu</label>
                                    <div className="grid grid-cols-2 gap-1 border-b mb-4 pb-4">
                                        <div className="col-span-1">
                                            <input id="promotion" type="text" placeholder="XXX-XXX" style={{ height: '100%' }} className="input_style__primary" />
                                        </div>
                                        <div className="col-span-1">
                                            <button onClick={handleClick} data-state={promotion != null ? 0 : 1} className={`!w-full justify-center ${reservationButton === true ? 'btn_primary__v1': 'hidden'}`}>
                                                {promotion != null ? 'Kaldır' : 'Uygula'}
                                                <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M7.42505 16.5999L12.8584 11.1666C13.5 10.5249 13.5 9.4749 12.8584 8.83324L7.42505 3.3999" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="font-sans text-dark-1 text-1md font-semibold flex justify-between">Advance payment (%{comission_status == 0 ? comission : default_comission}) : <span>{process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}{balancePrice.toLocaleString()}</span></div>
                                    <div className="font-sans text-dark-1 text-1md font-semibold flex justify-between">Payment at the Door : <span>{process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}{doorPrice.toLocaleString()}</span></div>
                                    {(totalDiscount > 0) && (
                                        <div className="font-sans text-primary-1 text-1md font-semibold flex justify-between text-opacity-50 line-through">Total : <span>{process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}{Math.ceil(Number(totalPrice)+Number(totalDiscount)).toLocaleString()}</span></div>
                                    )}
                                    <div className="font-sans text-primary-1 text-1md font-semibold flex justify-between">Total : <span>{process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}{totalPrice.toLocaleString()}</span></div>
                                    <div className="single__accordion shadow-custom-1 bg-primary-1 mt-4 font-sans border border-primary-1">
                                        <button onClick={() => handleClickDrop(0)} type="button" className="flex justify-between toggle p-3 leading-1.5 text-2md text-start w-full text-white text-1md font-semibold">
                                            Detail <i className="bi bi-info-circle"></i>
                                        </button>
                                        <div
                                            className={`hidden inner p-2 bg-white ${0 === activeIndex ? 'content show' : 'content'}`}
                                            style={{ 
                                                display: 0 === activeIndex ? 'block' : 'none'
                                            }}
                                        >
                                            {firstMinStay > nightDifference && 
                                                <div className="font-sans text-dark-1 text-1md font-semibold flex justify-between border-b mt-1 pt-1 pb-4 border-stock-1">Cleaning Fee : <span>{process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}{cleaninFee.toLocaleString()}</span></div>
                                            }
                                            <div className="font-sans text-dark-1 text-1md font-semibold flex justify-between mt-1 pt-1">Damage Deposit : <span>{process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}{depositFee.toLocaleString()}</span></div>
                                            {(((monthsDiscountState == 1 || weeksDiscountState == 1 || discountState == 1 || villaDiscountState == 1) && nightDifference >= 7) || promotion != null) && (
                                                <div className="font-sans text-primary-1 text-1md font-semibold border-t mt-4 pt-4 border-stock-1">
                                                    {((monthsDiscountState == 1 || weeksDiscountState == 1) && nightDifference >= 7) && (
                                                        <>
                                                            <span className="block"> - Kiralama süreniz {(nightDifference >= 30 ? 30 : (nightDifference >= 7 ? 7 : 0))} gece ve üzeri olduğu için fiyata %{(nightDifference >= 30 ? monthsDiscount : (nightDifference >= 7 ? weeksDiscount : 0))} indirim uygulanmıştır.</span>
                                                        </>
                                                    )}
                                                    {(promotionDiscountState == 1) && (
                                                        <>
                                                            <span className="block"> - Kullandığınız promosyon kodu dahilinde, %{promotion.discount} indirim uygulanmıştır.</span>
                                                        </>
                                                    )}
                                                    {(discountState == 1) && (
                                                        <>
                                                            <span className="block"> - Firmamızın kampanyası dahilinde, %{discount} indirim uygulanmıştır.</span>
                                                        </>
                                                    )}
                                                    {(villaDiscountState == 1) && (
                                                        <>
                                                            <span className="block"> - Firmamızın kampanyası dahilinde, %{villaDiscount} indirim uygulanmıştır.</span>
                                                        </>
                                                    )}
                                                    {(regionsDiscountState == 1) && (
                                                        <>
                                                            <span className="block"> - Firmamızın kampanyası dahilinde, %{regionsDiscount} indirim uygulanmıştır.</span>
                                                        </>
                                                    )}
                                                    {(regionsUpDiscountState == 1) && (
                                                        <>
                                                            <span className="block"> - Firmamızın kampanyası dahilinde, %{regionsUpDiscount} indirim uygulanmıştır.</span>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            {(totalDiscount != 0) && (
                                                <div className="font-sans text-primary-1 text-1md font-semibold border-t mt-4 pt-4 border-stock-1">
                                                    <span className="block"> - Toplamda fiyata {process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}{totalDiscount.toLocaleString()} indirim uygulanmıştır.</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                </>
                            )}
                        </div>
                        <Link href={url} className={`!w-full justify-center mt-5 ${reservationButton === true ? 'btn_primary__v1': 'hidden'}`}>
                            Book Now
                            <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.42505 16.5999L12.8584 11.1666C13.5 10.5249 13.5 9.4749 12.8584 8.83324L7.42505 3.3999" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </div>
                </div>
                <div id="tab-4" className={`tab-content ${activTab === 'enquiry' ? 'active' : ''}`}>
                    <form action="#" className="lg:px-base px-5 lg:py-base py-5 bg-white border-primary-1 border">
                        <h4 className="lg:text-lg text-2md text-dark-1 font-semibold">Enquiry Now</h4>
                        <p className="regular-text-v1 !leading-[1.62] mt-2">Qui ad idque soluta deterruisset, nec sale
                            pertinax mandamus et.</p>
                        <div className="lg:mt-base mt-5">
                            <input type="text" placeholder="Your Name" className="input_style__primary" />
                        </div>
                        <div className="lg:mt-base mt-5">
                            <input type="email" placeholder="Email" className="input_style__primary" />
                        </div>
                        <div className="lg:mt-base mt-5">
                            <input type="tel" placeholder="Mobile Number" className="input_style__primary" />
                        </div>
                        <div className="lg:mt-base mt-5">
                            <textarea cols={30} rows={6} className="input_style__primary" placeholder="Additional Description..." defaultValue={""} />
                        </div>
                        <button aria-label="form submit" type="submit" className="btn_primary__v1 !w-full justify-center mt-5">
                            Enquiry
                            <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.42505 16.5999L12.8584 11.1666C13.5 10.5249 13.5 9.4749 12.8584 8.83324L7.42505 3.3999" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default PackageBookingForm