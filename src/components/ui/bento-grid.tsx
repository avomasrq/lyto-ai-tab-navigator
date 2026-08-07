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

function BentoGrid({ items, className }: BentoGridProps) {
    return (
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5", className)}>
            {items.map((item, index) => {
                const cardClass = cn(
                    "group relative flex flex-col rounded-3xl p-6 sm:p-7 overflow-hidden transition-all duration-300",
                    "border bg-card",
                    item.hasPersistentHover
                        ? "border-foreground/15 shadow-xl shadow-foreground/5 -translate-y-1 bg-gradient-to-br from-muted/50 to-transparent"
                        : "border-border/60 hover:-translate-y-1 hover:border-foreground/15 hover:shadow-xl hover:shadow-foreground/5",
                    SPAN_CLASS[item.colSpan ?? 1]
                );

                const content = (
                    <>
                        {/* Glyph + status row */}
                        <div className="flex items-center justify-between">
                            {item.glyph && (
                                <span className="font-mono text-[22px] text-primary select-none" aria-hidden>
                                    {item.glyph}
                                </span>
                            )}
                            {item.status && (
                                <span className="text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full bg-foreground text-background">
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
                                            className="text-[11px] text-muted-foreground px-2.5 py-1 rounded-full bg-muted/60 border border-border/40"
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
