# Privacy Policy
**Lyto AI Extension**
**Last updated:** June 2026

This Privacy Policy describes how the Lyto AI browser extension ("Lyto", "we", "us", or "our") collects, uses, stores, shares, and protects your information. Lyto is an AI-powered research and browser assistant.

---

## 1. Personal Data We Collect and Process

We only collect and process the minimum amount of data necessary to provide and improve our services.

- **Account Data:** Email address, collected when you create an account for authentication purposes.
- **User Content:** Conversation messages, prompt history, and AI-generated responses stored while your account is active.
- **Transient Page Context:** When you explicitly request Lyto to perform a task on an active tab, it temporarily processes necessary page metadata (URL, title), page structure (DOM context, links, form field labels), or automated screenshots. This data is handled transiently to execute your command and is not stored persistently.
- **Browser Session Cookies:** When you explicitly use the Browser Sessions feature (entering a domain in Settings → Browser Sessions), cookies for that domain are read from your browser and transmitted to Lyto's server solely to authenticate the headless browser for that background task. This only happens on your explicit action. Cookies are never collected passively or in the background.
- **Local Extension Data:** User preferences, configuration settings, and active session state stored locally on your device via Chrome's local storage API. This data is not transmitted to our servers unless required for a specific feature.
- **Usage Metadata:** Timestamps, session counts, and request counts used to enforce plan limits and monitor system health.
- **Integration Tokens:** Encrypted OAuth access tokens if you choose to connect third-party integrations (e.g. Google Sheets, Google Docs, Airtable).

### Information We Do Not Collect

- We do not collect names, phone numbers, physical locations, or payment data. All payments are processed securely via our provider (Polar); we never see or store your card details.
- We never read, store, or fill password fields, and we do not use the Credential Management API. Chrome's autofill populates credential fields; your explicit approval is required before any form is submitted.
- We do not perform background scraping or capture data from tabs unless explicitly triggered by a user action.

---

## 2. How We Use Your Information

We use browser APIs strictly to fulfil the single purpose of the extension — research assistance and browser automation — at your direct request:

- **Automation & Control:** We use the Chrome DevTools Protocol (CDP) via `chrome.debugger` and `chrome.scripting` to programmatically perform browser actions (navigation, clicks, scrolling, text input) to automate routine tasks on your behalf.
- **Clipboard & Downloads:** Clipboard write access is used to paste data into web applications and to copy research results and AI responses. The Downloads API is used to save AI-generated artifacts or automation screenshots to your local Downloads folder.
- **Tab Management:** The `tabs`, `tabGroups`, and `webNavigation` APIs are used to display open tabs in the sidebar for context, switch between tabs, and organise tab groups via natural language commands.
- **Notifications:** System alerts are shown when background tasks or research tasks complete.

---

## 3. Data Sharing and Third-Party Disclosure

We do not sell, rent, trade, or lease your personal data to any third parties under any circumstances. To provide our core AI features, we transmit relevant user prompts and page context to the following trusted AI providers:

- **Google Gemini** — used for AI responses and browser task reasoning.
- **Anthropic Claude** — used for AI responses and deep research tasks.
- **Perplexity** — used for web search and real-time information retrieval.

Each provider processes this data under their respective privacy policies. Passwords, payment data, and passively collected data are never shared with these providers.

Encrypted integration OAuth tokens are transmitted solely to the respective platform you connect (e.g. Google, Airtable) to execute your commands and are never shared with any other party.

---

## 4. Data Storage and Security

Your data is stored on servers hosted by Supabase (AWS infrastructure, ap-northeast-2 region). All data is encrypted at rest and in transit via HTTPS/TLS. We apply industry-standard security practices to protect your information from unauthorised access, alteration, or disclosure.

---

## 5. Data Retention

Conversation history and usage metadata are retained for as long as your account is active. You may request deletion of your account and all associated data by contacting us at info@trylyto.com. All personal data is permanently deleted within **30 days** of account deletion.

---

## 6. Your Rights and Choices

You have the right to:

- **Access** the personal data we hold about you and export your conversation history.
- **Correct** any inaccuracies in your data.
- **Request deletion** of your account and all associated data.

To exercise any of these rights, contact us at info@trylyto.com and we will respond within 30 days.

You can stop using the extension at any time by disabling or removing it from Chrome. You can avoid features that send page context if you prefer not to share any page data.

---

## 7. Children's Privacy

Lyto is not directed at children under the age of 13. We do not knowingly collect personal data from children under 13. If you believe a child has provided us with personal data, contact us at info@trylyto.com and we will delete it promptly.

---

## 8. Updates to This Policy

We may update this policy. The "Last updated" date at the top of this page will be revised when we do. Continued use of Lyto after changes means you accept the updated policy.

---

## 9. Contact Us

For privacy-related questions, requests, or concerns, contact us at info@trylyto.com. We aim to respond within 2 business days.
