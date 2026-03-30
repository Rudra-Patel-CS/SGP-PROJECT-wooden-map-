"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/* ─── seeded random to avoid hydration mismatch ─── */
function seededRandom(seed: number) {
    let s = seed;
    return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

/* ─── tiny wood-shaving particle ─── */
function Particle({ index }: { index: number }) {
    const rng = seededRandom(index * 1000 + 42);
    const left = 8 + rng() * 84;
    const size = 3 + rng() * 5;
    const h = 2 + rng() * 3;
    const delay = index * 0.15;
    const dur = 1.8 + rng() * 1.2;
    const rotateEnd = 180 + rng() * 90;

    return (
        <motion.span
            className="wml-particle"
            style={{
                left: `${left}%`,
                width: size,
                height: h,
            }}
            initial={{ y: 0, opacity: 0, rotate: 0 }}
            animate={{
                y: -90,
                opacity: [0, 0.65, 0],
                rotate: rotateEnd,
            }}
            transition={{
                duration: dur,
                delay,
                repeat: Infinity,
                ease: "easeOut",
            }}
        />
    );
}

/* ─── main loader component ─── */
export function WorldMapLoader({ onFinish }: { onFinish?: () => void }) {
    const [phase, setPhase] = useState<"engrave" | "brand" | "exit">("engrave");

    useEffect(() => {
        const t1 = setTimeout(() => setPhase("brand"), 1600);
        const t2 = setTimeout(() => setPhase("exit"), 2300);
        const t3 = setTimeout(() => onFinish?.(), 2800);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [onFinish]);

    /* shared path animation props */
    const engrave = (delay: number) => ({
        initial: { pathLength: 0, fillOpacity: 0 } as const,
        animate: { pathLength: 1, fillOpacity: 0.85 } as const,
        transition: { pathLength: { duration: 1.4, delay, ease: "easeInOut" as const }, fillOpacity: { duration: 0.6, delay: delay + 0.9, ease: "easeIn" as const } },
    });

    return (
        <motion.div
            className="wml-overlay"
            initial={{ opacity: 1 }}
            animate={phase === "exit" ? { opacity: 0, scale: 1.04 } : { opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            {/* warm radial glow */}
            <div className="wml-glow" />

            {/* floating particles */}
            <div className="wml-particles">
                {[...Array(14)].map((_, i) => (
                    <Particle key={i} index={i} />
                ))}
            </div>

            <div className="wml-content">
                {/* ─── SVG wooden map ─── */}
                <motion.div
                    className="wml-frame-wrapper"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <svg
                        viewBox="0 0 800 450"
                        className="wml-svg"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            {/* wood grain pattern */}
                            <pattern id="wg" x="0" y="0" width="800" height="450" patternUnits="userSpaceOnUse">
                                <rect width="800" height="450" fill="#c49a6c" />
                                {[18, 42, 68, 95, 125, 158, 190, 222, 255, 288, 320, 355, 390, 420].map((y, i) => (
                                    <line key={i} x1="0" y1={y} x2="800" y2={y + (i % 3 === 0 ? 2 : -1)}
                                        stroke={i % 2 === 0 ? "#b8895c" : "#ae7f52"}
                                        strokeWidth={0.5 + (i % 3) * 0.3}
                                        opacity={0.25 + (i % 4) * 0.08} />
                                ))}
                            </pattern>
                            {/* engrave shadow filter */}
                            <filter id="engraveShadow">
                                <feDropShadow dx="0.5" dy="0.8" stdDeviation="0.6" floodColor="#2a1508" floodOpacity="0.45" />
                            </filter>
                            {/* shimmer */}
                            <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="transparent" />
                                <stop offset="45%" stopColor="transparent" />
                                <stop offset="50%" stopColor="rgba(255,245,220,0.18)" />
                                <stop offset="55%" stopColor="transparent" />
                                <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                        </defs>

                        {/* Background panel */}
                        <rect x="15" y="15" width="770" height="420" rx="8" fill="url(#wg)" />

                        {/* Frame border */}
                        <motion.rect
                            x="15" y="15" width="770" height="420" rx="8"
                            fill="none" stroke="#5c3310" strokeWidth="3.5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                        />
                        {/* Inner frame */}
                        <motion.rect
                            x="30" y="30" width="740" height="390" rx="4"
                            fill="none" stroke="#8b5a3c" strokeWidth="1"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
                        />

                        {/* ═══════ CONTINENT PATHS ═══════ */}
                        <g filter="url(#engraveShadow)">
                            {/* North America — Alaska, Canada, USA, Mexico */}
                            <motion.path
                                d="M68 72 L72 68 L80 65 L88 62 L95 64 L100 60 L108 58 L115 60 L120 56 L128 55 L135 58 L140 55 L148 56 L155 60 L162 58 L168 62 L175 60 L180 65 L188 68 L192 72 L195 78 L198 85 L200 92 L202 100 L200 108 L198 115 L195 120 L192 126 L188 132 L185 138 L180 142 L175 148 L170 152 L165 158 L160 162 L155 165 L150 168 L145 172 L140 175 L135 178 L132 182 L128 188 L125 192 L122 198 L120 205 L118 210 L115 215 L112 218 L108 215 L105 210 L102 205 L98 200 L95 195 L90 192 L85 188 L80 185 L75 180 L72 175 L68 170 L65 165 L62 158 L60 150 L58 142 L56 135 L55 128 L56 120 L58 112 L60 105 L62 98 L64 90 L66 82 L68 72 Z"
                                fill="#5c3310" stroke="#3a1d08" strokeWidth="1.5"
                                {...engrave(0.1)}
                            />
                            {/* Central America isthmus */}
                            <motion.path
                                d="M118 210 L120 215 L122 220 L125 228 L128 235 L132 240 L135 245 L138 248"
                                fill="none" stroke="#3a1d08" strokeWidth="2"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
                            />
                            {/* South America */}
                            <motion.path
                                d="M138 248 L145 250 L155 252 L165 256 L172 262 L178 270 L182 280 L185 290 L186 302 L185 312 L182 322 L178 332 L172 342 L168 350 L162 358 L155 365 L148 370 L142 372 L136 370 L132 365 L128 358 L125 350 L122 340 L120 328 L118 318 L117 308 L118 298 L120 288 L122 278 L125 268 L128 260 L132 254 L138 248 Z"
                                fill="#5c3310" stroke="#3a1d08" strokeWidth="1.5"
                                {...engrave(0.25)}
                            />
                            {/* Greenland */}
                            <motion.path
                                d="M210 42 L218 38 L228 36 L238 38 L248 42 L254 48 L258 56 L258 64 L256 72 L250 78 L242 82 L234 82 L226 80 L218 76 L212 70 L208 62 L206 54 L208 46 L210 42 Z"
                                fill="#5c3310" stroke="#3a1d08" strokeWidth="1.3"
                                {...engrave(0.3)}
                            />
                            {/* Europe — Scandinavia, Spain, Italy, Balkans */}
                            <motion.path
                                d="M362 52 L368 48 L375 46 L382 48 L388 45 L395 48 L400 52 L405 48 L410 50 L415 55 L418 60 L420 66 L422 72 L420 78 L418 84 L415 90 L412 96 L408 100 L405 106 L400 110 L395 115 L390 118 L385 120 L380 122 L375 118 L370 114 L366 110 L364 115 L362 120 L360 115 L358 108 L355 102 L352 96 L350 90 L348 84 L347 78 L348 72 L350 66 L352 60 L355 55 L362 52 Z"
                                fill="#5c3310" stroke="#3a1d08" strokeWidth="1.5"
                                {...engrave(0.2)}
                            />
                            {/* British Isles */}
                            <motion.path
                                d="M348 58 L352 55 L356 56 L358 60 L356 64 L352 66 L348 64 L346 60 L348 58 Z"
                                fill="#5c3310" stroke="#3a1d08" strokeWidth="1"
                                {...engrave(0.32)}
                            />
                            {/* Iceland */}
                            <motion.path
                                d="M318 42 L324 40 L330 42 L332 46 L328 50 L322 50 L318 48 L316 44 L318 42 Z"
                                fill="#5c3310" stroke="#3a1d08" strokeWidth="0.8"
                                {...engrave(0.35)}
                            />
                            {/* Africa */}
                            <motion.path
                                d="M370 128 L378 125 L388 124 L398 125 L408 128 L418 132 L425 138 L430 145 L434 155 L436 165 L438 178 L438 190 L436 202 L434 215 L430 228 L426 240 L420 252 L414 262 L408 270 L400 278 L392 282 L384 280 L378 275 L372 268 L368 258 L365 248 L362 238 L360 226 L358 215 L358 202 L360 190 L362 178 L364 168 L365 158 L366 148 L368 138 L370 128 Z"
                                fill="#5c3310" stroke="#3a1d08" strokeWidth="1.5"
                                {...engrave(0.35)}
                            />
                            {/* Madagascar */}
                            <motion.path
                                d="M442 242 L446 238 L450 240 L452 248 L450 258 L446 264 L442 262 L440 254 L440 246 L442 242 Z"
                                fill="#5c3310" stroke="#3a1d08" strokeWidth="1"
                                {...engrave(0.5)}
                            />
                            {/* Asia — Russia, China, Middle East */}
                            <motion.path
                                d="M422 50 L432 46 L442 44 L455 42 L468 40 L480 38 L492 36 L505 38 L518 40 L530 42 L542 45 L552 48 L562 52 L570 56 L578 62 L582 68 L585 58 L588 52 L592 48 L598 46 L605 48 L608 52 L605 58 L600 65 L596 72 L590 78 L585 82 L580 88 L575 92 L568 96 L560 100 L552 105 L545 110 L538 115 L530 118 L522 120 L515 122 L508 125 L500 128 L492 130 L485 132 L478 130 L470 128 L462 125 L455 120 L448 115 L442 110 L436 105 L430 98 L425 90 L422 82 L420 74 L420 66 L420 58 L422 50 Z"
                                fill="#5c3310" stroke="#3a1d08" strokeWidth="1.5"
                                {...engrave(0.15)}
                            />
                            {/* India */}
                            <motion.path
                                d="M482 138 L490 135 L498 138 L504 145 L508 155 L510 168 L508 180 L504 190 L498 198 L492 202 L486 200 L480 195 L476 185 L474 175 L474 165 L476 155 L478 145 L482 138 Z"
                                fill="#5c3310" stroke="#3a1d08" strokeWidth="1.5"
                                {...engrave(0.4)}
                            />
                            {/* Southeast Asia peninsula */}
                            <motion.path
                                d="M530 125 L535 130 L538 138 L540 148 L542 158 L540 168 L536 175 L530 178 L525 175 L522 168 L520 158 L522 148 L525 138 L528 130 L530 125 Z"
                                fill="#5c3310" stroke="#3a1d08" strokeWidth="1.2"
                                {...engrave(0.42)}
                            />
                            {/* Japan */}
                            <motion.path
                                d="M602 62 L606 58 L610 60 L612 66 L614 74 L612 82 L608 88 L604 86 L602 80 L600 72 L602 62 Z"
                                fill="#5c3310" stroke="#3a1d08" strokeWidth="1.2"
                                {...engrave(0.4)}
                            />
                            {/* Indonesia — island chain */}
                            <motion.path
                                d="M542 192 L548 190 L554 192 L558 196 L556 200 L550 202 L544 200 L542 196 L542 192 Z"
                                fill="#5c3310" stroke="#3a1d08" strokeWidth="0.8"
                                {...engrave(0.5)}
                            />
                            <motion.path
                                d="M562 196 L568 194 L574 196 L576 200 L574 204 L568 206 L562 204 L560 200 L562 196 Z"
                                fill="#5c3310" stroke="#3a1d08" strokeWidth="0.8"
                                {...engrave(0.52)}
                            />
                            <motion.path
                                d="M580 200 L586 198 L592 200 L594 204 L592 208 L586 210 L580 208 L578 204 L580 200 Z"
                                fill="#5c3310" stroke="#3a1d08" strokeWidth="0.8"
                                {...engrave(0.54)}
                            />
                            {/* Australia */}
                            <motion.path
                                d="M565 258 L575 252 L588 248 L600 250 L612 256 L620 264 L626 275 L628 288 L626 300 L622 312 L615 320 L606 326 L596 328 L585 326 L576 320 L568 312 L562 302 L558 290 L556 278 L558 268 L562 260 L565 258 Z"
                                fill="#5c3310" stroke="#3a1d08" strokeWidth="1.5"
                                {...engrave(0.45)}
                            />
                            {/* New Zealand */}
                            <motion.path
                                d="M645 310 L648 306 L652 308 L654 314 L652 322 L648 328 L644 326 L642 320 L642 314 L645 310 Z"
                                fill="#5c3310" stroke="#3a1d08" strokeWidth="1"
                                {...engrave(0.55)}
                            />
                            {/* Sri Lanka */}
                            <motion.path
                                d="M496 208 L500 206 L504 208 L504 214 L500 218 L496 216 L494 212 L496 208 Z"
                                fill="#5c3310" stroke="#3a1d08" strokeWidth="0.8"
                                {...engrave(0.48)}
                            />
                        </g>

                        {/* ═══════ COMPASS ROSE ═══════ */}
                        <motion.g
                            transform="translate(710, 380)"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.2, duration: 0.5, ease: "backOut" }}
                        >
                            <circle cx="0" cy="0" r="22" fill="none" stroke="#5c3310" strokeWidth="1.5" />
                            <circle cx="0" cy="0" r="18" fill="none" stroke="#8b5a3c" strokeWidth="0.8" />
                            {/* N */}
                            <path d="M0 -16 L3 -4 L0 -2 L-3 -4 Z" fill="#3a1d08" />
                            {/* S */}
                            <path d="M0 16 L3 4 L0 2 L-3 4 Z" fill="#8b5a3c" />
                            {/* E */}
                            <path d="M16 0 L4 -3 L2 0 L4 3 Z" fill="#8b5a3c" />
                            {/* W */}
                            <path d="M-16 0 L-4 -3 L-2 0 L-4 3 Z" fill="#3a1d08" />
                            <circle cx="0" cy="0" r="2.5" fill="#5c3310" />
                            <text x="0" y="-24" textAnchor="middle" fontSize="7" fill="#3a1d08" fontWeight="bold"
                                style={{ fontFamily: "serif" }}>N</text>
                        </motion.g>

                        {/* Shimmer sweep */}
                        <rect x="15" y="15" width="770" height="420" rx="8"
                            fill="url(#shimmer)" className="wml-shimmer" />
                    </svg>
                </motion.div>

                {/* ─── Brand ─── */}
                <motion.div
                    className="wml-brand"
                    initial={{ opacity: 0, y: 14 }}
                    animate={
                        phase === "brand" || phase === "exit"
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 14 }
                    }
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <h2 className="wml-brand-title">
                        Aryam <span className="wml-brand-accent">Maps</span>
                    </h2>
                    <p className="wml-brand-tagline">Handcrafted Wooden Maps</p>
                </motion.div>
            </div>
        </motion.div>
    );
}
