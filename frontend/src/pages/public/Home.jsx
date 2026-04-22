// src/pages/public/Home.jsx
import { useEffect, useState } from "react";
import Hero from "../../components/sections/Hero";
import FeaturedCollections from "../../components/sections/FeaturedCollections";
import FeaturedProjects from "../../components/sections/FeaturedProjects";
import WhyUs from "../../components/sections/WhyUs";
import Testimonials from "../../components/sections/Testimonials";
import OffersBanner from "../../components/sections/OffersBanner";
import { getAllCollections } from "../../api/collectionApi";
import { getAllProjects } from "../../api/projectApi";
import { getAllOffers } from "../../api/offerApi";
import { getAllTestimonials } from "../../api/testimonialApi";

// ── Safe extractor — tries every possible key shape ──────────────────────
const extract = (res, keys) => {
  const d = res?.data;
  if (!d) return [];
  for (const key of keys) {
    const val = key.includes(".")
      ? key.split(".").reduce((o, k) => o?.[k], d)
      : d[key];
    if (Array.isArray(val) && val.length > 0) return val;
  }
  if (Array.isArray(d)) return d;
  return [];
};

const Home = () => {
  const [collections, setCollections]   = useState([]);
  const [projects, setProjects]         = useState([]);
  const [offers, setOffers]             = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    getAllCollections({ featured: true, limit: 6 })
      .then((r) => setCollections(extract(r, ["collections", "data.collections", "data", "items"])))
      .catch(() => setCollections([]));

    getAllProjects({ featured: true, limit: 4 })
      .then((r) => setProjects(extract(r, ["projects", "data.projects", "data", "items"])))
      .catch(() => setProjects([]));

    getAllOffers({ isActive: true, limit: 3 })
      .then((r) => setOffers(extract(r, ["offers", "data.offers", "data", "items"])))
      .catch(() => setOffers([]));

    getAllTestimonials({ isActive: true, limit: 6 })
      .then((r) => setTestimonials(extract(r, ["testimonials", "data.testimonials", "data", "items"])))
      .catch(() => setTestimonials([]));
  }, []);

  return (
    <div className="bg-[#0a0a0a]">
      <Hero />
      <FeaturedCollections collections={collections} />
      <FeaturedProjects projects={projects} />
      <WhyUs />
      <Testimonials testimonials={testimonials} />
      <OffersBanner offers={offers} />
    </div>
  );
};

export default Home;