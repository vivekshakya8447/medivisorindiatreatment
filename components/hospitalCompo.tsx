'use client';

import { ChevronLeft, ChevronRight, MapPin, Star, Building2, Users } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import Slider from 'react-slick';
import ContactModal from '@/components/ContactModal'; // Assuming the path is correct
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Hospital interface
interface Hospital {
  id: string;
  name: string;
  logo: string;
  image: string;
  location: string;
  phone: string;
  website: string;
  rating: number;
  reviews: number;
  beds: number;
  established: number;
  specialties: string[];
  description: string;
  achievements: string[];
  category: 'multi-specialty' | 'cardiac' | 'cancer' | 'orthopedic' | 'pediatric';
}

// Hospital data
const HOSPITALS: Hospital[] = [
  {
    id: 'apollo',
    name: 'Apollo Hospitals',
    logo: '/hospital-logo/apollo.svg',
    image: '/hospital-logo/apollo-hospital.webp',
    location: 'Multiple Locations across India',
    phone: '+91-1860-500-1066',
    website: 'apollohospitals.com',
    rating: 4.8,
    reviews: 15420,
    beds: 10000,
    established: 1983,
    specialties: ['Cardiology', 'Oncology', 'Neurology', 'Orthopedics', 'Transplants'],
    description:
      "Apollo Hospitals is one of India's leading healthcare providers with over 70 hospitals across 13 countries. Known for pioneering medical treatments and advanced healthcare technology.",
    achievements: ['First hospital in India to perform heart transplant', 'JCI Accredited', 'NABH Certified'],
    category: 'multi-specialty',
  },
  {
    id: 'fortis',
    name: 'Fortis Healthcare',
    logo: '/hospital-logo/fortis.png',
    image: '/hospital-logo/Fortis.jpg',
    location: 'Pan India Network',
    phone: '+91-92-1234-5678',
    website: 'fortishealthcare.com',
    rating: 4.7,
    reviews: 12350,
    beds: 4500,
    established: 2001,
    specialties: ['Cardiac Sciences', 'Neurosciences', 'Oncology', 'Renal Sciences', 'Orthopedics'],
    description:
      'Fortis Healthcare is a leading integrated healthcare delivery service provider in India with 36 healthcare facilities across the country.',
    achievements: ['NABH Accredited', 'Green OT Certified', 'ISO 9001:2015 Certified'],
    category: 'multi-specialty',
  },
  {
    id: 'max',
    name: 'Max Healthcare',
    logo: '/hospital-logo/max-hospital.svg',
    image: '/hospital-logo/max-super-specialit.webp',
    location: 'North & West India',
    phone: '+91-92-6666-6666',
    website: 'maxhealthcare.in',
    rating: 4.6,
    reviews: 9870,
    beds: 3500,
    established: 2000,
    specialties: ['Oncology', 'Neurosciences', 'Cardiac Sciences', 'Orthopedics', 'Gastroenterology'],
    description:
      "Max Healthcare is one of India's leading private healthcare providers operating 17 healthcare facilities across the Delhi NCR, Punjab, Uttarakhand and Maharashtra.",
    achievements: ['JCI Accredited', 'NABL Certified Labs', 'NABH Accredited'],
    category: 'multi-specialty',
  },
  {
    id: 'medanta',
    name: 'Medanta - The Medicity',
    logo: '/hospital-logo/medanta.svg',
    image: '/hospital-logo/medanta.jpg',
    location: 'Gurugram, Delhi NCR',
    phone: '+91-124-414-1414',
    website: 'medanta.org',
    rating: 4.9,
    reviews: 8920,
    beds: 1600,
    established: 2009,
    specialties: ['Cardiac Sciences', 'Neurosciences', 'Oncology', 'Digestive & Hepatobiliary Sciences', 'Orthopedics'],
    description:
      "Medanta is a multi-super specialty hospital with 1600 beds and 45 operation theatres. It is one of India's largest and most advanced medical institutes.",
    achievements: ['JCI Accredited', 'NABH Certified', 'NABL Accredited Labs'],
    category: 'multi-specialty',
  },
  {
    id: 'manipal',
    name: 'Manipal Hospitals',
    logo: '/hospital-logo/manipal-hospitals.webp',
    image: '/hospital-logo/manipal.jpeg',
    location: 'Pan India Network',
    phone: '+91-80-2502-4444',
    website: 'manipalhospitals.com',
    rating: 4.5,
    reviews: 11200,
    beds: 6000,
    established: 1953,
    specialties: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Gastroenterology'],
    description:
      'Manipal Hospitals is a leading healthcare provider in India with 28 hospitals across 15 cities, known for clinical excellence and patient care.',
    achievements: ['NABH Accredited', 'JCI Accredited Units', 'NABL Certified'],
    category: 'multi-specialty',
  },
  {
    id: 'artemis',
    name: 'Artemis Hospital',
    logo: '/hospital-logo/artemis-logo1.png',
    image: '/hospital-logo/artemis.jpeg',
    location: 'Gurugram, Delhi NCR',
    phone: '+91-124-451-1111',
    website: 'artemishospitals.com',
    rating: 4.7,
    reviews: 6540,
    beds: 600,
    established: 2007,
    specialties: ['Cardiac Sciences', 'Neurosciences', 'Oncology', 'Orthopedics', 'Gastroenterology'],
    description:
      'Artemis Hospital is a 600+ bed, state-of-the-art multi-specialty hospital located in Gurugram, Delhi NCR.',
    achievements: ['JCI Accredited', 'NABH Certified', 'NABL Accredited'],
    category: 'multi-specialty',
  },
];

// Utility function to truncate text
const truncateText = (text: string, maxLength = 120): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Hospital Card Component
const HospitalCard = ({ hospital, onOpenModal }: { hospital: Hospital; onOpenModal: () => void }) => (
  <div className="flex-1">
    <Card className="overflow-hidden hover:shadow-lg shadow-none transition-all duration-300 group border border-gray-100 h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={hospital.image || '/placeholder.svg?height=200&width=400'}
          alt={hospital.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/95 text-gray-900 shadow-sm backdrop-blur-sm">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
            {hospital.rating}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-1">
        <div className="flex items-end space-x-3 mb-2">
          <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center">
            <Image
              src={hospital.logo || '/placeholder.svg?height=32&width=32'}
              alt={hospital.name}
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-medium text-gray-600 ">{hospital.name}</CardTitle>
        </div>
        <CardDescription className="flex items-center my-2 text-lg font-medium text-gray-600 mb-0">
          <MapPin className="h-5 w-5 mr-1 text-[#E22026] flex-shrink-0" />
          <span className="truncate">{hospital.location}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 flex flex-col flex-grow">
        <p className="text-gray-600 text-base mb-2 text-left leading-relaxed flex-grow">{truncateText(hospital.description)}</p>

        <Button
          onClick={onOpenModal}
          variant="ghost"
          className="text-lg text-left px-0 justify-start text-gray-700 cursor-pointer "
        >
          Enquire Now
        </Button>
      </CardContent>
    </Card>
  </div>
);

// Custom Arrow Components
const CustomPrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <Button
    variant="outline"
    size="icon"
    onClick={onClick}
    className="bg-[#d82128] text-white md:p-2 rounded-full relative md:top-4 hover:bg-[#b5181e] transition"
  >
    <ChevronLeft className="md:h-5 h-4 md:w-5 h-4" />
  </Button>
);

const CustomNextArrow = ({ onClick }: { onClick?: () => void }) => (
  <Button
    variant="outline"
    size="icon"
    onClick={onClick}
    className="bg-[#d82128] text-white md:p-2 rounded-full relative md:top-4 hover:bg-[#b5181e] transition ml-2"
  >
    <ChevronRight className="md:h-5 h-4 md:w-5 h-4" />
  </Button>
);

// Main Carousel Component
export default function HospitalCarousel() {
  const sliderRef = useRef<Slider>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: false, // We'll use custom arrows
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    customPaging: () => (
      <div className="w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors duration-300" />
    ),
    dotsClass: 'slick-dots custom-dots',
  };

  return (
    <>
      <style jsx global>{`
        .slick-dots {
          bottom: -50px;
          display: flex !important;
          justify-content: center;
          align-items: center;
          gap: 8px;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .slick-dots li {
          margin: 0;
          width: auto;
          height: auto;
        }
        
        .slick-dots li button {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #d1d5db;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
          font-size: 0;
        }
        
        .slick-dots li.slick-active button {
          background: #E22026;
          transform: scale(1.2);
        }
        
        .slick-dots li button:hover {
          background: #9ca3af;
        }
        
        .slick-dots li.slick-active button:hover {
          background: #c01c22;
        }
        
        .slick-slider {
          margin: 0 -10px;
        }
        
        .slick-slide {
          text-align: center;
          padding-left: 10px;
          padding-right: 10px;
          /* Remove the explicit margin-left/right on the slide itself */
        }

        .slick-slide > div {
          height: 100%;
        }

        .slick-list {
          overflow: hidden;
        }

      `}</style>

      <section className="md:py-10 py-4 bg-white">
        <div className="container mx-auto px-4 md:px-0">
          {/* Header with Navigation Arrows */}
          <div className="flex justify-between items-center mb-2 md:mb-6">
            <div className="flex-1">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-">Our Hospital Partners</h2>
            </div>

        
             <div className="flex gap-2">
                        <button
                          onClick={() => sliderRef.current?.slickPrev()}
                          className="bg-white text-gray-700 p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                          aria-label="Previous advisor"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                       onClick={() => sliderRef.current?.slickNext()}
                          className="bg-white text-gray-700 p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                          aria-label="Next advisor"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
          </div>

          <div className="hospital-carousel">
            <Slider ref={sliderRef} {...settings}>
              {HOSPITALS.map((hospital) => (
                <HospitalCard key={hospital.id} hospital={hospital} onOpenModal={openModal} />
              ))}
            </Slider>
          </div>
        </div>
      </section>

      <ContactModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}