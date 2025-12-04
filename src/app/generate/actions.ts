'use server';

import { generateMegaNumbers } from '@/ai/flows/generate-mega-numbers';

export async function getMegaNumbersAction(numberOfNumbers: number): Promise<{ numbers?: number[]; error?: string }> {
  try {
    const result = await generateMegaNumbers({ userId: 'anonymous', numberOfNumbers });
    if (result && result.numbers) {
      return { numbers: result.numbers };
    }
    return { error: 'A IA não conseguiu gerar os números. A base de dados pode estar temporariamente indisponível.' };
  } catch (error) {
    console.error('Error generating Mega numbers:', error);
    return { error: 'Ocorreu um erro inesperado no servidor de análise. Por favor, tente mais tarde.' };
  }
}
