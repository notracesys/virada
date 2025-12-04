export type AccessCode = {
    id: string; // Este será o codeId
    email: string;
    isUsed: boolean;
    createdAt: string; // Formatado como string
    usedAt: string | null;
    generatedNumbers: number[] | null;
};
