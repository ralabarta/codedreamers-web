import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import CodeDreamersLanding from "./CodeDreamersLanding";
import {
  buildLocaleHref,
  getBootstrapDecision,
  getStorage,
  readLocalePreference,
} from "./i18n/locale";
import "./styles.css";

const decision = getBootstrapDecision({
  pathname: window.location.pathname,
  savedLocale: readLocalePreference(getStorage(() => window.localStorage)),
  browserLanguages: navigator.languages,
});

if (decision.action === "redirect") {
  window.location.replace(buildLocaleHref(decision.locale, window.location.hash));
} else {
  const root = document.getElementById("root")!;
  const app = (
    <StrictMode>
      <CodeDreamersLanding locale={decision.locale} />
    </StrictMode>
  );

  if (root.hasChildNodes()) {
    hydrateRoot(root, app);
  } else {
    createRoot(root).render(app);
  }
}
