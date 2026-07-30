"use client";

import {
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { localizeCatalog } from "./i18n/catalog";
import type { LocalizedFamily, LocalizedProduct } from "./i18n/catalog";
import { getDictionary } from "./i18n/dictionaries";
import {
  buildLocaleHref,
  getStorage,
  LOCALES,
  writeLocalePreference,
} from "./i18n/locale";
import type { Locale } from "./i18n/locale";
import { PROJECT_MODE_IDS } from "./i18n/types";
import type { Dictionary, FamilyId, MessageCount, OutcomeId } from "./i18n/types";

const revealFocusedButton = (event: FocusEvent<HTMLDivElement>) => {
  const target = event.target;
  if (target instanceof HTMLButtonElement) {
    target.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
  }
};

export const families = localizeCatalog("es");

export const formatCount = (message: MessageCount, count: number): string =>
  (count === 1 ? message.one : message.other).replace("{count}", String(count));

export const LOCALE_FLAG_SOURCES: Record<Locale, string> = {
  es: "/flags/es.svg",
  "pt-BR": "/flags/pt-br.svg",
  en: "/flags/en.svg",
};

export const CATALOG_SOURCES: Record<Locale, string> = {
  es: "/catalog/codedreamers-catalog-es.pdf",
  "pt-BR": "/catalog/codedreamers-catalog-pt.pdf",
  en: "/catalog/codedreamers-catalog-en.pdf",
};

export function LocaleSelector({
  locale,
  onNavigate,
}: {
  locale: Locale;
  onNavigate?: () => void;
}) {
  const [hash, setHash] = useState("");
  const copy = getDictionary(locale).selector;

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  return (
    <nav className="locale-selector" aria-label={copy.ariaLabel}>
      {LOCALES.map((target) => (
        <a
          key={target}
          href={buildLocaleHref(target, hash)}
          hrefLang={target}
          aria-current={target === locale ? "page" : undefined}
          aria-label={copy.labels[target]}
          onClick={() => {
            writeLocalePreference(
              getStorage(() => window.localStorage),
              target,
            );
            onNavigate?.();
          }}
        >
          <img
            className="locale-selector__flag"
            src={LOCALE_FLAG_SOURCES[target]}
            alt=""
            aria-hidden="true"
            width={24}
            height={16}
          />
          {target === locale ? (
            <span className="sr-only"> ({copy.activeLabel})</span>
          ) : null}
        </a>
      ))}
    </nav>
  );
}

const normalizeSearchText = (text: string, locale: Locale): string =>
  text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim()
    .toLocaleLowerCase(locale);

export const getSearchText = (
  product: LocalizedProduct,
  locale: Locale,
): string =>
  normalizeSearchText(
    [product.code, product.name, product.description, ...product.includes].join(" "),
    locale,
  );

export function filterFamilies(
  source: readonly LocalizedFamily[],
  outcomeId: OutcomeId | null | "all",
  familyId: FamilyId | null,
  query: string,
  locale: Locale,
): LocalizedFamily[] {
  const normalizedQuery = normalizeSearchText(query, locale);

  return source
    .filter((family) => familyId === null || family.id === familyId)
    .map((family) => ({
      ...family,
      products: family.products.filter(
        (product) =>
          (outcomeId === null ||
            outcomeId === "all" ||
            product.outcomeIds.includes(outcomeId)) &&
          (!normalizedQuery || getSearchText(product, locale).includes(normalizedQuery)),
      ),
    }))
    .filter((family) => family.products.length > 0);
}

const outcomeColors: Record<OutcomeId, string> = {
  captar: "#20cfd4",
  vender: "#f347a6",
  operar: "#5b63ff",
  decidir: "#36cfaa",
  escalar: "#ffb83f",
};

function Brand({ ariaLabel }: { ariaLabel: string }) {
  return (
    <a className="brand" href="#inicio" aria-label={ariaLabel}>
      <img
        className="brand-mark"
        src="/brand-mark.svg"
        alt=""
        aria-hidden="true"
        width={96}
        height={96}
      />
      <span className="brand-name">CodeDreamers</span>
    </a>
  );
}

function Arrow({ direction = "right" }: { direction?: "right" | "down" }) {
  return (
    <span className={`arrow arrow--${direction}`} aria-hidden="true">
      <span />
    </span>
  );
}

function OrbitAtlas({
  families,
  outcomes,
  copy,
  status,
}: {
  families: readonly LocalizedFamily[];
  outcomes: readonly { id: OutcomeId; label: string; color: string }[];
  copy: Dictionary["hero"];
  status: Dictionary["status"];
}) {
  const nodes = [
    { x: 134, y: 438, family: families[0] },
    { x: 232, y: 168, family: families[1] },
    { x: 432, y: 142, family: families[2] },
    { x: 546, y: 322, family: families[3] },
    { x: 432, y: 500, family: families[4] },
    { x: 230, y: 526, family: families[5] },
  ];

  return (
    <div className="orbit-atlas" aria-hidden="true">
      <div className="orbit-coordinate orbit-coordinate--north">
        N 40° 42′
      </div>
      <div className="orbit-coordinate orbit-coordinate--east">
        E 120°
      </div>
      <div className="orbit-coordinate orbit-coordinate--system">
        {status.system}
      </div>
      <div className="orbit-coordinate orbit-coordinate--route">
        {status.route}
      </div>
      <svg viewBox="0 0 660 620" role="img">
        <title>{copy.atlasTitle}</title>
        <defs>
          <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="12"
              stdDeviation="10"
              floodColor="#02101b"
              floodOpacity=".5"
            />
          </filter>
          <marker
            id="route-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M0 0L10 5L0 10Z" fill="context-stroke" />
          </marker>
        </defs>
        <g className="orbit-grid">
          <circle cx="335" cy="320" r="252" />
          <circle cx="335" cy="320" r="205" />
          <circle cx="335" cy="320" r="154" />
          <path d="M36 320H624M335 22V598" />
          <path d="M80 125L590 520M86 520L585 116" />
        </g>
        <path
          className="orbit-route orbit-route--cyan"
          pathLength="1"
          markerEnd="url(#route-arrow)"
          d="M24 548C68 530 104 496 134 438"
        />
        <path
          className="orbit-route orbit-route--pink"
          pathLength="1"
          markerEnd="url(#route-arrow)"
          d="M134 438C122 333 141 221 232 168"
        />
        <path
          className="orbit-route orbit-route--indigo"
          pathLength="1"
          markerEnd="url(#route-arrow)"
          d="M232 168C292 108 379 104 432 142"
        />
        <path
          className="orbit-route orbit-route--mint"
          pathLength="1"
          markerEnd="url(#route-arrow)"
          d="M432 142C523 174 574 241 546 322"
        />
        <path
          className="orbit-route orbit-route--amber"
          pathLength="1"
          markerEnd="url(#route-arrow)"
          d="M546 322C576 414 522 486 432 500"
        />
        <path
          className="orbit-route orbit-route--violet"
          pathLength="1"
          markerEnd="url(#route-arrow)"
          d="M432 500C354 564 275 567 230 526C176 494 143 469 134 438"
        />
        <g className="orbit-spokes">
          <path d="M232 168L335 320L546 322" />
          <path d="M134 438L335 320L432 142" />
          <path d="M230 526L335 320L432 500" />
        </g>
        <g className="orbit-core__construction">
          <circle cx="335" cy="320" r="111" />
          <path d="M211 320H459M335 196V444" />
          <path d="M262 238L408 402M262 402L408 238" />
          <path d="M289 224V204M381 224V204M289 436V416M381 436V416" />
        </g>
        <g className="orbit-core" filter="url(#soft-shadow)">
          <circle cx="335" cy="320" r="92" />
          <text
            className="orbit-core__number orbit-core__number--outline"
            x="335"
            y="323"
          >
            54
          </text>
          <text className="orbit-core__number" x="335" y="323">
            54
          </text>
          <text className="orbit-core__label" x="335" y="359">
            {copy.productLabel.toUpperCase()}
          </text>
        </g>
        {nodes.map(({ x, y, family }, nodeIndex) => (
          <g
            className="orbit-node"
            key={family.id}
            style={
              {
                "--node-color": family.color,
                "--node-delay": `${0.6 + nodeIndex * 0.09}s`,
              } as CSSProperties
            }
          >
            <circle className="orbit-node__halo" cx={x} cy={y} r="41" />
            <circle className="orbit-node__disc" cx={x} cy={y} r="29" />
            <text className="orbit-node__number" x={x} y={y + 5}>
              {family.index}
            </text>
          </g>
        ))}
        <g className="orbit-stage-labels">
          {outcomes.map((outcome, index) => (
            <text
              key={outcome.id}
              x={[54, 197, 456, 563, 426][index]}
              y={[404, 98, 82, 376, 576][index]}
            >
              {outcome.label.toUpperCase()}
            </text>
          ))}
        </g>
        <g className="orbit-ticks">
          {[
            [94, 466],
            [113, 401],
            [139, 329],
            [166, 250],
            [286, 122],
            [369, 112],
            [490, 184],
            [556, 259],
            [558, 399],
            [502, 474],
            [345, 548],
            [276, 548],
          ].map(([x, y], index) => (
            <circle key={index} cx={x} cy={y} r="3.5" />
          ))}
        </g>
      </svg>
      <div className="orbit-start">
        <span />
        <small>{copy.solutionInitial}</small>
      </div>
      {families.map((family, index) => (
        <div
          className={`orbit-family-label orbit-family-label--${[
            "one",
            "two",
            "three",
            "four",
            "five",
            "six",
          ][index]}`}
          key={family.id}
        >
          {family.name}
        </div>
      ))}
      <div className="mobile-atlas-route">
        <div className="mobile-atlas-route__origin">
          <span />
          <strong>{copy.mobileOrigin}</strong>
          <small>{copy.mobileOriginDetail}</small>
        </div>
        <ol>
          {families.map((family, index) => (
            <li
              key={family.id}
              style={{ "--mobile-route-color": family.color } as CSSProperties}
            >
              <span>{family.index}</span>
              <div>
                <strong>{family.name}</strong>
                <small>
                  {outcomes[Math.min(index, outcomes.length - 1)].label}
                  {index === families.length - 1
                    ? ` · ${status.ecosystemLabel}`
                    : ""}
                </small>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Hero({
  families,
  heroRef,
  outcomes,
  copy,
  status,
}: {
  families: readonly LocalizedFamily[];
  heroRef: RefObject<HTMLElement | null>;
  outcomes: readonly { id: OutcomeId; label: string; color: string }[];
  copy: Dictionary["hero"];
  status: Dictionary["status"];
}) {
  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroRef.current?.style.setProperty("--pointer-x", `${x * 12}px`);
    heroRef.current?.style.setProperty("--pointer-y", `${y * 12}px`);
  };

  return (
    <section
      className="hero"
      id="inicio"
      tabIndex={-1}
      ref={heroRef}
      onPointerMove={handlePointerMove}
    >
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-calibration hero-calibration--top" aria-hidden="true">
        {Array.from({ length: 11 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className="hero-calibration hero-calibration--bottom" aria-hidden="true">
        {Array.from({ length: 11 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className="hero-coordinates hero-coordinates--left" aria-hidden="true">
        90
        <br />
        75
        <br />
        60
        <br />
        45
        <br />
        30
        <br />
        15
        <br />
        00
      </div>
      <div className="hero__content">
        <p className="hero__kicker">{copy.kicker}</p>
        <h1>
          {copy.title.map((line, index) => (
            <span key={line}>
              {line}
              {index < copy.title.length - 1 ? (
                <>
                  <br />{" "}
                </>
              ) : null}
            </span>
          ))}
        </h1>
        <p className="hero__intro">{copy.intro}</p>
        <div className="hero__actions">
          <a className="button button--primary" href="#cartera">
            {copy.primaryAction}
            <Arrow />
          </a>
          <a className="button button--ghost" href="#contacto">
            {copy.secondaryAction}
            <Arrow />
          </a>
        </div>
      </div>
      <div className="hero__visual">
        <OrbitAtlas
          families={families}
          outcomes={outcomes}
          copy={copy}
          status={status}
        />
      </div>
      <dl className="proof-rail">
        {copy.proof.map((item) => (
          <div key={item.value}>
            <dt>{item.value}</dt>
            <dd>{item.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

type BackToTopTargets = {
  hero: Element;
  contact: Element;
  footer: Element;
};

export function observeBackToTopTargets(
  targets: BackToTopTargets,
  onVisibilityChange: (visible: boolean) => void,
  ObserverClass: typeof IntersectionObserver = window.IntersectionObserver,
): () => void {
  const intersections = new Map<Element, boolean>();
  const observer = new ObserverClass(
    (entries) => {
      for (const entry of entries) {
        intersections.set(entry.target, entry.isIntersecting);
      }

      const heroIntersecting = intersections.get(targets.hero);
      const contactIntersecting = intersections.get(targets.contact);
      const footerIntersecting = intersections.get(targets.footer);
      if (
        heroIntersecting === undefined ||
        contactIntersecting === undefined ||
        footerIntersecting === undefined
      ) {
        return;
      }

      onVisibilityChange(
        !heroIntersecting && !contactIntersecting && !footerIntersecting,
      );
    },
    { root: null, rootMargin: "0px", threshold: 0 },
  );

  observer.observe(targets.hero);
  observer.observe(targets.contact);
  observer.observe(targets.footer);

  return () => observer.disconnect();
}

export function BackToTopControl({
  copy,
  heroRef,
  observerVisible,
  mobileMenuOpen,
}: {
  copy: Dictionary["backToTop"];
  heroRef: RefObject<HTMLElement | null>;
  observerVisible: boolean;
  mobileMenuOpen: boolean;
}) {
  const effectiveVisible = observerVisible && !mobileMenuOpen;

  const handleClick = () => {
    window.requestAnimationFrame(() => {
      heroRef.current?.focus({ preventScroll: true });
    });
  };

  return (
    <a
      className={effectiveVisible ? "back-to-top is-visible" : "back-to-top"}
      href="#inicio"
      aria-label={copy.ariaLabel}
      aria-hidden={effectiveVisible ? undefined : true}
      tabIndex={effectiveVisible ? 0 : -1}
      onClick={handleClick}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M5 14l7-7 7 7M12 7v11" />
      </svg>
    </a>
  );
}

function BackToTop({
  copy,
  heroRef,
  contactRef,
  footerRef,
  mobileMenuOpen,
}: {
  copy: Dictionary["backToTop"];
  heroRef: RefObject<HTMLElement | null>;
  contactRef: RefObject<HTMLElement | null>;
  footerRef: RefObject<HTMLElement | null>;
  mobileMenuOpen: boolean;
}) {
  const [observerVisible, setObserverVisible] = useState(false);

  useEffect(() => {
    if (typeof window.IntersectionObserver === "undefined") return;

    const hero = heroRef.current;
    const contact = contactRef.current;
    const footer = footerRef.current;
    if (!hero || !contact || !footer) return;

    return observeBackToTopTargets(
      { hero, contact, footer },
      setObserverVisible,
    );
  }, [contactRef, footerRef, heroRef]);

  return (
    <BackToTopControl
      copy={copy}
      heroRef={heroRef}
      observerVisible={observerVisible}
      mobileMenuOpen={mobileMenuOpen}
    />
  );
}

function OutcomeNavigator({
  copy,
  onSelectOutcome,
}: {
  copy: Dictionary["outcomes"];
  onSelectOutcome: (outcomeId: OutcomeId) => void;
}) {
  const outcomes = (Object.keys(copy.items) as OutcomeId[]).map((id) => ({
    id,
    ...copy.items[id],
    color: outcomeColors[id],
  }));
  const [activeOutcome, setActiveOutcome] = useState(outcomes[0]);

  return (
    <section className="outcome-section section-pad" id="soluciones">
      <div className="section-intro section-intro--wide" data-reveal>
        <p className="coordinate-label">{copy.eyebrow}</p>
        <h2>
          {copy.title[0]}
          <br />
          {copy.title[1]}
        </h2>
        <p>{copy.intro}</p>
      </div>

      <div
        className="outcome-navigator"
        style={{ "--outcome-color": activeOutcome.color } as CSSProperties}
        data-reveal
      >
        <div className="outcome-tabs" role="group" aria-label={copy.ariaLabel} onFocus={revealFocusedButton}>
          {outcomes.map((outcome, index) => (
            <button
              type="button"
              aria-pressed={activeOutcome.id === outcome.id}
              key={outcome.id}
              onClick={() => setActiveOutcome(outcome)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {outcome.label}
            </button>
          ))}
        </div>
        <div
          className="outcome-panel"
          aria-live="polite"
          aria-atomic="true"
          key={activeOutcome.id}
        >
          <div className="outcome-panel__range">{activeOutcome.range}</div>
          <h3>{activeOutcome.lead}</h3>
          <p>{activeOutcome.body}</p>
          <a
            href="#cartera"
            onClick={() => onSelectOutcome(activeOutcome.id)}
          >
            {copy.action}
            <Arrow />
          </a>
        </div>
        <div className="outcome-route" aria-hidden="true">
          {outcomes.map((outcome) => (
            <span
              key={outcome.id}
              className={
                outcomes.findIndex((item) => item.id === activeOutcome.id) >=
                outcomes.findIndex((item) => item.id === outcome.id)
                  ? "is-active"
                  : ""
              }
              style={{ "--route-color": outcome.color } as CSSProperties}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Portfolio({
  activeOutcome,
  copy,
  families,
  locale,
  onClearOutcome,
}: {
  activeOutcome: OutcomeId | null;
  copy: Dictionary["catalog"];
  families: readonly LocalizedFamily[];
  locale: Locale;
  onClearOutcome: () => void;
}) {
  const [activeFamily, setActiveFamily] = useState<FamilyId | "all">("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setActiveFamily("all");
  }, [activeOutcome]);

  const visibleFamilies = useMemo(
    () =>
      filterFamilies(
        families,
        activeOutcome,
        activeFamily === "all" ? null : activeFamily,
        query,
        locale,
      ),
    [activeFamily, activeOutcome, families, locale, query],
  );

  const visibleCount = visibleFamilies.reduce(
    (total, family) => total + family.products.length,
    0,
  );
  const languageLabels = getDictionary(locale).selector.labels;

  return (
    <section className="portfolio section-pad" id="cartera">
      <div className="portfolio__heading" data-reveal>
        <div>
          <p className="coordinate-label coordinate-label--dark">
            {copy.eyebrow}
          </p>
          <h2>{copy.title}</h2>
        </div>
        <p>{copy.intro}</p>
      </div>

      <div className="catalog-downloads" data-reveal>
        <p>{copy.downloadsLabel}</p>
        <nav aria-label={copy.downloadsAriaLabel}>
          {LOCALES.map((catalogLocale) => (
            <a
              className="catalog-downloads__link"
              key={catalogLocale}
              href={CATALOG_SOURCES[catalogLocale]}
              download
              aria-label={copy.downloadAriaLabels[catalogLocale]}
            >
              <img
                src={LOCALE_FLAG_SOURCES[catalogLocale]}
                alt=""
                aria-hidden="true"
                width={24}
                height={16}
              />
              <span>{languageLabels[catalogLocale]}</span>
              <span aria-hidden="true">↓</span>
            </a>
          ))}
        </nav>
      </div>

      <div className="portfolio-sheet" data-reveal>
        <div className="portfolio-toolbar">
          <div
            className="family-filter"
            role="group"
            aria-label={copy.familyFilterAriaLabel}
            onFocus={revealFocusedButton}
          >
            <button
              className={activeFamily === "all" ? "is-active" : ""}
              type="button"
              aria-pressed={activeFamily === "all"}
              onClick={() => setActiveFamily("all")}
            >
              <span className="family-filter__code">00</span>
              <strong>{copy.allFamilies}</strong>
              <span className="family-filter__count">54</span>
            </button>
            {families.map((family) => (
              <button
                className={activeFamily === family.id ? "is-active" : ""}
                type="button"
                key={family.id}
                aria-pressed={activeFamily === family.id}
                onClick={() => setActiveFamily(family.id)}
                style={{ "--family-color": family.color } as CSSProperties}
                aria-label={`${family.index}. ${family.name}, ${formatCount(copy.resultCount, family.products.length)}`}
              >
                <span className="family-filter__code">{family.index}</span>
                <strong>{family.shortName}</strong>
                <span className="family-filter__count">
                  {family.products.length}
                </span>
              </button>
            ))}
          </div>
          <label className="portfolio-search">
            <span>{copy.searchLabel}</span>
            <input
              type="search"
              aria-label={copy.searchLabel}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.searchPlaceholder}
            />
            <span className="search-cross" aria-hidden="true" />
          </label>
        </div>

        <p
          className="portfolio-result"
          aria-live="polite"
          aria-atomic="true"
        >
          {formatCount(copy.resultCount, visibleCount)}
        </p>

        <div className="product-ledger">
          {visibleFamilies.length ? (
            visibleFamilies.map((family) => (
              <article
                className="ledger-family"
                key={family.id}
                style={{ "--family-color": family.color } as CSSProperties}
              >
                <header>
                  <span>{family.index}</span>
                  <div>
                    <h3>{family.name}</h3>
                    <p>{family.promise}</p>
                  </div>
                  <strong>{family.products.length}</strong>
                </header>
                <ol>
                  {family.products.map((product) => (
                    <li key={product.code}>
                      <details className="product-detail">
                        <summary>
                          <span>{product.code}</span>
                          <strong>{product.name}</strong>
                          <i aria-hidden="true">↓</i>
                        </summary>
                        <div className="product-detail__panel">
                          <p>{product.description}</p>
                          <p className="product-detail__label">{copy.includesLabel}</p>
                          <ul role="list">
                            {product.includes.map((includedItem) => (
                              <li key={includedItem}>{includedItem}</li>
                            ))}
                          </ul>
                        </div>
                      </details>
                    </li>
                  ))}
                </ol>
              </article>
            ))
          ) : (
            <div className="portfolio-empty">
              <strong>{copy.emptyTitle}</strong>
              <p>{copy.emptyBody}</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveFamily("all");
                  onClearOutcome();
                }}
              >
                {copy.emptyAction}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Ecosystem({ copy }: { copy: Dictionary["ecosystem"] }) {
  const layers = copy.layers.map((label, index) => ({
    label,
    color: ["#20cfd4", "#f347a6", "#5b63ff", "#36cfaa", "#ffb83f"][index],
    offset: `${index * 9}%`,
  }));

  return (
    <section className="ecosystem section-pad" id="ecosistema">
      <div className="ecosystem__copy" data-reveal>
        <p className="coordinate-label">{copy.eyebrow}</p>
        <h2>
          {copy.title.map((line, index) => (
            <span key={line}>
              {line}
              {index < copy.title.length - 1 ? <br /> : null}
            </span>
          ))}
        </h2>
        <p>{copy.intro}</p>
      </div>
      <div className="system-assembler" data-reveal aria-label={copy.ariaLabel}>
        <div className="system-assembler__origin">
          <span />
          {copy.origin}
        </div>
        <div className="system-assembler__rails">
          {layers.map((layer, index) => (
            <div
              className="system-layer"
              key={layer.label}
              style={
                {
                  "--layer-color": layer.color,
                  "--layer-offset": layer.offset,
                  "--layer-index": index,
                } as CSSProperties
              }
            >
              <span className="system-layer__node">{index + 1}</span>
              <strong>{layer.label}</strong>
              <span className="system-layer__line" />
            </div>
          ))}
        </div>
        <div className="system-assembler__destination">
          <span>360°</span>
          {copy.destination}
        </div>
        <p>{copy.example}</p>
      </div>
    </section>
  );
}

function FormatsAndCapabilities({
  capabilities,
  formats,
}: {
  capabilities: Dictionary["capabilities"];
  formats: Dictionary["formats"];
}) {
  return (
    <section className="delivery section-pad">
      <div className="delivery__intro" data-reveal>
        <p className="coordinate-label coordinate-label--dark">
          {formats.eyebrow}
        </p>
        <h2>{formats.title}</h2>
      </div>
      <div className="format-ribbons" data-reveal>
        <div className="format-ribbons__track">
          {[...formats.items, ...formats.items].map((format, index) => (
            <span key={`${format}-${index}`}>
              <i style={{ "--dot-index": index % 6 } as CSSProperties} />
              {format}
            </span>
          ))}
        </div>
        <div
          className="format-ribbons__track format-ribbons__track--reverse"
          aria-hidden="true"
        >
          {[...formats.items.slice().reverse(), ...formats.items.slice().reverse()].map(
            (format, index) => (
              <span key={`${format}-reverse-${index}`}>
                <i style={{ "--dot-index": index % 6 } as CSSProperties} />
                {format}
              </span>
            ),
          )}
        </div>
      </div>

      <div className="capabilities" data-reveal>
        <div className="capabilities__copy">
          <p className="coordinate-label coordinate-label--dark">
            {capabilities.eyebrow}
          </p>
          <h3>{capabilities.title}</h3>
          <p>{capabilities.intro}</p>
        </div>
        <ol className="capability-list">
          {capabilities.items.map((capability, index) => (
            <li key={capability}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{capability}</strong>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function SectorAtlas({ copy }: { copy: Dictionary["sectors"] }) {
  return (
    <section className="sectors section-pad" id="sectores">
      <div className="sectors__heading" data-reveal>
        <p className="coordinate-label">{copy.eyebrow}</p>
        <h2>
          {copy.title[0]}
          <br />
          {copy.title[1]}
        </h2>
      </div>
      <ol className="sector-index" data-reveal>
        {copy.items.map((sector, index) => (
          <li key={sector}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{sector}</strong>
            <i aria-hidden="true">P{45 + index}</i>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ProjectModes({ copy }: { copy: Dictionary["projectModes"] }) {
  return (
    <section className="project-modes section-pad">
      <div className="project-modes__lead" data-reveal>
        <p className="coordinate-label coordinate-label--dark">
          {copy.eyebrow}
        </p>
        <h2>{copy.title}</h2>
      </div>
      <ol data-reveal>
        {PROJECT_MODE_IDS.map((id, index) => {
          const mode = copy.items[id];

          return (
            <li key={id}>
              <details className="project-mode">
                <summary>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{mode.name}</strong>
                  <Arrow />
                </summary>
                <div className="project-mode__panel">
                  <p>{mode.description}</p>
                  <p className="project-mode__label">{copy.includesLabel}</p>
                  <ul>
                    {mode.inclusions.map((inclusion) => (
                      <li key={inclusion}>{inclusion}</li>
                    ))}
                  </ul>
                  <a
                    className="project-mode__cta"
                    href={`mailto:codedreamers.dev@gmail.com?subject=${encodeURIComponent(
                      `${copy.emailSubjectPrefix} · ${mode.name}`,
                    )}`}
                  >
                    {mode.ctaLabel}
                    <Arrow />
                  </a>
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/5352015051?text=${encodeURIComponent(message)}`;
}

function WhatsAppIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path
        fill="currentColor"
        d="M12.04 2a9.84 9.84 0 0 0-8.5 14.79L2 22l5.35-1.49A9.92 9.92 0 1 0 12.04 2Zm0 17.98a8 8 0 0 1-4.08-1.12l-.29-.17-3.18.89.85-3.1-.19-.31a7.98 7.98 0 1 1 6.89 3.81Zm4.38-5.98c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19a7.24 7.24 0 0 1-1.33-1.65c-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.41h-.46a.88.88 0 0 0-.64.3c-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z"
      />
    </svg>
  );
}

function WhatsAppLink({ href, ariaLabel }: { href: string; ariaLabel: string }) {
  return (
    <a
      className="whatsapp-link"
      href={href}
      aria-label={ariaLabel}
      target="_blank"
      rel="noreferrer"
    >
      <WhatsAppIcon />
    </a>
  );
}

export function ContactArchitecture() {
  return (
    <svg
      className="contact-architecture"
      viewBox="0 0 520 520"
      aria-hidden="true"
      focusable="false"
      data-reveal
    >
      <g className="contact-architecture__branches">
        <g className="contact-architecture__branch">
          <path className="contact-architecture__path contact-architecture__path--primary" pathLength="1" d="M260 260L214 204L174 160" />
          <path className="contact-architecture__path contact-architecture__path--secondary" pathLength="1" d="M174 160L92 104" />
        </g>
        <g className="contact-architecture__branch">
          <path className="contact-architecture__path contact-architecture__path--primary" pathLength="1" d="M260 260L236 182L246 126" />
          <path className="contact-architecture__path contact-architecture__path--secondary" pathLength="1" d="M246 126L260 64" />
        </g>
        <g className="contact-architecture__branch">
          <path className="contact-architecture__path contact-architecture__path--primary" pathLength="1" d="M260 260L322 196L364 168" />
          <path className="contact-architecture__path contact-architecture__path--secondary" pathLength="1" d="M364 168L430 116" />
        </g>
        <g className="contact-architecture__branch">
          <path className="contact-architecture__path contact-architecture__path--primary" pathLength="1" d="M260 260L340 274L398 286" />
          <path className="contact-architecture__path contact-architecture__path--secondary" pathLength="1" d="M398 286L454 310" />
        </g>
        <g className="contact-architecture__branch">
          <path className="contact-architecture__path contact-architecture__path--primary" pathLength="1" d="M260 260L298 334L326 382" />
          <path className="contact-architecture__path contact-architecture__path--secondary" pathLength="1" d="M326 382L360 438" />
        </g>
        <g className="contact-architecture__branch">
          <path className="contact-architecture__path contact-architecture__path--primary" pathLength="1" d="M260 260L202 316L162 352" />
          <path className="contact-architecture__path contact-architecture__path--secondary" pathLength="1" d="M162 352L112 406" />
        </g>
      </g>
      <circle className="contact-architecture__pulse" cx="260" cy="260" r="58" />
      <g className="contact-architecture__core">
        <circle className="contact-architecture__core-ring" cx="260" cy="260" r="48" />
        <circle className="contact-architecture__core-fill" cx="260" cy="260" r="29" />
      </g>
      <g className="contact-architecture__endpoints">
        <circle className="contact-architecture__endpoint" cx="92" cy="104" r="11" />
        <circle className="contact-architecture__endpoint" cx="260" cy="64" r="11" />
        <circle className="contact-architecture__endpoint" cx="430" cy="116" r="11" />
        <circle className="contact-architecture__endpoint" cx="454" cy="310" r="11" />
        <circle className="contact-architecture__endpoint" cx="360" cy="438" r="11" />
        <circle className="contact-architecture__endpoint" cx="112" cy="406" r="11" />
      </g>
      <circle className="contact-architecture__signal" cx="430" cy="116" r="6" />
    </svg>
  );
}

function Contact({
  brandAriaLabel,
  contactRef,
  copy,
  footerRef,
}: {
  brandAriaLabel: string;
  contactRef: RefObject<HTMLElement | null>;
  copy: Dictionary["contact"];
  footerRef: RefObject<HTMLElement | null>;
}) {
  const whatsappHref = buildWhatsAppUrl(copy.whatsappMessage);

  return (
    <section className="contact section-pad" id="contacto" ref={contactRef}>
      <ContactArchitecture />
      <p className="coordinate-label" data-reveal>
        {copy.eyebrow}
      </p>
      <h2 data-reveal>
        {copy.title.map((line, index) => (
          <span key={line}>
            {line}
            {index < copy.title.length - 1 ? <br /> : null}
          </span>
        ))}
      </h2>
      <div className="contact__actions" data-reveal>
        <a
          className="button button--paper"
          href={`mailto:codedreamers.dev@gmail.com?subject=${encodeURIComponent(
            copy.mailSubject,
          )}`}
        >
          {copy.action}
          <Arrow />
        </a>
        <WhatsAppLink href={whatsappHref} ariaLabel={copy.whatsappAriaLabel} />
      </div>
      <footer ref={footerRef}>
        <Brand ariaLabel={brandAriaLabel} />
        <p>{copy.footerSummary}</p>
        <div>
          <a href="mailto:codedreamers.dev@gmail.com">
            codedreamers.dev@gmail.com
          </a>
          <WhatsAppLink href={whatsappHref} ariaLabel={copy.whatsappAriaLabel} />
        </div>
      </footer>
    </section>
  );
}

export type CodeDreamersLandingProps = { locale: Locale };

export default function CodeDreamersLanding({
  locale,
}: CodeDreamersLandingProps) {
  const dictionary = getDictionary(locale);
  const localizedFamilies = useMemo(() => localizeCatalog(locale), [locale]);
  const localizedOutcomes = useMemo(
    () =>
      (Object.keys(dictionary.outcomes.items) as OutcomeId[]).map((id) => ({
        id,
        ...dictionary.outcomes.items[id],
        color: outcomeColors[id],
      })),
    [dictionary.outcomes.items],
  );
  const [activeOutcome, setActiveOutcome] = useState<OutcomeId | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navigationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window.IntersectionObserver === "undefined") return;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const menuButton = menuButtonRef.current;
    const navigation = navigationRef.current;
    const links = navigation
      ? Array.from(navigation.querySelectorAll<HTMLAnchorElement>("a[href]"))
      : [];
    const focusTimer = window.setTimeout(() => links[0]?.focus(), 0);

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        window.requestAnimationFrame(() => menuButton?.focus());
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = [menuButton, ...links].filter(
        (element) => element !== null,
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 900) setMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      {/* 
        THESIS: Una necesidad puntual entra en el sistema y sale convertida en una plataforma conectada; se rechaza el hero genérico de agencia y la cuadrícula de servicios.
        OWN-WORLD: Azul noche cartográfico, placas de papel frío, seis rutas cromáticas, coordenadas y cápsulas del símbolo.
        STORY: El visitante entiende la oferta, elige un resultado, explora 54 productos, ve cómo se conectan y abre una conversación.
        FIRST VIEWPORT: Copy monumental a la izquierda, atlas orbital de 54 productos a la derecha, navegación arriba y prueba numérica en el carril inferior.
        FORM: Atlas de Sistemas, dirección 4/7, puesta en escena orbital, seed 364e55e7.
      */}
      <div className="site-route" aria-hidden="true">
        <i className="site-route__progress" />
        <span style={{ "--route-stop": "7%", "--route-stop-color": "#20cfd4" } as CSSProperties} />
        <span style={{ "--route-stop": "24%", "--route-stop-color": "#f347a6" } as CSSProperties} />
        <span style={{ "--route-stop": "43%", "--route-stop-color": "#5b63ff" } as CSSProperties} />
        <span style={{ "--route-stop": "62%", "--route-stop-color": "#36cfaa" } as CSSProperties} />
        <span style={{ "--route-stop": "80%", "--route-stop-color": "#ffb83f" } as CSSProperties} />
        <span style={{ "--route-stop": "96%", "--route-stop-color": "#8857ff" } as CSSProperties} />
      </div>
      <header className="site-header">
        <Brand ariaLabel={dictionary.header.brandAriaLabel} />
        <button
          ref={menuButtonRef}
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">
            {menuOpen
              ? dictionary.header.closeMenuLabel
              : dictionary.header.openMenuLabel}
          </span>
          <i />
          <i />
        </button>
        <nav
          ref={navigationRef}
          className={menuOpen ? "is-open" : ""}
          id="site-navigation"
          aria-label={dictionary.header.navigationAriaLabel}
        >
          <a href="#soluciones" onClick={closeMenu}>
            {dictionary.header.links.solutions}
          </a>
          <a href="#ecosistema" onClick={closeMenu}>
            {dictionary.header.links.ecosystem}
          </a>
          <a href="#sectores" onClick={closeMenu}>
            {dictionary.header.links.sectors}
          </a>
          <a href="#contacto" onClick={closeMenu}>
            {dictionary.header.links.contact}
          </a>
          <LocaleSelector locale={locale} onNavigate={closeMenu} />
        </nav>
        <LocaleSelector locale={locale} />
        <a className="header-contact" href="#contacto">
          {dictionary.header.contact} <span aria-hidden="true">↗</span>
        </a>
      </header>
      <Hero
        families={localizedFamilies}
        heroRef={heroRef}
        outcomes={localizedOutcomes}
        copy={dictionary.hero}
        status={dictionary.status}
      />
      <OutcomeNavigator
        copy={dictionary.outcomes}
        onSelectOutcome={setActiveOutcome}
      />
      <Portfolio
        activeOutcome={activeOutcome}
        copy={dictionary.catalog}
        families={localizedFamilies}
        locale={locale}
        onClearOutcome={() => setActiveOutcome(null)}
      />
      <Ecosystem copy={dictionary.ecosystem} />
      <FormatsAndCapabilities
        capabilities={dictionary.capabilities}
        formats={dictionary.formats}
      />
      <SectorAtlas copy={dictionary.sectors} />
      <ProjectModes copy={dictionary.projectModes} />
      <Contact
        brandAriaLabel={dictionary.header.brandAriaLabel}
        contactRef={contactRef}
        copy={dictionary.contact}
        footerRef={footerRef}
      />
      <BackToTop
        contactRef={contactRef}
        copy={dictionary.backToTop}
        footerRef={footerRef}
        heroRef={heroRef}
        mobileMenuOpen={menuOpen}
      />
    </main>
  );
}
