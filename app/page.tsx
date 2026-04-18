import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ProductsSection from "@/components/sections/ProductsSection";
import BlogSection from "@/components/sections/BlogSection";
import ContactSection from "@/components/sections/ContactSection";
import TeamSection from "@/components/sections/TeamSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <TeamSection />
      <ProductsSection />
      <BlogSection />
      <ContactSection />
    </>
  );
}
