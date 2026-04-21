import { createElement } from "react";

import { Section } from "../components/Section";

export function WidgetPage({ eyebrow, title, description, children }) {
  return (
    <Section eyebrow={eyebrow} title={title} description={description}>
      {children}
    </Section>
  );
}
