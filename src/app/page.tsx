{
  /*
Project: Yumyum – Digital Menus for Street Food Vendors
Task: Build a High-Converting, Emotionally Resonant Landing Page
Goal: Maximize signups, sales, and profitability while maintaining human warmth and trust.

// ... (rest of the prompt)
*/
}

import React from 'react';

import { HeroSection } from '@/components/features/landing/HeroSection';
import { PartnerSearch } from '@/components/shared/PartnerSearch'; // Import PartnerSearch
import { HowItWorksSection } from '@/components/features/landing/HowItWorksSection';
import { LoginEntryPoint } from '@/components/shared/LoginEntryPoint';
import { TopVendorsSection } from '@/components/features/landing/TopVendorsSection';
import { WhyYumyumSection } from '@/components/features/landing/WhyYumyumSection';
import { VisualDemoSection } from '@/components/features/landing/VisualDemoSection';
import { VendorStoriesSection } from '@/components/features/landing/VendorStoriesSection';
import { PremiumMarketingSection } from '@/components/features/landing/PremiumMarketingSection';
import { TierComparison } from '@/components/features/landing/TierComparison';
import { HowToJoinSection } from '@/components/features/landing/HowToJoinSection';
import { FaqSection } from '@/components/features/landing/FaqSection';
import { AboutSection } from '@/components/features/landing/AboutSection';
import { ConversionSection } from '@/components/features/landing/ConversionSection';
import { FooterSection } from '@/components/features/landing/FooterSection';
import { InterestCTA } from '@/components/features/landing/InterestCTA';

// ... (rest of imports)

export default function LandingPage() {
  return (
    <div>
      <LoginEntryPoint />
      <HeroSection />
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <PartnerSearch />
      </div>
      <TopVendorsSection /> {/* Add TopVendorsSection here */}
      <HowItWorksSection />
      <WhyYumyumSection />
      <VisualDemoSection />
      <VendorStoriesSection />
      <PremiumMarketingSection />
      <TierComparison />
      <HowToJoinSection />
      <FaqSection />
      <AboutSection />
      <ConversionSection />
      <FooterSection />
      <InterestCTA />
    </div>
  );
}
