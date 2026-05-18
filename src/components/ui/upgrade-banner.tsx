import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnnouncementBannerProps {
  badge?: string;
  description?: string;
  onClick?: () => void;
  className?: string;
}

const SparkIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path
      d="M8 1 L9.2 6.8 L15 8 L9.2 9.2 L8 15 L6.8 9.2 L1 8 L6.8 6.8 Z"
      fill="currentColor"
    />
  </svg>
);

const iconVariants = {
  hidden: { x: 0, y: 0, opacity: 0, rotate: 0, scale: 0.5 },
  visible: (custom: { x: number; y: number }) => ({
    x: custom.x,
    y: custom.y,
    opacity: 1,
    rotate: 180,
    scale: 1,
    transition: {
      x: { duration: 0.35, ease: "easeOut" },
      y: { duration: 0.35, ease: "easeOut" },
      opacity: { duration: 0.25 },
      rotate: { duration: 0.6, type: "spring", stiffness: 120, damping: 12 },
      scale: { duration: 0.25 },
    },
  }),
};

export function AnnouncementBanner({
  badge = "Lyto Inc.",
  description = "AI that lives inside your browser",
  onClick,
  className,
}: AnnouncementBannerProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div className={cn("inline-flex items-center justify-center", className)}>
      <AnimatePresence>
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Floating sparks on hover */}
          <motion.div
            initial="hidden"
            animate={isHovered ? "visible" : "hidden"}
            variants={iconVariants}
            custom={{ x: -10, y: -9 }}
            className="pointer-events-none absolute left-[6px] top-[2px]"
          >
            <SparkIcon className="text-primary" />
          </motion.div>
          <motion.div
            initial="hidden"
            animate={isHovered ? "visible" : "hidden"}
            variants={iconVariants}
            custom={{ x: 10, y: 8 }}
            className="pointer-events-none absolute bottom-[2px] right-[6px]"
          >
            <SparkIcon className="text-primary/60" />
          </motion.div>

          {/* Banner pill */}
          <div className="relative flex h-[34px] items-center gap-2 rounded-full border border-primary/20 bg-primary/5 pl-1 pr-3">
            {/* Badge chip */}
            <span className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-white tracking-wide">
              <SparkIcon className="w-2.5 h-2.5 text-white/80" />
              {badge}
            </span>

            {/* Description */}
            <button
              className="cursor-pointer border-none bg-transparent p-0 font-sans text-[13px] font-medium text-foreground/70 hover:text-primary outline-none transition-colors duration-150"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={onClick}
            >
              {description}
            </button>

            {/* Arrow */}
            <motion.span
              animate={{ x: isHovered ? 3 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-primary/50 text-xs leading-none pointer-events-none"
            >
              →
            </motion.span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
