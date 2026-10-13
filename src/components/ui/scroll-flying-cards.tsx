"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

export interface FlyingCard {
  id: string | number;
  title: string;
  description: string;
  imageUrl?: string;
  icon?: React.ReactNode;
  className?: string;
}

export interface ScrollFlyingCardsProps {
  backgroundText?: string;
  backgroundContent?: React.ReactNode;
  cards: FlyingCard[];
  className?: string;
  cardClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  backgroundTextClassName?: string;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;

  animationOffset?: number;
  animationRotation?: number;
  animationScale?: number;
  animationBlur?: number;
}

export const ScrollFlyingCards = ({
  backgroundText = "GREAT UI",
  backgroundContent,
  cards,
  className,
  cardClassName,
  titleClassName,
  descriptionClassName,
  backgroundTextClassName,
  scrollContainerRef,

  animationOffset = 300,
  animationRotation = 10,
  animationScale = 0.85,
  animationBlur = 20,
}: ScrollFlyingCardsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLElement | null>(null);
  const [effectiveContainerRef, setEffectiveContainerRef] = useState<React.RefObject<HTMLElement | null> | undefined>(scrollContainerRef);

  useEffect(() => {
    if (scrollContainerRef?.current) {
      setEffectiveContainerRef(scrollContainerRef);
    } else {
      const scrollEl = document.querySelector('.portfolio-app-layout') as HTMLElement | null;
      if (scrollEl) {
        fallbackRef.current = scrollEl;
        setEffectiveContainerRef(fallbackRef);
      }
    }
  }, [scrollContainerRef]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-x-clip", className)}
      style={{ minHeight: `${(cards.length + 1) * 100}vh` }}
    >
      <div className="pointer-events-none sticky top-0 left-0 z-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {backgroundContent ? (
          backgroundContent
        ) : (
          <p
            className={cn(
              "text-foreground/5 px-4 text-center text-[12vw] leading-[0.9] font-black break-words whitespace-pre-line select-none md:text-[15vw]",
              backgroundTextClassName,
            )}
          >
            {backgroundText}
          </p>
        )}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center">
        {cards.map((card, index) => {
          return (
            <CardItem
              key={card.id}
              card={card}
              index={index}
              totalCards={cards.length}
              scrollContainerRef={effectiveContainerRef}
              cardClassName={cardClassName}
              titleClassName={titleClassName}
              descriptionClassName={descriptionClassName}

              animationOffset={animationOffset}
              animationRotation={animationRotation}
              animationScale={animationScale}
              animationBlur={animationBlur}
            />
          );
        })}
      </div>
    </div>
  );
};

const CardItem = ({
  card,
  index,
  totalCards,
  scrollContainerRef,
  cardClassName,
  titleClassName,
  descriptionClassName,

  animationOffset = 300,
  animationRotation = 10,
  animationScale = 0.85,
  animationBlur = 20,
}: {
  card: FlyingCard;
  index: number;
  totalCards: number;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  cardClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;

  animationOffset?: number;
  animationRotation?: number;
  animationScale?: number;
  animationBlur?: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    container: scrollContainerRef,
    offset: ["start end", "end start"],
  });

  const isEven = index % 2 === 0;

  // Calculate entry and exit values based on direction
  const getTransforms = () => {
    return { x: [0, 0, 0, 0], y: [animationOffset, 0, 0, -animationOffset] };
  };

  const transforms = getTransforms();

  const y = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], transforms.y);
  const x = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], transforms.x);

  // Slight rotation based on odd/even
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [
      isEven ? -animationRotation : animationRotation,
      0,
      0,
      isEven ? animationRotation / 2 : -animationRotation / 2,
    ],
  );

  // Smooth fade
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [0, 1, 1, 0],
  );

  // Scale effect for depth
  const scale = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [animationScale, 1, 1, animationScale + 0.05],
  );

  // Blur effect for entering/exiting
  const filter = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [
      `blur(${animationBlur}px)`,
      "blur(0px)",
      "blur(0px)",
      `blur(${animationBlur / 2}px)`,
    ],
  );

  return (
    <div
      ref={cardRef}
      className="flex h-[100vh] w-full items-center justify-center md:h-[120vh]"
    >
      <motion.div
        style={{
          x,
          y,
          rotate,
          opacity,
          scale,
          filter,
        }}
        className={cn(
          "scroll-flying-card",
          cardClassName,
          card.className,
        )}
      >
        <div className="scroll-flying-card-header">
          <h2
            className={cn(
              "scroll-flying-card-title",
              titleClassName,
            )}
          >
            {card.title}
          </h2>
          <p
            className={cn(
              "scroll-flying-card-desc",
              descriptionClassName,
            )}
          >
            {card.description}
          </p>
        </div>
        <div className="scroll-flying-card-icon-box [&>svg]:h-full [&>svg]:w-full [&>svg]:max-w-[120px] md:[&>svg]:max-w-[160px]">
          {card.icon ? (
            card.icon
          ) : card.imageUrl ? (
            <img
              src={card.imageUrl}
              alt={card.title}
              className="h-full w-full object-contain"
            />
          ) : null}
        </div>
      </motion.div>
    </div>
  );
};

export default ScrollFlyingCards;
