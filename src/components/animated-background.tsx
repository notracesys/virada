'use client';
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";

export const AnimatedBackground = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const columns = useMemo(() => {
        if (!isMounted) return [];
        const numColumns = Math.floor(window.innerWidth / 12);
        return Array.from({ length: numColumns > 0 ? numColumns : 30 }, (_, i) => i);
    }, [isMounted]);

    const chars = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ01";
    const randomString = (length: number) => Array.from({ length }).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    
    if (!isMounted) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black">
            <div className="absolute inset-0 flex justify-between opacity-20">
                {columns.map((_, i) => (
                    <div 
                        key={i} 
                        className="h-full text-accent font-mono text-xs leading-loose animate-matrix-rain will-change-transform" 
                        style={{ 
                            animationDelay: `${Math.random() * -15}s`, 
                            animationDuration: `${5 + Math.random() * 8}s`,
                            writingMode: 'vertical-rl'
                        }}
                    >
                        {randomString(100)}
                    </div>
                ))}
            </div>
        </div>
    );
};
