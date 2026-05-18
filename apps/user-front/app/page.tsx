import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import { CommunitySection } from "../components/CommunitySection";

export default function Home() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        {/* <CommunitySection /> */}
      </main>
    </div>
  );
}
