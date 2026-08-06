import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
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

        <h1 className="text-4xl font-serif mb-8">Terms of Service</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-lg">
            Last updated: June 18, 2026
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">1. Acceptance of Terms</h2>
            <p>
              These Terms of Service ("Terms") govern your access to and use of Lyto AI
              ("Lyto", "Service", "we", "us", or "our"), including our Chrome extension,
              website, and related backend services. By installing, accessing, or using
              the Service, you agree to be bound by these Terms and by our{' '}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              If you do not agree, please do not use the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">2. Description of Service</h2>
            <p>
              Lyto is an AI-powered assistant that works inside your browser and in
              connected messaging channels. Depending on the features you use, Lyto can:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Read and summarize the content of web pages you are viewing;</li>
              <li>Perform actions in the browser on your behalf, such as clicking, scrolling, filling forms, and navigating between pages;</li>
              <li>Run tasks autonomously in a server-side browser, including while your browser is closed;</li>
              <li>Conduct research and generate documents, spreadsheets, and other files;</li>
              <li>Connect to third-party services you authorize (for example Google Docs, Gmail, Google Sheets, GitHub, Slack, and messaging platforms);</li>
              <li>Remember information you choose to save to personalize your experience.</li>
            </ul>
            <p>
              We may modify, add, suspend, or discontinue any part of the Service at any
              time. We will make reasonable efforts to notify you of material changes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">3. Eligibility and Accounts</h2>
            <p>To use the Service you must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be at least 13 years old (or the minimum age of digital consent in your jurisdiction);</li>
              <li>Create an account and provide accurate, current information;</li>
              <li>Maintain the security of your account credentials;</li>
              <li>Notify us immediately of any unauthorized access to your account;</li>
              <li>Be responsible for all activity that occurs under your account.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">4. Subscriptions, Billing, and Refunds</h2>
            <p>
              Lyto is a paid service offered through subscription plans (currently "Pro"
              and "Team"), available on monthly or annual billing. New users may be offered
              a free trial period; if you do not cancel before the trial ends, your
              subscription begins and your payment method is charged. Subscriptions are
              processed by our third-party payment provider, Polar. By subscribing, you
              authorize recurring charges to your selected payment method until you cancel.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You can cancel at any time; access continues until the end of the current billing period, and you will not be charged for the next one.</li>
              <li>Usage limits, prices, plan names, and features may change; we will notify you of material changes in advance.</li>
              <li>Refunds are not automatic, but we will consider reasonable refund requests on a case-by-case basis. To request one, contact us at the email below.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service for any unlawful purpose or in violation of any applicable laws or regulations;</li>
              <li>Use Lyto to access systems, accounts, or data you are not authorized to access;</li>
              <li>Infringe the intellectual property or other rights of others;</li>
              <li>Attempt to disrupt, overload, reverse-engineer, or gain unauthorized access to the Service or its infrastructure;</li>
              <li>Use the Service to generate or distribute spam, malware, or harmful, deceptive, or abusive content;</li>
              <li>Circumvent usage limits, security measures, or access controls.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">6. Third-Party Services and Google API</h2>
            <p>
              When you connect third-party accounts, your use of those services remains
              subject to their own terms and privacy policies. We access third-party data
              only to provide the features you request.
            </p>
            <p>
              Lyto's use and transfer of information received from Google APIs adheres to
              the{' '}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements. See our{' '}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>{' '}
              for details on how we handle your data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">7. Your Content and Credentials</h2>
            <p>
              You retain ownership of the content, data, and credentials you provide to the
              Service. You grant us a limited license to process this information solely to
              operate and improve the Service for you. Stored credentials are encrypted, and
              we never sell your personal data. You are responsible for ensuring you have the
              right to share any data you connect to Lyto.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">8. Intellectual Property</h2>
            <p>
              The Service and its original content, features, branding, and functionality
              are owned by Lyto AI and protected by copyright, trademark, and other
              intellectual property laws. These Terms do not grant you any right to use our
              trademarks without prior written permission.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">9. AI Output and Disclaimer</h2>
            <p>
              The Service is provided "as is" and "as available", without warranties of any
              kind. Lyto uses AI models that may produce inaccurate, incomplete, or
              unexpected results, and may take automated actions in your browser or
              connected accounts based on your instructions. You are responsible for
              reviewing outputs and actions and for any consequences of relying on them. Do
              not use the Service for decisions requiring professional, legal, medical, or
              financial advice without independent verification.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Lyto AI shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages, or for any
              loss of data, revenue, or profits, arising from your use of or inability to
              use the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">11. Termination</h2>
            <p>
              You may stop using the Service and delete your account at any time. We may
              suspend or terminate your access if you violate these Terms or use the Service
              in a way that may cause harm to us, other users, or third parties. Upon
              termination, your right to use the Service ends immediately.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">12. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the Republic of Kazakhstan, without
              regard to its conflict-of-law principles. Any disputes shall be subject to the
              competent courts of Kazakhstan, unless otherwise required by applicable law.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">13. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. We will post the revised version
              on this page and update the "Last updated" date. Material changes will be
              communicated where appropriate. Your continued use of the Service after changes
              take effect constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">14. Contact Us</h2>
            <p>
              If you have questions about these Terms, please contact us at info@trylyto.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
