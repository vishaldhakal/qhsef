"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="bg-gradient-to-br min-h-[calc(100vh-130px)] flex flex-col justify-center items-center from-blue-50 to-white py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-12 grid md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[#0A1E4B]">
            Quality, Health, Safety, Environment & Food
          </h1>
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-600 mb-2 relative">
              Commitment to Quality, Safety, and Sustainability
            </h2>
            <div className="relative mt-7 py-3">
              <Image
                src="/Rectangle.svg"
                alt=""
                width={300}
                height={8}
                className="absolute -bottom-2 left-0 mx-auto sm:mx-0"
              />
            </div>
            <p className="text-gray-600 mt-6 sm:mt-8 px-4 sm:px-0 text-base sm:text-lg">
              A Campaign Initiated for the Quality of Domestic Products
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center sm:justify-start">
            <Button
              className="bg-[#0b2a71] text-white hover:bg-blue-900 rounded-full p-4 sm:p-5 text-lg font-semibold"
              asChild
            >
              <Link href={"/qhsef"}>Self Assessment</Link>
            </Button>
            <Button
              variant="outline"
              className="border-[#0A1E4B] text-[#0A1E4B] p-4 sm:p-5 rounded-full text-lg font-semibold mt-4 sm:mt-0"
              onClick={() => scrollToSection("#about")}
            >
              Learn More
            </Button>
          </div>
        </div>
        <div className="relative md:mx-auto  justify-center items-center mt-8 md:mt-0 md:block hidden">
          <Image
            src="/logo.png"
            alt="MDMU Logo"
            width={350}
            height={350}
            className="w-full max-w-[350px] h-auto"
          />
        </div>
      </div>
    </section>
  );
}
