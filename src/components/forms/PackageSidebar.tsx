'use client'

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QueryString from '@/app/api/params_function/QueryString';
import Separator from '../ui/Separator';
import DatePicker from 'react-datepicker';

import "react-datepicker/dist/react-datepicker.css";

const PackageSidebarFilter = ({ params }: any) => {
  const [sliderValue, setSliderValue] = useState([0, 50000]);
  const [categories, setCategories] = useState<string[]>([]);
  const [destinations, setDestinations] = useState<string[]>([]);
  const [capacity, setCapacity] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const router = useRouter()

  const data_category =  [
    { name: '2025 Kiralık Villalar', slug: 'luks-villalar',  id: 216 },
    { name: 'Deniz Manzaralı Villalar', slug: 'luks-villalar', id: 65 },
    { name: 'Jakuzili Villalar', slug: 'luks-villalar', id: 72 },
    { name: 'Lüks Villalar', slug: 'luks-villalar', id: 56 },
  ]
  const data_regions =  [
    { name: 'Kalkan', slug: 'kalkan', id: 72 },
    { name: 'Seydikemer', slug: 'seydikemer', id: 80 },
    { name: 'Patara', slug: 'patara', id: 92 },
  ]
  const data_capacity =  [
    { name: '1+', id: 1 }, { name: '2+', id: 2 }, { name: '3+', id: 3 },
    { name: '4+', id: 4 }, { name: '5+', id: 5 }, { name: '6+', id: 6 },
    { name: '7+', id: 7 }, { name: '8+', id: 8 }, { name: '9+', id: 9 },
    { name: '10+', id: 10 }, { name: '11+', id: 11 }, { name: '12+', id: 12 },
    { name: '13+', id: 13 },
  ]

  useEffect(() => {
    const startDate = params.check_in;
    const endDate = params.check_out;

    if (startDate && endDate) {
      const parsedStartDate = new Date(startDate as string);
      const parsedEndDate = new Date(endDate as string);
      setDateRange([parsedStartDate, parsedEndDate]);
    }
    if (params.categorys) {
      setCategories(params.categorys.split(','));
    }
    if (params.prices) {
      setSliderValue(params.prices.split(',').map(Number));
    }
    if (params.regions) {
      setDestinations(params.regions.split(','));
    }
    if (params.capacity) {
      setCapacity(params.capacity.split(','));
    }
  }, [params]);

  function handleChange(value: any) {
    setSliderValue(value);
  }

  function handleChangeComplete(value: any) {
    const page = 1; 
    delete params.page;  
    params.prices = value.join(',');
    params.page = page; 
    router.push(`/search?${QueryString(params)}`);
  }

  const onChangeCategory = (e: { target: { checked: boolean; value: string; }; }) => {
    const { value, checked } = e.target;
    const page = 1;
    delete params.page;

    let newCategories = [...categories];
    if (checked) {
      newCategories.push(value);
    } else {
      newCategories = newCategories.filter((categorys) => categorys !== value);
    }

    params.categorys = newCategories.join(',');
    params.page = page; 
    setCategories(newCategories);
    router.push(`/search?${QueryString(params)}`);
  }

  const onChangeDestination = (e: { target: { checked: boolean; value: string; }; }) => {
    const { value, checked } = e.target;
    const page = 1;
    delete params.page;

    let newDestinations = [...destinations];
    if (checked) {
      newDestinations = [] // tekli seçim için burayı ekledim
      newDestinations.push(value);
    } else {
      newDestinations = newDestinations.filter((destination) => destination !== value);
    }

    params.regions = newDestinations.join(',');
    params.page = page; 
    setDestinations(newDestinations);
    router.push(`/search?${QueryString(params)}`);
  }

  const onChangeCapacity = (e: { target: { checked: boolean; value: string; }; }) => {
    const { value, checked } = e.target;
    const page = 1;
    delete params.page;

    let newCapacity = [...capacity];
    if (checked) {
      newCapacity = [] // tekli seçim için burayı ekledim
      newCapacity.push(value);
    } else {
      newCapacity = newCapacity.filter((capacity) => capacity !== value);
    }
    params.capacity = newCapacity.join(',');
    params.page = page; 
    setCapacity(newCapacity);
    router.push(`/search?${QueryString(params)}`);
  }
 
  const handleDateChange = (update: [Date | null, Date | null]) => {
    setDateRange(update);
    if (update[0]) {
      const formattedStartDate = update[0].getFullYear() + "-" + (update[0].getMonth() + 1).toString().padStart(2,"0") + "-" + update[0].getDate().toString().padStart(2,"0");
      params.check_in = formattedStartDate;
    } else {
      delete params.check_in
    }
    if (update[1]) {
      const formattedEndDate = update[1].getFullYear() + "-" + (update[1].getMonth() + 1).toString().padStart(2,"0") + "-" + update[1].getDate().toString().padStart(2,"0");
      params.check_out = formattedEndDate;
    } else {
      delete params.check_out
    }
    if((update[0] && update[1]) || (!update[0] && !update[1])){
      router.push(`/search?${QueryString(params)}`);
    }
  };

  return (
    <>
      <div className="pb-[10px] mb-2">
        <h4 className="text-lg font-semibold text-dark-1">Filter by :</h4>
      </div>
      <Separator />
      <aside>
        <h5 className="font-sans lg:text-md text-base pb-2 font-semibold text-dark-1">Date </h5>
        <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
            minDate={new Date()}
            isClearable={true}
            placeholderText="Select Date"
            className="bg-transparent search__daterange border border-primary-1 lg:h-[54px] h-12 px-5 py-2 text-dark-2 focus:border-primary-1 w-full placeholder:text-dark-2 outline-none !font-sans text-start z-999"
        />
      </aside>
      <Separator />
      <aside>
        <h5 className="font-sans lg:text-md text-base pb-2 font-semibold text-dark-1">Categories</h5>
        <ul className="pt-4">
          {data_category.map((item, index) => (
            <li className="pt-3 first:pt-0" key={item.id}>
              <div className="custom-checkbox">
                <input type="checkbox" id={`${index}_category_item`}
                  checked={categories.includes(String(item.id))}
                  value={item.id}
                  onChange={onChangeCategory}
                />
                <label htmlFor={`${index}_category_item`}>{item.name}</label>
              </div>
            </li>
          ))}
        </ul>
      </aside>
      <Separator />
      <aside>
        <h5 className="font-sans lg:text-md text-base pb-2 font-semibold text-dark-1">Destinations</h5>
        <ul className="pt-4">
          {data_regions.map((item, index) => (
            <li className="pt-3 first:pt-0" key={item.id}>
              <div className="custom-checkbox">
                <input type="checkbox" id={`${index}_destinations_item`}
                  checked={destinations.includes(String(item.id))}
                  value={item.id}
                  onChange={onChangeDestination}
                />
                <label htmlFor={`${index}_destinations_item`}>{item.name}</label>
              </div>
            </li>
          ))}
        </ul>
      </aside>
      <Separator />
      <aside>
        <h5 className="font-sans lg:text-md text-base pb-2 font-semibold text-dark-1">Price </h5>
        <Slider
          range
          allowCross={false}
          value={sliderValue}
          min={0}
          max={50000}
          draggableTrack
          onChange={handleChange}
          onChangeComplete={handleChangeComplete}
        />
        <div className="flex text-dark-2 lg:text-base textsm pt-4 items-center">
          Pricing Range :&nbsp; <span className='text-dark-1 font-semibold'>₺{sliderValue[0]} - ₺{sliderValue[1]}</span>
        </div>
      </aside>
      <Separator />
      <aside>
        <h5 className="font-sans lg:text-md text-base pb-2 font-semibold text-dark-1">
          Capacity
        </h5>
        <ul className="pt-4">
          {data_capacity.map((item, index) => (
            <li className="pt-3 first:pt-0" key={item.id}>
              <div className="custom-checkbox">
                <input type="checkbox" id={`${index}_capacity_item`}
                  checked={capacity.includes(String(item.id))}
                  value={item.id}
                  onChange={onChangeCapacity}
                />
                <label htmlFor={`${index}_capacity_item`}>{item.name}</label>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}

export default PackageSidebarFilter;
