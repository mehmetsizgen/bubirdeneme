'use client'

import { useRef, useState } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const PackageCommentsForm = (
    {villa_id} : 
    {
        villa_id: any, 
    },
    ) => {
    const ref = useRef<HTMLFormElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        villa: villa_id,
        point: '',
        title: '',
        phone: '',
        email: '',
        subject: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/comments_function`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                withReactContent(Swal).fire({
                    title: 'HATA!',
                    text: 'Yorumunuz eklenirken bir hata ile karşılaşıldı.',
                    icon: 'error',
                    confirmButtonColor: '#cccccc',
                    timer: 2000
                });
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const result = await response.json();
            if(result.status == 1){
                 withReactContent(Swal).fire({
                    title: 'TEBRİKLER!',
                    text: 'Yorumunuz başarılı bir şekilde gönderilmiştir.',
                    icon: 'success',
                    confirmButtonColor: '#cccccc',
                    timer: 2000,
                });
                ref.current?.reset();
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
       
    };

    return (
        <form ref={ref} onSubmit={handleSubmit} id="commentsForm" className="lg:pt-10 pt-8">
            <h3 className="lg:text-2xl md:text-xl text-lg text-dark-1 leading-[1.42] font-medium mt-[10px] !mb-base">
                Post A Comment
            </h3>
            <div className="grid grid-cols-2 gap-base">
                <div className="lg:col-span-1 col-span-2">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" className="input_style__primary" />
                </div>
                <div className="lg:col-span-1 col-span-2">
                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Tittle" className="input_style__primary" />
                </div>
                <div className="lg:col-span-1 col-span-2">
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Your Phone Number" className="input_style__primary" />
                </div>
                <div className="lg:col-span-1 col-span-2">
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" className="input_style__primary" />
                </div>
                <div className="col-span-2">
                    <input type="number" name="point" value={formData.point} onChange={handleChange} placeholder="Point" className="input_style__primary" />
                </div>
                <div className="col-span-2">
                    <textarea name="subject" value={formData.subject} onChange={handleChange} cols={30} rows={6} className="input_style__primary" placeholder="Your Subject..." />
                </div>
                <div className="col-span-2">
                    <button aria-label="toggle button" type="submit" className="btn_primary__v1">
                        Find Out More
                        <i className="bi bi-chevron-right" />
                    </button>
                </div>
            </div>
        </form>
    );
}

export default PackageCommentsForm;
