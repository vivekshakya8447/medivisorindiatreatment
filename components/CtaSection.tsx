"use client"
import { Phone } from "lucide-react"
import ContactModal from "@/components/ContactModal"
import { useState } from 'react'

const ModernHelpSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <section className="relative py-0 md:py-10 px-0 md:px-6 lg:px-8 overflow-hidden">
        <div className="container bg-[#e32128] py-12 px-6 md:px-10 mx-auto rounded-xs shadow-xs relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main CTA Content */}
            <div className="mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-snug mb-4">
                Ready to Transform Your Healthcare Experience?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-100 leading-relaxed max-w-2xl mx-auto">
                Join thousands of patients who trust us with their health. Get started today and experience
                world-class medical care at your fingertips.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center mb-10">
              <button
                className="group w-full sm:w-auto cursor-pointer bg-white text-[#E22026] px-5 py-2 rounded-md font-medium text-sm md:text-base hover:bg-red-50 transition-all duration-300 transform border border-white shadow-md flex items-center justify-center gap-2"
                onClick={openModal}
              >
                Get Started
              </button>
              <a href="tel:+918368247758">
                <button
                  className="group w-full sm:w-auto cursor-pointer border border-white text-white px-5 py-2 rounded-md font-medium text-sm md:text-base hover:bg-white hover:text-[#E22026] transition-all duration-300 transform flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 md:w-5 md:h-5" />
                  Call Us
                </button>
              </a>

            </div>

            {/* Trust Indicators */}
            <div className="mt-8 pt-6 border-t border-white/30">
              <p className="text-red-100 text-sm sm:text-base md:text-lg">
                Trusted by <span className="font-semibold">2,000+</span> patients worldwide 🌍
              </p>
            </div>
          </div>
        </div>
      </section>

      <ContactModal
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  )
}

export default ModernHelpSection
