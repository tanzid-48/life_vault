import FeaturedLessons from "@/components/shared/FeaturedLessons";
import HeroSection from "@/components/shared/HeroSection";
import HowItWorks from "@/components/shared/HowItWorks";
import TopContributors from "@/components/shared/TopContributors";
import WhySection from "@/components/shared/WhySection";
import { getFeaturedLessons, getTopContributors } from "@/lib/api/home";
import { getSession } from "@/lib/auth-session";

export const metadata = {
  title: "LifeVault — Preserve & Share Life's Most Important Lessons",
  description:
    "A platform to create, store, and share meaningful life lessons and personal wisdom.",
};

export default async function Home() {
  const session = await getSession();
  const user = session?.user || null;

  const featured = await getFeaturedLessons();
  const topContributors = await getTopContributors();

  return (
    <>
      <main className="min-h-screen bg-[#080810]">
        <HeroSection />
        <WhySection />
        <FeaturedLessons lessons={featured} currentUser={user} />
        <HowItWorks />
         <TopContributors contributors={topContributors}/>
      </main>
    </>
  );
}
