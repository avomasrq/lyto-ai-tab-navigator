import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
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
        
        <h1 className="text-4xl font-serif mb-4">Privacy Policy</h1>
        <p className="text-lg text-muted-foreground mb-8">Lyto AI Extension</p>
        
        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
          <p className="text-sm italic">
            Last updated: May 2026
          </p>

          <p>
            This policy describes how the Lyto AI browser extension ("Lyto") handles information. Lyto is an AI-powered research and browser assistant.
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">Personal Data We Collect</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Email address</strong> — collected when you create an account.</li>
              <li><strong>Conversation messages and AI responses</strong> — the messages you send and the responses Lyto generates are stored while your account is active.</li>
              <li><strong>Usage metadata</strong> — timestamps, session counts, and request counts used to enforce plan limits and improve the service.</li>
            </ul>
            <p>We do <strong>not</strong> collect your name, phone number, physical location, or payment data. Payment is processed entirely by our payment provider (Polar) and no card details are ever seen or stored by Lyto.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">What Lyto Does</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Chat and research:</strong> You send messages; Lyto uses external AI providers to answer and can open relevant links in tabs.
              </li>
              <li>
                <strong>Browser actions:</strong> Lyto runs actions you request (open URL, click, fill non-sensitive fields, scroll) on the active tab.
              </li>
              <li>
                <strong>Page context:</strong> When you run a task that needs it, Lyto may use a snapshot of the page (structure, links, form field labels — not password or payment values) or a screenshot, only for that task.
              </li>
              <li>
                <strong>Sign-in confirmation:</strong> Lyto does not read, fill, or use your passwords. It relies on Chrome's autofill to populate credential fields and requires your explicit approval before submitting any form. No credentials are ever stored, accessed, or sent by Lyto.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">Information We Do Not Collect</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Passwords:</strong> Lyto never reads, stores, or fills password fields. No Credential Management API is used.</li>
              <li><strong>Payment data:</strong> Lyto never reads or fills card numbers, CVV, expiry, or other payment fields.</li>
              <li><strong>Background scraping:</strong> Lyto does not read page content or take screenshots in the background. The background script only uses tab metadata (URL, title) for context.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">Third-Party AI Providers</h2>
            <p>Your messages and page context may be sent to the following providers to generate AI responses:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Google Gemini</strong> — used for AI responses and browser task reasoning.</li>
              <li><strong>Anthropic Claude</strong> — used for AI responses and deep research tasks.</li>
              <li><strong>Perplexity</strong> — used for web search and real-time information retrieval.</li>
            </ul>
            <p>Each provider processes data under their own privacy policy. Passwords and payment data are never included in any data sent to these providers.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">Data Retention</h2>
            <p>
              Conversation history and usage metadata are retained for as long as your account is active. You may request deletion of your account and all associated data by contacting us at <a href="mailto:info@trylyto.com" className="text-primary hover:underline underline-offset-4">info@trylyto.com</a>. All personal data is permanently deleted within <strong>30 days</strong> of account deletion.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">Security</h2>
            <p>
              All data in transit is encrypted via <strong>HTTPS/TLS</strong>. Backend data is stored on encrypted infrastructure. We apply industry-standard security practices to protect your information from unauthorised access, alteration, or disclosure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Access</strong> the personal data we hold about you.</li>
              <li><strong>Correct</strong> any inaccuracies in your data.</li>
              <li><strong>Request deletion</strong> of your account and all associated data.</li>
              <li><strong>Export</strong> your conversation history.</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at <a href="mailto:info@trylyto.com" className="text-primary hover:underline underline-offset-4">info@trylyto.com</a> and we will respond within 30 days.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">Your Choices</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>You can stop using the extension at any time by disabling or removing it from Chrome.</li>
              <li>You can avoid features that send page context (e.g. don't ask Lyto to describe or interact with a page) if you prefer not to share any page data.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">Updates</h2>
            <p>
              We may update this policy. The "Last updated" date will be revised when we do. Continued use of Lyto after changes means you accept the updated policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">Contact</h2>
            <p>
              For privacy-related questions, requests, or concerns, contact us at{' '}
              <a href="mailto:info@trylyto.com" className="text-primary hover:underline underline-offset-4">
                info@trylyto.com
              </a>. We aim to respond within 2 business days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
