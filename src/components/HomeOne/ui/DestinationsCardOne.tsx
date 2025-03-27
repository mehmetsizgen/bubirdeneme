import ImageCheck from "@/app/api/image_function/ImageCheck";
import Link from "next/link";

const DestionationCardOne = async (
    {img, title, villas_count, slug, id} : 
    {
        img: string, 
        title: string, 
        villas_count?: number, 
        slug: string,
        id: number,
    }
) => {
    const check = await ImageCheck(img)
    return (
        <>
            <div className="text-center group " key={id}>
                <Link href={slug} className="shadow-custom-2 px-6 py-6 flex justify-center items-center lg:min-h-[200px] bg-white ">
                    <img src={`${check?img:process.env.DEFAULT_IMG}`} alt="map" className="group-hover:scale-110 duration-200 lg:h-[120px]" />
                </Link>
                <h4 className="lg:text-[22px] text-md font-medium text-dark-1 leading-1.6 lg:mt-7 mt-5">
                    <Link href={slug}>{title}</Link>
                </h4>
                <p className="font-medium lg:text-md text-sm mt-2 text-secondary-1">
                    {villas_count} Villas
                </p>
            </div>
        </>
    );
}

export default DestionationCardOne;