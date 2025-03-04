
import React from "react";
import { Link } from "react-router-dom";
import ColorPalette from "./ColorPalette";
import ShadowExamples from "./ShadowExamples";
import BorderRadiusExamples from "./BorderRadiusExamples";
import TypographyExamples from "./TypographyExamples";
import FormExamples from "./FormExamples";
import InteractiveComponents from "./InteractiveComponents";

const DesignSystem: React.FC = () => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <div className="min-h-screen bg-white font-['Open_Sans']">
        <header className="bg-[var(--color-olivia-blue)] text-white p-6">
          <h1 className="text-2xl font-bold">Design System Showcase</h1>
          <p className="mt-2">
            A comprehensive guide to our UI components and styles
          </p>
          <Link to="/token-test" className="inline-block mt-2 bg-white text-[var(--color-olivia-blue)] px-4 py-1 rounded-base font-semibold text-sm hover:bg-opacity-90 transition-colors">
            View Token Test Page
          </Link>
        </header>

        <main className="container mx-auto px-4 py-8">
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6 text-[#555]">
              Introduction
            </h2>
            <p className="text-[#555] max-w-3xl">
              This design system showcases the visual elements, components, and
              styling guidelines for our application. It includes color
              palettes, shadow-base variations, border radius examples, and
              typography styles that form the foundation of our UI design.
            </p>
          </section>

          <div className="flex flex-col gap-10 p-5 max-md:p-[15px] max-sm:p-2.5 mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <ColorPalette />
              <ShadowExamples />
              <BorderRadiusExamples />
            </div>

            <div className="mt-16">
              <TypographyExamples />
            </div>
          </div>

          <div className="border-t border-[#EDEDED] pt-12">
            <FormExamples />
          </div>

          <div className="border-t border-[#EDEDED] pt-12">
            <InteractiveComponents />
          </div>
        </main>

        <footer className="bg-[var(--color-grey-fog)] border-t border-[#EDEDED] p-6 text-center text-[#555]">
          <p className="text-sm">
            © 2023 Design System Showcase. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
};

export default DesignSystem;
