'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import Select from "react-select";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Link from 'next/link';
import Separator from '../ui/Separator';


type OptionType = {
    value: string;
    label: string;
    name: string;
};
type OptionTypeExtra = {
    label: string;
    value: string;
    price: number,
    period_status: number;
    currency_type: number;
};
let optionsPayment : OptionType[] = []
let optionsPaymentType : OptionType[] = []
let optionsExtra : OptionTypeExtra[] = []


const PackageReservationsForm = (
    {params, seo, detail, date_options}: { 
        params: any,
        seo:any,
        detail:any,
        date_options:any,
    }
) => {
    const router = useRouter()
    const ref = useRef<HTMLFormElement>(null);
    const adult:number = Number(params.params[4])
    const child:number = Number(params.params[5])
    const check_in = params.params[2]
    const check_out = params.params[3]
    const promotion_code = params.params[6]
    const id = params.params[1]
    const reservation = params.params[0]
    const quick_booking = params.params[7]
    const payment_status = params.params[8]
    const default_comission = params.params[9]
    const array = params.params[10]
    array.totalPaymentDiscount = 5
    const extraCharge:number = array.extraCharge
    const damageDeposit:number = array.damageDeposit
    const firstMinStay:number = array.firstMinStay
    
    if(payment_status == 0){
        optionsPayment = [
            { value: '1', label: 'Ön Ödeme (%'+ default_comission +') - '+ process.env.NEXT_PUBLIC_CURRENCY_SYMBOL + array.balance.toLocaleString(), name: 'payment_status'},
            { value: '2', label: 'Tamamı (%100) - '+ ((array.totalPaymentDiscountState == 1 && array.totalPaymentDiscountPrice == 0) ? process.env.NEXT_PUBLIC_CURRENCY_SYMBOL + (array.totalPrice-(array.totalPrice/100*array.totalPaymentDiscount)).toLocaleString() : process.env.NEXT_PUBLIC_CURRENCY_SYMBOL + array.totalPrice.toLocaleString()), name: 'payment_status'},
        ]; 
    } else if(payment_status == 1){
        optionsPayment = [
            { value: '1', label: 'Ön Ödeme (%'+ default_comission +') - '+ process.env.NEXT_PUBLIC_CURRENCY_SYMBOL + array.balance.toLocaleString(), name: 'payment_status'},
        ]; 
    } else if(payment_status == 2){
        optionsPayment = [
            { value: '2', label: 'Tamamı (%100) - '+ ((array.totalPaymentDiscountState == 1 && array.totalPaymentDiscountPrice == 0) ? process.env.NEXT_PUBLIC_CURRENCY_SYMBOL + (array.totalPrice-(array.totalPrice/100*array.totalPaymentDiscount)).toLocaleString() : process.env.NEXT_PUBLIC_CURRENCY_SYMBOL + array.totalPrice.toLocaleString()), name: 'payment_status'},
        ]; 
    }
    optionsPaymentType = [
        { value: '1', label: 'Kredi Kartı', name: 'payment_type'},
        { value: '2', label: 'Havale/EFT', name: 'payment_type'},
    ]; 
    optionsExtra =  [
        {
            value: '1',
            label: 'Araç Kiralama',
            price: 100,
            period_status: 1, // 0 günlük, 3 adet, 4 gidiş, 5 geliş, 6 gidiş/geliş
            currency_type: 1,
            // aylık periyod
        },
        {
            value: '2',
            label: 'Aşçı',
            price: 500,
            period_status: 1, // 0 günlük,
            currency_type: 1,
        },
        {
            value: '3',
            label: 'Transfer',
            price: 100,
            period_status: 1, // 0 günlük, 3 adet, 4 gidiş, 5 geliş, 6 gidiş/geliş
            currency_type: 1,
            // bölgeye göre periyod
        },
        {
            value: '4',
            label: 'Viski',
            price: 500,
            period_status: 1, // 0 günlük,
            currency_type: 1,
        },
        // ...
    ]; 
    const [selectedOptionPayment, setSelectedOptionPayment] = useState<OptionType | null | any>(optionsPayment[0]);
    const [selectedOptionPaymentType, setSelectedOptionPaymentType] = useState<OptionType | null | any>(optionsPaymentType[0]);
    const [selectedOptionExtra, setSelectedOptionExtra] = useState<OptionType | null | any>([]);
    const [discountPrice, setDiscountPrice] = useState<number | 0>(0);
    const [formData, setFormData] = useState({
        detail: {
            phone: '',
            email: '',
            name: '', 
            tc: '', 
            country: '', 
            city: '', 
            address: '', 
            note: '', 
            guest_list: '', 
            check_in: check_in,
            check_out: check_out,
            adult: adult,
            child: child,
        }, 
        settings: {
            quick_booking,
            payment_status: Number(selectedOptionPayment.value),
            payment_type: Number(selectedOptionPaymentType.value),
        },
        extra: [],
        payment: {
            recommendation_advance_payment: array.balance,
            recommendation_payment_at_the_door: array.doorPrice,
            paid_payment_at_the_door : 0,
            paid_advance_payment : 0,
            admin_discount: 0,
            admin_discount_type: 0, // 0 ev sahibi ve kapıda ödemeden düşecek, 1 firma ve ön ödemeden düşecek, 2 toplamdan ve toplam fiyattan düşecek.
            default_comission,
            promotion_code,
            ...array,
        },
        
        villa: Number(id),
        checked: false,
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        if (type === 'checkbox') {
            setFormData(prevState => ({
                ...prevState,
                [name]: checked
            }));
        } else if (name in formData.detail) {
            setFormData(prevState => ({
                ...prevState,
                detail: {
                    ...prevState.detail,
                    [name]: value
                }
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };
    const handleSelectChange = (e:any) => {
        if(e.name == 'payment_status'){ 
            // ödeme yöntemi, kredi kartı veya havale.
            if(e.value == 2 && array.totalPaymentDiscountState == 1){
                setDiscountPrice(array.totalPrice)
                array.totalPrice = array.totalPrice+array.totalPaymentDiscountPrice
                array.totalPaymentDiscountPrice = array.totalPrice/100*array.totalPaymentDiscount
                array.totalDiscount = array.totalDiscount+array.totalPaymentDiscountPrice
                array.totalPrice = array.totalPrice-array.totalPaymentDiscountPrice
               
            } else {
                setDiscountPrice(0)
                array.totalPrice = array.totalPrice+array.totalPaymentDiscountPrice
                array.totalDiscount = array.totalDiscount-array.totalPaymentDiscountPrice
                array.totalPaymentDiscountPrice = 0
              
            }
            setFormData(prevState => ({
                ...prevState,
                payment: {
                    ...prevState.payment,
                    ['recommendation_advance_payment']: (e.value == 1  && (payment_status == 0 || payment_status == 1)) ? array.balance : array.totalPrice,
                }
            }));
            setFormData(prevState => ({
                ...prevState,
                payment: {
                    ...prevState.payment,
                    ['recommendation_payment_at_the_door']: (e.value == 2  && (payment_status == 0 || payment_status == 2)) ? 0 : array.doorPrice,
                }
            }));
            setFormData(prevState => ({
                ...prevState,
                settings: {
                    ...prevState.settings,
                    [e.name]: Number(e.value)
                }
            }));
            setFormData(prevState => ({
                ...prevState,
                payment: {
                    ...prevState.payment,
                    ...array,
                }
            }));
            setSelectedOptionPayment(e)
        }
        if(e.name == 'payment_type'){ 
            setFormData(prevState => ({
                ...prevState,
                settings: {
                    ...prevState.settings,
                    [e.name]: Number(e.value)
                }
            }));
            setSelectedOptionPaymentType(e)
        }
    }
    const handleExtraChange = (e:any) => {
        setSelectedOptionExtra(e)
        setFormData(prevState => ({
            ...prevState,
            extra: e
        }));
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.checked) {
            withReactContent(Swal).fire({
                title: 'HATA!',
                text: 'Sözleşme kurallarını kabul etmeden rezervasyon talebi gönderilemez.',
                icon: 'error',
                confirmButtonColor: '#cccccc',
                timer: 2000
            });
            return;
        }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/reservations_function`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                withReactContent(Swal).fire({
                    title: 'HATA!',
                    text: response.statusText,
                    icon: 'error',
                    confirmButtonColor: '#cccccc',
                    timer: 2000
                });
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            if (result.status === 1) {
                withReactContent(Swal).fire({
                    title: 'TEBRİKLER!',
                    text: response.statusText,
                    icon: 'success',
                    confirmButtonColor: '#cccccc',
                    timer: 2000,
                });
                ref.current?.reset();
            } else if(result.status === 2){
                router.push('/payment/'+result.data.id+'/'+result.data.json.villa+'/'+result.data.json.detail.check_in+'/'+result.data.json.detail.check_out+'/'+result.data.json.detail.adult+'/'+result.data.json.detail.child+'/'+result.data.json.payment.promotion_code)
            } else if(result.status === 0){
                withReactContent(Swal).fire({
                    title: 'HATA!',
                    text: response.statusText,
                    icon: 'error',
                    confirmButtonColor: '#cccccc',
                    timer: 2000,
                });
                ref.current?.reset();
            }
        } catch (error:any) {
            console.error('Hata:', error.message || error);
        }
    };
    return (
        <>
            <div className="lg:col-span-8 col-span-12">
                <form ref={ref} onSubmit={handleSubmit} id="reservationsForm">
                    <h5 className="text-dark-1 lg:text-[22px] text-2md font-semibold mb-7">
                        Please tell us about yourself.
                    </h5>
                    <div className="grid grid-cols-4 lg:gap-7 gap-5">
                        <div className="lg:col-span-2 col-span-2">
                            <label className="text-dark-2 block mb-2">Full Name</label>
                            <input 
                                type="text" 
                                placeholder="ex: Jhon Doe" 
                                name="name" 
                                value={formData.detail.name} 
                                onChange={handleChange} 
                                className="input_style__primary" 
                            />
                        </div>
                        <div className="lg:col-span-2 col-span-2">
                            <label className="text-dark-2 block mb-2">Email</label>
                            <input 
                                type="email" 
                                placeholder="ex: example@email.com" 
                                name="email" 
                                value={formData.detail.email} 
                                onChange={handleChange} 
                                className="input_style__primary" 
                            />
                        </div>
                        <div className="lg:col-span-2 col-span-2">
                            <label className="text-dark-2 block mb-2">Phone Number</label>
                            <input 
                                type="text" 
                                placeholder="ex: +00 000 000 000" 
                                name="phone" 
                                value={formData.detail.phone} 
                                onChange={handleChange} 
                                className="input_style__primary" 
                            />
                        </div>
                        <div className="lg:col-span-2 col-span-2">
                            <label className="text-dark-2 block mb-2">Tc Kimlik/Pasaport No</label>
                            <input 
                                type="number" 
                                placeholder="ex: 11111111" 
                                name="tc" 
                                value={formData.detail.tc} 
                                onChange={handleChange} 
                                className="input_style__primary" 
                            />
                        </div>
                        <div className="lg:col-span-1 col-span-1">
                            <label className="text-dark-2 block mb-2">Ülke</label>
                            <input 
                                type="text" 
                                placeholder="ex: 11111111" 
                                name="country" 
                                value={formData.detail.country} 
                                onChange={handleChange} 
                                className="input_style__primary" 
                            />
                        </div>
                        <div className="lg:col-span-1 col-span-1">
                            <label className="text-dark-2 block mb-2">Şehir</label>
                            <input 
                                type="text" 
                                placeholder="ex: 11111111" 
                                name="city" 
                                value={formData.detail.city} 
                                onChange={handleChange} 
                                className="input_style__primary" 
                            />
                        </div>
                        <div className="lg:col-span-2 col-span-2">
                            <label className="text-dark-2 block mb-2">Adres</label>
                            <input 
                                type="text" 
                                placeholder="ex: 11111111" 
                                name="address" 
                                value={formData.detail.address} 
                                onChange={handleChange} 
                                className="input_style__primary" 
                            />
                        </div>
                        <div className="lg:col-span-2 col-span-2">
                            <label className="text-dark-2 block mb-2">Not</label>
                            <textarea 
                                placeholder="ex: 11111111" 
                                name="note" 
                                value={formData.detail.note} 
                                onChange={handleChange} 
                                className="input_style__primary" 
                            />
                        </div>
                        <div className="lg:col-span-2 col-span-2">
                            <label className="text-dark-2 block mb-2">Diğer Misafirler</label>
                            <textarea 
                                placeholder="ex: 11111111" 
                                name="guest_list" 
                                value={formData.detail.guest_list} 
                                onChange={handleChange} 
                                className="input_style__primary" 
                            />
                        </div>
                        <h5 className="lg:col-span-4 col-span-4 text-dark-1 lg:text-[22px] text-2md font-semibold mb-1">
                            Ekstra Hizmetler
                        </h5>
                        <div className="lg:col-span-4 col-span-4">
                            <label className="text-dark-2 block mb-2">Esktra Hizmet</label>
                            <Select
                                defaultValue={selectedOptionExtra}
                                onChange={handleExtraChange}
                                options ={optionsExtra}
                                isMulti
                                className="z-999 select_style__primary text-dark-4"
                                placeholder="Hizmet Seç"
                                classNamePrefix="react-select"
                            />
                        </div>
                        <h5 className="lg:col-span-4 col-span-4 text-dark-1 lg:text-[22px] text-2md font-semibold mb-1">
                            Ödeme Bilgileri
                        </h5>
                        {array.totalPaymentDiscountState == 1 && (
                            <>
                                <div className="lg:col-span-4 col-span-4">
                                    <span>Ödemenin tamamını yapmanız dahilinde toplam fiyata %{array.totalPaymentDiscount} indirim uygulanacaktır.</span>
                                </div>
                            </>
                        )}
                        <div className="lg:col-span-2 col-span-2">
                            <label className="text-dark-2 block mb-2">Ödeme Yöntemi</label>
                            <Select
                                defaultValue={selectedOptionPayment}
                                onChange={handleSelectChange}
                                options ={optionsPayment}
                                className="z-999 select_style__primary text-dark-4"
                                placeholder="Tour Type"
                                classNamePrefix="react-select"
                            />
                        </div>
                        <div className="lg:col-span-2 col-span-2">
                            <label className="text-dark-2 block mb-2">Ödeme Şekli</label>
                            <Select
                                defaultValue={selectedOptionPaymentType}
                                onChange={handleSelectChange}
                                options ={optionsPaymentType}
                                className="z-999 select_style__primary text-dark-4"
                                placeholder="Tour Type"
                                classNamePrefix="react-select"
                            />
                        </div>
                        <div className="custom-checkbox col-span-4">
                            <input type="checkbox" id="agree2" name="checked" onChange={handleChange} />
                            <label htmlFor="agree2">I agree to Arid Terms of Use and Privacy Policy.</label>
                        </div>
                        <div className="col-span-2">
                            <button aria-label="toggle button" type="submit" className="btn_primary__v1">
                                Find Out More
                                <i className="bi bi-chevron-right" />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="lg:col-span-4 col-span-12">
                <h5 className="text-dark-1 lg:text-[22px] text-2md font-semibold">
                    Your Booking Details
                </h5>
                <div className="flex group pt-5">
                    <Link target='_blank' href={`/holiday-villas/${seo?.slug}`} className="shrink-0 lg:max-w-[134px] max-w-[100px] mr-[15px] overflow-hidden">
                        <img src="../../../../../../../assets/images/packages/p1-1.webp" alt="blogs" className="w-full group-hover:scale-105 duration-200" />
                    </Link>
                    <div className="grow">
                        <ul className="text-sm text-orange-500">
                            <li className="mr-[2px] last:mr-0 inline-block"><i className="bi bi-star-fill" /></li>
                            <li className="mr-[2px] last:mr-0 inline-block"><i className="bi bi-star-fill" /></li>
                            <li className="mr-[2px] last:mr-0 inline-block"><i className="bi bi-star-fill" /></li>
                            <li className="mr-[2px] last:mr-0 inline-block"><i className="bi bi-star-fill" /></li>
                            <li className="mr-[2px] last:mr-0 inline-block"><i className="bi bi-star-half" /></li>
                        </ul>
                        <h5 className="lg:text-md mt-1 text-base font-semibold leading-[1.64] group-hover:text-primary-1 duration-200 fixed-title">
                            <a href="package-details.html">{detail?.name}</a>
                        </h5>
                        <div className="mt-[5px] text-dark-2">
                            <span>
                                From
                            </span> 
                            {discountPrice != 0 && (
                                <>
                                    <span className="pl-1 text-primary-1 font-medium opacity-50 line-through">{process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}{discountPrice.toLocaleString()}</span>
                                </>
                            )}
                            <span className="pl-1 text-primary-1 font-medium">{process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}{array.totalPrice.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 items-center">
                    <div className="col-span-1 border-r border-stock-1">
                        <span className="text-sm text-dark-3">Check-in</span>
                        <h5 className="lg:text-2md text-md font-semibold text-dark-1 pb-1">{new Date(check_in).toLocaleDateString('en-US', date_options)}</h5>
                        <span className="text-sm text-dark-3">Time : <span className="text-dark-2 font-medium">10:00 -
                            12:00</span> </span>
                    </div>
                    <div className="col-span-1 text-end">
                        <span className="text-sm text-dark-3">Check-out</span>
                        <h5 className="lg:text-2md text-md font-semibold text-dark-1 pb-1">{new Date(check_out).toLocaleDateString('en-US', date_options)}</h5>
                        <span className="text-sm text-dark-3">Time : <span className="text-dark-2 font-medium">10:00 -
                            12:00</span> </span>
                    </div>
                </div>
                <Separator />
                <div>
                    {firstMinStay > array.nightDifference && 
                        <div className="flex justify-between gap-3 lg:text-base text-sm">
                            <span className="grow text-dark-2">- Cleaning Fee:</span>
                            <span className="grow text-dark-1 font-semibold text-end">{process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}{extraCharge.toLocaleString()}</span>
                        </div>
                    }
                    <div className="flex justify-between gap-3 lg:text-base text-sm">
                        <span className="grow text-dark-2">- Damage Deposit:</span>
                        <span className="grow text-dark-1 font-semibold text-end">{process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}{damageDeposit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between gap-3 lg:text-base text-sm">
                        <span className="grow text-dark-2">- Total length of stay:</span>
                        <span className="grow text-dark-1 font-semibold text-end">{array.nightDifference} nights</span>
                    </div>
                    <div className="flex justify-between gap-3 mb-5 lg:text-base text-sm">
                        <span className="grow text-dark-2">- Guests:</span>
                        <span className="grow text-dark-1 font-semibold text-end">{adult} Adult, {child} Children</span>
                    </div>
                    <div className="flex justify-between gap-3 lg:text-base text-sm">
                        {(selectedOptionPayment.value == 1  && (payment_status == 0 || payment_status == 1)) && (
                            <>
                                <span className="grow text-dark-2">- Advance payment:</span>
                                <span className="grow text-dark-1 font-semibold text-end">{process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}{array.balance.toLocaleString()}</span>
                            </>
                        )}
                        {(selectedOptionPayment.value == 2 && (payment_status == 0 || payment_status == 2)) && (
                            <>
                                <span className="grow text-dark-2">- Payment:</span>
                                <span className="grow text-dark-1 font-semibold text-end">{process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}{array.totalPrice.toLocaleString()}</span>
                            </>
                        )}
                    </div>
                    <div className={`justify-between gap-3 lg:text-base text-sm ${(selectedOptionPayment.value == 1 && (payment_status == 0 || payment_status == 1)) ? 'flex': 'hidden'}`}>
                        <span className="grow text-dark-2">- Payment at the Door:</span>
                        <span className="grow text-dark-1 font-semibold text-end">{process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}{array.doorPrice.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PackageReservationsForm;
