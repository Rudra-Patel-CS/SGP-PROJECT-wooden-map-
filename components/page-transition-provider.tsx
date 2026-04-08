"use client";

import { createContext, useContext, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ScrollProgress } from "@/components/scroll-progress";

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

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const navigateTo = useCallback((href: string) => {
        if (href === pathname) return;
        router.push(href);
    }, [pathname, router]);

    const triggerLoading = useCallback(() => {
        router.back();
    }, [router]);

    return (
        <PageTransitionContext.Provider value={{ triggerLoading, navigateTo }}>
            <div className="min-h-screen">
                {children}
            </div>
            <ScrollProgress />
        </PageTransitionContext.Provider>
    );
}

