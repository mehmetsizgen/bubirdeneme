import prisma from "@/libs/db"
import { equal } from "assert";

async function main() {

  
// uzun dönem kiralama seçenekleri eklenecek.
// uzun dönem haftalık kiralama ve aylık kiralama oranı eklenecek.
// villa ödemeye açık mı yoksa kapalı mı olacak.
// ödemeye direkt açık olan villalarda tarih aralığında boşluk olmadan rezervasyon yapabilecek.
// villa ödeme seçenekleri eklenecek.
// site fiyat tipi eklenecek.
// temizlik ücreti fiyata ne zaman eklenecek?
// villa deniz uzaklığı eklenecek ve uzaklıklar filtreye eklenecek.
// eğer villanın sahibi acente ise, acentenin belirlediği fiyattan mı komisyon alınacak, yoksa üzerine konularak mı komisyon alınacak?
// acente komisyon eklenecek.
// bölgeye, kategoriye ve villaya göre indirim belirlenecek. kategoriye indirim yapamadık.
// indirim sıralamasında villa öncelik olacak.
// indirimde bölgeden üst bölgeyi seçip, indirim uygulanacak alt bölgeler seçilecek.
// kategori indiriminde en yüksek oran baz alınacak.
// indirimlerin hepsi detaylı olarak villa detay sayfasında gösterilecek.
// ekstra ücrete kapıda alınsın ön ödemede alınsın fiyata daihl edilsin edilmesi seçenekleri eklenecek, temizlik ücreti gibi
// post ve get işlemlerine api key eklenecek.
// indirim sistemi villa arama ve kategoriler, bölgelere de eklenecek.
// iç satış ve dış satış olarak ayrılacak. Böylece dış satışlarda gider düşülecek.
// mail şablonları özel olarak hazırlanabilecek.
// kısayol kelime seçenekleri eklenecek. Örn : <villa_title>, <villa_desc>
// ilan numarasına göre arama sistemi eklenecek.
// villa ilan numarası araması için slug eklenecek ve admin paneline seçenek eklenecek. Eğer admin paneline giriş yapıldıysa villa ismi gözükecek.
// özelliğe göre filtreleme eklenecek.
// villa kurallarına göre filtreleme eklenecek.
// villaya giriş ve çıkış saati gün bazında özel olarak belirlenecek.
// fiyat sistemi tam çalışmıyor, fiyat hesaplama tam çalışacak şekilde ayarlanacak.
// villa görüntüleme sayısı eklenecek.
// ödemenin tamamını yapacaksa ona göre indirim ayarlanabilecek.
// takvime renklendirme yapılacak, müsait, indirim vs.
// rezervasyon formuna kişi sayısına göre isim & soyisim eklenecek ve adminden seçenekli olacak.
// bölgelerin listelenmesi alt bölge ve üst bölge olayına göre ayarlanacak.
// son gezilen villalar seçeneği eklenecek.
// admin panelinden indirim seçeneği, ev sahibinden, şirketten ve ortak olarak 3e ayrılacak.
// rezervasyon ödeme formu ve villa ekranına giriş çıkış saati eklenecek, veritabanına da.
// villa yorum ortalaması yıldızı rezervasyon ve ödeme sayfasına çekilecek.





  // const prices = await prisma.prices.findMany({
  //   where: {
  //     json: {
  //       path: '$.json',
  //       array_contains: {
  //         price: 16950
  //       }
  //     },
  //   },
  // })
  // console.log(prices)


  // const prices = await prisma.prices.findMany({
  //   where: {
  //     json: { path: '$.json[*].price', gte: 5000 },
  //   },
  // })
  // console.log(prices)


  // const prices = await prisma.prices.findMany();
  
  // const filteredPrices = prices.filter(priceRecord => {
  //   if (priceRecord.json && priceRecord.json.json) {
  //     // JSON dizisini parse edip işliyoruz
  //     const priceArray = priceRecord.json.json;
  //     return priceArray.some(price => price.price >= 30000);
  //   }
  //   return false;
  // });
  
  // console.log(filteredPrices[0].json);


  // const prices = await prisma.prices.findMany({
  //   where: {
  //     AND: [
  //       {
  //         json: {
  //           not: null,
  //         },
  //       },
  //       {
  //         json: {
  //           path: '$.price', // JSON içindeki "price" değerini hedefle
  //           gte: 8000, // 8000 ve üzerindeki fiyatları getir
  //         },
  //       },
  //     ],
  //   },
  // });
  


//   const prices = await prisma.$queryRaw`
//   SELECT * FROM prices 
//   WHERE JSON_OVERLAPS(
//     JSON_EXTRACT(json, '$.json'),
//     JSON_ARRAY(
//       JSON_OBJECT('price', 8000)
//     )
//   );
// `;



// const prices = await prisma.prices.findMany({
//   where: {
//     json: {
//       path: '$.json[*].price', // Dizideki her elemanın price değerine ulaş
//       gte: 8000, // 8000 ve üzeri fiyatları filtrele
//     },
//   },
// });


// console.log(prices)



// const allPrices = await prisma.prices.findMany();
// console.log(JSON.stringify(allPrices, null, 2));



// const prices = await prisma.$queryRaw`
//   SELECT id, JSON_UNQUOTE(JSON_EXTRACT(json, '$.json[*].price')) AS price
//   FROM prices;
// `;

// console.log(prices);



// const prices = await prisma.$queryRaw`
//   SELECT id, JSON_UNQUOTE(JSON_EXTRACT(json, '$.json[*].price')) AS price
//   FROM prices;
// `;

// // Fiyatları filtreleyelim
// const filteredPrices = prices.filter((priceRecord) => {
//   if (priceRecord.price && priceRecord.price !== 'null') {
//     // Fiyatları bir diziye dönüştürüp filtreleyelim
//     const priceArray = JSON.parse(priceRecord.price);
//     return priceArray.some(price => Number(price) >= 8000); // 8000'den büyük fiyat var mı?
//   }
//   return false;
// });

// console.log(filteredPrices);





  const response = await fetch(
    `https://www.villaburada.com/get_veri.php?db=yorum`,
      {
        //   cache: 'force-cache',
          method: 'GET',
          headers : {
            "Content-Type": "application/json"
          },
      }
  )
  const son = await response.json()
  son?.map(async (element:any, index:number) =>{
    function formatDate(dateStr: string): string {
        const [day, month, year] = dateStr.split('-');
        return `${year}-${month}-${day}`; // YYYY-MM-DD formatına dönüştür
    }
    // console.log(element)


    // console.log(element)


    // const id = element.id
    // const status = element.emlak_status
    // const company_slug = element.firma_slug
    // const add_date = new Date();
    // const image_sliders:any = []
    // let sliders:any = []
    // let categorys:any = []
    // let category:any = element.emlak_category.split(',')
    // category?.map((cat:any) => {
    //   categorys.push(
    //     Number(cat)
    //   )
    // })
    // if(element.emlak_gorsel){
    //   sliders = element.emlak_gorsel.split(',')
    // }
    // sliders?.map((slider:any) => {
    //   image_sliders.push(
    //     {
    //       src: slider,
    //       width: 500,
    //       height: 500,
    //     }
    //   )
    // })
    // const json_villas = { 
    //   seo: {
    //     title : element.emlak_title,
    //     descriptions : element.emlak_desc,
    //     keywords : element.emlak_kyw,
    //     slug : element.emlak_url,
    //   },
    //   detail : {
    //     image : {
    //       poster : {
    //         "src" : element.emlak_one_cikan_gorsel?element.emlak_one_cikan_gorsel:'',
    //         "width" : process.env.IMAGES_WIDTH,
    //         "height" : process.env.IMAGES_HEIGHT
    //       },
    //       slider: image_sliders,
    //     },
    //     name: element.emlak_baslik,
    //     contents : element.emlak_icerik,
    //     commission_status : Number(element.emlak_komisyon_status),
    //     commission : Number(element.emlak_komisyon),
    //     check_in_time: "16:00",
    //     check_out_time: "10:00",
    //     position: [element.emlak_konum?element.emlak_konum:null],
    //     min_stay : Number(element.emlak_min_gece),
    //     document_number: element.emlak_basvuru_no,
    //     video: element.emlak_video_url?element.emlak_video_url:'',
    //     square: element.emlak_metre_kare?element.emlak_metre_kare:0,
    //     capacity: element.emlak_kapasite?Number(element.emlak_kapasite):0,
    //     bedroom : {
    //       detail : [
    //         {
    //           image: {
    //             poster: {
    //               "src" : '',
    //               "width" : process.env.IMAGES_WIDTH,
    //               "height" : process.env.IMAGES_HEIGHT
    //             },
    //           },
    //           name: 'Deneme Yatak Odası',
    //           count: 1,
    //           video : ''
    //         }
    //       ],
    //       pagination: {
    //         total : element.emlak_yatak_odasi?element.emlak_yatak_odasi:0
    //       }
    //     },
    //     bathroom : {
    //       detail : [
    //         {
    //           image: {
    //             poster: {
    //               "src" : '',
    //               "width" : process.env.IMAGES_WIDTH,
    //               "height" : process.env.IMAGES_HEIGHT
    //             },
    //           },
    //           name: 'Deneme Banyo Odası',
    //           count: 1,
    //           video : ''
    //         }
    //       ],
    //       pagination: {
    //         total : element.emlak_banyo?element.emlak_banyo:0
    //       }
    //     },
    //     poolroom : {
    //       detail : [
    //         {
    //           image: {
    //             poster: {
    //               "src" : '',
    //               "width" : process.env.IMAGES_WIDTH,
    //               "height" : process.env.IMAGES_HEIGHT
    //             },
    //           },
    //           name: element.emlak_havuz_yazisi?element.emlak_havuz_yazisi:'',
    //           count: 1,
    //           video : '',
    //           width: element.emlak_havuz_boy?element.emlak_havuz_boy:0,
    //           height: element.emlak_havuz_en?element.emlak_havuz_en:0,
    //           size: element.emlak_havuz_derinlik?element.emlak_havuz_derinlik:0,
    //         }
    //       ],
    //       pagination: {
    //         total : 0
    //       }
    //     },
    //   },
    //   extra : {
    //     ical_url : element.emlak_ical_url,
    //     note: element.emlak_not,
    //     warranty_villa: 1,
    //     payment_status: 0,
    //     quick_booking: 0,
    //     total_payment_discount: 0,
    //   },
    //   discount : {
    //     discount_status : element.emlak_firsat?Number(element.emlak_firsat):0,
    //     discount: 0,
    //     discount_message: '',
    //     discount_start: '',
    //     discount_end: '',
    //     icon : '',
    //     image: {
    //       poster: {
    //         "src" : '',
    //         "width" : process.env.IMAGES_WIDTH,
    //         "height" : process.env.IMAGES_HEIGHT
    //       },
    //     },
    //   },
    //   loop_text: {
    //     base: element.emlak_one_cikan_yazi?element.emlak_one_cikan_yazi:'',
    //     view: element.emlak_manzara_yazisi?element.emlak_manzara_yazisi:'',
    //     left: element.emlak_sol_ust_yazi?element.emlak_sol_ust_yazi:'',
    //     right: element.emlak_resim_ustu_yazi?element.emlak_resim_ustu_yazi:'',
    //   },
    //   price_excludes: {
    //     list: [
    //       "Havalimanı transferleri",
    //       "Günlük kiralık araç",
    //       "Yat kiralama",
    //       "Ekstra temizlik hizmetleri",
    //       "Market alışverişi",
    //       "Kişi başı 150 TL değerinde teminat"
    //     ],
    //     title: "Fiyata Dahil Olmayanlar"
    //   },
    //   price_includes: {
    //     list: [
    //       "Havalimanı transferleri",
    //       "Günlük kiralık araç",
    //       "Yat kiralama",
    //       "Ekstra temizlik hizmetleri",
    //       "Market alışverişi",
    //       "Kişi başı 150 TL değerinde teminat"
    //     ],
    //     title: "Fiyata Dahil Olanlar"
    //   },
    //   rules: {
    //     list: [
    //       "Havalimanı transferleri",
    //       "Günlük kiralık araç",
    //       "Yat kiralama",
    //       "Ekstra temizlik hizmetleri",
    //       "Market alışverişi",
    //       "Kişi başı 150 TL değerinde teminat"
    //     ],
    //     title: "Kurallar"
    //   },
    // }
    // const data_villas:Villas = await prisma.villas.create({
    //   data: {
    //     id: id,
    //     json: json_villas,
    //     add_date: String(add_date),
    //     member: [],
    //     owner: [
    //       Number(element.emlak_sahibi) ?? Number(element.emlak_sahibi)
    //     ],
    //     regions: [
    //       Number(element.emlak_bolge) ?? Number(element.emlak_bolge)
    //     ],
    //     regions_up: [
    //       Number(element.emlak_ebeveyn_bolge) ?? Number(element.emlak_ebeveyn_bolge)
    //     ],
    //     categorys: categorys,
    //     distances: [],
    //     prices: [],
    //     features: [],
    //     comments: [],
    //     availability: [],
    //     reservation: [],
    //     agency: [],
    //     order: element.emlak_sira,
    //     company_slug : company_slug,
    //     status: status,
    //     show_status: 0,
    //     add_member: element.emlak_add_uye_id?Number(element.emlak_add_uye_id):0,
    //   },
    // })




    // const id = element.id
    // const status = element.status
    // const menu_status = element.menu_status
    // const company_slug = element.firma_slug
    // const member = (element.uye_id != 0) ? element.uye_id : null
    // const add_date = new Date();
    // const json_regions = { 
    //   seo: {
    //     title : element.seo_name,
    //     descriptions : element.seo_desc,
    //     keywords : element.seo_kyw,
    //     slug : element.url,
    //   },
    //   detail: {
    //     name: element.name,
    //     contents : element.icerik,
    //     icon :  element.icon,
    //     image : {
    //       poster: {
    //         "src" : element.image,
    //         "width" : process.env.IMAGES_WIDTH,
    //         "height" : process.env.IMAGES_HEIGHT
    //       },
    //     },
    //     city_code : element.il_code,
    //     town_code : element.ilce_code,
    //   },
    //   regions_up: [
    //     element.ebeveyn,
    //   ],
    //   discount : {
    //     discount_status : 0,
    //     discount: 0,
    //     discount_message: '',
    //     discount_start: '',
    //     discount_end: '',
    //     icon: '',
    //     image : {
    //       poster: {
    //         "src" : element.image,
    //         "width" : process.env.IMAGES_WIDTH,
    //         "height" : process.env.IMAGES_HEIGHT
    //       },
    //     },
    //   },
    // }
    // const data_regions:Regions = await prisma.regions.create({
    //   data: {
    //     id: id,
    //     json: json_regions,
    //     add_date: String(add_date),
    //     add_member: 0,
    //     member: [
    //       Number(member)
    //     ],
    //     company_slug : company_slug,
    //     status: status,
    //     show_status: menu_status,
    //     order: element.sira
    //   },
    // })



    // const id = element.id
    // const status = element.status
    // const menu_status = element.menu_status
    // const company_slug = element.firma_slug
    // const add_date = new Date();
    // const json_categorys = { 
    //   seo: {
    //     title : element.seo_name,
    //     descriptions : element.seo_desc,
    //     keywords : element.seo_kyw,
    //     slug : element.url,
    //   },
    //   detail: {
    //     name: element.name,
    //     contents : element.icerik,
    //     icon :  element.icon,
    //     image : {
    //       poster: {
    //           "src" : element.image,
    //           "width" : process.env.IMAGES_WIDTH,
    //           "height" : process.env.IMAGES_HEIGHT
    //       },
    //     },
    //   },
    //   discount : {
    //     discount_status : 0,
    //     discount: 0,
    //     discount_message: '',
    //     discount_start: '',
    //     discount_end: '',
    //     icon: '',
    //     image : {
    //       poster: {
    //           "src" : element.image,
    //           "width" : process.env.IMAGES_WIDTH,
    //           "height" : process.env.IMAGES_HEIGHT
    //       },
    //     },
    //   },
    // }
    // const data_categorys:Categorys = await prisma.categorys.create({
    //   data: {
    //     id: id,
    //     json: json_categorys,
    //     add_date: String(add_date),
    //     add_member: 0,
    //     member: [],
    //     company_slug : company_slug,
    //     status: status,
    //     show_status: menu_status,
    //     order: element.sira
    //   },
    // })



    // const id = element.id
    // const status = element.status
    // const company_slug = element.firma_slug
    // const add_date = new Date();
    // const json_features = { 
    //     seo: {
    //       title : element.seo_name,
    //       descriptions : element.seo_desc,
    //       keywords : element.seo_kyw,
    //       slug : element.name_slug,
    //     },
    //     detail: {
    //       name: element.name,
    //       icon :  element.icon,
    //       image : {
    //         poster: {
    //           "src" : '',
    //           "width" : process.env.IMAGES_WIDTH,
    //           "height" : process.env.IMAGES_HEIGHT
    //         },
    //       },
    //     },
    //     discount : {
    //       discount_status : 0,
    //       discount: 0,
    //       discount_message: '',
    //       discount_start: '',
    //       discount_end: '',
    //       icon :  element.icon,
    //       image : {
    //         poster: {
    //           "src" : element.image,
    //           "width" : process.env.IMAGES_WIDTH,
    //           "height" : process.env.IMAGES_HEIGHT
    //         },
    //       },
    //     },
    // }
    // const data_features:Features = await prisma.features.create({
    //   data: {
    //     id: id,
    //     json: json_features,
    //     add_date: String(add_date),
    //     member: [],
    //     add_member: 0,
    //     company_slug : company_slug,
    //     status: status,
    //   },
    // })





    // const id = element.id
    // const status = 1
    // const company_slug = element.firma_slug
    // const add_date = new Date();
    // const json:any = []
    // JSON.parse(element.fiyat_all)?.map((price:any) => {
    //     json.push(
    //       {
    //         check_in:price.giris?formatDate(price.giris):'',
    //         check_out:price.cikis?formatDate(price.cikis):'',

    //         pricing_type:1,
    //         price:price.tutar?price.tutar:0,

    //         min_stay:Number(price.minimumgun?price.minimumgun:0),
    //         min_stay_price:5000,
    //         min_stay_in: 0,

    //         damage_deposit: 3000,

    //         discount_status: 0,
    //         discount: 0,
    //         discount_message: '',

    //         price_currency: Number(element.fiyat_doviz?element.fiyat_doviz:0),
    //         min_stay_price_currency: Number(element.fiyat_doviz?element.fiyat_doviz:0),
    //         damage_deposit_currency: Number(element.fiyat_doviz?element.fiyat_doviz:0),
  
    //         contents : element.fiyat_aciklama?element.fiyat_aciklama:'',
    //       },
    //     )
    // })
    // const data_prices:Prices = await prisma.prices.create({
    //   data: {
    //     id: id,
    //     json: json?json:[],
    //     add_date: String(add_date),
    //     add_member: 0,
    //     company_slug : company_slug,
    //     status: status,
    //   },
    // })



    // const id = element.id
    // const status = 1
    // const company_slug = element.firma_slug
    // const add_date = new Date();
    // const json_distances = [ 
    //   {
    //     name : 'Cafe',
    //     parent_name : '',
    //     distance : element.uzaklik_restorant,
    //     distance_type: 0,
    //     image: {
    //       poster: {
    //           "src" : '',
    //           "width" : process.env.IMAGES_WIDTH,
    //           "height" : process.env.IMAGES_HEIGHT
    //       },
    //     },
    //     icon: '',
    //   },
    //   {
    //     name : 'Market',
    //     parent_name : '',
    //     distance : element.uzaklik_market,
    //     distance_type: 0,
    //     image: {
    //       poster: {
    //           "src" : '',
    //           "width" : process.env.IMAGES_WIDTH,
    //           "height" : process.env.IMAGES_HEIGHT
    //       },
    //     },
    //     icon: '',
    //   },
    //   {
    //     name : 'Beach',
    //     parent_name : '',
    //     distance : element.uzaklik_plaj,
    //     distance_type: 0,
    //     image: {
    //       poster: {
    //           "src" : '',
    //           "width" : process.env.IMAGES_WIDTH,
    //           "height" : process.env.IMAGES_HEIGHT
    //       },
    //     },
    //     icon: '',
    //   },
    //   {
    //     name : 'Center',
    //     parent_name : '',
    //     distance : element.uzaklik_merkez,
    //     distance_type: 0,
    //     image: {
    //       poster: {
    //           "src" : '',
    //           "width" : process.env.IMAGES_WIDTH,
    //           "height" : process.env.IMAGES_HEIGHT
    //       },
    //     },
    //     icon: '',
    //   },
    //   {
    //     name : 'Airport',
    //     parent_name : 'Antalya',
    //     distance : element.uzaklik_antalya_havalimani,
    //     distance_type: 0,
    //     image: {
    //       poster: {
    //           "src" : '',
    //           "width" : process.env.IMAGES_WIDTH,
    //           "height" : process.env.IMAGES_HEIGHT
    //       },
    //     },
    //     icon: '',
    //   },
    //   {
    //     name : 'Airport',
    //     parent_name : 'Dalaman',
    //     distance : element.uzaklik_dalaman_havalimani,
    //     distance_type: 0,
    //     image: {
    //       poster: {
    //           "src" : '',
    //           "width" : process.env.IMAGES_WIDTH,
    //           "height" : process.env.IMAGES_HEIGHT
    //       },
    //     },
    //     icon: '',
    //   },
    //   {
    //     name : 'Airport',
    //     parent_name : 'Dalaman',
    //     distance : element.uzaklik_istanbul_havalimani,
    //     distance_type: 0,
    //     image: {
    //       poster: {
    //           "src" : '',
    //           "width" : process.env.IMAGES_WIDTH,
    //           "height" : process.env.IMAGES_HEIGHT
    //       },
    //     },
    //     icon: '',
    //   },
    //   {
    //     name : 'Hospital',
    //     parent_name : '',
    //     distance : element.uzaklik_hastane,
    //     distance_type: 0,
    //     image: {
    //       poster: {
    //           "src" : '',
    //           "width" : process.env.IMAGES_WIDTH,
    //           "height" : process.env.IMAGES_HEIGHT
    //       },
    //     },
    //     icon: '',
    //   },
    //   {
    //     name : 'Bu Station',
    //     parent_name : '',
    //     distance : element.uzaklik_otobus_duragi,
    //     distance_type: 0,
    //     image: {
    //       poster: {
    //           "src" : '',
    //           "width" : process.env.IMAGES_WIDTH,
    //           "height" : process.env.IMAGES_HEIGHT
    //       },
    //     },
    //     icon: '',
    //   },
    //   {
    //     name : 'Sea',
    //     parent_name : '',
    //     distance : 0,
    //     distance_type: 0,
    //     image: {
    //       poster: {
    //           "src" : '',
    //           "width" : process.env.IMAGES_WIDTH,
    //           "height" : process.env.IMAGES_HEIGHT
    //       },
    //     },
    //     icon: '',
    //   },
    // ]
    // const data_distances:Distances = await prisma.distances.create({
    //   data: {
    //     id: id,
    //     json: json_distances,
    //     add_date: String(add_date),
    //     add_member: 0,
    //     company_slug : company_slug,
    //     status: status,
    //   },
    // })



    // const id = element.id
    // const status = 1
    // const company_slug = element.firma_slug
    // const add_date = new Date(element.date);
    // let check_in = ''
    // let check_out = ''
    // if(element.yorum != 'Rezervasyon'){
    //   check_in = formatDate(JSON.parse(element.data).giris)
    //   check_out = formatDate(JSON.parse(element.data).cikis)
    // } else {
    //   check_in = JSON.parse(element.data).giris
    //   check_out = JSON.parse(element.data).cikis
    // }
    // const json_availabilitys = { 
    //   check_in: check_in,
    //   check_out: check_out,
    //   villa:Number(element.emlak_id),
    //   comment: element.yorum,
    //   reservation: Number(element.rezervasyon_id),
    //   ical: element.ical_url,
    //   availabilitys_status: element.status,
    // }
    // const data_availabilitys:Availabilitys = await prisma.availabilitys.create({
    //   data: {
    //     id: id,
    //     json: json_availabilitys,
    //     add_date: String(add_date),
    //     member: [],
    //     add_member: 0,
    //     order: 0,
    //     company_slug : company_slug,
    //     status: status,
    //   },
    // })




    // const id = element.id
    // const status = element.status
    // const company_slug = element.firma_slug
    // const add_date = new Date();
    // const json_blogs = { 
    //   seo: {
    //     title : element.seo_name,
    //     descriptions : element.seo_desc,
    //     keywords : element.seo_kyw,
    //     slug : element.url,
    //   },
    //   detail: {
    //     name: element.name ,
    //     contents : element.icerik,
    //     image: {
    //       poster: {
    //           "src" : element.blog_gorsel,
    //           "width" : process.env.IMAGES_WIDTH,
    //           "height" : process.env.IMAGES_HEIGHT
    //       },
    //     },
    //   },
    // }
    // const data_blogs:Blogs = await prisma.blogs.create({
    //   data: {
    //     id: id,
    //     json: json_blogs,
    //     add_date: String(add_date),
    //     member: [],
    //     add_member: 0,
    //     order: element.sira,
    //     company_slug : company_slug,
    //     status: status,
    //   },
    // })




    // const id = element.id
    // const status = element.status
    // const company_slug = element.firma_slug
    // const add_date = new Date();
    // const json_comments = { 
    //     title: element.baslik ,
    //     subject : element.yorum,
    //     phone : element.telefon_no,
    //     name : element.sahibi,
    //     email : element.email,
    //     point : element.puan,
    //     reply : element.cevap,
    //     check_date : '2025-01-12',
    //     villa : element.emlak,
    // }
    // const data_blogs:Comments = await prisma.comments.create({
    //   data: {
    //     id: id,
    //     json: json_comments,
    //     add_date: String(add_date),
    //     member: [],
    //     add_member: 0,
    //     order: 0,
    //     company_slug : company_slug,
    //     status: status,
    //     show_status: status,
    //   },
    // })

   



    // const villas_id = element.emlak_id
    // let features:any = []
    // let feature:any = element.ozellik_id?.split(',')
    // feature?.map((fea:any) => {
    //   features.push(
    //     Number(fea)
    //   )
    // })
    // const update_villas:Villas = await prisma.villas.update({
    //   where: {
    //     id: villas_id,
    //   },
    //   data: {
    //     features: features,
    //   },
    // })



    // const id = element.id
    // const villas_id = element.emlak_id
    // const update_villas:Villas = await prisma.villas.update({
    //   where: {
    //     id: villas_id,
    //   },
    //   data: {
    //     prices: [id],
    //   },
    // })



    // const id = element.id
    // const villas_id = element.emlak_id
    // console.log(villas_id)
    // const update_villas:Villas = await prisma.villas.update({
    //   where: {
    //     id: villas_id,
    //   },
    //   data: {
    //     distances: [id],
    //   },
    // })




  })



























  // findUnique yalnız tek arama yapıyor
  // findMany çoklu olarak arama yapıyor, select sadece neyi istiyorsan o veriyi getiriyor, omit gelmesini istemediğin veriyi siliyor, orderby sıralama yapıyor, take ve skip sayfalama yapmaya olanak sağlıyor
  // findFirst yalnız tek arama yapıyor
  // find tek veri veriyor


  // const data_veri:any[] = (
  //   data.find(
  //     (veri:any) => (veri.add_member === 2)
  //   )
  // )
}

export default main