"use client";

import { format, parseISO, eachDayOfInterval } from "date-fns";
import { tr } from "date-fns/locale";
import { useState, useMemo } from "react";
import { Range, DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const PackageDateRange = ({
  prices,
  availability,
  set_month,
  onDateRangeChange, // Yeni prop eklendi
}: {
  prices?: any;
  availability?: any;
  set_month: any;
  onDateRangeChange?: (startDate: Date, endDate: Date) => void; // Yeni prop tip
}) => {
  const [dateRangeValue, setDateRangeValue] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    showDateDisplay: false,
  });

  const handleOnChange = (itemRespon: Range): void => {
    setDateRangeValue(itemRespon);
    if (itemRespon.startDate && itemRespon.endDate && onDateRangeChange) {
      onDateRangeChange(itemRespon.startDate, itemRespon.endDate); // Callback fonksiyonunu çağır
    }
  };

  // Günlük fiyatları içeren bir obje oluşturuyoruz
  const generatePriceMap = () => {
    const priceMap: Record<string, number> = {};
    prices?.json?.forEach(({ price, check_in, check_out }: any) => {
      const days = eachDayOfInterval({
        start: parseISO(check_in),
        end: parseISO(check_out),
      });

      days.forEach((day) => {
        const formattedDate = format(day, "yyyy-MM-dd");
        priceMap[formattedDate] = price;
      });
    });
    return priceMap;
  };

  const priceMap = useMemo(() => generatePriceMap(), [prices]);

  // **Uygunluk Kontrolü için Tarihleri İşle**
  const getDisabledDates = () => {
    let disabledDates = new Set<string>();
    let checkInDates = new Set<string>();
    let checkOutDates = new Set<string>();

    availability?.forEach(({ json }: any) => {
      const start = parseISO(json.check_in);
      const end = parseISO(json.check_out);

      // Check-in ve check-out tarihlerini belirle
      checkInDates.add(format(start, "yyyy-MM-dd"));
      checkOutDates.add(format(end, "yyyy-MM-dd"));

      // Giriş ve çıkış tarihleri arasını tamamen engelle
      const daysBetween = eachDayOfInterval({ start, end });
      daysBetween.forEach((day) => {
        const formattedDate = format(day, "yyyy-MM-dd");
        disabledDates.add(formattedDate);
      });
    });

    return { disabledDates, checkInDates, checkOutDates };
  };

  const { disabledDates, checkInDates, checkOutDates } = useMemo(
    () => getDisabledDates(),
    [availability]
  );

  // 🎯 **Disabled Day Function (Tarih Engelleme)**
  const isDayDisabled = (day: Date) => {
    const formattedDay = format(day, "yyyy-MM-dd");

    // Eğer tarih engellenmişse ve giriş/çıkış günü değilse
    if (disabledDates.has(formattedDay) && !checkInDates.has(formattedDay) && !checkOutDates.has(formattedDay)) {
      return true;
    }

    // Eğer tarih check-in veya check-out günü ise, seçilebilir
    if (checkInDates.has(formattedDay) || checkOutDates.has(formattedDay)) {
      return false;
    }

    return false; // Diğer günler seçilebilir
  };

  function customDayContent(day: any) {
    const formattedDate = format(day, "yyyy-MM-dd");
    const price = priceMap[formattedDate];

    const isCheckIn = checkInDates.has(formattedDate);
    const isCheckOut = checkOutDates.has(formattedDate);
    const isDisabled = disabledDates.has(formattedDate) && !isCheckIn && !isCheckOut;

    return (
      <div
        className={`absolute flex flex-col justify-center text-white inset-0 leading-3 
          ${isDisabled ? "bg-red-300 text-white jut-reserved" : ""}
          ${isCheckIn ? "bg-yellow-300 border-l-4 border-red-300 jut-check-in" : ""}
          ${isCheckOut ? "bg-yellow-300 border-r-4 border-red-300 jut-check-out" : ""}
        `}
      >
        <span className="relative">{format(day, "d")}</span>
        {price && (
          <span className="inline-block w-full text-[10px] ms:text-xs text-red-600">
            ₺{price.toLocaleString()}
          </span>
        )}
      </div>
    );
  }

  let months = window.innerWidth <= 600 ? 1 : 2;
  const direction = window.innerWidth <= 600 ? "vertical" : "horizontal";

  return (
    <>
      <DateRange
        className="w-full get-availability"
        editableDateInputs={true}
        onChange={(item: RangeKeyDict): void => handleOnChange(item.selection)}
        moveRangeOnFirstSelection={false}
        ranges={[{ ...dateRangeValue, key: "selection" }]}
        months={set_month} // Gösterilecek ay sayısı
        showDateDisplay={false} // Üstteki tarih göstergesini kaldır
        showMonthAndYearPickers={false} // Ay ve yıl seçici dropdownları kapat
        showPreview={true} // Seçili aralığın efektini göster
        showMonthArrow={true} // Ay değiştirme oklarını göster
        fixedHeight={true}
        minDate={new Date()}
        direction={direction}
        locale={tr}
        dayContentRenderer={customDayContent}
        disabledDay={isDayDisabled} 
      />
    </>
  );
};

export default PackageDateRange;
