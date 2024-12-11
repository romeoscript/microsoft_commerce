'use client';
import { client } from '@/utils/sanity/client';
import Hero from "@/components/pages/Hero.jsx"
import { useState, useEffect } from 'react';
import Features from '@/components/pages/Features';
import Qualities from '@/components/pages/Qualities';
import BestSellerDishes from '@/components/pages/BestDishes';
import HomeLayout from '@/components/layout/HomeLayout';



// Define async function to fetch content from Sanity
async function getContent() {
  const CONTENT_QUERY = `*[_type == "dish"] {
    ...,
    category->,
    ingredients[]->,
    image {
      ...,
      asset->
    }
  }`;

  const content = await client.fetch(CONTENT_QUERY);
  return content;
}

// Define functional component
export default function Home() {
  const [content, setContent] = useState([]);

  // Fetch content when component mounts
  useEffect(() => {
    getContent().then((data) => {
      setContent(data);
    });
  }, []);

  return (
    <HomeLayout>

      <section className="min-h-screen ">
        <Hero />
        <BestSellerDishes />
        <Features />
        <Qualities />
      </section>
    </HomeLayout>
  );
}


