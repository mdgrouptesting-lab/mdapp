import { Hero } from "@/components/site/Hero";
import { AboutPreview, AppSection, CtaBanner, EnquirySection, LatestPosts, ProcessSection, ServicesGrid, StatsBand, WhyUs } from "@/components/site/HomeSections";
import { getPublishedPosts } from "@/lib/posts";

export const revalidate = 300;

export default async function HomePage() {
  const posts = await getPublishedPosts(3);
  return (
    <>
      <Hero />
      <StatsBand />
      <ServicesGrid />
      <AboutPreview />
      <ProcessSection />
      <AppSection />
      <WhyUs />
      <LatestPosts posts={posts} />
      <EnquirySection />
      <CtaBanner />
    </>
  );
}
