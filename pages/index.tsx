import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import { HomeIcon } from "@heroicons/react/24/solid";

import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import WorkExperience from "../components/WorkExperience";
import Skills from "../components/Skills";
import Certifications from "../components/Certifications";
import Projects from "../components/Projects";
import ContactMe from "../components/ContactMe";

import { siteConfig } from "../config/site";
import { getPortfolioContent, PortfolioContent } from "../lib/content";

type Props = PortfolioContent;

const Home = ({
  pageInfo,
  experiences,
  projects,
  skills,
  socials,
  certifications,
  isMock,
}: Props) => {
  const analyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <div
      className="bg-lightBackground text-darkBlack h-screen snap-y snap-mandatory
    overflow-y-scroll overflow-x-hidden z-0 scrollbar-thin scrollbar-track-gray-400/20 scrollbar-thumb-darkGreen/80"
    >
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <title>{siteConfig.meta.title}</title>
        <meta name="description" content={siteConfig.meta.description} />
        <meta property="og:title" content={siteConfig.meta.title} />
        <meta property="og:description" content={siteConfig.meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteConfig.url} />
      </Head>

      {/* Analytics only loads if NEXT_PUBLIC_GA_MEASUREMENT_ID is set. */}
      {analyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${analyticsId}')`}
          </Script>
        </>
      )}

      {/* Demo banner disappears once Sanity is connected. */}
      {isMock && (
        <div className="sticky top-0 z-50 bg-darkGreen px-4 py-1.5 text-center text-xs text-white">
          Demo content — edit <code className="font-mono">config/site.ts</code>{" "}
          and <code className="font-mono">data/mock.json</code>, or connect Sanity.
        </div>
      )}

      <Header socials={socials} />

      <section id="hero" className="snap-start">
        <Hero pageInfo={pageInfo} />
      </section>

      {siteConfig.sections.about && (
        <section id="about" className="snap-center">
          <About pageInfo={pageInfo} />
        </section>
      )}

      {siteConfig.sections.experience && (
        <section id="experience" className="snap-center">
          <WorkExperience experiences={experiences} />
        </section>
      )}

      {siteConfig.sections.skills && (
        <section id="skills" className="snap-start">
          <Skills skills={skills} />
        </section>
      )}

      {siteConfig.sections.certifications && (
        <section id="certifications" className="snap-start">
          <Certifications certifications={certifications} />
        </section>
      )}

      {siteConfig.sections.projects && (
        <section id="projects" className="snap-start">
          <Projects projects={projects} />
        </section>
      )}

      {siteConfig.sections.contact && (
        <section id="contact" className="snap-start">
          <ContactMe />
        </section>
      )}

      <Link href="#hero">
        <footer className="sticky bottom-5 w-full cursor-pointer">
          <div className="flex items-center justify-center">
            <div className="h-10 w-10 bg-darkGreen/80 rounded-full flex items-center justify-center">
              <HomeIcon className="h-7 w-17 pb-0.5 hover:grayscale-100 text-white animate-pulse" />
            </div>
          </div>
        </footer>
      </Link>
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const content = await getPortfolioContent();
  return { props: content, revalidate: 10 };
};
