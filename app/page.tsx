import HeroCut from "@/components/home/HeroCut";
import Manifesto from "@/components/home/Manifesto";
import FeaturedEdit from "@/components/home/FeaturedEdit";
import FilmSequence from "@/components/home/FilmSequence";
import Categories from "@/components/home/Categories";
import Spotlight from "@/components/home/Spotlight";
import HowToOrder from "@/components/home/HowToOrder";
import Reviews from "@/components/home/Reviews";
import Lookbook from "@/components/home/Lookbook";

export default function Home() {
  return (
    <>
      <HeroCut />
      <Manifesto />
      <FeaturedEdit />
      <FilmSequence />
      <Categories />
      <Spotlight />
      <HowToOrder />
      <Reviews />
      <Lookbook />
    </>
  );
}
