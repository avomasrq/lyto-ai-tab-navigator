"use client";

import { motion } from "framer-motion";
import React from "react";

function FloatingPaths({ position }: { position: number }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
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
                        opacity: [0.3, 0.6, 0.3],
                        pathOffset: [0, 1, 0],
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
 * We render enough tiles to fill the full wrapper height.
 */
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
    // 10 tiles × 800px = 8000px — covers any reasonable page length
    const tileCount = 10;
    const tiles = Array.from({ length: tileCount }, (_, i) => i % 2 === 1);

    return (
        <div className={`relative ${className}`}>
            {/* Animated SVG paths layer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden text-primary/40">
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
