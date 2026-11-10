import { APP_NAME } from '../../utils/helpers';
import About from '../../components/landing/About';
import Cta from '../../components/landing/Cta';
import Faq from '../../components/landing/Faq';
import Features from '../../components/landing/Features';
import Hero from '../../components/landing/Hero';
import HowItWorks from '../../components/landing/HowItWorks';
import Showcase from '../../components/landing/Showcase';
import StackStrip from '../../components/landing/StackStrip';
import Testimonials from '../../components/landing/Testimonials';

export default function LandingPage() {
  return (
    <>
      <title>{`${APP_NAME} — Build web apps by chatting with AI`}</title>
      <Hero />
      <StackStrip />
      <Features />
      <HowItWorks />
      <Showcase />
      <Testimonials />
      <About />
      <Faq />
      <Cta />
    </>
  );
}
