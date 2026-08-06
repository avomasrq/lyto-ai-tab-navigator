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

        <h1 className="text-4xl font-serif mb-2">Privacy Policy</h1>
        <p className="text-lg text-muted-foreground mb-2">Lyto AI Extension</p>
        <p className="text-sm text-muted-foreground italic mb-10">Last updated: June 2026</p>

        <div className="prose prose-invert max-w-none space-y-10 text-muted-foreground">

          <p>
            This Privacy Policy describes how the Lyto AI browser extension ("Lyto", "we", "us", or "our")
            collects, uses, stores, shares, and protects your information. Lyto is an AI-powered research
            and browser assistant.
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">1. Personal Data We Collect and Process</h2>
            <p>We only collect and process the minimum amount of data necessary to provide and improve our services.</p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Account Data:</strong> Email address, collected when you create an account for authentication purposes.</li>
              <li><strong>User Content:</strong> Conversation messages, prompt history, and AI-generated responses stored while your account is active.</li>
              <li>
                <strong>Transient Page Context:</strong> When you explicitly request Lyto to perform a task on an active tab,
                it temporarily processes necessary page metadata (URL, title), page structure (DOM context, links, form field labels),
                or automated screenshots. This data is handled transiently to execute your command and is not stored persistently.
              </li>
              <li>
                <strong>Browser Session Cookies:</strong> When you explicitly use the Browser Sessions feature (entering a domain in
                Settings → Browser Sessions), cookies for that domain are read from your browser and transmitted to Lyto's server
                solely to authenticate the headless browser for that background task. This only happens on your explicit action.
                Cookies are never collected passively or in the background.
              </li>
              <li><strong>Local Extension Data:</strong> User preferences, configuration settings, and active session state stored locally on your device via Chrome's local storage API. This data is not transmitted to our servers unless required for a specific feature.</li>
              <li><strong>Usage Metadata:</strong> Timestamps, session counts, and request counts used to enforce plan limits and monitor system health.</li>
              <li><strong>Integration Tokens:</strong> Encrypted OAuth access tokens if you choose to connect third-party integrations (e.g. Google Sheets, Google Docs, Airtable).</li>
            </ul>
            <h3 className="text-lg font-semibold text-foreground mt-4">Information We Do Not Collect</h3>
            <ul className="list-disc pl-6 space-y-3">
              <li>We do not collect names, phone numbers, physical locations, or payment data. All payments are processed securely via our provider (Polar); we never see or store your card details.</li>
              <li>We never read, store, or fill password fields, and we do not use the Credential Management API. Chrome's autofill populates credential fields; your explicit approval is required before any form is submitted.</li>
              <li>We do not perform background scraping or capture data from tabs unless explicitly triggered by a user action.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">2. How We Use Your Information</h2>
            <p>We use browser APIs strictly to fulfil the single purpose of the extension — research assistance and browser automation — at your direct request:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Automation & Control:</strong> We use the Chrome DevTools Protocol (CDP) via <code>chrome.debugger</code> and <code>chrome.scripting</code> to programmatically perform browser actions (navigation, clicks, scrolling, text input) to automate routine tasks on your behalf.</li>
              <li><strong>Clipboard & Downloads:</strong> Clipboard write access is used to paste data into web applications and to copy research results and AI responses. The Downloads API is used to save AI-generated artifacts or automation screenshots to your local Downloads folder.</li>
              <li><strong>Tab Management:</strong> The <code>tabs</code>, <code>tabGroups</code>, and <code>webNavigation</code> APIs are used to display open tabs in the sidebar for context, switch between tabs, and organise tab groups via natural language commands.</li>
              <li><strong>Notifications:</strong> System alerts are shown when background tasks or research tasks complete.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">3. Data Sharing and Third-Party Disclosure</h2>
            <p>
              We do not sell, rent, trade, or lease your personal data to any third parties under any circumstances.
              To provide our core AI features, we transmit relevant user prompts and page context to the following trusted AI providers:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Google Gemini</strong> — used for AI responses and browser task reasoning.</li>
              <li><strong>Anthropic Claude</strong> — used for AI responses and deep research tasks.</li>
              <li><strong>Perplexity</strong> — used for web search and real-time information retrieval.</li>
            </ul>
            <p>Each provider processes this data under their respective privacy policies. Passwords, payment data, and passively collected data are never shared with these providers.</p>
            <p>Encrypted integration OAuth tokens are transmitted solely to the respective platform you connect (e.g. Google, Airtable) to execute your commands and are never shared with any other party.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">4. Data Storage and Security</h2>
            <p>
              Your data is stored on servers hosted by Supabase (AWS infrastructure, ap-northeast-2 region).
              All data is encrypted at rest and in transit via HTTPS/TLS. We apply industry-standard security
              practices to protect your information from unauthorised access, alteration, or disclosure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">5. Data Retention</h2>
            <p>
              Conversation history and usage metadata are retained for as long as your account is active.
              You may request deletion of your account and all associated data by contacting us at{' '}
              <a href="mailto:info@trylyto.com" className="text-primary hover:underline underline-offset-4">info@trylyto.com</a>.
              All personal data is permanently deleted within <strong>30 days</strong> of account deletion.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">6. Your Rights and Choices</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Access</strong> the personal data we hold about you and export your conversation history.</li>
              <li><strong>Correct</strong> any inaccuracies in your data.</li>
              <li><strong>Request deletion</strong> of your account and all associated data.</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:info@trylyto.com" className="text-primary hover:underline underline-offset-4">info@trylyto.com</a>{' '}
              and we will respond within 30 days.
            </p>
            <p>You can stop using the extension at any time by disabling or removing it from Chrome. You can avoid features that send page context if you prefer not to share any page data.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">7. Children's Privacy</h2>
            <p>
              Lyto is not directed at children under the age of 13. We do not knowingly collect personal data
              from children under 13. If you believe a child has provided us with personal data, contact us at{' '}
              <a href="mailto:info@trylyto.com" className="text-primary hover:underline underline-offset-4">info@trylyto.com</a>{' '}
              and we will delete it promptly.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">8. Updates to This Policy</h2>
            <p>
              We may update this policy. The "Last updated" date at the top of this page will be revised when we do.
              Continued use of Lyto after changes means you accept the updated policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">9. Contact Us</h2>
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
