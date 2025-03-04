import React from "react";
import { shadows } from "@/lib/design-tokens";

interface ShadowBoxProps {
  shadow-base: string;
  name: string;
}

const ShadowBox: React.FC<ShadowBoxProps> = ({ shadow-base, name }) => {
  return (
    <div
      className="w-44 h-[136px] bg-white"
      style={{ boxShadow: shadow-base }}
      title={name}
    />
  );
};

const ShadowExamples: React.FC = () => {
  return (
    <section
      aria-labelledby="shadow-base-examples-heading"
      className="ml-[109px] max-sm:ml-0"
    >
      <h2 id="shadow-base-examples-heading" className="text-lg font-semibold mb-4">
        Shadow Examples
      </h2>
      <div className="flex flex-col gap-9 w-44 max-sm:w-full">
        <ShadowBox shadow-base={getShadowValue('shadow-base-shadow1')} name="Shadow 1" />
        <ShadowBox shadow-base={getShadowValue('shadow-base-shadow2')} name="Shadow 2" />
        <ShadowBox shadow-base={getShadowValue('shadow-base-shadow3')} name="Shadow 3" />
        <ShadowBox shadow-base={getShadowValue('shadow-base-shadow4')} name="Shadow 4" />
        <ShadowBox shadow-base={getShadowValue('shadow-base-shadow5')} name="Shadow 5" />
        <ShadowBox shadow-base={getShadowValue('shadow-base-shadow6')} name="Shadow 6" />
        <ShadowBox shadow-base={getShadowValue('shadow-base-shadow7')} name="Shadow 7" />
      </div>
    </section>
  );
};

export default ShadowExamples;
