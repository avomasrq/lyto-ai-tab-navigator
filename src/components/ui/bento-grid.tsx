"use client";

import { cn } from "@/lib/utils";

export interface BentoItem {
    title: string;
    description: string;
    icon?: React.ReactNode;
    status?: string;
    tags?: string[];
    meta?: string;
    cta?: string;
    colSpan?: number;
    hasPersistentHover?: boolean;
}

interface BentoGridProps {
    items: BentoItem[];
    className?: string;
}

function BentoGrid({ items, className }: BentoGridProps) {
    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-3", className)}>
            {items.map((item, index) => (
                <div
                    key={index}
                    className={cn(
                        "group relative p-5 rounded-2xl overflow-hidden transition-all duration-300",
                        "border border-border/60 bg-card/60",
                        "hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_20px_rgba(255,255,255,0.04)]",
                        "hover:-translate-y-0.5",
                        item.colSpan === 2 ? "md:col-span-2" : "col-span-1",
                        item.hasPersistentHover && "-translate-y-0.5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(255,255,255,0.04)]"
                    )}
                >
                    {/* Dot grid overlay */}
                    <div
                        className={cn(
                            "absolute inset-0 transition-opacity duration-300",
                            item.hasPersistentHover
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                        )}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.025)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[length:4px_4px]" />
                    </div>

                    <div className="relative flex flex-col space-y-3.5">
                        {/* Icon + status row */}
                        <div className="flex items-center justify-between">
                            {item.icon && (
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20 transition-all duration-300 group-hover:bg-primary/15">
                                  {item.icon}
                              </div>
                            )}
                            {item.status && (
                                <span className={cn(
                                    "text-xs font-medium px-2.5 py-1 rounded-lg",
                                    "bg-muted/60 text-muted-foreground border border-border/40",
                                    "transition-colors duration-300 group-hover:bg-muted"
                                )}>
                                    {item.status}
                                </span>
                            )}
                        </div>

                        {/* Title + description */}
                        <div className="space-y-1.5">
                            <h3 className="font-semibold text-foreground tracking-tight text-[15px] leading-snug">
                                {item.title}
                                {item.meta && (
                                    <span className="ml-2 text-xs text-muted-foreground font-normal">
                                        {item.meta}
                                    </span>
                                )}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {item.description}
                            </p>
                        </div>

                        {/* Tags + CTA */}
                        <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center flex-wrap gap-1.5 text-xs text-muted-foreground">
                                {item.tags?.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-0.5 rounded-md bg-muted/60 border border-border/40 transition-colors duration-200 hover:bg-muted"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            {item.cta && (
                                <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ml-2">
                                    {item.cta}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Gradient border on hover */}
                    <div
                        className={cn(
                            "absolute inset-0 -z-10 rounded-2xl p-px bg-gradient-to-br from-transparent via-primary/10 to-transparent transition-opacity duration-300",
                            item.hasPersistentHover
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                        )}
                    />
                </div>
            ))}
        </div>
    );
}

export { BentoGrid };
