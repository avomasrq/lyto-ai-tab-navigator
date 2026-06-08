import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, RotateCcw, Share2, ArrowRight, Scan } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

function BlurFade({ children, delay = 0, className }: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function parseReview(text: string) {
  const sections: { title: string; content: string }[] = [];
  const lines = text.split('\n').filter(Boolean);
  let current: { title: string; content: string } | null = null;

  for (const line of lines) {
    const bold = line.match(/^\*\*(.+?):\*\*\s*(.*)/);
    if (bold) {
      if (current) sections.push(current);
      current = { title: bold[1], content: bold[2] };
    } else if (current) {
      current.content += (current.content ? ' ' : '') + line.trim();
    }
  }
  if (current) sections.push(current);
  return sections;
}

const SECTION_COLORS: Record<string, string> = {
  'Overall Foot Rating': 'bg-orange-50 border-orange-200 text-orange-900',
  'The Roast': 'bg-red-50 border-red-200 text-red-900',
  'Toe Report': 'bg-yellow-50 border-yellow-200 text-yellow-900',
  'Skin & Nail Situation': 'bg-purple-50 border-purple-200 text-purple-900',
  'Arch Intelligence': 'bg-blue-50 border-blue-200 text-blue-900',
  "Lyto's Verdict": 'bg-green-50 border-green-200 text-green-900',
};

export default function ScanPage() {
  const [image, setImage] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string>('image/jpeg');
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'done' | 'error'>('idle');
  const [review, setReview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setMediaType(file.type as string);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      // Strip the data URL prefix to get raw base64
      const base64 = result.split(',')[1];
      setImage(base64);
      setStatus('idle');
      setReview(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleScan = async () => {
    if (!image) return;
    setStatus('scanning');
    setErrorMsg('');

    try {
      const { data, error } = await supabase.functions.invoke('scan-feet', {
        body: { imageBase64: image, mediaType },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setReview(data.review);
      setStatus('done');
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg('Something went wrong. Make sure the image is clear and try again.');
      setStatus('error');
    }
  };

  const handleShare = async () => {
    const text = `I got my feet roasted by Lyto AI 😂\n\n${review}\n\ntrylyto.com/scan`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const reset = () => {
    setImage(null);
    setPreview(null);
    setReview(null);
    setStatus('idle');
    setErrorMsg('');
  };

  const sections = review ? parseReview(review) : [];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute rounded-full"
          style={{ width: 600, height: 600, top: '-20%', left: '-10%',
            background: 'radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{ width: 500, height: 500, bottom: '-15%', right: '-10%',
            background: 'radial-gradient(circle, rgba(234,88,12,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)`,
            backgroundSize: '72px 72px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-16 pb-24">

        {/* Header */}
        <BlurFade delay={0.05} className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-5">
            <Scan className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif tracking-tight text-foreground mb-3">
            Lyto<span className="text-primary italic"> Scan</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-sm mx-auto">
            Upload a photo of your feet. Get brutally honest AI feedback. Share with everyone.
          </p>
        </BlurFade>

        {/* Upload / Preview */}
        <BlurFade delay={0.15}>
          <AnimatePresence mode="wait">
            {!preview ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
                className="cursor-pointer rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-colors duration-200 p-12 text-center group"
                style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)' }}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-muted group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                    <Upload className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Drop a photo here or click to upload</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG, WEBP — show us the feet</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); cameraRef.current?.click(); }}
                    className="inline-flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors font-medium mt-2"
                  >
                    <Camera className="w-3.5 h-3.5" /> Use camera
                  </button>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="rounded-2xl overflow-hidden border border-border shadow-sm"
              >
                <div className="relative">
                  <img src={preview} alt="Your feet" className="w-full max-h-72 object-cover" />
                  <button
                    onClick={reset}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 backdrop-blur-sm border border-border hover:bg-white transition-colors shadow-sm"
                  >
                    <RotateCcw className="w-4 h-4 text-foreground" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </BlurFade>

        {/* Scan button */}
        <AnimatePresence>
          {preview && status !== 'done' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4"
            >
              <button
                onClick={handleScan}
                disabled={status === 'scanning'}
                className="scan-btn w-full"
              >
                {status === 'scanning' ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block"
                    >
                      <Scan className="w-4 h-4" />
                    </motion.span>
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Scan className="w-4 h-4" /> Roast my feet
                  </span>
                )}
              </button>
              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-500 text-center mt-2"
                >
                  {errorMsg}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {status === 'done' && sections.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 space-y-3"
            >
              {sections.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className={`rounded-xl border p-4 ${SECTION_COLORS[s.title] ?? 'bg-muted border-border text-foreground'}`}
                >
                  <p className="text-[11px] font-bold uppercase tracking-widest opacity-60 mb-1">{s.title}</p>
                  <p className="text-sm leading-relaxed font-medium">{s.content}</p>
                </motion.div>
              ))}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Share the roast'}
                </button>
                <button
                  onClick={reset}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors"
                >
                  <RotateCcw className="w-4 h-4" /> Again
                </button>
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="rounded-2xl border border-[#fed7aa] bg-[#fff7ed] p-5 text-center mt-4"
              >
                <p className="text-sm font-semibold text-[#9a3412] mb-1">
                  Lyto can do a lot more than roast your feet
                </p>
                <p className="text-xs text-[#c2410c] mb-4">
                  AI that lives in your browser — automates tasks, researches anything, fills forms, sends messages.
                </p>
                <a
                  href="https://chromewebstore.google.com/detail/lyto-ai-research-assistan/nalekilafbipfallhlkbpidgfceoabcb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 scan-btn-sm"
                >
                  Add to Chrome — It's Free <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <BlurFade delay={0.3} className="mt-16 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors">
            <span className="font-serif">Lyto AI</span>
            <span>·</span>
            <span>trylyto.com</span>
          </Link>
        </BlurFade>
      </div>

      <style>{`
        .scan-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 28px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          border: none;
          outline: none;
          background: linear-gradient(135deg, hsl(24 95% 53%), hsl(20 90% 48%));
          box-shadow: 0 1px 0 0 rgba(255,255,255,0.2) inset, 0 4px 24px rgba(249,115,22,0.25), 0 1px 3px rgba(0,0,0,0.1);
          transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
        }
        .scan-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 1px 0 0 rgba(255,255,255,0.25) inset, 0 8px 32px rgba(249,115,22,0.3), 0 2px 6px rgba(0,0,0,0.1);
        }
        .scan-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .scan-btn-sm {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          border: none;
          outline: none;
          background: linear-gradient(135deg, hsl(24 95% 53%), hsl(20 90% 48%));
          box-shadow: 0 4px 16px rgba(249,115,22,0.25);
          transition: transform 0.18s ease;
          text-decoration: none;
        }
        .scan-btn-sm:hover { transform: translateY(-1px); }
      `}</style>
    </div>
  );
}
