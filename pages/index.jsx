import Layout from '../src/layouts/Layout';
import Hero from '../src/components/Hero';
import About from '../src/components/About';
import Portfolio from '../src/components/Portfolio';
import Experience from '../src/components/Experience';
import Testimonials from '../src/components/Testimonials';
import BlogSection from '../src/components/BlogSection';
import Contact from '../src/components/Contact';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <About />
      <Portfolio />
      <Experience />
      <Testimonials />
      <BlogSection />
      <Contact />
    </Layout>
  );
}
