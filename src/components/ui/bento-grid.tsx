"use client";

import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export interface BentoItem {
    title: string;
    description: string;
    glyph?: string;
    status?: string;
    tags?: string[];
    meta?: string;
    cta?: string;
    /** Makes the whole card a link — internal (starts with "/") or external */
    href?: string;
    /** 1 = one column, 2 = spans two, 3 = spans the full row (desktop) */
    colSpan?: 1 | 2 | 3;
    hasPersistentHover?: boolean;
    /** Optional lead visual — reserve this for the one card that's earned it */
    visual?: ReactNode;
}

interface BentoGridProps {
    items: BentoItem[];
    className?: string;
}

const SPAN_CLASS: Record<number, string> = {
    1: "",
    2: "sm:col-span-2",
    3: "sm:col-span-2 lg:col-span-3",
};

/* ── Claymorphism, in monochrome ──────────────────────────────────────────
   No hue to play with on a black/white theme, so the "clay" read comes from
   a dual soft-shadow (dark below-right, light above-left) against a card
   color that sits close to the page background — a puffy, borderless card
   that looks pressed out of the same material as the page, not layered on
   top of it. Hover deepens the shadow slightly instead of lifting the card;
   real clay doesn't float. */
const CLAY = "shadow-[7px_7px_18px_rgba(0,0,0,0.09),-7px_-7px_18px_rgba(255,255,255,0.8),inset_0_1px_0_rgba(255,255,255,0.6)]";
const CLAY_HOVER = "hover:shadow-[9px_9px_24px_rgba(0,0,0,0.12),-9px_-9px_24px_rgba(255,255,255,0.85),inset_0_1px_0_rgba(255,255,255,0.6)]";
const CLAY_RAISED = "shadow-[10px_10px_28px_rgba(0,0,0,0.12),-9px_-9px_24px_rgba(255,255,255,0.85),inset_0_1px_0_rgba(255,255,255,0.65)]";
const CLAY_CHIP = "shadow-[3px_3px_8px_rgba(0,0,0,0.08),-3px_-3px_8px_rgba(255,255,255,0.75),inset_0_1px_0_rgba(255,255,255,0.6)]";
const CLAY_CHIP_INVERTED = "shadow-[3px_3px_8px_rgba(0,0,0,0.25),-2px_-2px_6px_rgba(255,255,255,0.12),inset_0_1px_0_rgba(255,255,255,0.15)]";

function BentoGrid({ items, className }: BentoGridProps) {
    return (
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6", className)}>
            {items.map((item, index) => {
                const cardClass = cn(
                    "group relative flex flex-col rounded-[28px] p-6 sm:p-7 overflow-hidden transition-shadow duration-300 border-0 bg-card",
                    item.hasPersistentHover ? cn(CLAY_RAISED, "bg-gradient-to-br from-muted/40 to-card") : cn(CLAY, CLAY_HOVER),
                    SPAN_CLASS[item.colSpan ?? 1]
                );

                const content = (
                    <>
                        {/* Glyph chip + status row */}
                        <div className="flex items-center justify-between">
                            {item.glyph && (
                                <span
                                    className={cn(
                                        "flex h-11 w-11 items-center justify-center rounded-2xl bg-card font-mono text-[19px] text-primary select-none",
                                        CLAY_CHIP
                                    )}
                                    aria-hidden
                                >
                                    {item.glyph}
                                </span>
                            )}
                            {item.status && (
                                <span
                                    className={cn(
                                        "text-[11px] font-semibold tracking-wide px-3 py-1.5 rounded-full bg-foreground text-background",
                                        CLAY_CHIP_INVERTED
                                    )}
                                >
                                    {item.status}
                                </span>
                            )}
                        </div>

                        {/* Title + description (+ optional lead visual, side by side above sm) */}
                        <div className={cn("mt-5 flex-1", item.visual && "flex flex-col sm:flex-row sm:items-center gap-6")}>
                            <div className={cn(item.visual && "flex-1")}>
                                <h3 className="font-serif text-[18px] sm:text-[19px] leading-snug tracking-tight text-foreground">
                                    {item.title}
                                    {item.meta && (
                                        <span className="ml-2 text-xs text-muted-foreground font-sans font-normal">
                                            {item.meta}
                                        </span>
                                    )}
                                </h3>
                                <p className="mt-2.5 text-[13.5px] sm:text-sm text-muted-foreground leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                            {item.visual && <div className="shrink-0">{item.visual}</div>}
                        </div>

                        {/* Tags + CTA */}
                        {(item.tags?.length || item.cta) && (
                            <div className="mt-5 flex items-center justify-between gap-2">
                                <div className="flex flex-wrap gap-1.5">
                                    {item.tags?.map((tag, i) => (
                                        <span
                                            key={i}
                                            className={cn(
                                                "text-[11px] text-muted-foreground px-2.5 py-1 rounded-full bg-card",
                                                CLAY_CHIP
                                            )}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                {item.cta && (
                                    <span
                                        className={cn(
                                            "text-xs text-primary font-medium whitespace-nowrap transition-opacity",
                                            !item.href && "opacity-0 group-hover:opacity-100"
                                        )}
                                    >
                                        {item.cta}
                                    </span>
                                )}
                            </div>
                        )}
                    </>
                );

                if (item.href?.startsWith("/")) {
                    return (
                        <Link key={index} to={item.href} className={cardClass}>
                            {content}
                        </Link>
                    );
                }
                if (item.href) {
                    return (
                        <a key={index} href={item.href} target="_blank" rel="noopener noreferrer" className={cardClass}>
                            {content}
                        </a>
                    );
                }
                return (
                    <div key={index} className={cardClass}>
                        {content}
                    </div>
                );
            })}
        </div>
    );
}

export { BentoGrid };
