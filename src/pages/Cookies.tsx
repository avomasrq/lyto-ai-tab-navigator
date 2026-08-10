import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Cookies = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl py-16 px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <h1 className="text-4xl font-serif mb-2">Cookie Policy</h1>
        <p className="text-lg text-muted-foreground mb-2">Argos Extension</p>
        <p className="text-sm text-muted-foreground italic mb-10">Last updated: June 2026</p>

        <div className="prose prose-invert max-w-none space-y-10 text-muted-foreground">

          <p>
            This Cookie Policy explains how Argos ("Argos", "we", "us", or "our") uses cookies
            and similar technologies when you use our website and Chrome extension.
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">1. What Are Cookies</h2>
            <p>
              Cookies are small text files stored on your device by your web browser. They help websites
              remember your preferences, keep you signed in, and understand how you interact with a site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">2. Cookies We Use</h2>

            <h3 className="text-lg font-semibold text-foreground">Essential Cookies</h3>
            <p>These cookies are required for the website and extension to function. They cannot be disabled.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Authentication:</strong> Session cookies from Supabase to keep you signed in.</li>
              <li><strong>Security:</strong> CSRF tokens to protect against cross-site request forgery.</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mt-4">Functional Cookies</h3>
            <p>These cookies remember your preferences and settings.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>User preferences:</strong> Theme, language, and extension settings stored locally via Chrome's storage API.</li>
              <li><strong>Subscription state:</strong> Locally cached plan information to avoid unnecessary API calls.</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mt-4">Analytics Cookies</h3>
            <p>We use Vercel Analytics to understand how visitors use our website.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Vercel Analytics:</strong> Privacy-focused, cookieless analytics that do not track individual users or use cookies. Page views and web vitals are collected anonymously.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">3. Third-Party Cookies</h2>
            <p>
              We do not use third-party advertising cookies. The only external services that may set cookies are:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Supabase:</strong> Authentication and session management.</li>
              <li><strong>Polar:</strong> Payment and subscription management (only on checkout pages).</li>
              <li><strong>Google OAuth:</strong> If you sign in with Google, Google may set its own authentication cookies.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">4. Browser Extension Cookies</h2>
            <p>
              The Argos Chrome extension uses Chrome's local storage API (not traditional cookies) to store
              your preferences, session state, and configuration. This data stays on your device and is
              not transmitted to our servers unless required for a specific feature you initiate.
            </p>
            <p>
              A task you start can keep running after you close your browser, which means the same signed-in
              session has to be available to Argos on the server side. While you are signed in and the Argos
              panel is open, cookies for sites you have open are read and passed to your own Argos account, so
              those tasks continue as you. You can also hand a specific site over yourself in Settings →
              Browser Sessions, and remove any stored session there at any time. Cookies are used only to carry
              your own session into your own tasks — they are never shared with third parties and never used
              for advertising or profiling.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">5. Managing Cookies</h2>
            <p>You can control and delete cookies through your browser settings:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
              <li>You can block all cookies, block third-party cookies, or clear cookies when you close your browser.</li>
            </ul>
            <p>
              Please note that disabling essential cookies may prevent you from signing in or using
              certain features of Argos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">6. Changes to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. We will notify you of any significant
              changes by updating the "Last updated" date at the top of this page.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">7. Contact Us</h2>
            <p>
              If you have questions about our use of cookies, contact us at{' '}
              <a href="mailto:info@tryargos.cc" className="text-primary hover:underline">info@tryargos.cc</a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Cookies;
