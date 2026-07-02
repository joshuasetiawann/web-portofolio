"use client";

/**
 * Catches errors thrown by the root layout itself. Must render its own
 * <html>/<body>. Kept dependency-free and inline-styled so it works even if
 * the app shell / theme provider / token layer is what failed. Colors are the
 * DATUM INSTRUMENT (dark) hex values, hardcoded because tokens may be unavailable.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const mono = '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
  const sans = '"Archivo", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  const signal = "#FF4A1C";
  const bone = "#F1EFE9";
  const muted = "#9C9A92";
  const subtle = "#6C6A64";
  const rule = "#2A2A2F";

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          background: "#0D0D0F",
          color: bone,
          fontFamily: sans,
          padding: "1.5rem",
        }}
      >
        <main
          style={{
            width: "100%",
            maxWidth: "640px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "1.25rem",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              fontFamily: mono,
              fontSize: "0.8125rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: bone,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <span
              aria-hidden="true"
              style={{ display: "block", width: "40px", height: "1px", background: signal }}
            />
            ERR · 500
          </span>

          <h1
            style={{
              margin: 0,
              fontFamily: sans,
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: 800,
              letterSpacing: "-0.01em",
              lineHeight: 1.05,
            }}
          >
            Calibration fault
          </h1>

          <p style={{ margin: 0, maxWidth: "52ch", color: muted, lineHeight: 1.6 }}>
            A critical fault interrupted the instrument. Reload to recalibrate, or return to the
            index.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "2rem",
              borderTop: `1px solid ${rule}`,
              paddingTop: "1rem",
              width: "100%",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                appearance: "none",
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                fontFamily: mono,
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: bone,
              }}
            >
              Recalibrate
            </button>
            {/* global-error replaces the root layout; a hard full-document reload is intended. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                fontFamily: mono,
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: muted,
                textDecoration: "none",
              }}
            >
              Return to index
            </a>
          </div>

          {error.digest ? (
            <p
              style={{
                margin: 0,
                fontFamily: mono,
                fontSize: "0.75rem",
                letterSpacing: "0.04em",
                color: subtle,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              DIGEST: {error.digest}
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
