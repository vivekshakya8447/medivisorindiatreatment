'use client';

import { FaPhoneAlt } from 'react-icons/fa';
import Image from 'next/image';

interface BannerProps {
  bannerBgImage?: string;
  title: string;
  description: string; // HTML string
  buttonText: string;
  buttonLink: string;
  mainImageSrc: string;
  mainImageAlt: string;
  mainImageClass?: string;
  topSpanText?: string;
  children?: React.ReactNode;
}

export default function Banner({
  bannerBgImage = '/medicine-science.png',
  title,
  description,
  buttonText,
  buttonLink,
  mainImageSrc,
  mainImageAlt,
  mainImageClass,
  topSpanText,
  children,
}: BannerProps) {
  return (
    <section className="relative overflow-hidden bg-white py-0 pt-10 md:pt-0 md:py-0 md:h-[70vh]">




      <div className="relative z-20 container mx-auto md:px-0 px-4  grid grid-cols-1 md:grid-cols-2 md:gap-12 items-center h-full">
        {/* Left Content */}
        <div className="space-y-2 md:space-y-4">
          {topSpanText && (
            <span className="inline-block px-0 py-1 rounded-sm text-[#E22026] bg-white text-base font-medium tracking-wide shado mb-1">
              {topSpanText}
            </span>
          )}
          <h1 className="text-2xl md:text-5xl font-semibold text-black leading-tight">
            {title}
          </h1>
          <p
            className="text-gray-700 text-base md:text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: description }}
          />

        </div>

        {/* Right Image */}
        <div className=" absoloute  w-full md:h-full">
          <img
            src={mainImageSrc}
            alt={mainImageAlt}
            className={`w-full mx-auto rounded-xl ${mainImageClass || ''}`}
          />
        </div>
      </div>
    </section>
  );
}
