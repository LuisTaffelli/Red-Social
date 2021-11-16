import React from "react";

import { HiArrowNarrowRight } from "react-icons/hi";
import { useSelector } from "react-redux";

import { Section, Headline, JoinNow } from "./LandingElements";

import image from "./PostExample.png";

export default function LandingPage() {
  const isDark = useSelector((state) => state.themeReducer.theme);
  return (
    <main>
      <Section>
        <Headline isDark={isDark}>
          Join the best <br /> developer social <br /> network!
        </Headline>

        <JoinNow to="/signup">
          Join now! <HiArrowNarrowRight style={{ color: "#fff" }} />
        </JoinNow>

        <img src={image} alt="" />
      </Section>
    </main>
  );
}
