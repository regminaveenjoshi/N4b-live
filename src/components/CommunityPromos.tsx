import { useEffect, useState } from "react";

export const ADMIN_TELEGRAM_URL = "https://t.me/Bugcodex";
export const CHANNEL_ONE_URL = "https://t.me/+QCnsBsFv1p02MTQ0";
export const CHANNEL_TWO_URL = "https://t.me/virusxnav";

export default function CommunityPromos() {
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showPopup]);

  const buttonStyle = {
    display: "block",
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    textAlign: "center" as const,
    fontWeight: 700,
    textDecoration: "none",
    boxSizing: "border-box" as const,
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.25s ease",
  };

  return (
    <>
      <style>
        {`
          @keyframes glassFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes glassFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }

          .glass-join-btn,
          .glass-ad-btn {
            transition: transform .2s ease, filter .2s ease;
          }

          .glass-join-btn:active,
          .glass-ad-btn:active {
            transform: scale(.97);
            filter: brightness(1.12);
          }

          .glass-ad-btn:hover {
            filter: brightness(1.12);
            transform: translateY(-2px);
          }
        `}
      </style>

      {/* PREMIUM GLASS ADVERTISEMENT BANNER */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          margin: "24px 16px",
          padding: "28px 22px",
          borderRadius: "26px",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.075), rgba(230,57,70,0.10), rgba(255,255,255,0.025))",
          border: "1px solid rgba(255,100,120,0.32)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          color: "#fff",
          textAlign: "center",
          boxShadow:
            "0 18px 55px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.09)",
        }}
      >
        {/* Red glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-95px",
            right: "-65px",
            width: "210px",
            height: "190px",
            borderRadius: "50%",
            background: "rgba(230,57,70,0.22)",
            filter: "blur(65px)",
            pointerEvents: "none",
          }}
        />

        {/* Blue glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "-110px",
            left: "-70px",
            width: "190px",
            height: "180px",
            borderRadius: "50%",
            background: "rgba(34,158,217,0.13)",
            filter: "blur(65px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "7px 12px",
              borderRadius: "30px",
              background: "rgba(255,255,255,0.065)",
              border: "1px solid rgba(255,255,255,0.13)",
              color: "#ffb6bf",
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "2px",
              marginBottom: "20px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                background: "#ff5267",
                borderRadius: "50%",
                boxShadow: "0 0 10px #ff5267",
              }}
            />
            ADVERTISING PARTNERS
          </div>

          <div
            style={{
              width: "66px",
              height: "66px",
              margin: "0 auto 18px",
              borderRadius: "22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              background:
                "linear-gradient(145deg, rgba(255,90,110,0.20), rgba(255,255,255,0.045))",
              border: "1px solid rgba(255,110,125,0.28)",
              boxShadow: "0 8px 28px rgba(230,57,70,0.12)",
            }}
          >
            📢
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "clamp(23px, 6vw, 30px)",
              fontWeight: 900,
              lineHeight: 1.25,
              letterSpacing: "-0.8px",
            }}
          >
            Advertise on
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg, #ff8997, #ffffff, #ff657a)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              StreamZone Live
            </span>
          </h2>

          <p
            style={{
              maxWidth: "300px",
              margin: "15px auto 23px",
              color: "rgba(255,255,255,0.68)",
              fontSize: "14px",
              lineHeight: 1.8,
            }}
          >
            Promote your Telegram channel, brand or business with us.
            Reach your target audience through paid promotions.
          </p>

          <div
            style={{
              height: "1px",
              margin: "0 0 21px",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
            }}
          />

          <a
            className="glass-ad-btn"
            href={ADMIN_TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              width: "100%",
              padding: "16px",
              boxSizing: "border-box",
              borderRadius: "15px",
              background: "linear-gradient(135deg, #ff5368, #df233f)",
              border: "1px solid rgba(255,255,255,0.19)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 900,
              fontSize: "14px",
              letterSpacing: "0.3px",
              boxShadow: "0 8px 25px rgba(230,57,70,0.22)",
            }}
          >
            <span>DM FOR PAID ADS</span>
            <span style={{ fontSize: "18px" }}>↗</span>
          </a>

          <p
            style={{
              margin: "15px 0 0",
              color: "rgba(255,255,255,0.38)",
              fontSize: "10px",
              letterSpacing: "0.5px",
            }}
          >
            YOUR BRAND · OUR PLATFORM · ONE CONNECTION
          </p>
        </div>
      </section>

      {/* FLOATING CONNECT ADMIN BUTTON */}
      <a
        href={ADMIN_TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          right: "16px",
          bottom: "85px",
          zIndex: 900,
          background: "rgba(34,158,217,0.82)",
          backdropFilter: "blur(15px)",
          WebkitBackdropFilter: "blur(15px)",
          border: "1px solid rgba(255,255,255,0.24)",
          color: "#fff",
          padding: "13px 17px",
          borderRadius: "30px",
          textDecoration: "none",
          fontWeight: 800,
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
        }}
      >
        ✈ Connect Admin
      </a>

      {/* GLASS TELEGRAM POPUP */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.64)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "22px",
            animation: "glassFadeIn 0.35s ease",
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="telegram-popup-title"
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "370px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "30px 23px 24px",
              borderRadius: "28px",
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.13), rgba(255,255,255,0.045))",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              textAlign: "center",
              boxShadow:
                "0 25px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
            }}
          >
            {/* Blue glow */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "-90px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "220px",
                height: "180px",
                background: "rgba(34,158,217,0.24)",
                filter: "blur(65px)",
                borderRadius: "50%",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "relative",
                width: "76px",
                height: "76px",
                margin: "0 auto 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "24px",
                fontSize: "38px",
                background: "rgba(34,158,217,0.14)",
                border: "1px solid rgba(100,200,255,0.3)",
                boxShadow: "0 8px 30px rgba(34,158,217,0.12)",
                animation: "glassFloat 3s ease-in-out infinite",
              }}
            >
              ✈️
            </div>

            <h2
              id="telegram-popup-title"
              style={{
                position: "relative",
                margin: "0 0 10px",
                fontSize: "26px",
                fontWeight: 850,
                letterSpacing: "-0.7px",
              }}
            >
              Join Our Telegram
            </h2>

            <p
              style={{
                position: "relative",
                color: "rgba(255,255,255,0.7)",
                fontSize: "14px",
                lineHeight: 1.6,
                margin: "0 0 25px",
              }}
            >
              Join our channels to get more links and updates.
            </p>

            <a
              className="glass-join-btn"
              href={CHANNEL_ONE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...buttonStyle,
                position: "relative",
                marginBottom: "12px",
                color: "#fff",
                background:
                  "linear-gradient(135deg, rgba(41,182,246,0.95), rgba(0,119,190,0.95))",
                border: "1px solid rgba(255,255,255,0.24)",
                boxShadow: "0 7px 22px rgba(0,145,220,0.18)",
              }}
            >
              ✈ JOIN CHANNEL 1 ↗
            </a>

            <a
              className="glass-join-btn"
              href={CHANNEL_TWO_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...buttonStyle,
                position: "relative",
                marginBottom: "19px",
                color: "#fff",
                background: "rgba(255,255,255,0.075)",
                border: "1px solid rgba(255,255,255,0.19)",
              }}
            >
              ✈ JOIN CHANNEL 2 ↗
            </a>

            <button
              className="glass-join-btn"
              type="button"
              onClick={() => setShowPopup(false)}
              style={{
                ...buttonStyle,
                position: "relative",
                color: "#fff",
                background:
                  "linear-gradient(135deg, rgba(34,197,94,0.95), rgba(15,150,75,0.95))",
                border: "1px solid rgba(255,255,255,0.23)",
                boxShadow: "0 7px 22px rgba(34,197,94,0.15)",
              }}
            >
              ✓ ALREADY JOINED
            </button>

            <p
              style={{
                position: "relative",
                color: "rgba(255,255,255,0.43)",
                fontSize: "10px",
                margin: "15px 0 0",
              }}
            >
              Membership is not automatically verified.
            </p>
          </div>
        </div>
      )}
    </>
  );
                }
