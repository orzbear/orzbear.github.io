import { useLayoutEffect, useRef, useMemo, type CSSProperties, type ReactNode, type RefObject, type ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ScrollReveal.css";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
  style?: CSSProperties;
  as?: ElementType;
}

// Returns a function (ScrollTrigger accepts () => number for start/end).
// Clamps the result to >= 0 so elements already visible on page load
// don't get a negative trigger start that snaps progress to > 0.
// viewportFraction: 0 = element bottom, 1.0 = viewport bottom, 0.9 = 10% early
function clampedStart(el: HTMLElement, viewportFraction = 1.0) {
  return () => {
    const absTop = el.getBoundingClientRect().top + window.scrollY;
    return Math.max(0, absTop - window.innerHeight * viewportFraction);
  };
}

export default function ScrollReveal({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "+=400",
  wordAnimationEnd = "+=200",
  style,
  as: Tag = "h2",
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === "string" ? children : "";
    // Parse **bold** markers: split on **...** keeping delimiters as their own parts
    const parts = text.split(/(\*\*[^*]+\*\*)/);
    const result: React.ReactNode[] = [];
    parts.forEach((part, pi) => {
      const isBold = part.startsWith("**") && part.endsWith("**");
      const content = isBold ? part.slice(2, -2) : part;
      content.split(/(\s+)/).forEach((word, wi) => {
        if (/^\s+$/.test(word)) {
          result.push(word);
        } else {
          result.push(
            <span className="word" key={`${pi}-${wi}`}>
              {isBold ? <strong>{word}</strong> : word}
            </span>,
          );
        }
      });
    });
    return result;
  }, [children]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef?.current ?? window;

    const ctx = gsap.context(() => {
      const wordEls = el.querySelectorAll<HTMLElement>(".word");

      // gsap.set() is synchronous and applied inside useLayoutEffect (before paint).
      // This guarantees elements are invisible on first render, even before
      // ScrollTrigger calculates its trigger positions.
      gsap.set(el, { rotate: baseRotation, transformOrigin: "0% 50%" });
      gsap.set(wordEls, { opacity: baseOpacity });
      if (enableBlur) {
        gsap.set(wordEls, { filter: `blur(${blurStrength}px)` });
      }

      gsap.fromTo(
        el,
        { transformOrigin: "0% 50%", rotate: baseRotation },
        {
          ease: "none",
          rotate: 0,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: clampedStart(el, 1.0),
            end: rotationEnd,
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );

      gsap.fromTo(
        wordEls,
        { opacity: baseOpacity, willChange: "opacity" },
        {
          ease: "none",
          opacity: 1,
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: clampedStart(el, 0.9),
            end: wordAnimationEnd,
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );

      if (enableBlur) {
        gsap.fromTo(
          wordEls,
          { filter: `blur(${blurStrength}px)` },
          {
            ease: "none",
            filter: "blur(0px)",
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: clampedStart(el, 0.9),
              end: wordAnimationEnd,
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      }
    });

    return () => ctx.revert();
  }, [
    scrollContainerRef,
    enableBlur,
    baseRotation,
    baseOpacity,
    rotationEnd,
    wordAnimationEnd,
    blurStrength,
  ]);

  return (
    <Tag
      ref={containerRef}
      className={`scroll-reveal ${containerClassName}`}
      style={style}
    >
      <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </Tag>
  );
}
