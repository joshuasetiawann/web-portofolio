"use client";

/**
 * Catches errors thrown by the root layout itself. Must render its own
 * <html>/<body>. Kept dependency-free and inline-styled so it works even if
 * the app shell / theme provider is what failed.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          display: "grid",
          placeItems: "center",
          minHeight: "100dvh",
          margin: 0,
          background: "#05070d",
          color: "#eaedf5",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "28rem", padding: "1.5rem" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Something went wrong</h1>
          <p style={{ color: "#a4abbd", marginBottom: "1.25rem" }}>
            A critical error occurred. Please reload the page.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: "none",
              background: "#5e8bff",
              color: "#05070d",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {error.digest ? (
            <p style={{ color: "#687085", fontSize: "0.75rem", marginTop: "1rem" }}>
              Digest: {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
