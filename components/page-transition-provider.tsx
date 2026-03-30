"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { WorldMapLoader } from "@/components/world-map-loader";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface PageTransitionContextType {
    triggerLoading: () => void;
    navigateTo: (href: string) => void;
}

const PageTransitionContext = createContext<PageTransitionContextType>({
    triggerLoading: () => { },
    navigateTo: () => { },
});

export function usePageTransition() {
    return useContext(PageTransitionContext);
}

// Time needed for the shutter to completely close before navigating (in ms)
const SHUTTER_CLOSE_DURATION = 600;

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const pendingNavRef = useRef<string | null>(null);
    const pendingBackRef = useRef(false);

    // Turn off initial load once WorldMapLoader finishes
    const handleInitialLoadFinish = useCallback(() => {
        setIsInitialLoad(false);
    }, []);

    // Navigate with grain reveal overlay
    const navigateTo = useCallback((href: string) => {
        if (href === pathname || isTransitioning) return;
        pendingNavRef.current = href;
        setIsTransitioning(true);
    }, [pathname, isTransitioning]);

    // Back navigation with grain reveal overlay
    const triggerLoading = useCallback(() => {
        if (isTransitioning) return;
        pendingBackRef.current = true;
        setIsTransitioning(true);
    }, [isTransitioning]);

    // Perform actual navigation after shutter closes
    useEffect(() => {
        if (!isTransitioning) return;

        const timer = setTimeout(() => {
            if (pendingNavRef.current) {
                router.push(pendingNavRef.current);
                pendingNavRef.current = null;
            } else if (pendingBackRef.current) {
                router.back();
                pendingBackRef.current = false;
            }

            // Brief delay to allow Next.js route processing before "opening" shutter
            setTimeout(() => {
                setIsTransitioning(false);
            }, 100);
        }, SHUTTER_CLOSE_DURATION);

        return () => clearTimeout(timer);
    }, [isTransitioning, router]);

    // Intercept internal clicks
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const anchor = (e.target as HTMLElement).closest("a");
            if (!anchor) return;

            const href = anchor.getAttribute("href");
            if (!href) return;

            if (
                href.startsWith("http") ||
                href.startsWith("mailto:") ||
                href.startsWith("tel:") ||
                href.startsWith("#") ||
                anchor.target === "_blank" ||
                anchor.hasAttribute("download")
            ) {
                return;
            }

            if (href === pathname) return;

            e.preventDefault();
            e.stopPropagation();
            navigateTo(href);
        };

        document.addEventListener("click", handleClick, true);
        return () => document.removeEventListener("click", handleClick, true);
    }, [pathname, navigateTo]);

    return (
        <PageTransitionContext.Provider value={{ triggerLoading, navigateTo }}>
            {/* 1. Opening Animation (Page Load) */}
            <AnimatePresence>
                {isInitialLoad && <WorldMapLoader onFinish={handleInitialLoadFinish} />}
            </AnimatePresence>

            {/* 2. Inter-page Transition: The Grain Reveal */}
            <AnimatePresence>
                {isTransitioning && <GrainRevealOverlay />}
            </AnimatePresence>

            {/* 3. Page Content Wrapper: Smooth entry */}
            <motion.div
                key={pathname}
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                    duration: 0.8,
                    delay: 0.2, // waits for shutter to open slightly
                    ease: [0.25, 1, 0.5, 1] // smooth out
                }}
                className="min-h-screen"
            >
                {children}
            </motion.div>
        </PageTransitionContext.Provider>
    );
}

// ==========================================
// THE GRAIN REVEAL - TRANSITION OVERLAY
// ==========================================
function GrainRevealOverlay() {
    return (
        <motion.div
            className="fixed inset-0 z-[9998] pointer-events-none flex items-center justify-center overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {/* Shutter Effect: Dark Walnut wood texture covering screen */}
            {/* Top Shutter Panel */}
            <motion.div
                className="absolute inset-x-0 top-0 bg-[#5D4037] border-b border-[#3e2923]/50"
                variants={{
                    hidden: { y: "-100%" },
                    visible: {
                        y: "0%",
                        transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] }
                    },
                    exit: {
                        y: "-100%",
                        transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1], delay: 0.3 }
                    }
                }}
                style={{ height: "50%" }}
            >
                <WoodGrainSvgPattern idSuffix="top" />
            </motion.div>

            {/* Bottom Shutter Panel */}
            <motion.div
                className="absolute inset-x-0 bottom-0 bg-[#5D4037] border-t border-[#8b6154]/20"
                variants={{
                    hidden: { y: "100%" },
                    visible: {
                        y: "0%",
                        transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] }
                    },
                    exit: {
                        y: "100%",
                        transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1], delay: 0.3 }
                    }
                }}
                style={{ height: "50%" }}
            >
                <WoodGrainSvgPattern idSuffix="btm" />
            </motion.div>

            {/* Light Oak Map Silhouette - Appears when shutter closes, expands/unfolds when opening */}
            <motion.div
                className="absolute z-10 flex items-center justify-center pointer-events-none"
                variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: {
                        opacity: 1,
                        scale: 1,
                        transition: { duration: 0.4, delay: 0.2, ease: "easeOut" }
                    },
                    exit: {
                        opacity: 0,
                        scale: 2.5, // Map "grows" from center as page opens!
                        filter: "blur(4px)",
                        transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] }
                    }
                }}
            >
                <svg width="280" height="160" viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="oak-grain" x="0" y="0" width="280" height="160" patternUnits="userSpaceOnUse">
                            <rect width="280" height="160" fill="#D7CCC8" />
                            <path d="M0,20 Q140,40 280,10" stroke="#c8bcba" strokeWidth="0.5" fill="none" opacity="0.6" />
                            <path d="M0,60 Q140,80 280,50" stroke="#c8bcba" strokeWidth="0.8" fill="none" opacity="0.5" />
                            <path d="M0,100 Q140,120 280,90" stroke="#c8bcba" strokeWidth="0.6" fill="none" opacity="0.7" />
                            <path d="M0,140 Q140,155 280,130" stroke="#c8bcba" strokeWidth="0.5" fill="none" opacity="0.4" />
                        </pattern>
                        <filter id="soft-shadow">
                            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#1a0f0a" floodOpacity="0.4" />
                        </filter>
                    </defs>
                    <g fill="url(#oak-grain)" filter="url(#soft-shadow)">
                        {/* North America */}
                        <motion.path
                            d="M25 18 L32 15 L40 14 L48 16 L55 14 L62 16 L68 20 L72 26 L74 34 L72 42 L68 50 L64 56 L58 62 L52 66 L46 68 L42 72 L38 78 L34 72 L30 66 L26 62 L22 56 L18 48 L16 40 L16 32 L18 24 L25 18 Z"
                            variants={pieceVariants(-10, -10)}
                        />
                        {/* South America */}
                        <motion.path
                            d="M48 82 L54 80 L60 82 L64 88 L66 96 L66 106 L64 114 L60 122 L54 128 L48 130 L44 128 L40 122 L38 114 L36 104 L38 94 L42 86 L48 82 Z"
                            variants={pieceVariants(-5, 10)}
                        />
                        {/* Europe */}
                        <motion.path
                            d="M120 15 L128 12 L136 14 L142 18 L146 24 L148 32 L146 40 L142 46 L136 50 L130 52 L124 48 L120 42 L118 34 L118 26 L120 18 L120 15 Z"
                            variants={pieceVariants(5, -8)}
                        />
                        {/* Africa */}
                        <motion.path
                            d="M128 56 L136 54 L144 56 L150 62 L154 72 L156 84 L154 96 L150 108 L144 116 L136 120 L128 118 L122 112 L118 102 L116 90 L118 78 L122 68 L126 60 L128 56 Z"
                            variants={pieceVariants(8, 5)}
                        />
                        {/* Asia */}
                        <motion.path
                            d="M152 12 L162 10 L174 8 L186 10 L198 14 L208 20 L214 28 L216 22 L220 18 L226 20 L224 28 L218 36 L210 42 L200 48 L190 52 L180 54 L170 52 L160 48 L152 42 L148 34 L146 26 L148 18 L152 12 Z"
                            variants={pieceVariants(10, -5)}
                        />
                        {/* India */}
                        <motion.path
                            d="M176 58 L182 56 L188 60 L190 68 L188 78 L184 84 L178 86 L172 82 L170 74 L172 66 L176 58 Z"
                            variants={pieceVariants(6, 8)}
                        />
                        {/* Australia */}
                        <motion.path
                            d="M210 96 L218 92 L228 94 L234 100 L236 110 L232 120 L224 126 L214 126 L206 120 L204 110 L206 100 L210 96 Z"
                            variants={pieceVariants(15, 12)}
                        />
                        {/* Greenland */}
                        <motion.path
                            d="M78 8 L84 6 L92 8 L96 14 L94 20 L88 24 L80 22 L76 16 L78 8 Z"
                            variants={pieceVariants(-4, -12)}
                        />
                    </g>
                </svg>
            </motion.div>
        </motion.div>
    );
}

// Map piece variants: they "slide apart" gracefully
function pieceVariants(dx: number, dy: number): Variants {
    return {
        hidden: { x: dx, y: dy, opacity: 0 },
        visible: { x: 0, y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 80, damping: 15, delay: 0.3 } },
        exit: {
            x: dx * 1.5,
            y: dy * 1.5,
            transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] }
        }
    };
}

// Background dark walnut wood grain pattern overlay 
function WoodGrainSvgPattern({ idSuffix }: { idSuffix: string }) {
    return (
        <div className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id={`grain-${idSuffix}`} width="800" height="200" patternUnits="userSpaceOnUse">
                        <path d="M0,20 Q200,50 400,10 T800,30" stroke="#000" strokeWidth="1" fill="none" opacity="0.3" />
                        <path d="M0,60 Q200,90 400,50 T800,70" stroke="#000" strokeWidth="2" fill="none" opacity="0.4" />
                        <path d="M0,100 Q200,130 400,90 T800,110" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.2" />
                        <path d="M0,140 Q200,170 400,130 T800,150" stroke="#000" strokeWidth="1" fill="none" opacity="0.5" />
                        <path d="M0,180 Q200,210 400,170 T800,190" stroke="#000" strokeWidth="2.5" fill="none" opacity="0.3" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#grain-${idSuffix})`} />
            </svg>
        </div>
    );
}
