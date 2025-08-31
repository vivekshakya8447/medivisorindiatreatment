"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { FileText, ExternalLink, Play } from "lucide-react"
import { wixClient } from "@/lib/wixClient"
import { getWixScaledToFillImageUrl, getBestCoverImage } from "@/lib/wixMedia"

interface GalleryItem {
  _id: string
  _createdDate: Date
  _updatedDate: Date
  title?: string
  description?: string
  sortOrder: number
  type: "IMAGE" | "VIDEO" | "TEXT" | "AUDIO" | "DOCUMENT"
  image?: { imageInfo: string }
  video?: { type?: "YOUTUBE" | "WIX_MEDIA"; videoInfo?: string; duration?: number }
  text?: { html: string; css?: any }
  link?: { text: string; url: string }
  galleryId?: string
  galleryName?: string
}

// Media Card Skeleton with Shimmer
const MediaCardSkeleton = () => (
  <Card className="overflow-hidden rounded-lg border border-slate-200 shadow-sm animate-pulse">
    <div className="aspect-[4/3] relative">
      <Skeleton className="w-full h-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      <Skeleton className="absolute top-4 left-4 h-5 w-16 rounded-full" />
    </div>
    <CardContent className="p-6 space-y-3">
      <Skeleton className="h-5 w-full rounded-lg" />
      <Skeleton className="h-4 w-4/5 rounded-lg" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>
    </CardContent>
  </Card>
)

const getMediaType = (item: GalleryItem): string => {
  if (item.type === "IMAGE" && item.image?.imageInfo) return "image"
  if (item.type === "VIDEO" && item.video) return "video"
  if (item.type === "TEXT" && item.text?.html) return "text"
  return "unknown"
}

const getYouTubeEmbedUrl = (videoInfo?: string): string | null => {
  if (!videoInfo) return null
  const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  const match = videoInfo.match(youtubeRegex)
  return match?.[1] ? `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1` : null
}

interface MediaCoverageCarouselProps {
  title?: string

  showViewAll?: boolean
  maxItems?: number
  className?: string
}

export default function MediaCoverageCarousel({
  title = "Latest Media Coverage",

  showViewAll = true,
  maxItems = 8,
  className = "",
}: MediaCoverageCarouselProps) {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMediaData = async () => {
    try {
      setLoading(true)
      setError(null)

      const galleriesResponse = await wixClient.proGallery.listGalleries()
      const fetchedGalleries = (galleriesResponse.galleries || []).map((gallery: any) => ({
        ...gallery,
        _id: String(gallery._id ?? ""),
        _createdDate: gallery._createdDate ? new Date(gallery._createdDate) : new Date(),
        totalItems: gallery.totalItems ?? 0,
        sortOrder: gallery.sortOrder ?? 0,
        name: gallery.name ?? "",
      }))

      const allItemsPromises = fetchedGalleries.slice(0, 3).map(async (gallery: any) => {
        try {
          const itemsResponse = await wixClient.proGallery.listGalleryItems(gallery._id)
          return (
            itemsResponse.items?.map((item: any) => ({
              ...item,
              galleryId: gallery._id,
              galleryName: gallery.name || `Gallery ${gallery._id.slice(0, 8)}`,
            })) || []
          )
        } catch {
          return []
        }
      })

      const allItemsArrays = await Promise.all(allItemsPromises)
      const allItems = allItemsArrays
        .flat()
        .map((item: any) => ({
          ...item,
          _id: String(item._id ?? ""),
          _createdDate: item._createdDate ? new Date(item._createdDate) : new Date(),
          _updatedDate: item._updatedDate ? new Date(item._updatedDate) : new Date(),
        }))
        .filter((item) => item._id)
        .sort((a, b) => b._createdDate.getTime() - a._createdDate.getTime())
        .slice(0, maxItems)

      setItems(allItems)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load media")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMediaData()
  }, [maxItems])

  const renderMediaCard = (item: GalleryItem) => {
    const mediaType = getMediaType(item)

    const getOptimizedImageUrl = (item: GalleryItem): string => {
      const bestCover = getBestCoverImage(item)
      if (bestCover) return bestCover

      if (item.image?.imageInfo) {
        return getWixScaledToFillImageUrl(item.image.imageInfo, 400, 300) || "/placeholder.svg?height=300&width=400"
      }

      return "/placeholder.svg?height=300&width=400"
    }

    return (
      <Card
        key={item._id}
        className="group relative overflow-hidden rounded-xs border border-slate-100 bg-white shadow-none transition-all duration-300 hover:shadow-xl"
      >
        <div className="aspect-[4/3] relative bg-slate-100 overflow-hidden">
          {mediaType === "image" && (
            <img
              src={getOptimizedImageUrl(item) || "/placeholder.svg"}
              alt={item.title || "Media item"}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=300&width=400"
              }}
            />
          )}
          {mediaType === "video" && (
            <div className="w-full h-full flex items-center justify-center bg-black/20">
              <Play className="h-10 w-10 text-red-600 drop-shadow-lg" />
            </div>
          )}
          {mediaType === "text" && (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <FileText className="h-10 w-10 text-gray-600" />
            </div>
          )}
          <Badge className="absolute top-4 left-4 bg-white text-slate-700 border-0 shadow-sm font-semibold capitalize">
            {mediaType}
          </Badge>
        </div>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 min-h-14 line-clamp-2">{item.title || "Untitled Media"}</h3>
      
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <div className={`py-10 ${className}`}>
        <div className="container mx-auto px-4 md:px-0 text-center">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
        
          <Button onClick={fetchMediaData} className="bg-red-500 text-white">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <section className="md:py-10 py-4 border-t md:border-none border-b border-gray-100 bg-gray-50">
      <div className="container mx-auto px-4 md:px-0">
        <div className="flex justify-between items-center mb-2 md:mb-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
         
          </div>
          {showViewAll && (
            <Button asChild variant="link" className="text-gray-600 px-0">
              <a href="/media-coverage" className="inline-flex items-center gap-1 font-semibold">
                View All
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <MediaCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4 md:-ml-6">
              {items.map((item) => (
                <CarouselItem key={item._id} className="pl-4 rounded-xs shadow-none md:pl-6 md:basis-1/2 lg:basis-1/4">
                  {renderMediaCard(item)}
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Arrows hidden on mobile */}
            <CarouselPrevious className=" flex left-2 bg-white border-gray-200 w-10 h-10 shadow-lg hover:bg-gray-50" />
            <CarouselNext className=" flex right-2 bg-white border-gray-200 w-10 h-10 shadow-lg hover:bg-gray-50" />
          </Carousel>
        )}
      </div>
    </section>
  )
}