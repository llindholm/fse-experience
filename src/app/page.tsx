"use client";

import Insight from "@/components/Insight";
import EnrollmentPrompt from "@/components/EnrollmentPrompt";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const pressureItems = [
  "Post more.",
  "Show up more.",
  "Teach more.",
  "Launch more.",
  "Give more.",
  "Build a bigger audience.",
];

const recognitionMoments = [
  "You’ve done everything they told you to do.",
];

const transformationStories = [
  {
    belief: "Results can move quickly when the message finally lands.",
    title: "$16K in seven days.",
    quote:
      "I landed two high-ticket clients in one week, and they both paid in full.",
    name: "Gagan | FSE Client",

    result: "2 clients · paid in full",
  },
  {
    belief: "Premium sales do not have to begin with a sales call.",
    title: "The content did the heavy lifting.",
    quote:
      "I sold a $15K package one week after implementing the strategy. No sales call. No pitch. Just premium content that did the heavy lifting for me.",
    name: "FSE Client",

    result: "$15K · no sales call",
  },
  {
    belief: "The right content keeps working after it is posted.",
    title: "Every post became stronger.",
    quote:
      "My content keeps compounding. Every post does even better than the last.",
    name: "FSE Client",

    result: "2 signups already",
  },
  {
    belief: "The biggest result is often how the business begins to feel.",
    title: "It finally felt scalable—and simple.",
    quote:
      "I’ve done a lot of programs, but nothing has ever pulled together content, sales, offers, and messaging like this.",
    name: "FSE Client",

    result: "No more starting over",
  },
];

const fitStatements = [
  "You have meaningful work—and know it should be selling more consistently.",
  "You're tired of rebuilding momentum every time you want to make an offer.",
  "You want premium buyers without performing online all day.",
  "You are ready to refine what already exists instead of starting your business over.",
];

const enrollmentIncludes = [
  {
    title: "Million Dollar Authority™",
    description:
      "Position your work as the obvious choice through premium messaging, identity, and authority.",
  },
  {
    title: "Effortless Sales System™",
    description:
      "Create a sustainable content rhythm that builds recognition, trust, and buyer readiness.",
  },
  {
    title: "The Signature Close™",
    description:
      "Connect your offers and sales pathways into an ecosystem that sells without constant launching.",
  },
  {
    title: "Results Companion",
    description:
      "Turn each teaching into decisions, completed assets, and implementation inside your actual business.",
  },
];

const invitationFaqs = [
  {
    question: "Do I need a large audience for this to work?",
    answer:
      "No. Feminine Sales Engine is designed to help the right buyers understand your authority and move toward your offers. The focus is not becoming visible to everyone—it is becoming unmistakable to the people your work is for.",
  },
  {
    question: "What if I already have offers and content?",
    answer:
      "That is ideal. This is not about discarding everything you have built. You will refine your positioning, strengthen your message, and connect the pieces of your existing business so they work together.",
  },
  {
    question: "Is this only for business coaches?",
    answer:
      "No. The principles apply to experts, coaches, consultants, creators, and service-based business owners whose clients are buying meaningful transformation—not simply information.",
  },
  {
    question: "How quickly can I begin using what I learn?",
    answer:
      "You can begin making changes immediately. Each part of the experience is designed to lead toward implementation, and the Results Companion helps you apply the work directly to your messaging, content, offers, and sales system.",
  },
  {
    question: "Do I need paid advertising?",
    answer:
      "No. The system can support an organic business, paid traffic, or a combination of both. The foundation is strong messaging and buyer-led sales architecture—not dependence on a particular traffic source.",
  },
];

export default function Home() {

  const demandSectionRef = useRef<HTMLElement>(null);
  const [activeThought, setActiveThought] = useState(0);

  useEffect(() => {
    const updateActiveThought = () => {
      const section = demandSectionRef.current;

      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();

      const scrollableDistance =
        section.offsetHeight - window.innerHeight;

      if (scrollableDistance <= 0) {
        return;
      }

      const progress = Math.min(
        Math.max(-rect.top / scrollableDistance, 0),
        1
      );

      const nextThought = Math.min(
        Math.floor(progress * 4),
        3
      );

      setActiveThought(nextThought);
    };

    updateActiveThought();

    window.addEventListener("scroll", updateActiveThought, {
      passive: true,
    });

    window.addEventListener("resize", updateActiveThought);

    return () => {
      window.removeEventListener("scroll", updateActiveThought);
      window.removeEventListener("resize", updateActiveThought);
    };
  }, []);

  return (
    <main>
      <nav className="site-nav">
        <a href="#top" className="brand">
          TO LIVING FREE
        </a>

        <a href="#chapter-one" className="nav-link">
          Feminine Sales Engine
        </a>
      </nav>

      <EnrollmentPrompt />

      <aside className="chapter-marker" aria-hidden="true">
        <span>01</span>
        <div className="chapter-marker-line" />
        <span>Recognition</span>
      </aside>

      <section id="top" className="hero">
        <div className="hero-light hero-light-one" />
        <div className="hero-light hero-light-two" />

        <div className="hero-content">
          <Insight delay={0.1} distance={18}>
            <p className="eyebrow">THE FEMININE SALES ENGINE</p>
          </Insight>

          <Insight delay={0.25} distance={26}>
            <h1>
              The way you’ve been taught
              <span>to sell online...</span>
              is exactly why selling
              <span>feels so hard.</span>
            </h1>
          </Insight>
        </div>

        <a href="#chapter-one" className="scroll-cue">
          <span>Begin</span>
          <span className="scroll-line" />
        </a>
      </section>

      <section id="chapter-one" className="recognition-sequence">
        <div className="chapter-introduction">
          <Insight>
            <div className="chapter-heading chapter-heading-1">
              <div className="chapter-number">
                <span>01</span>
                <div className="chapter-line" />
              </div>

              <h2>
                Something isn't
                <span> adding up.</span>
              </h2>
            </div>
          </Insight>
        </div>

        {recognitionMoments.map((moment, index) => (

          <article
            className={`recognition-moment recognition-moment-${index + 1}`}
            key={moment}
          >
            <Insight
              className="recognition-insight"
              delay={0.05}

            >


              <p>{moment}</p>
            </Insight>
          </article>
        ))}
        <article className="recognition-stack">
          <div className="recognition-stack-inner">
            <div className="recognition-stack-lines">
              <Insight delay={0.12} distance={18}>
                <p>You’ve been consistent.</p>
              </Insight>

              <Insight delay={0.62} distance={18}>
                <p>You’ve shown up.</p>
              </Insight>

              <Insight delay={1.12} distance={18}>
                <p>You’ve given value.</p>
              </Insight>
            </div>
          </div>
        </article>
        <article className="recognition-moment recognition-question">
          <Insight
            className="recognition-insight"

          >
            <p>
              So why does selling still feel
              <span>harder than it should?</span>
            </p>
          </Insight>
        </article>
      </section>

      <section className="pressure-section">
        <div className="pressure-introduction">
          <Insight>
            <p>Everywhere you look...</p>
          </Insight>

          <Insight delay={0.12}>
            <h2>
              You’re told
              <span>to do more.</span>
            </h2>
          </Insight>
        </div>

        <div className="pressure-list">
          {pressureItems.map((item, index) => (
            <Insight
              key={item}
              delay={index * 0.06}

            >
              <div className="pressure-item">
                <span>0{index + 1}</span>
                <p>{item}</p>
              </div>
            </Insight>
          ))}
        </div>
      </section>

      <section className="demand-question">
        <div className="demand-question-inner">
          <Insight>
            <p>But what if...</p>
          </Insight>

          <Insight delay={0.15}>
            <h2>
              none of those
              <span>actually create demand?</span>
            </h2>
          </Insight>
        </div>
      </section>

      <section className="narrative-bridge">
        <Insight>
          <p className="bridge-opening">
            What if doing more
            <span>isn’t the answer?</span>
          </p>
        </Insight>

        <div className="bridge-pause" aria-hidden="true">
          <span />
        </div>

        <Insight delay={0.12}>
          <p className="bridge-question">
            Then what actually creates sales?
          </p>
        </Insight>

        <a
          href="#chapter-two"
          className="bridge-scroll-cue"
          aria-label="Continue to Authority Changes Everything"
        >
          <span>Continue</span>
          <i aria-hidden="true" />
        </a>
      </section>
      <section id="chapter-two" className="authority-chapter">
        <div className="authority-opening">
          <Insight>
            <div className="chapter-heading chapter-heading-2">
              <div className="chapter-number">
                <span>02</span>
                <div className="chapter-line" />
              </div>

              <h2>
                Authority changes
                <span>everything.</span>
              </h2>
            </div>
          </Insight>
        </div>

        <article className="authority-moment authority-belief">
          <Insight className="authority-insight">
            <p className="authority-small">You’ve been told...</p>

            <h2>
              visibility
              <span>creates sales.</span>
            </h2>
          </Insight>
        </article>

        <article className="authority-moment authority-correction">
          <Insight className="authority-insight">
            <p>
              But being seen
              <span>is not the same as being chosen.</span>
            </p>
          </Insight>
        </article>

        <section className="attention-sequence">
          <Insight>
            <p className="attention-intro">You can be...</p>
          </Insight>

          <div className="attention-words">
            <Insight>
              <p>Followed.</p>
            </Insight>

            <Insight delay={0.08}>
              <p>Liked.</p>
            </Insight>

            <Insight delay={0.16}>
              <p>Known.</p>
            </Insight>
          </div>

          <Insight delay={0.22} className="attention-conclusion">
            <h2>
              And still be treated
              <span>like one of many options.</span>
            </h2>
          </Insight>
        </section>

        <article className="authority-moment authority-definition">
          <Insight className="authority-insight">
            <p className="authority-small">Authority begins the moment...</p>

            <h2>
              your perspective changes
              <span>how they see the problem.</span>
            </h2>
          </Insight>
        </article>

        <article className="authority-moment authority-consequence">
          <Insight className="authority-insight">
            <p>
              You stop becoming
              <span>another person who can help.</span>
            </p>
          </Insight>
        </article>

        <article className="authority-moment authority-choice">
          <Insight className="authority-insight">
            <p>
              You become
              <span>the person they trust to lead them.</span>
            </p>
          </Insight>
        </article>

        <section className="narrative-bridge">
          <Insight>
            <p className="identity-small">You do not need everyone to see you.</p>
            <p className="bridge-opening">


              <span>You need the right people to see you differently.</span>
            </p>
          </Insight>

          <div className="bridge-pause" aria-hidden="true">
            <span />
          </div>

          <Insight delay={0.12}>
            <p className="bridge-question">
              So what makes the right person recognize herself in your message?
            </p>
          </Insight>

          <a
            href="#chapter-three"
            className="bridge-scroll-cue"
            aria-label="Continue to Identity Before Strategy"
          >
            <span>Continue</span>
            <i aria-hidden="true" />
          </a>
        </section>
      </section>
      <section id="chapter-three" className="identity-chapter">
        <div className="identity-opening">
          <Insight>
            <div className="chapter-heading chapter-heading-3">
              <div className="chapter-number">
                <span>03</span>
                <div className="chapter-line" />
              </div>

              <h2>
                Identity before
                <span>strategy.</span>
              </h2>
            </div>
          </Insight>
        </div>

        <article className="identity-moment identity-result">
          <Insight className="identity-insight">
            <p className="identity-small">
              Your client does want the result.
            </p>

            <h2>
              More clients.
              <span>More money.</span>
              More freedom.
            </h2>
          </Insight>
        </article>

        <article className="identity-moment identity-deeper">
          <Insight className="identity-insight">
            <p>
              But the result is not
              <span>the deepest desire.</span>
            </p>
          </Insight>
        </article>

        <section className="outcome-identity-sequence">
          <div className="outcome-beat">
            <Insight>
              <p className="identity-sequence-label">Outcome</p>
            </Insight>

            <Insight delay={0.08}>
              <h2>What she wants to have.</h2>
            </Insight>
          </div>

          <div className="identity-divider" aria-hidden="true">
            <span />
          </div>

          <div className="identity-beat">
            <Insight delay={0.16}>
              <p className="identity-sequence-label">Identity</p>
            </Insight>

            <Insight delay={0.24}>
              <h2>
                Who she believes
                <span>she is becoming.</span>
              </h2>
            </Insight>
          </div>
        </section>

        <article className="identity-moment identity-old-message">
          <Insight className="identity-insight">
            <p className="identity-small">
              Most marketing speaks to her current struggle.
            </p>

            <h2>
              'You feel stuck.'
              <span>'You need more clients.'</span>
              'You need help.'
            </h2>
          </Insight>
        </article>

        <article className="identity-moment identity-new-message">
          <Insight className="identity-insight">
            <p className="identity-small">
              Premium messaging speaks to the woman emerging.
            </p>

            <h2>
              The leader.
              <span>The authority.</span>
              The obvious choice.
            </h2>
          </Insight>
        </article>

        <article className="identity-moment identity-activation">
          <Insight className="identity-insight">
            <p>
              You are not convincing her
              <span>to become someone else.</span>
            </p>
          </Insight>
        </article>

        <article className="identity-moment identity-recognition">
          <Insight className="identity-insight">
            <p>
              You are helping her recognize
              <span>the woman she already knows she can be.</span>
            </p>
          </Insight>
        </article>

        <section className="narrative-bridge">
          <Insight>
            <p className="bridge-opening">
              Your offer stops feeling optional.
              <span>It begins to feel inevitable.</span>
            </p>
          </Insight>

          <div className="bridge-pause" aria-hidden="true">
            <span />
          </div>

          <Insight delay={0.12}>
            <p className="bridge-question">
              So when does the decision to buy actually begin?
            </p>
          </Insight>

          <a
            href="#chapter-four"
            className="bridge-scroll-cue"
            aria-label="Continue to Demand Before the Offer"
          >
            <span>Continue</span>
            <i aria-hidden="true" />
          </a>
        </section>
      </section>
      <section id="chapter-four" className="demand-chapter">
        <div className="demand-opening">
          <Insight>
            <div className="chapter-heading chapter-heading-4">
              <div className="chapter-number">
                <span>04</span>
                <div className="chapter-line" />
              </div>

              <h2>
                Demand is created
                <span>before the offer.</span>
              </h2>
            </div>
          </Insight>
        </div>

        <article className="demand-moment demand-promotion">
          <Insight className="demand-insight">
            <p className="demand-small">
              Most businesses wait until it's time to sell.
            </p>

            <h2>
              Then suddenly...
              <span>they start creating urgency.</span>
            </h2>
          </Insight>
        </article>

        <article className="demand-moment demand-pressure">
          <Insight className="demand-insight">
            <p>
              More emails.
              <span>More posts.</span>
              More pressure.
            </p>
          </Insight>
        </article>

        <article className="demand-moment demand-correction">
          <Insight className="demand-insight">
            <p>
              But demand does not begin
              <span>when the doors open.</span>
            </p>
          </Insight>
        </article>

        <section
          ref={demandSectionRef}
          className="demand-build-sequence"
        >
          <div className="demand-build-sticky">
            <Insight>
              <p className="demand-sequence-intro">
                Demand begins every time your message makes someone think...
              </p>
            </Insight>

            <div className="demand-thoughts">
              <p className={activeThought === 0 ? "active" : ""}>
                She understands me.
              </p>

              <p className={activeThought === 1 ? "active" : ""}>
                She sees what I couldn’t see.
              </p>

              <p className={activeThought === 2 ? "active" : ""}>
                She’s naming the real problem.
              </p>

              <p className={activeThought === 3 ? "active" : ""}>
                I trust where she is leading me.
              </p>
            </div>
          </div>
        </section>

        <article className="demand-moment demand-before-cta">
          <Insight className="demand-insight">
            <p>
              By the time you make the offer...
              <span>the decision to buy has begun.</span>
            </p>
          </Insight>
        </article>

        <article className="demand-moment demand-content">
          <Insight className="demand-insight">
            <p className="demand-small">
              Your content is not there to fill the space between promotions.
            </p>

            <h2>
              It's there to build
              <span>belief, trust, and readiness.</span>
            </h2>
          </Insight>
        </article>

        <article className="demand-moment demand-system">
          <Insight className="demand-insight">
            <p>
              Every message should make
              <span>the next yes easier.</span>
            </p>
          </Insight>
        </article>

        <section className="narrative-bridge">
          <Insight>
            <p className="bridge-opening">
              Demand isn't created
              <span>when you make the offer.</span>
            </p>
          </Insight>

          <div className="bridge-pause" aria-hidden="true">
            <span />
          </div>

          <Insight delay={0.12}>
            <p className="bridge-question">
              So what does that system actually look like?
            </p>
          </Insight>

          <a
            href="#chapter-five"
            className="bridge-scroll-cue"
            aria-label="Continue to The Feminine Sales Engine"
          >
            <span>Continue</span>
            <i aria-hidden="true" />
          </a>
        </section>
      </section>


      <section id="chapter-five" className="engine-chapter">
        <div className="engine-opening">
          <Insight>
            <div className="chapter-heading chapter-heading-5">
              <div className="chapter-number">
                <span>05</span>
                <div className="chapter-line" />
              </div>

              <h2>
                The Feminine
                <span>Sales Engine.</span>
              </h2>
            </div>
          </Insight>

          <Insight delay={0.22}>
            <p className="chapter-subtitle">
              The complete framework behind effortless sales.
            </p>
          </Insight>
        </div>

        <article className="engine-moment engine-pieces">
          <Insight className="engine-insight">
            <p className="engine-small">
              You've probably already built many of the pieces.
            </p>

            <h2>
              The offer.
              <span>The content.</span>
              The emails.
            </h2>
          </Insight>
        </article>

        <article className="engine-moment engine-fragmented">
          <Insight className="engine-insight">
            <p>
              The problem isn't always
              <span>that something is missing.</span>
            </p>
          </Insight>
        </article>

        <article className="engine-moment engine-connection">
          <Insight className="engine-insight">
            <p>
              It's that <span>nothing is</span>
              <span>working together.</span>
            </p>
          </Insight>
        </article>

        <section className="engine-assembly">
          <Insight>
            <p className="engine-assembly-intro">
              What changes when every part of your business begins moving the buyer
              in the same direction?
            </p>
          </Insight>

          <div className="engine-layers">
            <Insight className="engine-layer">
              <span>01</span>
              <p>Messaging creates recognition.</p>
            </Insight>

            <Insight className="engine-layer" delay={0.08}>
              <span>02</span>
              <p>Content builds authority.</p>
            </Insight>

            <Insight className="engine-layer" delay={0.16}>
              <span>03</span>
              <p>Your offer activates desire.</p>
            </Insight>

            <Insight className="engine-layer" delay={0.24}>
              <span>04</span>
              <p>Your sales system meets readiness.</p>
            </Insight>
          </div>
        </section>

        <article className="engine-moment engine-reveal">
          <Insight className="engine-insight">
            <p className="engine-small">This is the Feminine Sales Engine.</p>

            <h2>
              Not another tactic.
              <span>A complete sales ecosystem.</span>
            </h2>
          </Insight>
        </article>

        <article className="engine-moment engine-not-pressure">
          <Insight className="engine-insight">
            <p>
              It does not depend on
              <span>pressure, performance, or perfect timing.</span>
            </p>
          </Insight>
        </article>

        <article className="engine-moment engine-readiness">
          <Insight className="engine-insight">
            <p className="engine-small">
              Instead of pushing every person toward the same decision...
            </p>

            <h2>
              It meets the right buyer
              <span>with the right offer, at the right time.</span>
            </h2>
          </Insight>
        </article>

        <section className="engine-rhythm">
          <Insight>
            <p className="engine-rhythm-intro">
              Your business stops resetting every time you want to sell.
            </p>
          </Insight>

          <div className="engine-rhythm-words">
            <Insight>
              <p>It builds.</p>
            </Insight>

            <Insight delay={0.08}>
              <p>It compounds.</p>
            </Insight>

            <Insight delay={0.16}>
              <p>It keeps moving.</p>
            </Insight>
          </div>
        </section>

        <section className="narrative-bridge">
          <Insight>
            <p className="bridge-opening">
              You don't need more strategies.
              <span>You need a system that creates demand.</span>
            </p>
          </Insight>

          <div className="bridge-pause" aria-hidden="true">
            <span />
          </div>

          <Insight delay={0.12}>
            <p className="bridge-question">
              What happens when your business begins to work this way?
            </p>
          </Insight>

          <a
            href="#chapter-six"
            className="bridge-scroll-cue"
            aria-label="Continue"
          >
            <span>Continue</span>
            <i aria-hidden="true" />
          </a>
        </section>
      </section>
      <section id="chapter-six" className="possibility-chapter">
        <div className="possibility-opening">
          <Insight>
            <div className="chapter-heading chapter-heading-6">
              <div className="chapter-number">
                <span>06</span>
                <div className="chapter-line" />
              </div>

              <h2>
                Here's what
                <span>happens.</span>
              </h2>
            </div>
          </Insight>

          <Insight delay={0.22}>
            <p className="chapter-subtitle">
              When demand begins working for you, everything else changes.
            </p>
          </Insight>
        </div>

        <article className="possibility-moment possibility-clients">
          <Insight className="possibility-insight">
            <p className="possibility-small">Imagine waking up...</p>

            <h2>
              without wondering
              <span>where your next client is coming from.</span>
            </h2>
          </Insight>
        </article>

        <article className="possibility-moment possibility-social">
          <Insight className="possibility-insight">
            <p className="possibility-small">Imagine opening Instagram...</p>

            <h2>
              because you want to connect.
              <span>Not because you feel obligated to perform.</span>
            </h2>
          </Insight>
        </article>

        <article className="possibility-moment possibility-launch">
          <Insight className="possibility-insight">
            <p className="possibility-small">Imagine creating an offer...</p>

            <h2>
              without wondering
              <span>if anyone will buy.</span>
            </h2>
          </Insight>
        </article>

        <article className="possibility-moment possibility-life">
          <Insight className="possibility-insight">
            <p className="possibility-small">Imagine knowing...</p>

            <h2>
              your business keeps working
              <span>while you are living your life.</span>
            </h2>
          </Insight>
        </article>

        <section className="possibility-reframe">
          <Insight>
            <p>This isn't only about selling more.</p>
          </Insight>

          <Insight delay={0.14}>
            <h2>
              It's about
              <span>living differently.</span>
            </h2>
          </Insight>
        </section>

        <section className="possibility-words">
          <article className="possibility-word">
            <Insight>
              <p>More peace.</p>
            </Insight>
          </article>

          <article className="possibility-word">
            <Insight>
              <p>More confidence.</p>
            </Insight>
          </article>

          <article className="possibility-word">
            <Insight>
              <p>More freedom.</p>
            </Insight>
          </article>

          <article className="possibility-word">
            <Insight>
              <p>More trust.</p>
            </Insight>
          </article>

          <article className="possibility-word possibility-word-final">
            <Insight>
              <p>More life.</p>
            </Insight>
          </article>
        </section>

        <section className="possibility-purpose">
          <Insight>
            <p>This is why</p>
          </Insight>

          <Insight delay={0.12}>
            <h2>
              Feminine Sales Engine
              <span>exists.</span>
            </h2>
          </Insight>
        </section>

        <section className="narrative-bridge">
          <Insight>
            <p className="bridge-opening">
              Your business becomes
              <span>a source of freedom.</span>
            </p>
          </Insight>

          <div className="bridge-pause" aria-hidden="true">
            <span />
          </div>

          <Insight delay={0.12}>
            <p className="bridge-question">
              So what does that actually look like in real life?
            </p>
          </Insight>

          <a
            href="#chapter-seven"
            className="bridge-scroll-cue"
            aria-label="Continue"
          >
            <span>Continue</span>
            <i aria-hidden="true" />
          </a>
        </section>
      </section>
      <section id="chapter-seven" className="inside-chapter">
        <div className="inside-opening">
          <Insight>
            <div className="chapter-heading chapter-heading-7">
              <div className="chapter-number">
                <span>07</span>
                <div className="chapter-line" />
              </div>

              <h2>
                Inside the
                <span>experience.</span>
              </h2>
            </div>
          </Insight>

          <Insight delay={0.22}>
            <p className="chapter-subtitle">
              Here's what you'll find inside Feminine Sales Engine.
            </p>
          </Insight>
        </div>

        <section className="inside-map">
          <Insight>
            <p className="inside-map-intro">
              Three connected systems.
              One self-selling business.
            </p>
          </Insight>

          <div className="inside-map-path">
            <Insight className="inside-map-step">
              <span>01</span>

              <div>
                <p>Positioning</p>
                <h3>Become the obvious choice.</h3>
              </div>
            </Insight>

            <Insight className="inside-map-step" delay={0.08}>
              <span>02</span>

              <div>
                <p>Demand</p>
                <h3>Make every message build readiness.</h3>
              </div>
            </Insight>

            <Insight className="inside-map-step" delay={0.16}>
              <span>03</span>

              <div>
                <p>Conversion</p>
                <h3>Turn attention into a natural next yes.</h3>
              </div>
            </Insight>
          </div>
        </section>

        <article className="program-chapter program-authority">
          <div className="program-number" aria-hidden="true">
            01
          </div>

          <Insight className="program-content">
            <p className="program-label">Positioning + Messaging</p>

            <h2>
              Million Dollar
              <span>Authority™</span>
            </h2>

            <p className="program-promise">
              Clarify the problem your work owns, sharpen your message, and position
              your mastery so premium buyers understand why it has to be you.
            </p>

            <div className="program-outcomes">
              <p>Your million-dollar message</p>
              <p>Your highest-cost problem</p>
              <p>Your premium positioning</p>
              <p>Your pre-sell messaging angles</p>
            </div>
          </Insight>
        </article>

        <section className="program-transition">
          <Insight>
            <p>
              Once your message makes you
              <span>the obvious choice...</span>
            </p>
          </Insight>
        </section>

        <article className="program-chapter program-content-system">
          <div className="program-number" aria-hidden="true">
            02
          </div>

          <Insight className="program-content">
            <p className="program-label">Content + Visibility</p>

            <h2>
              Effortless Sales
              <span>System™</span>
            </h2>

            <p className="program-promise">
              Build a sustainable content rhythm in which every message has a job:
              create recognition, demonstrate authority, and move buyers closer.
            </p>

            <div className="program-outcomes">
              <p>Your what-to-post rhythm</p>
              <p>Your buyer-led content sequence</p>
              <p>Your repeatable authority assets</p>
              <p>Your always-on demand engine</p>
            </div>
          </Insight>
        </article>

        <section className="program-transition program-transition-dark">
          <Insight>
            <p>
              Once your content has created
              <span>belief and readiness...</span>
            </p>
          </Insight>
        </section>

        <article className="program-chapter program-close-system">
          <div className="program-number" aria-hidden="true">
            03
          </div>

          <Insight className="program-content">
            <p className="program-label">Offers + Conversion</p>

            <h2>
              The Signature
              <span>Close™</span>
            </h2>

            <p className="program-promise">
              Connect your offers, emails, sales pages, and buyer pathways into one
              sales architecture that keeps working without another launch.
            </p>

            <div className="program-outcomes">
              <p>Your complete ecosystem map</p>
              <p>Your high-converting micro offer</p>
              <p>Your bridge and promo sequences</p>
              <p>Your signature offer sales path</p>
            </div>
          </Insight>
        </article>

        <section className="companion-section">
          <div className="companion-orbit" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <Insight className="companion-content">
            <p className="companion-label">
              Knowledge is not the finish line.
            </p>

            <h2>
              Meet your
              <span>Results Companion.</span>
            </h2>

            <p className="companion-copy">
              As you move through FSE, the companion helps you apply each lesson to
              your actual business—turning the teaching into clear decisions,
              completed messaging, content, and sales assets.
            </p>
          </Insight>
        </section>

        <section className="implementation-sequence">
          <Insight>
            <p className="implementation-intro">
              You will not be left wondering what to do with what you learned.
            </p>
          </Insight>

          <div className="implementation-moments">
            <Insight>
              <p>See the shift.</p>
            </Insight>

            <Insight delay={0.16}>
              <p>Everything else starts working together.</p>
            </Insight>

          </div>
        </section>

        <section className="access-section">
          <Insight>
            <p className="access-kicker">Built for strategic simplicity</p>
          </Insight>

          <div className="access-list">
            <Insight className="access-item">
              <p>Clear direction</p>
              <span>
                Know exactly what to focus on next - without hours of unnecessary
                content.
              </span>
            </Insight>

            <Insight className="access-item" delay={0.08}>
              <p>Reusable assets</p>
              <span>
                Messaging, content, emails, and sales structures that keep working
                long after you create them.
              </span>
            </Insight>

            <Insight className="access-item" delay={0.16}>
              <p>Lifetime access</p>
              <span>
                Return to the system whenever your offers, positioning, or business
                evolve.
              </span>
            </Insight>

            <Insight className="access-item" delay={0.24}>
              <p>A system that grows with you</p>
              <span>
                Use the architecture again as you refine, expand, and create what
                comes next.
              </span>
            </Insight>
          </div>
        </section>

        <section className="narrative-bridge">
          <Insight>
            <p className="bridge-opening">
              This isn't just about
              <span>what you'll discover.</span>
            </p>
          </Insight>

          <div className="bridge-pause" aria-hidden="true">
            <span />
          </div>

          <Insight delay={0.12}>
            <p className="bridge-question">
              So what happens when women begin building their businesses this way?
            </p>
          </Insight>

          <a
            href="#chapter-eight"
            className="bridge-scroll-cue"
            aria-label="Continue"
          >
            <span>Continue</span>
            <i aria-hidden="true" />
          </a>
        </section>
      </section>
      <section id="chapter-eight" className="proof-chapter">
        <div className="proof-opening">
          <Insight>
            <div className="chapter-heading chapter-heading-8">
              <div className="chapter-number">
                <span>08</span>
                <div className="chapter-line" />
              </div>

              <h2>
                The results
                <span>speak.</span>
              </h2>
            </div>
          </Insight>
        </div>

        <section className="proof-reframe">
          <Insight>
            <p>Proof isn't just the revenue.</p>
          </Insight>

          <Insight delay={0.12}>
            <h2>
              It's the woman
              <span>who created it.</span>
            </h2>
          </Insight>
        </section>

        <div className="story-sequence">
          {transformationStories.map((story, index) => (
            <article
              className={`story-chapter story-chapter-${index + 1}`}
              key={story.title}
            >
              <div className="story-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </div>

              <Insight className="story-content">
                <p className="story-belief">{story.belief}</p>

                <h2>{story.title}</h2>

                <blockquote>
                  <p>“{story.quote}”</p>
                </blockquote>

                <div className="story-person">
                  <div className="story-person-copy">
                    <p>{story.name}</p>

                  </div>

                  <strong className="story-result">{story.result}</strong>
                </div>
              </Insight>
            </article>
          ))}
        </div>

        <section className="proof-pattern">
          <Insight>
            <p className="proof-pattern-intro">
              Different businesses. Different offers. The same underlying shift.
            </p>
          </Insight>

          <div className="proof-pattern-lines">
            <Insight>
              <p>The message became clear.</p>
            </Insight>

            <Insight delay={0.08}>
              <p>The buyer became certain.</p>
            </Insight>

            <Insight delay={0.16}>
              <p>The decision became easy.</p>
            </Insight>

            <Insight delay={0.24}>
              <p>The business became light.</p>
            </Insight>
          </div>
        </section>

        <section className="proof-final-shift">
          <Insight>
            <p>Now that you've seen what the system changes...</p>
          </Insight>

          <Insight delay={0.12}>
            <h2>
              The only question left is
              <span>what it could change for you.</span>
            </h2>
          </Insight>
        </section>

        <section className="narrative-bridge narrative-bridge-final">
          <Insight>
            <p className="bridge-opening">
              This is what happens
              <span>when demand begins working for you.</span>
            </p>
          </Insight>

          <div className="bridge-pause" aria-hidden="true">
            <span />
          </div>

          <Insight delay={0.12}>
            <p className="bridge-question">
              Are you ready?
            </p>
          </Insight>

          <a href="#chapter-nine" className="bridge-scroll-cue">
            <span>Continue</span>
            <i />
          </a>
        </section>
      </section>
      <section id="chapter-nine" className="invitation-chapter">
        <div className="invitation-opening">
          <Insight>
            <div className="chapter-heading chapter-heading-9">

              <div className="chapter-number">
                <span>09</span>
                <div className="chapter-line" />
              </div>

              <h2>
                Your
                <span>invitation.</span>
              </h2>

            </div>
          </Insight>
        </div>

        <section className="invitation-readiness">
          <Insight>
            <p className="invitation-small">
              Feminine Sales Engine is for the woman who knows...
            </p>
          </Insight>

          <div className="fit-statements">
            {fitStatements.map((statement, index) => (
              <Insight
                className="fit-statement"
                delay={index * 0.06}
                key={statement}
              >
                <span>0{index + 1}</span>
                <p>{statement}</p>
              </Insight>
            ))}
          </div>
        </section>

        <section className="invitation-not-for">
          <Insight className="invitation-not-for-content">
            <p className="invitation-small">This is not for you if...</p>

            <h2>
              You are looking for another quick tactic
              <span>without changing the way your business sells.</span>
            </h2>
          </Insight>
        </section>

        <section className="enrollment-summary">
          <Insight>
            <p className="enrollment-kicker">Your complete FSE experience</p>
          </Insight>

          <Insight delay={0.1}>
            <h2>
              Everything connects.
              <span>Nothing exists in isolation.</span>
            </h2>
          </Insight>

          <div className="enrollment-includes">
            {enrollmentIncludes.map((item, index) => (
              <Insight
                className="enrollment-item"
                delay={index * 0.06}
                key={item.title}
              >
                <span>0{index + 1}</span>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </Insight>
            ))}
          </div>
        </section>

        <section className="jess-proof">
          <div className="jess-proof-inner">
            <Insight className="jess-proof-heading">
              <p className="jess-proof-label">
                Built from a business,
                <span>not a theory.</span>
              </p>
            </Insight>

            <div className="jess-proof-editorial">
              <Insight className="jess-proof-portrait" distance={20}>
                <div className="jess-proof-image">
                  <Image
                    src="/images/jess-fse-editorial.png"
                    alt="Jessica Caver Lindholm, creator of Feminine Sales Engine"
                    fill
                    sizes="(max-width: 800px) 88vw, 42vw"
                  />
                </div>
              </Insight>

              <Insight
                className="jess-proof-content"
                delay={0.14}
                distance={24}
              >
                <h2>
                  I didn't build Feminine Sales Engine because women needed
                  <span>another marketing method.</span>
                </h2>

                <div className="jess-proof-letter">
                  <p>
                    I built it because I was tired of watching brilliant women feel
                    like they had to constantly perform just to keep their businesses
                    alive.
                  </p>

                  <p className="jess-proof-rhythm">
                    I wanted selling to become quieter.
                  </p>

                  <p className="jess-proof-rhythm">
                    I wanted demand to become steadier.
                  </p>

                  <p className="jess-proof-rhythm">
                    I built the system I wanted to exist.
                  </p>

                  <p className="jess-proof-closing">
                    Now it's yours to step into.
                  </p>
                </div>

                <p className="jess-proof-signature">
                  JESSICA CAVER LINDHOLM
                </p>

                <section className="checkout-divider">
                  <div className="divider-line" />
                </section>

                <p className="jess-proof-founder">
                  Founder · To Living Free
                </p>
              </Insight>
            </div>
          </div>
        </section>

        <section id="enrollment" className="offer-section">
          <div className="offer-atmosphere" aria-hidden="true">
            <span />
            <span />
          </div>

          <Insight className="offer-content">
            <p className="offer-label">Enroll in Feminine Sales Engine</p>

            <h2>
              Build the business
              <span>that sells for you.</span>
            </h2>

            <p className="offer-description">
              Receive the complete Feminine Sales Engine curriculum, implementation
              experience, reusable business assets, and lifetime access.
            </p>

            <div className="offer-price">
              <p>Enrollment</p>

              {/* Replace with the confirmed current price */}
              <strong>$1,497</strong>

              {/* Replace or remove when the payment plan is confirmed */}
              <span>or 3 monthly payments of $597</span>
            </div>

            <a
              className="primary-enrollment-button"
              href="https://course.tolivingfree.com/fse-experience-checkout"
              aria-label="Enroll in Feminine Sales Engine"
            >
              <span>Enter Feminine Sales Engine</span>
              <span aria-hidden="true">→</span>
            </a>

            <Insight delay={0.3}>
              <p className="final-note">
                <span>Your message. Your authority. Your offers.</span>
                <span>Built to sell for you.</span>
              </p>
            </Insight>
          </Insight>
        </section>



        <section className="after-enrollment">
          <Insight>
            <p className="after-enrollment-kicker">The moment you enroll...</p>
          </Insight>

          <div className="after-enrollment-sequence">
            <Insight>
              <p>The entire FSE experience is yours.</p>
            </Insight>

            <Insight delay={0.08}>
              <p>One complete system.</p>
            </Insight>


            <Insight delay={0.24}>
              <p>
                Designed to keep working for you.
              </p>
            </Insight>
          </div>
        </section>

        <section className="faq-section">
          <Insight>
            <p className="faq-kicker">Before you decide</p>
          </Insight>

          <Insight delay={0.1}>
            <h2>
              Questions deserve
              <span>clear answers.</span>
            </h2>
          </Insight>

          <div className="faq-list">
            {invitationFaqs.map((faq, index) => (
              <details className="faq-item" key={faq.question}>
                <summary>
                  <span>0{index + 1}</span>
                  <p>{faq.question}</p>
                  <i aria-hidden="true">+</i>
                </summary>

                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="final-invitation">
          <Insight>
            <p className="final-invitation-label">
              You already know what doing more feels like.
            </p>
          </Insight>

          <Insight delay={0.12}>
            <h2>
              Now discover what happens
              <span>when everything works together.</span>
            </h2>
          </Insight>

          <Insight delay={0.24}>
            <a
              className="final-enrollment-button"
              href="https://course.tolivingfree.com/fse-experience-checkout"
              aria-label="Join Feminine Sales Engine"
            >
              <span>Join Feminine Sales Engine</span>
              <span aria-hidden="true">→</span>
            </a>
          </Insight>

          <Insight delay={0.3}>
            <p className="final-note">
              <span>Your message. Your authority. Your offers.</span>
              <span>Built to sell for you.</span>
            </p>
          </Insight>
        </section>

        <footer className="experience-footer">
          <a href="https://tolivingfree.com">To Living Free</a>

          <p>Feminine Sales Engine™</p>

          <div>
            <a href="https://course.tolivingfree.com/terms-of-use">Terms</a>
            <a href="https://course.tolivingfree.com/privacy-policy">Privacy</a>
            <a href="mailto:support@tolivingfree.com">Support</a>
          </div>
        </footer>
      </section>
    </main >
  );
}
