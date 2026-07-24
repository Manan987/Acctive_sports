"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>
        <div style={{ display: "grid", placeItems: "center", minHeight: "100vh", padding: 24, textAlign: "center" }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800 }}>Something went wrong</h1>
            <p style={{ color: "#64748b", marginTop: 8 }}>
              An unexpected error occurred. Please try again.
            </p>
            <button
              onClick={reset}
              style={{
                marginTop: 20,
                background: "#ff5a0f",
                color: "#fff",
                border: 0,
                borderRadius: 999,
                padding: "10px 22px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
