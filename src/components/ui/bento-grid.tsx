"use client";

import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { MeanderBand, greekStoneStyle } from "@/components/ui/greek-tablet";

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

/* The cards themselves are now inscribed-stone tablets (see greekStoneStyle +
   MeanderBand below). These soft-shadow chips are what the glyph badge and tags
   still ride on, kept subtle so they read as inset into the stone. */
const CLAY_CHIP = "shadow-[3px_3px_8px_rgba(0,0,0,0.08),-3px_-3px_8px_rgba(255,255,255,0.75),inset_0_1px_0_rgba(255,255,255,0.6)]";
const CLAY_CHIP_INVERTED = "shadow-[3px_3px_8px_rgba(0,0,0,0.25),-2px_-2px_6px_rgba(255,255,255,0.12),inset_0_1px_0_rgba(255,255,255,0.15)]";

function BentoGrid({ items, className }: BentoGridProps) {
    return (
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6", className)}>
            {items.map((item, index) => {
                const cardClass = cn(
                    "greek-tablet group relative flex flex-col rounded-[18px] px-7 py-8 sm:px-8 overflow-hidden transition-transform duration-300 hover:-translate-y-1 border border-[#c8bca0] dark:border-[#3c352a]",
                    SPAN_CLASS[item.colSpan ?? 1]
                );

                const content = (
                    <>
                        {/* stone tablet chrome: double rule + meander friezes */}
                        <span aria-hidden className="pointer-events-none absolute inset-[7px] rounded-[12px] border border-[#a8946e]/40" />
                        <MeanderBand className="pointer-events-none absolute inset-x-4 top-[14px] w-auto opacity-50" color="#8a6d3b" />
                        <MeanderBand flip className="pointer-events-none absolute inset-x-4 bottom-[14px] w-auto opacity-50" color="#8a6d3b" />
                        {/* Index label — small mono "( 01 )", editorial detail sitting above the glyph */}
                        <span className="font-mono text-[11px] text-muted-foreground/50 select-none">
                            ( {String(index + 1).padStart(2, "0")} )
                        </span>

                        {/* Glyph chip + status row */}
                        <div className="mt-3 flex items-center justify-between">
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
                        <Link key={index} to={item.href} className={cardClass} style={greekStoneStyle}>
                            {content}
                        </Link>
                    );
                }
                if (item.href) {
                    return (
                        <a key={index} href={item.href} target="_blank" rel="noopener noreferrer" className={cardClass} style={greekStoneStyle}>
                            {content}
                        </a>
                    );
                }
                return (
                    <div key={index} className={cardClass} style={greekStoneStyle}>
                        {content}
                    </div>
                );
            })}
        </div>
    );
}

export { BentoGrid };
