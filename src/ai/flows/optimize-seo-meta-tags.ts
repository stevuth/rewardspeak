'use server';

/**
 * @fileOverview An AI-powered tool that suggests improvements to meta tags for SEO optimization.
 *
 * - optimizeSEOMetaTags - A function that takes a title and description and returns an optimized title and description.
 * - OptimizeSEOMetaTagsInput - The input type for the optimizeSEOMetaTags function.
 * - OptimizeSEOMetaTagsOutput - The return type for the optimizeSEOMetaTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeSEOMetaTagsInputSchema = z.object({
  title: z.string().describe('The current meta title of the page.'),
  description: z.string().describe('The current meta description of the page.'),
  keywords: z.string().optional().describe('The keywords associated with the page.'),
});
export type OptimizeSEOMetaTagsInput = z.infer<
  typeof OptimizeSEOMetaTagsInputSchema
>;

const OptimizeSEOMetaTagsOutputSchema = z.object({
  optimizedTitle: z
    .string()
    .describe('The optimized meta title for better SEO.'),
  optimizedDescription: z
    .string()
    .describe('The optimized meta description for better SEO.'),
});

export type OptimizeSEOMetaTagsOutput = z.infer<
  typeof OptimizeSEOMetaTagsOutputSchema
>;

export async function optimizeSEOMetaTags(
  input: OptimizeSEOMetaTagsInput
): Promise<OptimizeSEOMetaTagsOutput> {
  return optimizeSEOMetaTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeSEOMetaTagsPrompt',
  input: {schema: OptimizeSEOMetaTagsInputSchema},
  output: {schema: OptimizeSEOMetaTagsOutputSchema},
  prompt: `You are an SEO expert. Given the current meta title, meta description, and keywords (if provided) of a page, suggest an improved meta title and meta description that are optimized for search engines.

Current Title: {{{title}}}
Current Description: {{{description}}}
{{#if keywords}}
Current Keywords: {{{keywords}}}
{{/if}}

Optimize the title and description to be more engaging and include relevant keywords for better search engine ranking. The title should be concise and capture the essence of the page. The description should provide a brief summary of the page content and entice users to click through from search results.

Ensure that the optimized title and description are within the recommended length limits for search engines (title: 50-60 characters, description: 150-160 characters). Return the optimized title and description as a JSON object.

{{schema description=OptimizeSEOMetaTagsOutputSchema}}
`,
});

const optimizeSEOMetaTagsFlow = ai.defineFlow(
  {
    name: 'optimizeSEOMetaTagsFlow',
    inputSchema: OptimizeSEOMetaTagsInputSchema,
    outputSchema: OptimizeSEOMetaTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
