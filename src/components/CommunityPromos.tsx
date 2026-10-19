import { useEffect, useState } from "react";

export const ADMIN_TELEGRAM_URL = "https://t.me/Bugcodex";
export const CHANNEL_ONE_URL = "https://t.me/+QCnsBsFv1p02MTQ0";
export const CHANNEL_TWO_URL = "https://t.me/virusxnav";

function useLiveViewers() {
  const [viewers, setViewers] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    const updateViewers = async () => {
      try {
        const response = await fetch("/api/viewers");

        if (!response.ok) return;

        const data = await response.json();

        if (
          active &&
          typeof data.viewers === "number" &&
          Number.isFinite(data.viewers) &&
          data.viewers >= 0
        ) {
          setViewers(data.viewers);
        }
      } catch {
        // Keep the current value if the service is unavailable.
      }
    };

    updateViewers();

    const timer = window.setInterval(updateViewers, 15000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  return viewers;
}

export default function CommunityPromos() {
  const [showPopup, setShowPopup] = useState(true);
  const viewers = useLiveViewers();

  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showPopup]);

  const buttonStyle = {
    display: "block",
    width: "100%",
    padding: "13px 16px",
    borderRadius: "10px",
    textAlign: "center" as const,
    fontWeight: 700,
    textDecoration: "none",
    boxSizing: "border-box" as const,
    cursor: "pointer",
    fontSize: "14px",
  };

  return (
    <>
      {/* CURRENTLY VIEWERS */}
      <div
        aria-live="polite"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "9px",
          padding: "12px 16px",
          margin: "12px 16px",
          background: "#171717",
          color: "#fff",
          border: "1px solid #333",
          borderRadius: "12px",
          fontWeight: 700,
          fontSize: "14px",
        }}
      >
        <span
          style={{
            width: "9px",
            height: "9px",
            background: "#22c55e",
            borderRadius: "50%",
            flexShrink: 0,
          }}
        />

        CURRENTLY VIEWERS: {viewers === null ? "—" : viewers}
      </div>

      {/* PAID ADS BANNER */}
      <section
        style={{
          margin: "16px",
          padding: "20px",
          borderRadius: "14px",
          background: "linear-gradient(135deg, #191919, #3b1015)",
          border: "1px solid #e63946",
          color: "white",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "22px", fontWeight: 900 }}>
          📢 ADVERTISE ON STREAMZONE LIVE
        </div>

        <p style={{ color: "#ddd", margin: "10px 0 16px" }}>
          Promote your channel, brand or business with us!
        </p>

        <a
          href={ADMIN_TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...buttonStyle,
            background: "#e63946",
            color: "#fff",
          }}
        >
          DM FOR PAID ADS ↗
        </a>
      </section>

      {/* FLOATING ADMIN BUTTON */}
      <a
        href={ADMIN_TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          right: "16px",
          bottom: "20px",
          zIndex: 900,
          background: "#229ED9",
          color: "#fff",
          padding: "13px 17px",
          borderRadius: "30px",
          textDecoration: "none",
          fontWeight: 800,
          boxShadow: "0 4px 18px #0006",
        }}
      >
        ✈ Connect Admin
      </a>

      {/* TELEGRAM CHANNEL POPUP */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.88)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="telegram-popup-title"
            style={{
              width: "100%",
              maxWidth: "380px",
              padding: "25px",
              borderRadius: "20px",
              background: "#151515",
              border: "1px solid #333",
              color: "white",
              textAlign: "center",
              boxShadow: "0 15px 60px #0009",
            }}
          >
            <div style={{ fontSize: "42px" }}>✈️</div>

            <h2
              id="telegram-popup-title"
              style={{ margin: "10px 0", fontSize: "24px" }}
            >
              Join Our Telegram
            </h2>

            <p style={{ color: "#bdbdbd", marginBottom: "22px" }}>
              Join this channel for more links
            </p>

            <a
              href={CHANNEL_ONE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...buttonStyle,
                background: "#229ED9",
                color: "#fff",
                marginBottom: "12px",
              }}
            >
              JOIN CHANNEL 1 ↗
            </a>

            <a
              href={CHANNEL_TWO_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...buttonStyle,
                background: "#229ED9",
                color: "#fff",
                marginBottom: "18px",
              }}
            >
              JOIN CHANNEL 2 ↗
            </a>

            <button
              type="button"
              onClick={() => setShowPopup(false)}
              style={{
                ...buttonStyle,
                background: "#16a34a",
                color: "#fff",
                border: "none",
              }}
            >
              ✓ ALREADY JOINED
            </button>

            <p style={{ color: "#777", fontSize: "11px", marginBottom: 0 }}>
              Membership is not automatically verified.
            </p>
          </div>
        </div>
      )}
    </>
  );
          }
