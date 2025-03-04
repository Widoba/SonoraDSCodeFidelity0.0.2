import React, { useState } from "react";
import { colors } from "@/lib/design-tokens";

const FormExamples: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subscription, setSubscription] = useState("monthly");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form
    if (name && email && message && agreeTerms) {
      setFormSubmitted(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setName("");
        setEmail("");
        setMessage("");
        setSubscription("monthly");
        setAgreeTerms(false);
        setFormSubmitted(false);
      }, 3000);
    }
  };

  return (
    <section aria-labelledby="form-examples-heading" className="mt-16 mb-16">
      <h2 id="form-examples-heading" className="text-xl font-semibold mb-6">
        Form Examples
      </h2>

      {formSubmitted ? (
        <div className="p-4 bg-[#E9FAF0] border border-[#39D279] rounded-base-lg mb-6">
          <p className="text-[#27AA5D] font-semibold">
            Thank you for your submission!
          </p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-semibold mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-[var(--color-grey-steel)] rounded-base focus:outline-none focus:ring-2 focus:ring-[var(--color-olivia-blue)]"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-[var(--color-grey-steel)] rounded-base focus:outline-none focus:ring-2 focus:ring-[var(--color-olivia-blue)]"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-semibold mb-1">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full p-2 border border-[var(--color-grey-steel)] rounded-base focus:outline-none focus:ring-2 focus:ring-[var(--color-olivia-blue)]"
            required
          />
        </div>

        <fieldset className="mb-4">
          <legend className="text-sm font-semibold mb-2">
            Subscription Plan
          </legend>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="subscription"
                value="monthly"
                checked={subscription === "monthly"}
                onChange={() => setSubscription("monthly")}
                className="mr-2 text-[var(--color-olivia-blue)] focus:ring-[var(--color-olivia-blue)]"
              />
              <span className="text-sm">Monthly</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="subscription"
                value="yearly"
                checked={subscription === "yearly"}
                onChange={() => setSubscription("yearly")}
                className="mr-2 text-[var(--color-olivia-blue)] focus:ring-[var(--color-olivia-blue)]"
              />
              <span className="text-sm">Yearly</span>
            </label>
          </div>
        </fieldset>

        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mr-2 text-[var(--color-olivia-blue)] focus:ring-[var(--color-olivia-blue)]"
              required
            />
            <span className="text-sm">I agree to the terms and conditions</span>
          </label>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-[var(--color-olivia-blue)] text-white font-semibold rounded-base hover:bg-[#0BB4BA] focus:outline-none focus:ring-2 focus:ring-[#0BB4BA] focus:ring-offset-2 transition-colors"
        >
          Submit
        </button>
      </form>
    </section>
  );
};

export default FormExamples;
