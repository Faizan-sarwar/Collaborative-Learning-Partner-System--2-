import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import Features from '../components/Features/Features';
import AdditionalFeatures from '../components/AdditionalFeatures/AdditionalFeatures';
import HowItWorks from '../components/HowItWorks/HowItWorks';
import WhyGroupStudy from '../components/WhyGroupStudy/WhyGroupStudy';
import Impact from '../components/Impact/Impact';
import FAQ from '../components/FAQ/FAQ';
import Footer from '../components/Footer/Footer';

const Index = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <AdditionalFeatures />
      <HowItWorks />
      <WhyGroupStudy />
      <Impact />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
