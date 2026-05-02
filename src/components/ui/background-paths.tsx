"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

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

    // Mobile: 0 paths (hidden entirely), Desktop: 12 paths (was 36)
    const pathCount = isMobile ? 0 : 12;
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

    if (pathCount === 0) return null;

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
                    initial={{ pathLength: 0.3, opacity: 0.4 }}
                    animate={{
                        pathLength: [0.3, 1, 0.3],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 30 + path.id * 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                        // Stagger start times so they don't all animate at once
                        delay: path.id * 1.5,
                    }}
                />
            ))}
        </svg>
    );
}

function PathTile({ position, flip }: { position: number; flip?: boolean }) {
    return (
        <div
            className="w-full flex-shrink-0 pointer-events-none"
            style={{
                height: "800px",
                transform: flip ? "scaleY(-1)" : undefined,
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

    // On mobile skip rendering the SVG layer entirely
    const tileCount = isMobile ? 0 : 6; // was 10 tiles, now 6
    const tiles = Array.from({ length: tileCount }, (_, i) => i % 2 === 1);

    return (
        <div className={`relative ${className}`}>
            {!isMobile && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden text-primary/20">
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
            )}
            <div className="relative z-10">{children}</div>
        </div>
    );
}
