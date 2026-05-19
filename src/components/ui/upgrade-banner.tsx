import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnnouncementBannerProps {
  buttonText?: string;
  description?: string;
  onClick?: () => void;
  className?: string;
}

const SparkleIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path
      d="M8 1 L9.2 6.8 L15 8 L9.2 9.2 L8 15 L6.8 9.2 L1 8 L6.8 6.8 Z"
      fill="currentColor"
    />
  </svg>
);

const iconVariants = {
  hidden: { x: 0, y: 0, opacity: 0, rotate: 0 },
  visible: (custom: { x: number; y: number }) => ({
    x: custom.x,
    y: custom.y,
    opacity: 1,
    rotate: 360,
    transition: {
      x: { duration: 0.3, ease: "easeOut" },
      y: { duration: 0.3, ease: "easeOut" },
      opacity: { duration: 0.3 },
      rotate: { duration: 1, type: "spring", stiffness: 100, damping: 10 },
    },
  }),
};

export function AnnouncementBanner({
  buttonText = "Lyto Inc.",
  description = "AI that lives inside your browser",
  onClick,
  className,
}: AnnouncementBannerProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div className={cn("mx-auto flex items-center justify-center", className)}>
      <AnimatePresence>
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Floating sparkles on hover */}
          <motion.div
            initial="hidden"
            animate={isHovered ? "visible" : "hidden"}
            variants={iconVariants}
            custom={{ x: -10, y: -10 }}
            className="pointer-events-none absolute left-[4px] top-[2px]"
          >
            <SparkleIcon className="text-[#ea580c]" />
          </motion.div>
          <motion.div
            initial="hidden"
            animate={isHovered ? "visible" : "hidden"}
            variants={iconVariants}
            custom={{ x: 10, y: 10 }}
            className="pointer-events-none absolute bottom-[2px] left-[6rem]"
          >
            <SparkleIcon className="text-[#ea580c]" />
          </motion.div>

          {/* Banner pill */}
          <div className="relative flex h-[35px] items-center gap-1.5 rounded-[6px] border border-[#fed7aa] bg-[#fff7ed] pl-2.5 pr-2 text-sm">
            <button
              className="cursor-pointer border-none bg-transparent px-0 py-1 font-sans text-[13px] font-semibold text-[#9a3412] underline decoration-[#fdba74] underline-offset-[5px] outline-none hover:text-[#ea580c] hover:decoration-[#fb923c] transition-colors duration-150"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={onClick}
            >
              {buttonText}
            </button>
            <span className="text-[0.8125rem] text-[#c2410c]">
              {description}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
