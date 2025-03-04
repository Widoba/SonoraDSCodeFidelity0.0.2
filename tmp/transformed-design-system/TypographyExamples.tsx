import React from "react";
import { typography } from "@/lib/design-tokens";

const TypographyExamples: React.FC = () => {
  return (
    <section
      aria-labelledby="typography-heading"
      className="ml-[599px] max-md:ml-5 max-sm:ml-0"
    >
      <h2 id="typography-heading" className="text-lg font-semibold mb-4">
        Typography Examples
      </h2>
      <div className="flex flex-col gap-[69px] w-[744px] text-[#555] max-md:w-full max-sm:gap-[30px]">
        <div className={typography.bigTitle}>Big title!</div>
        <div className={typography.header}>This is a header!</div>
        <div className={typography.smallHeader}>This is a smaller header!!</div>
        <div className={typography.bodyText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mus est
          pulvinar diam sed tortor amet eget iaculis blandit.
        </div>
        <div className={typography.clickText}>Click here</div>
        <div className={typography.clickTextSmall}>Click here too</div>
        <div className={typography.inlineLink}>Inline link</div>
        <div className={typography.subtitle}>For smaller subtitles.</div>
        <div className={typography.uppercaseSubtitle}>
          Subtitle with uppercase twist.
        </div>
        <div className={typography.valueText}>Add some values</div>
        <div className={typography.contentText}>Put some content here</div>
        <div className={typography.welcomeText}>Hi Cory, Welcome Back!</div>
        <div className={typography.avatarLabel}>Avatar label</div>
        <div className={typography.welcomeTextSmall}>
          Hi Cory, Welcome Back!
        </div>
        <div className={typography.welcomeTextMedium}>
          Hi Cory, Welcome Back!
        </div>
      </div>
    </section>
  );
};

export default TypographyExamples;
