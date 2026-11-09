import { APP_NAME } from '../../../utils/helpers';
import About from '../components/About';
import Cta from '../components/Cta';
import Faq from '../components/Faq';
import Features from '../components/Features';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Showcase from '../components/Showcase';
import StackStrip from '../components/StackStrip';
import Testimonials from '../components/Testimonials';

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
