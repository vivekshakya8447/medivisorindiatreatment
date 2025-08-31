"use client"
import { Button } from "@/components/ui/button"
import { Check, Briefcase, ExternalLink, Clock, DollarSign, Tag } from "lucide-react"
import "keen-slider/keen-slider.min.css"
import Banner from "@/components/BannerService"
import ContactModal from '@/components/ContactModal';
import { useState, useEffect } from "react"
import CtaSection from "@/components/CtaSection"
import { getBestCoverImage, getWixScaledToFillImageUrl } from "@/lib/wixMedia"

const COLLECTION_ID = "Import1"

interface Service {
  _id?: string
  title: string
  description: string
  richContent?: string
  shortDescription?: string
  image: string
  images?: string[]
  benefits: string[]
  features?: string[]
  price?: string
  duration?: string
  category?: string
  tags?: string[]
  order?: number
  isPopular?: boolean
  ctaText?: string
  ctaLink?: string
  richContentNodes?: any[]
}

const ShimmerEffect = ({ className = "" }: { className?: string }) => (
  <div className={`relative overflow-hidden bg-gray-200 rounded ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
  </div>
)

const ModernSkeleton = () => (
  <section className="relative bg-white md:py-10" id="Services">
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2">
          <ShimmerEffect className="h-10 w-64" />
          <ShimmerEffect className="h-4 w-48" />
        </div>
        <div className="hidden md:flex gap-2">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xs border border-gray-100 shadow-sm h-[620px]">
            <ShimmerEffect className="w-full h-44 rounded-t-xs" />
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <ShimmerEffect className="h-5 w-3/4" />
                <ShimmerEffect className="h-4 w-16" />
              </div>
              <div className="space-y-2">
                <ShimmerEffect className="h-3 w-full" />
                <ShimmerEffect className="h-3 w-5/6" />
                <ShimmerEffect className="h-3 w-4/5" />
              </div>
              <div className="flex gap-2 mt-3">
                <ShimmerEffect className="h-6 w-16 rounded-full" />
                <ShimmerEffect className="h-6 w-20 rounded-full" />
              </div>
              <div className="space-y-2 mt-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
                    <ShimmerEffect className="h-3 w-4/5" />
                  </div>
                ))}
              </div>
              <ShimmerEffect className="h-10 w-full rounded-xs mt-6" />
            </div>
          </div>
        ))}
      </div>
    </div>

    <style jsx global>{`
      @keyframes shimmer {
        100% {
          transform: translateX(100%);
        }
      }
    `}</style>
  </section>
)

export default function Services() {

    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    }
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<"static" | "wix">("static")
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const processWixImageUrl = (item: any): string => {
    const bestImage = getBestCoverImage(item)
    if (bestImage) {
      return bestImage
    }

    const imageFields = ["image", "photo", "picture", "mainImage", "featuredImage", "coverImage", "thumbnail"]

    for (const field of imageFields) {
      if (item[field]) {
        let imageUrl = null

        if (typeof item[field] === "string" && item[field].startsWith("wix:image://")) {
          imageUrl = item[field]
        } else if (item[field]?.url && item[field].url.startsWith("wix:image://")) {
          imageUrl = item[field].url
        } else if (item[field]?.src && item[field].src.startsWith("wix:image://")) {
          imageUrl = item[field].src
        }

        if (imageUrl) {
          const processedUrl = getWixScaledToFillImageUrl(imageUrl, 400, 300)
          if (processedUrl) {
            return processedUrl
          }
        }
      }
    }

    return `/placeholder.svg?height=200&width=400&query=medical service`
  }

  const parseRichContent = (content: any): { text: string; nodes?: any[] } => {
    if (!content) return { text: "" }

    // Handle simple string content
    if (typeof content === "string") {
      return { text: content }
    }

    // Handle Wix rich content structure
    if (content.nodes && Array.isArray(content.nodes)) {
      const extractedText = extractTextFromNodes(content.nodes)
      return {
        text: extractedText,
        nodes: content.nodes,
      }
    }

    // Handle other formats
    if (content.html) {
      return { text: content.html }
    }

    if (content.plainText) {
      return { text: content.plainText }
    }

    if (content.text) {
      return { text: content.text }
    }

    return { text: "" }
  }

  const extractTextFromNodes = (nodes: any[]): string => {
    let text = ""

    for (const node of nodes) {
      if (node.type === "TEXT" && node.textData?.text) {
        text += node.textData.text
      } else if (node.type === "PARAGRAPH" && node.nodes) {
        text += extractTextFromNodes(node.nodes) + " "
      } else if (node.type === "LIST_ITEM" && node.nodes) {
        text += "• " + extractTextFromNodes(node.nodes) + " "
      } else if (node.type === "BULLETED_LIST" && node.nodes) {
        text += extractTextFromNodes(node.nodes)
      } else if (node.nodes && Array.isArray(node.nodes)) {
        text += extractTextFromNodes(node.nodes)
      }
    }

    return text.trim()
  }

  const extractBenefitsFromRichContent = (richContent: any): string[] => {
    if (!richContent?.nodes) return []

    const benefits: string[] = []

    const findListItems = (nodes: any[]) => {
      for (const node of nodes) {
        if (node.type === "LIST_ITEM" && node.nodes) {
          const itemText = extractTextFromNodes(node.nodes)
          if (itemText.trim()) {
            benefits.push(itemText.trim())
          }
        } else if (node.nodes && Array.isArray(node.nodes)) {
          findListItems(node.nodes)
        }
      }
    }

    findListItems(richContent.nodes)
    return benefits
  }

  const parseArrayField = (field: any, fallback: string[] = []): string[] => {
    if (!field) return fallback

    if (Array.isArray(field)) {
      return field.filter(Boolean)
    }

    if (typeof field === "string") {
      return field
        .split(/[,\n]/)
        .map((item) => item.trim())
        .filter(Boolean)
    }

    return fallback
  }

  const fetchServices = async () => {
    try {
      const { wixClient } = await import("@/lib/wixClient")

      const response = await wixClient.items
        .query(COLLECTION_ID)
        .skip(0)
        .limit(100)
        .descending("_createdDate") // Use creation date for consistent ordering
        .find({ consistentRead: true })

      if (!response?.items?.length) {
        return []
      }

      const servicesData: Service[] = response.items.map((item: any, originalIndex: number) => {
        const parsedRichContent = parseRichContent(item.richcontent || item.richContent)
        const parsedDescription = parseRichContent(item.description)

        const richContentBenefits = extractBenefitsFromRichContent(item.richcontent || item.richContent)
        const fallbackBenefits = parseArrayField(item.benefits, [
          "Professional service",
          "Expert care",
          "Quality assured",
        ])

        return {
          _id: item._id || item.ID,
          title: item.title || item.name || item.serviceName || "Service",
          description: parsedDescription.text || "Service description",
          richContent: parsedRichContent.text,
          richContentNodes: parsedRichContent.nodes,
          shortDescription: parseRichContent(item.shortDescription || item.summary).text,
          image: processWixImageUrl(item),
          images: item.images
            ? parseArrayField(item.images).map((img: any) => processWixImageUrl({ image: img }))
            : undefined,
          benefits: richContentBenefits.length > 0 ? richContentBenefits : fallbackBenefits,
          features: parseArrayField(item.features),
          price: item.price || item.cost || item.pricing,
          duration: item.duration || item.timeRequired || item.estimatedTime,
          category: item.category || item.serviceCategory || item.type,
          tags: parseArrayField(item.tags),
          order: Number.parseInt(item.order) || Number.parseInt(item.Order) || originalIndex,
          isPopular: item.isPopular || item.featured || item.popular || false,
          ctaText: item.ctaText || item.buttonText || "Enquire Now",
          ctaLink: item.ctaLink || item.bookingLink || item.contactLink,
        }
      })

      return servicesData.sort((a, b) => (a.order || 0) - (b.order || 0))
    } catch (error: any) {
      console.error("[v0] Wix API Error:", error)
      throw error
    }
  }

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchServices()

      if (result.length > 0) {
        setServices(result)
        setDataSource("wix")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const truncateText = (text: string, maxLength = 150) => {
    if (!text) return ""

    // Strip HTML tags for length calculation
    const plainText = text.replace(/<[^>]*>/g, "")

    if (plainText.length <= maxLength) return text

    // Find a good breaking point
    const truncated = plainText.substring(0, maxLength)
    const lastSpace = truncated.lastIndexOf(" ")
    const finalLength = lastSpace > maxLength * 0.8 ? lastSpace : maxLength

    return plainText.substring(0, finalLength).trim() + "..."
  }

  const ServiceCard = ({ service, index }: { service: Service; index: number }) => (
    <div className="group bg-white rounded-xs overflow-hidden shadow-none hover:shadow-sm transition-all duration-300 border border-gray-100 h-[620px] flex flex-col relative">
      {/* Popular Badge */}
      {service.isPopular && (
        <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
          Popular
        </div>
      )}

      {/* Image Section */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img
          src={service.image || "/placeholder.svg?height=200&width=400&query=medical service"}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = `/placeholder.svg?height=200&width=400&query=${encodeURIComponent(service.title + " medical service")}`
          }}
        />
        {service.category && (
          <div className="absolute bottom-4 left-4 bg-black/80 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
            {service.category}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 py-4 flex flex-col flex-grow">
        {/* Header with title and price */}
        <div className="flex items-start justify-between mb-2 min-h-[2rem]">
          <h3 className="text-xl font-medium text-gray-900 leading-tight flex-1 pr-2 line-clamp-2">
            {service.title}
          </h3>
          {service.price && (
            <div className="flex items-center gap-1 text-green-600 font-semibold text-sm bg-green-50 px-2 py-1 rounded-full flex-shrink-0">
              <DollarSign className="w-3 h-3" />
              {service.price}
            </div>
          )}
        </div>

        {/* Duration and Tags */}
        

        {/* Description */}
        <div className="mb-6  overflow-hidden">
          <p className="text-gray-600 leading-relaxed text-lg line-clamp-3">
            {truncateText(service.shortDescription || service.description, 120)}
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-3  overflow-hidden">
          <ul className="space-y-2.5">
            {service.benefits.slice(0, 3).map((benefit, benefitIndex) => (
              <li key={benefitIndex} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-base text-gray-600 leading-relaxed line-clamp-2">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        {/* <div className="mt-auto">
          <Button
            className="w-full bg-[#E22026] hover:bg-[#c01c22] text-white font-medium py-3 px-4 rounded-xs transition-all duration-200 shadow-sm hover:shadow-md group"
            onClick={() => {
              if (service.ctaLink) {
                window.open(service.ctaLink, "_blank")
              } else {
                setSelectedService(service)
              }
            }}
          >
            {service.ctaText || "Enquire Now"}
            {service.ctaLink && (
              <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            )}
          </Button>
        </div> */}
        <Button
              onClick={openModal}
              className=" inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background hover:text-accent-foreground h-10 px-4 py-2 border-gray-200 text-gray-600 hover:bg-gray-50 absolute bottom-4 left-4 right-4 mb-3"
            >
              Enquire Now
            </Button>
      </div>
    </div>
  )

  if (loading) {
    return <ModernSkeleton />
  }

  if (services.length === 0) {
    return (
      <section className="relative bg-white md:py-10" id="Services">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto py-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-100 to-purple-100 rounded-full mb-8">
              <Briefcase className="h-12 w-12 text-red-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
              Our Services
            </h2>
            <p className="text-lg text-gray-600">
              Our services information is currently being updated. Check back soon!
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <Banner
        topSpanText="Our Specialized Services"
        title="Comprehensive Healthcare Solutions Tailored for You"
        description="Discover our wide range of medical services designed to meet the diverse needs of international patients. From specialized treatments to general wellness, we connect you with the best healthcare providers in India."
        buttonText=" Connect Us"
        buttonLink="/services#list"
        mainImageSrc="/about-main.png"
        mainImageAlt="Doctor providing expert medical guidance"
        bannerBgImage="/bg-about.png"
      />
      <section className="relative bg-gray-50 py-12 md:py-16" id="Services">
        <div className="container mx-auto px-4 md:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-4">
            {services.map((service, index) => (
              <ServiceCard key={service._id || index} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>
      <CtaSection/>
       <ContactModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
}
