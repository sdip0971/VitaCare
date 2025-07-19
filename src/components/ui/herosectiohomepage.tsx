
'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";

function HeroSection() {
  return (
    <section
      style={{ backgroundImage: "url('/images/Advertising.jpeg')" }}
      className="  text-black py-20"
    >
      <div className="container mx-auto px-6">
        <div
          className=" grid grid-cols-1 lg:grid-cols-1 gap-12 items-center hero-background" // Use the new class here
        >
          <div>
            <Link rel="stylesheet" href="/Herosection.css" />
            <h1 className="text-2xl text-black font-bold text-nowrap md:text-4xl md:flex items-center justify-center font-bold mb-6">
              Transforming Healthcare Through Technology
            </h1>
            <p className="text-2xl text-shadow-slate-200 mb-8 ">
              VitaCare provides a centralized platform for secure healthcare
              management, giving patients, doctors, and administrators seamless
              access to medical records.
            </p>
            <div className="flex flex-col justify-center sm:flex-row  space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="font-medium px-8 bg-white text-primary hover:bg-white/90"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/auth?tab=register">
                <Button
                  size="lg"
                  className="font-medium px-8 bg-white text-primary hover:bg-white/90"
                >
                  Create an account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
