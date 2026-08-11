import posthog from "posthog-js";
import * as Sentry from "@sentry/react";

/**
 * Real product analytics (PostHog) + crash reporting (Sentry).
 * Both initialise only if their public env keys are present — otherwise no-op,
 * so local dev and unconfigured builds never break.
 */
let phReady = false;

export function initAnalytics() {
  const phKey = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
  const phHost =
    (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ||
    "https://us.i.posthog.com";
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;

  if (phKey) {
    posthog.init(phKey, {
      api_host: phHost,
      capture_pageview: true,
      autocapture: true,
      person_profiles: "always",
    });
    phReady = true;
  }

  if (sentryDsn) {
    Sentry.init({
      dsn: sentryDsn,
      tracesSampleRate: 0.2,
      replaysSessionSampleRate: 0,
    });
  }
}

/** Track a product event (no-op if PostHog not configured). */
export function track(event: string, props: Record<string, unknown> = {}) {
  if (phReady) posthog.capture(event, props);
}
