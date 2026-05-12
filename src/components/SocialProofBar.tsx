import { FadeIn } from '@/components/ui/fade-in';
import { useLandingStats } from '@/hooks/useLandingStats';
import { Star } from 'lucide-react';

const INTEGRATIONS = [
  { src: '/gmaillogo.webp',     label: 'Gmail' },
  { src: '/googledocs.png',     label: 'Docs' },
  { src: '/googlesheets.png',   label: 'Sheets' },
  { src: '/googlecalendar.png', label: 'Calendar' },
  { src: '/slack.png',          label: 'Slack' },
  { src: '/github.png',         label: 'GitHub' },
  { src: '/whatsapp.png',       label: 'WhatsApp' },
];

const SocialProofBar = () => {
  const { stats, loading } = useLandingStats();
  const userCount = loading ? '—' : stats.totalUsers > 0 ? `${stats.totalUsers.toLocaleString()}+` : '500+';

  return (
    <FadeIn direction="none">
      <div className="border-y border-border/40 bg-muted/20 py-5 px-4 sm:px-6">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Stars + user count */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">{userCount} users</span> on Chrome Web Store
            </span>
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-4 w-px bg-border" />

          {/* Works with */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="text-xs uppercase tracking-widest text-muted-foreground/60 flex-shrink-0">Works with</span>
            <div className="flex items-center gap-2">
              {INTEGRATIONS.map(({ src, label }) => (
                <div
                  key={label}
                  title={label}
                  className="w-6 h-6 rounded-md overflow-hidden bg-white/10 border border-border/30 flex items-center justify-center p-0.5 opacity-70 hover:opacity-100 transition-opacity"
                >
                  <img src={src} alt={label} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </FadeIn>
  );
};

export default SocialProofBar;
