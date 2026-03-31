"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

// Hook to detect mobile view for performance optimizations
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);
    return isMobile;
}

function FloatingPaths({ position }: { position: number }) {
    const isMobile = useIsMobile();
    // Reduce paths on mobile (from 36 to 12) for better performance
    const pathCount = isMobile ? 12 : 36;
    const paths = Array.from({ length: pathCount }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
            380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
            152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
            684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        width: 0.5 + i * 0.03,
    }));

    return (
        <svg
            className="w-full h-full"
            viewBox="0 0 696 316"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
        >
            <title>Background Paths</title>
            {paths.map((path) => (
                <motion.path
                    key={path.id}
                    d={path.d}
                    stroke="currentColor"
                    strokeWidth={path.width}
                    strokeOpacity={0.1 + path.id * 0.03}
                    initial={{ pathLength: 0.3, opacity: 0.6 }}
                    animate={{
                        pathLength: 1,
                        opacity: isMobile ? 0.4 : [0.3, 0.6, 0.3], // Simpler animation on mobile
                        pathOffset: isMobile ? 0 : [0, 1, 0], // Disable pathOffset animation on mobile
                    }}
                    transition={{
                        duration: 20 + Math.random() * 10,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                    }}
                />
            ))}
        </svg>
    );
}

/**
 * Each tile is sized to cover ~800px of vertical space.
 */
function PathTile({ position, flip }: { position: number; flip?: boolean }) {
    return (
        <div
            className="w-full flex-shrink-0 pointer-events-none"
            style={{
                height: "800px",
                transform: flip ? "scaleY(-1)" : undefined,
                willChange: "transform", // Performance hint
            }}
        >
            <FloatingPaths position={position} />
        </div>
    );
}

interface BackgroundPathsWrapperProps {
    children: React.ReactNode;
    className?: string;
}

export function BackgroundPathsWrapper({
    children,
    className = "",
}: BackgroundPathsWrapperProps) {
    const isMobile = useIsMobile();

    // On mobile, skip ALL animated paths entirely — they're the #1 scroll lag source
    if (isMobile) {
        return (
            <div className={`relative ${className}`}>
                <div className="relative z-10">{children}</div>
            </div>
        );
    }

    const tiles = Array.from({ length: 10 }, (_, i) => i % 2 === 1);

    return (
        <div className={`relative ${className}`}>
            {/* Animated SVG paths layer — desktop only */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden text-primary/30">
                <div className="absolute top-0 left-0 w-full flex flex-col">
                    {tiles.map((flip, i) => (
                        <PathTile key={`l-${i}`} position={1} flip={flip} />
                    ))}
                </div>
                <div className="absolute top-0 left-0 w-full flex flex-col">
                    {tiles.map((flip, i) => (
                        <PathTile key={`r-${i}`} position={-1} flip={!flip} />
                    ))}
                </div>
            </div>

            {/* Content layer */}
            <div className="relative z-10">{children}</div>
        </div>
    );
}
