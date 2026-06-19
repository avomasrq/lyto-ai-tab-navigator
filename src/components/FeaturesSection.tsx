import { Gallery6 } from '@/components/blocks/gallery6';

const FEATURES = [
  {
    id: 'browser-control',
    title: 'Full browser control',
    summary: 'Opens tabs, clicks elements, scrolls pages, and fills forms on any website — exactly like a human would, from a single prompt.',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=533&fit=crop&crop=center',
  },
  {
    id: 'integrations',
    title: 'Native integrations',
    summary: 'Works inside Gmail, Docs, Sheets, Slack, GitHub, Telegram, and WhatsApp — no copy-pasting required.',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=533&fit=crop&crop=center',
  },
  {
    id: 'research',
    title: 'Deep research',
    summary: 'Scans open tabs and the web, then returns a structured report with cited sources in seconds.',
    image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&h=533&fit=crop&crop=center',
  },
  {
    id: 'documents',
    title: 'Document automation',
    summary: 'Drafts emails, fills spreadsheets, and edits documents based on plain-language instructions.',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=533&fit=crop&crop=center',
  },
  {
    id: 'website-builder',
    title: 'Website & mind map builder',
    summary: 'Generate full websites and visual mind maps from a single prompt — no design skills needed.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=533&fit=crop&crop=center',
  },
  {
    id: 'privacy',
    title: 'Local-first privacy',
    summary: 'Everything runs inside your browser. No browsing data or credentials ever leave your device.',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=533&fit=crop&crop=center',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="scroll-mt-24">
      <Gallery6
        heading={<>everything you need to <span className="italic text-gradient">move faster</span></>}
        subheading="One AI that handles your entire browser workflow."
        items={FEATURES}
      />
    </section>
  );
};

export default FeaturesSection;
