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
            Last updated: January 2025
          </p>
          
          <p>
            This policy describes how the Lyto AI browser extension ("Lyto") handles information. Lyto is an AI-powered research and browser assistant.
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">What Lyto Does</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Chat and research:</strong> You send messages; Lyto can use external AI services (e.g. Perplexity) to answer and open relevant links in tabs.
              </li>
              <li>
                <strong>Browser actions:</strong> Lyto can run actions you request (open URL, click, fill non-sensitive fields, scroll) on the active tab.
              </li>
              <li>
                <strong>Page context:</strong> When you run a task that needs it, Lyto may use a snapshot of the page (structure, links, form field labels—not password or payment values) or a screenshot, only for that task.
              </li>
              <li>
                <strong>Sign-in confirmation:</strong> Lyto does not read or fill passwords. It shows a sign-in confirmation UI (user confirmation prompt / permission to submit login form). You fill credentials via Chrome autofill (or manually); Lyto only shows the prompt and, on your click, triggers the page's submit button. No credentials are stored or sent by Lyto.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">Information We Do Not Collect or Use</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Passwords:</strong> Lyto never reads, stores, or fills password fields. No Credential Management API is used.
              </li>
              <li>
                <strong>Payment data:</strong> Lyto never reads or fills card numbers, CVV, expiry, or other payment fields.
              </li>
              <li>
                <strong>Background scraping:</strong> Lyto does not read page content or take screenshots in the background. The background script only uses tab metadata (URL, title) for context.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">Information Used in Lyto</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Tab metadata:</strong> URL and title of open tabs may be used to give the AI context about your tabs. No page body or form values are read in the background.
              </li>
              <li>
                <strong>DOM/screenshots:</strong> Only when you start a task that needs it (e.g. "what's on this page?", "click the Search button"). Password and payment field values are never included. Data is used only for that request.
              </li>
              <li>
                <strong>Conversations and settings:</strong> If you use a backend account, your messages and preferences may be stored on the backend according to its terms and infrastructure (e.g. database, hosting). The extension does not send password or payment data to the backend.
              </li>
              <li>
                <strong>Integrations:</strong> If you connect Airtable or Google, only the data you explicitly send (e.g. which base/table, what to write) is used for those actions. Tokens are stored and used according to your consent and the integration's permissions.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">Data Flow</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Extension:</strong> Runs in your browser; captures only what is needed for the current task (tab metadata in background; DOM/screenshot only on task).
              </li>
              <li>
                <strong>Backend:</strong> Receives messages, conversation history (if you are signed in), and task-related context (e.g. snapshot, screenshot) for the current request. Does not receive passwords or payment data.
              </li>
              <li>
                <strong>Third-party AI:</strong> If the backend uses a provider (e.g. Perplexity), the content sent is limited to what is needed to answer or act (e.g. your question, allowed page context). Passwords and payment data are never sent.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-foreground">Your Choices</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>You can stop using the extension at any time (disable or remove it).</li>
              <li>You can avoid using features that send page context (e.g. don't ask to fill forms or describe the page) if you prefer not to send any page data.</li>
              <li>For backend accounts, check the backend's terms and settings for account data and retention.</li>
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
              For privacy-related questions about the Lyto extension, use the contact or support channel provided by the Lyto project (e.g. repository or app listing).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
