"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronRight } from "lucide-react"

export default function Testimonials() {
  const [showMoreButton, setShowMoreButton] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const [currentVideo, setCurrentVideo] = useState({
    id: "tRFHfLX-v2Q",
    title: "Akanisi Navuku from Fiji - Cancer Treatment",
  })

  const testimonials = [
    {
      id: "tRFHfLX-v2Q",
      name: "Akanisi Navuku",
      treatment: "Cancer Treatment",
      title: "Akanisi Navuku from Fiji - Cancer Treatment",
    },
    {
      id: "KZDq1ICki0k",
      name: "Cathy Koe",
      treatment: "Mitral Valve Replacement",
      title: "Cathy Koe from Solomon Islands",
    },
    {
      id: "5NVBGLyg5Cs",
      name: "Sterry Toukes",
      treatment: "Heart Treatment",
      title: "Sterry Toukes from PNG - Heart Treatment",
    },
    {
      id: "5BsftwEpNLo",
      name: "Leon Warsal",
      treatment: "Aortic Valve Replacement",
      title: "Leon Warsal from Vanuatu - Aortic Valve Replacement",
    },
    {
      id: "c2HbMordW7s",
      name: "Jean Gabriel",
      treatment: "Hodgkin's Lymphoma",
      title: "Jean Gabriel from Vanuatu - Hodgkin's Lymphoma",
    },
    {
      id: "SQ1RQELGqUM",
      name: "Freda Sofu",
      treatment: "Kidney Stone Removal",
      title: "Freda Sofu from Solomon Islands - Kidney Stone Removal",
    },
    {
      id: "dQw4w9WgXcQ",
      name: "Maria Santos",
      treatment: "Cardiac Surgery",
      title: "Maria Santos from Philippines - Cardiac Surgery",
    },
  ]

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const container = scrollContainerRef.current
        if (container) {
          const { scrollTop, scrollHeight, clientHeight } = container
          const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5
          setShowMoreButton(isAtBottom)
        }
      }, 100) // Debounce for 100ms
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true })
      // Check initial state
      handleScroll()

      return () => {
        container.removeEventListener("scroll", handleScroll)
        clearTimeout(timeoutId)
      }
    }
  }, [])

  const changeVideo = (videoId: string, title: string) => {
    setCurrentVideo({ id: videoId, title })
  }

  return (
    <section className="px-0 md:py-10 py-4 bg-white" id="Stories">
      <div className="container text-center px-4 md:px-0 mx-auto">
        <div className="md:text-center text-left mb-6 max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 leading-snug">Patient Testimonials</h2>
          <p className="md:text-lg text-base text-gray-600 leading-relaxed mb-5">
            Hear directly from our 2000+ International Patients about how comforting and hassle-free their India
            treatment journey became with Medivisor by their side.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 md:border-t md:border-gray-100 md:shadow ">
            <h4 className="md:text-2xl px-4 text-lg font-semibold py-5 text-gray-800">{currentVideo.title}</h4>
            <div className="aspect-video overflow-hidden border-gray-100">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1&mute=1&rel=0&modestbranding=1&showinfo=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <div>
            <div className="md:bg-white pb-1 md:border md:border-gray-100">
              <h3 className="md:text-2xl text-lg font-semibold text-gray-800 md:px-4 pt-4 pb-2">Inspiring Stories</h3>
              <div ref={scrollContainerRef} className="space-y-4 text-left overflow-y-auto max-h-[510px] md:px-4 py-2">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="cursor-pointer flex items-center p-3 rounded-md border border-gray-200 hover:bg-[#E22026]/10 transition group"
                    onClick={() => changeVideo(testimonial.id, testimonial.title)}
                  >
                    <Image
                      src={`https://img.youtube.com/vi/${testimonial.id}/hqdefault.jpg`}
                      alt={testimonial.name}
                      width={96}
                      height={64}
                      className="w-24 h-16 object-cover rounded-md border"
                    />
                    <div className="ml-4">
                      <p className="font-semibold text-gray-700 group-hover:text-black">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.treatment}</p>
                    </div>
                  </div>
                ))}
              </div>

             
                <div className="md:px-4 py-3 pt-5 border-t border-gray-100">
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-[#E22026] to-[#c71c1f] text-white rounded-md hover:from-[#c71c1f] hover:to-[#a01619] transition text-base font-medium">
                    <a href="/patient-testimonials" className="flex items-center justify-center gap-2">
                      Show More Videos
                    
                    </a>
                  </button>
                </div>
            
            </div>

            
          </div>
        </div>
      </div>
    </section>
  )
}
