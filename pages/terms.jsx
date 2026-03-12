import Head from "next/head";

export default function TermsOfService() {
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
        <title>Terms of Service — STARGATE</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <div style={styles.logo}>STARGATE</div>
            <div style={styles.rule} />
            <div style={styles.title}>Terms of Service</div>
            <div style={styles.updated}>EFFECTIVE DATE: MARCH 12, 2026</div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>▸ 01 — AGREEMENT</div>
            <div style={styles.body}>
              These Terms of Service ("Terms") govern your access to and use of STARGATE, a remote viewing training platform operated by AlphaBriefing LLC ("Company", "we", "us", or "our"), a Texas limited liability company. By accessing or using STARGATE at psiop.io, you agree to be bound by these Terms. If you do not agree, do not use the platform.
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>▸ 02 — DESCRIPTION OF SERVICE</div>
            <div style={styles.body}>
              STARGATE is a remote viewing training and simulation platform built on structured psychoenergetics protocols derived from declassified U.S. government research. The platform provides structured practice sessions, AI-generated feedback, and personal session archiving. STARGATE is a training tool for personal development and educational exploration. It does not claim to confer any verified psychic or paranormal abilities.
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>▸ 03 — ELIGIBILITY</div>
            <div style={styles.body}>
              You must be at least 18 years of age to use STARGATE. By using the platform you represent that you meet this requirement. The platform is intended for personal, non-commercial use only.
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>▸ 04 — ACCOUNTS</div>
            <div style={styles.body}>
              You must create an account to access session features. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately at <a href="mailto:monitor@psiop.io" style={styles.link}>monitor@psiop.io</a> if you suspect unauthorized access.
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>▸ 05 — SUBSCRIPTIONS AND BILLING</div>
            <div style={styles.body}>
              Access to STARGATE sessions requires an active paid subscription. Subscriptions are billed on a monthly or annual basis as selected at checkout. Payments are processed securely by Stripe. You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period. No refunds are issued for partial billing periods. AlphaBriefing LLC reserves the right to change pricing with 30 days notice.
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>▸ 06 — ACCEPTABLE USE</div>
            <div style={styles.body}>
              You agree not to use STARGATE to: (a) violate any applicable law or regulation; (b) attempt to reverse engineer, scrape, or copy the platform or its content; (c) use automated systems to access the platform; (d) submit false or misleading information; or (e) interfere with the platform's operation or security. We reserve the right to terminate accounts that violate these terms.
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>▸ 07 — INTELLECTUAL PROPERTY</div>
            <div style={styles.body}>
              All content, design, protocols, AI feedback systems, and software comprising STARGATE are the property of AlphaBriefing LLC and are protected by applicable intellectual property laws. The underlying remote viewing methodology is derived from declassified public domain research. You may not reproduce or distribute STARGATE content without written permission.
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>▸ 08 — DISCLAIMER OF WARRANTIES</div>
            <div style={styles.body}>
              STARGATE is provided "as is" without warranties of any kind, express or implied. We do not warrant that the platform will be uninterrupted, error-free, or that any particular results will be achieved through use of the platform. Remote viewing is an experimental practice. AlphaBriefing LLC makes no claims regarding its efficacy.
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>▸ 09 — LIMITATION OF LIABILITY</div>
            <div style={styles.body}>
              To the maximum extent permitted by law, AlphaBriefing LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of STARGATE. Our total liability to you for any claim shall not exceed the amount you paid to us in the 12 months preceding the claim.
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>▸ 10 — GOVERNING LAW</div>
            <div style={styles.body}>
              These Terms are governed by the laws of the State of Texas, United States, without regard to conflict of law principles. Any disputes shall be resolved in the courts of Texas.
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>▸ 11 — CHANGES TO TERMS</div>
            <div style={styles.body}>
              We reserve the right to modify these Terms at any time. Continued use of STARGATE after changes are posted constitutes acceptance of the updated Terms. Material changes will be communicated via email.
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>▸ 12 — CONTACT</div>
            <div style={styles.body}>
              Questions regarding these Terms should be directed to:<br /><br />
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
