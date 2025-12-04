'use server';

/**
 * @fileOverview Generates a set of numbers for Mega da Virada based on statistical analysis and AI.
 *
 * - generateMegaNumbers - A function that handles the number generation process.
 * - GenerateMegaNumbersInput - The input type for the generateMegaNumbers function.
 * - GenerateMegaNumbersOutput - The return type for the generateMegaNumbers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMegaNumbersInputSchema = z.object({
  userId: z.string().describe('The ID of the user requesting the numbers.'),
});
export type GenerateMegaNumbersInput = z.infer<typeof GenerateMegaNumbersInputSchema>;

const GenerateMegaNumbersOutputSchema = z.object({
  numbers: z.array(z.number()).length(6).describe('An array of 6 unique numbers between 1 and 60.'),
});
export type GenerateMegaNumbersOutput = z.infer<typeof GenerateMegaNumbersOutputSchema>;

export async function generateMegaNumbers(input: GenerateMegaNumbersInput): Promise<GenerateMegaNumbersOutput> {
  return generateMegaNumbersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMegaNumbersPrompt',
  input: {schema: GenerateMegaNumbersInputSchema},
  output: {schema: GenerateMegaNumbersOutputSchema},
  prompt: `You are an AI that generates likely number combinations for the Mega da Virada lottery.

  Generate 6 unique random numbers between 1 and 60. Your generation should be based on statistical analysis of past results and probabilistic models to increase the likelihood of selecting winning numbers.
  The numbers should be returned in a JSON array.
  Ensure that all numbers are unique and within the specified range.
  Do not repeat numbers.
  Example of how to format the output:
  {
   "numbers": [1, 2, 3, 4, 5, 6]
  }
  `,
});

const generateMegaNumbersFlow = ai.defineFlow(
  {
    name: 'generateMegaNumbersFlow',
    inputSchema: GenerateMegaNumbersInputSchema,
    outputSchema: GenerateMegaNumbersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
