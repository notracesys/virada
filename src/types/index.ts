export type AccessCode = {
    id: string;
    email: string;
    isUsed: boolean;
    createdAt: string; // Should be a string after formatting
    usedAt: string | null;
    generatedNumbers: number[] | null;
};
