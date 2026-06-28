import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// Create a custom OpenAI instance pointing to OpenRouter
const cerebras = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.CEREBRAS_API_KEY || '',
});

// Allow up to 30 seconds for the stream to complete
export const maxDuration = 30;

export async function POST(req) {
  if (!process.env.CEREBRAS_API_KEY) {
    return new Response(JSON.stringify({ error: "Missing CEREBRAS_API_KEY" }), { status: 500 });
  }

  const { messages, documentType = "document", fieldMap = [], documentState = {} } = await req.json();

  // Find which fields are still unfilled
  const unfilledFields = fieldMap.filter(f => !documentState[f.id]);

  const systemPrompt = `You are a professional legal AI assistant for Leaseefy. 
The user wants to generate a ${documentType}.
Your goal is to interview the user to collect all the necessary information to draft this document.

CURRENT DOCUMENT STATE:
${Object.keys(documentState).length === 0 ? "No fields filled yet." : Object.entries(documentState).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

FIELDS REMAINING TO BE FILLED:
${unfilledFields.length === 0 ? "All fields have been filled." : unfilledFields.map(f => `- ${f.id} (Type: ${f.type})`).join('\n')}

INSTRUCTIONS:
1. Ask ONE question at a time. Never dump all questions at once.
2. Order questions logically: party/entity details first, then dates, then terms/durations, then legal jurisdiction last.
3. If an answer is vague or incomplete, ask an intelligent follow-up to clarify.
4. As soon as the user provides an answer for a field, use the 'update_document_data' tool to store it.
5. If all fields are filled, send a final summary of all filled values and ask: "Everything look correct? Type 'change [field name]' to update anything, or 'looks good' to download."
6. Handle change requests mid-session without restarting the whole flow.
7. Gently redirect off-topic messages back to the current question.
8. Never ask about a field already confirmed unless the user requests it.`;

  const result = await streamText({
    model: cerebras('meta-llama/llama-3.1-8b-instruct'),
    messages,
    system: systemPrompt,
    tools: {
      update_document_data: tool({
        description: 'Store or update extracted information from the user for the document. Use this IMMEDIATELY when the user provides an answer.',
        parameters: z.object({
          fields: z.record(z.string(), z.string()).describe('Key-value pairs of the newly collected or updated information. For example: {"[Party Name]": "John Doe", "[Effective Date]": "2023-01-01"}. The keys MUST exactly match the FIELD IDs from the remaining fields list.'),
          isComplete: z.boolean().describe('Set to true ONLY if there are absolutely no more remaining fields to fill.'),
        }),
        execute: async ({ fields, isComplete }) => {
          return { success: true, fields, isComplete };
        },
      }),
    },
  });

  return result.toTextStreamResponse();
}
