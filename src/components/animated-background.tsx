'use client';
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";

export const AnimatedBackground = () => {
    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background">
            <div className="absolute -inset-10 opacity-10">
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>
        </div>
    );
};
