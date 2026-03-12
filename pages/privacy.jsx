import Head from "next/head";

export default function PrivacyPolicy() {
  const styles = {
    page: {
      minHeight: "100vh",
      background: "#020a02",
      color: "#4ade80",
      fontFamily: "'Courier New', monospace",
      padding: "60px 24px",
    },
    container: {
      maxWidth: 760,
      margin: "0 auto",
    },
    header: {
      textAlign: "center",
      marginBottom: 48,
      paddingBottom: 24,
      borderBottom: "1px solid #1a3a1a",
    },
    logo: {
      fontSize: 20,
      fontWeight: 900,
      color: "#f0c040",
      letterSpacing: "0.2em",
      marginBottom: 6,
    },
    rule: {
      height: 1,
      background: "linear-gradient(to right, transparent, #f0c040, transparent)",
      marginBottom: 20,
    },
    title: {
      fontFamily: "Georgia, serif",
      fontSize: 22,
      color: "#f0c040",
      fontWeight: 900,
      marginBottom: 8,
    },
    updated: {
      fontSize: 11,
      color: "#4ade80",
      opacity: 0.5,
      letterSpacing: "0.15em",
    },
    section: {
      marginBottom: 36,
    },
    sectionTitle: {
      fontSize: 12,
      color: "#f0c040",
      fontWeight: 900,
      letterSpacing: "0.2em",
      marginBottom: 12,
      paddingBottom: 6,
      borderBottom: "1px solid #1a3a1a",
    },
    body: {
      fontSize: 12,
      color: "#4ade80",
      lineHeight: 2,
      opacity: 0.85,
    },
    link: {
      color: "#f0c040",
      textDecoration: "none",
    },
    footer: {
      marginTop: 48,
      paddingTop: 24,
      borderTop: "1px solid #1a3a1a",
      textAlign: "center",
      fontSize: 10,
      color: "#4ade80",
      opacity: 0.4,
      letterSpacing: "0.15em",
    },
  };

  return (
    <>
      <Head>
        <title>Privacy Policy — STARGATE</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <div style={styles.logo}>STARGATE</div>
            <div style={styles.rule} />
            <div style={styles.title}>Privacy Policy</div>
            <div style={styles.updated}>EFFECTIVE DATE: MARCH 12, 2026</div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>▸ 01 — OVERVIEW</div>
            <div style={styles.body}>
              This Privacy Policy describes how AlphaBriefing LLC ("Company", "we", "us", or "our") collects, uses, and protects information when you use STARGATE at psiop.io. We are committed to protecting your privacy and handling your data with transparency.
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>▸ 02 — INFORMATION WE COLLECT</div>
            <div style={styles.body}>
              <strong style={{ color: "#f0c040" }}>Account Information:</strong> When you create an account, we collect your email address and any profile information you provide. Account authentication is managed by Clerk.<br /><br />
              <strong style={{ color: "#f0c040" }}>Payment Information:</strong> When you subscribe, payment is processed by Stripe. We do not store your credit card number or payment details. We receive confirmation of payment status and subscription tier only.<br /><br />
              <strong style={{ color: "#f0c040" }}>Session Data:</strong> Remote viewing session transcripts and responses you submit during sessions are stored locally on your device. We may collect anonymized or aggregated session data for research and product improvement purposes. You may opt out of research data collection by contacting us at <a href="mailto:monitor@psiop.io" style={styles.link}>monitor@psiop.io</a>.<br /><br />
              <strong style={{ color: "#f0c040" }}>Usage Data:</strong> We collect anonymous analytics data including page views, session counts, device type, and general geographic region via Vercel Analytics. This data contains no personally identifiable information.
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>▸ 03 — HOW WE USE YOUR INFORMATION</div>
            <div style={styles.body}>
              We use the information we collect to: (a) provide and maintain the STARGATE platform; (b) process subscription payments and manage your account; (c) communicate with you about your account or subscription; (d) improve the platform based on usage patterns; (e) conduct research into remote viewing methodology and practice with anonymized data; and (f) comply with legal obligations.
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>▸ 04 — THIRD PARTY SERVICES</div>
            <div style={styles.body}>
              STARGATE uses the following third-party services, each with their own privacy policies:<br /><br />
              <strong style={{ color: "#f0c040" }}>Clerk</strong> — Authentication and user identity management. <a href="https://clerk.com/privacy" style={styles.link}>clerk.com/privacy</a><br /><br />
              <strong style={{ color: "#f0c040" }}>Stripe</strong> — Payment processing. <a href="https://stripe.com/privacy" style={styles.link}>stripe.com/privacy</a><br /><br />
              <strong style={{ color: "#f0c040" }}>Anthropic</strong> — AI Monitor feedback is generated via the Anthropic API. Session content submitted for evaluation is processed by Anthropic's systems subject to their privacy policy. <a href="https://anthropic.com/privacy" style={styles.link}>anthropic.com/privacy</a><br /><br />
              <strong style={{ color: "#f0c040" }}>Vercel</strong> — Hosting and anonymous analytics. <a href="https://vercel.com/legal/privacy-policy" style={styles.link}>vercel.com/legal/privacy-policy</a>
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>▸ 05 — DATA RETENTION</div>
            <div style={styles.body}>
              Account data is retained for as long as your account is active. Session data stored on your device is controlled entirely by you and can be cleared at any time through your browser. If you delete your account, your personal data will be removed from our systems within 30 days.
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>▸ 06 — YOUR RIGHTS</div>
            <div style={styles.body}>
              You have the right to: (a) access the personal data we hold about you; (b) request correction of inaccurate data; (c) request deletion of your account and associated data; (d) opt out of research data collection; and (e) withdraw consent at any time. To exercise any of these rights, contact us at <a href="mailto:monitor@psiop.io" style={styles.link}>monitor@psiop.io</a>.
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>▸ 07 — CHILDREN'S PRIVACY</div>
            <div style={styles.body}>
              STARGATE is not directed at individuals under 18 years of age. We do not knowingly collect personal information from minors. If we become aware that a minor has provided us with personal information, we will delete it promptly.
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>▸ 08 — SECURITY</div>
            <div style={styles.body}>
              We implement reasonable technical and organizational measures to protect your information. All data transmission is encrypted via HTTPS. Authentication is managed by Clerk with industry-standard security practices. Payment data is handled exclusively by Stripe and never touches our servers.
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>▸ 09 — CHANGES TO THIS POLICY</div>
            <div style={styles.body}>
              We may update this Privacy Policy from time to time. Material changes will be communicated via email to registered users. Continued use of STARGATE after changes are posted constitutes acceptance of the updated policy.
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>▸ 10 — CONTACT</div>
            <div style={styles.body}>
              For privacy-related questions or requests:<br /><br />
              AlphaBriefing LLC<br />
              Texas, United States<br />
              <a href="mailto:monitor@psiop.io" style={styles.link}>monitor@psiop.io</a>
            </div>
          </div>

          <div style={styles.footer}>
            ALPHABRIEFING LLC — TEXAS, USA — PSIOP.IO
          </div>
        </div>
      </div>
    </>
  );
}
