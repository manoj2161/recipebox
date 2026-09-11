import homeImage from "../assets/home.png";
import tabletHomeImage from "../assets/tablethome.png";
import mobileHomeImage from "../assets/mobileHome.png";
import { Header } from "./Header";

export const Home = () => (
  <main className="relative min-h-[100svh] w-full overflow-hidden">
    <div className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat lg:block" style={{ backgroundImage: `url(${homeImage})` }} />
    <div className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat md:block lg:hidden" style={{ backgroundImage: `url(${tabletHomeImage})` }} />
    <div className="absolute inset-0 bg-cover bg-top bg-no-repeat md:hidden" style={{ backgroundImage: `url(${mobileHomeImage})` }} />
    <div className="relative z-10 w-full"><Header /></div>
  </main>
);
