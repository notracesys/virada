'use server';

// This is a placeholder for your server-side actions.
// In a real application, you would use a database to verify the access code.
// For this example, we'll simulate it.

// Mock database of generated codes
const validCodes: Record<string, { numbers: number[], used: boolean }> = {
    "MEGA-12345": { numbers: [10, 20, 30, 40, 50, 60], used: false },
    "HACKER-67890": { numbers: [7, 14, 21, 28, 35, 42], used: false },
    "SORTE-ABCDE": { numbers: [5, 15, 25, 35, 45, 55], used: true }, // Example of a used code
};

export async function verifyAccessCode(code: string): Promise<{ success: boolean; numbers?: number[]; error?: string; }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const codeData = validCodes[code.toUpperCase()];

    if (!codeData) {
        return { success: false, error: "Código de acesso não encontrado ou inválido." };
    }

    if (codeData.used) {
        return { success: false, error: "Este código de acesso já foi utilizado." };
    }
    
    // Mark the code as used in a real database
    // For this mock, we'll just pretend:
    // validCodes[code.toUpperCase()].used = true;

    return { success: true, numbers: codeData.numbers.sort((a, b) => a - b) };
}
