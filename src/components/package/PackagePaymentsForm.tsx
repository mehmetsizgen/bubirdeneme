'use client'

import { useRef, useState } from 'react'
import Link from 'next/link';
import Separator from '../ui/Separator';

const PackagePaymentsForm = (
    {params, seo, detail, date_options, payment}: { 
        params: any,
        seo:any,
        detail:any,
        date_options:any,
        payment:any,
    }
) => {
    const ref = useRef<HTMLFormElement>(null);
    const adult:number = Number(params.params[4])
    const child:number = Number(params.params[5])
    const check_in = params.params[2]
    const check_out = params.params[3]
    const payment_status = params.params[8]
    const extraCharge:number = payment.extraCharge
    const damageDeposit:number = payment.damageDeposit
    const firstMinStay:number = payment.firstMinStay
    return (
        <>
            <div className="lg:col-span-8 col-span-12">
                <form ref={ref} id="paymentsForm">
                    <h5 className="text-dark-1 lg:text-[22px] text-2md font-semibold mb-7">
                        Enter your payment details
                    </h5>
                    <div className="grid grid-cols-2 lg:gap-7 gap-5">
                        <div className="lg:col-span-1 col-span-2">
                            <label className="text-dark-2 block mb-2">Card Holder Name</label>
                            <input type="text" placeholder="Holder Full Name" className="input_style__primary" />
                        </div>
                        <div className="lg:col-span-1 col-span-2">
                            <label className="text-dark-2 block mb-2">Card Number</label>
                            <input type="text" placeholder="1234 4568 1234 4567" className="input_style__primary" />
                        </div>
                        <div className="lg:col-span-1 col-span-2">
                            <label className="text-dark-2 block mb-2">MM/YY</label>
                            <input type="text" placeholder="00/00" className="input_style__primary" />
                        </div>
                        <div className="lg:col-span-1 col-span-2">
                            <label className="text-dark-2 block mb-2">CVV/CVC</label>
                            <input type="text" placeholder={'1223'} className="input_style__primary" />
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
                                Form
                            </span> <span className="text-primary-1 font-medium">{process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}{payment.totalPrice.toLocaleString()}</span>
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
                    {firstMinStay > payment.nightDifference && 
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
                        <span className="grow text-dark-1 font-semibold text-end">{payment.nightDifference} nights</span>
                    </div>
                    <div className="flex justify-between gap-3 mb-5 lg:text-base text-sm">
                        <span className="grow text-dark-2">- Guests:</span>
                        <span className="grow text-dark-1 font-semibold text-end">{adult} Adult, {child} Children</span>
                    </div>
                    <div className={`flex justify-between gap-3 lg:text-base text-sm`}>
                        <span className="grow text-dark-2">- Payable now:</span>
                        <span className="grow text-dark-1 font-semibold text-end">
                            {payment_status == 1  && (process.env.NEXT_PUBLIC_CURRENCY_SYMBOL + payment.balance.toLocaleString())}
                            {payment_status == 2  && (process.env.NEXT_PUBLIC_CURRENCY_SYMBOL + payment.totalPrice.toLocaleString())}
                        </span>
                    </div>
                </div>
            </div>
        </>
        
    );
}

export default PackagePaymentsForm;
