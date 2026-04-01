import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for our website.',
}

export default function PrivacyPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'AutoBlog AI'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg2)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, background: 'var(--amber)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✦</div>
            <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 16, fontWeight: 700, color: 'var(--amber)' }}>{siteName}</span>
          </Link>
          <Link href="/" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>← Home</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 40 }}>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="blog-content">
          <p>This Privacy Policy describes how {siteName} ("{siteUrl}") collects, uses, and shares information about you when you use our website.</p>

          <h2>Information We Collect</h2>
          <p>We collect information you provide directly, such as your email address when subscribing to our newsletter. We also automatically collect certain information when you visit our site, including your IP address, browser type, referring URLs, and pages viewed.</p>

          <h2>Cookies and Tracking</h2>
          <p>We use cookies and similar tracking technologies to improve your browsing experience. This includes:</p>
          <ul>
            <li><strong>Google Analytics</strong> — to understand how visitors use our site</li>
            <li><strong>Google AdSense</strong> — to display relevant advertising. Google uses cookies to serve ads based on your prior visits to our site and other sites on the Internet.</li>
            <li><strong>Session cookies</strong> — to maintain your preferences</li>
          </ul>
          <p>You can opt out of Google's use of cookies by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer">Google's Ad Settings</a>.</p>

          <h2>Advertising</h2>
          <p>We use Google AdSense to display advertisements. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. You may opt out of personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noreferrer">www.aboutads.info</a>.</p>

          <h2>Affiliate Links</h2>
          <p>Some articles on this site contain affiliate links, primarily to Amazon.com. If you click an affiliate link and make a purchase, we may earn a small commission at no additional cost to you. We only link to products we believe may be relevant and useful to our readers.</p>

          <h2>Email Newsletter</h2>
          <p>If you subscribe to our newsletter, we will store your email address and use it to send you periodic content updates. You can unsubscribe at any time using the link in any newsletter email.</p>

          <h2>Third-Party Links</h2>
          <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites and encourage you to review their privacy policies.</p>

          <h2>Data Retention</h2>
          <p>We retain personal information for as long as necessary to provide our services. You may request deletion of your data by contacting us at the email below.</p>

          <h2>Your Rights</h2>
          <p>Depending on your location, you may have the right to access, correct, or delete your personal data. To exercise these rights, please contact us.</p>

          <h2>Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at: <a href={`mailto:privacy@${siteUrl.replace('https://', '')}`}>privacy@yourdomain.com</a></p>
        </div>
      </div>
    </div>
  )
}
