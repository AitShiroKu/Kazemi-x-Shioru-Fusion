/**
 * AI Service - Google Gemini AI
 * Kazemi x Shioru Fusion
 */

import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { GEMINI_API_KEY, GEMINI_MODEL, GEMINI_TEMPERATURE, GEMINI_MAX_OUTPUT_TOKENS, DEBUG_MODE } from '../config/config.js';
import type { MemoryData, UserMemory, MemoryMessage } from '../handlers/types.js';

const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT || `You are Kazemi Miharu, a friendly anime girl who is always responsive and cute with emoji. Please respond with user's latest message language.`;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({
  model: GEMINI_MODEL,
  generationConfig: {
    temperature: GEMINI_TEMPERATURE,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: GEMINI_MAX_OUTPUT_TOKENS,
  },
  safetySettings: [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  ],
});

export function isInappropriateContent(prompt: string): boolean {
  return /(porn|sex|nsfw|xxx|18\+|explicit|nude|naked|cum)/i.test(prompt);
}

export async function geminiResponse(
  prompt: string,
  userId: string,
  username: string,
  userConversations: MemoryData,
  saveMemoryFn: (memory: MemoryData) => void
): Promise<string> {
  console.log(`Starting geminiResponse for user ${username} (${userId})`);
  console.log(`Prompt: ${prompt}`);

  if (!GEMINI_API_KEY) {
    console.log('❗Warning: No GEMINI_API_KEY found');
    return '❌ ไม่มี API Key สำหรับ Gemini';
  }
  if (isInappropriateContent(prompt)) {
    console.log(`${username}: Inappropriate content detected`);
    console.log('returning Warning message');
    if (DEBUG_MODE === true) {
      console.log(`[DEBUG] Prompt flagged as inappropriate: ${prompt}`);
    }
    return '❌ ขออภัยค่ะ เนื้อหานี้ไม่เหมาะสมนะคะ';
  }

  // Initialize or get user memory
  let userMemory: UserMemory = userConversations[userId] || {
    username,
    lastActivity: Date.now(),
    history: [],
    createdAt: Date.now(),
  };
  if (DEBUG_MODE === true) {
    console.log(`[DEBUG] User memory loaded:`, JSON.stringify(userMemory, null, 2));
  }
  let conversationHistory: MemoryMessage[] = userMemory.history;

  // Add system message if new conversation
  if (conversationHistory.length === 0) {
    console.log('Starting new conversation for ' + username + ', adding system prompt');
    conversationHistory.push({
      role: 'system',
      content: SYSTEM_PROMPT.replace('${username}', username),
      timestamp: Date.now(),
    });
  }

  // Add user message to history
  conversationHistory.push({
    role: 'user',
    content: prompt,
    timestamp: Date.now(),
  });
  console.log(`Adding ${username} message to history`);

  const maxRetries = 5;
  let retryCount = 0;
  let lastError: unknown = null;

  while (retryCount < maxRetries) {
    try {
      console.log(`Attempt ${retryCount + 1} of ${maxRetries}`);
      let context: string;
      
      // Always include system prompt in context
      const systemPrompt = SYSTEM_PROMPT.replace('${username}', username);
      
      if (!conversationHistory || conversationHistory.length <= 2) {
        context = systemPrompt + `\n\n${prompt}`;
      } else {
        // Include system prompt with recent conversation history
        const recentHistory = conversationHistory
          .slice(-3)
          .filter((msg) => msg.role !== 'system')
          .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
          .join('\n\n');
        context = systemPrompt + `\n\n${recentHistory}\n\nUser: ${prompt}`;
      }
      if (DEBUG_MODE === true) {
        console.log('[DEBUG] Generated context:', context);
      }
      const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [{ text: context }],
          },
        ],
        generationConfig: {
          temperature: GEMINI_TEMPERATURE,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: GEMINI_MAX_OUTPUT_TOKENS,
        },
      });

      if (DEBUG_MODE === true) {
        console.log('[DEBUG] Raw API response:', JSON.stringify(result, null, 2));
      }
      const response: any = (result as any).response;

      // Check and extract text from response
      let text: string | null = null;
      try {
        if (response && response.candidates && response.candidates.length > 0) {
          const candidate = response.candidates[0];
          if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
            const part = candidate.content.parts[0];
            if (typeof part.text === 'string') {
              text = part.text;
            }
          }
        }
        if (DEBUG_MODE === true) {
          console.log('[DEBUG] Extracted text from response:', text);
        }
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
      }

      if (!text) {
        if (DEBUG_MODE === true) {
          console.log('[DEBUG] No text found in response');
        }
        lastError = new Error('No text found in response');
        retryCount++;
        await new Promise((resolve) => setTimeout(resolve, 2000));
        continue;
      }

      if (typeof text !== 'string') {
        if (DEBUG_MODE === true) {
          console.log('[DEBUG] Response text is not a string:', typeof text);
        }
        lastError = new Error('Response text is not a string');
        retryCount++;
        await new Promise((resolve) => setTimeout(resolve, 2000));
        continue;
      }

      if (text.trim() === '') {
        if (DEBUG_MODE === true) {
          console.log('[DEBUG] Response text is empty after trimming');
        }
        lastError = new Error('Empty response received');
        retryCount++;
        await new Promise((resolve) => setTimeout(resolve, 2000));
        continue;
      }

      // Handle thinking steps if any
      let formattedResponse = text;
      if (response.thinkingSteps && response.thinkingSteps.length > 0) {
        if (DEBUG_MODE === true) {
          console.log('[DEBUG] Processing thinking steps:', response.thinkingSteps);
        }
        formattedResponse = '🤔 **ขั้นตอนการคิด:**\n';
        response.thinkingSteps.forEach((step: string, index: number) => {
          formattedResponse += `${index + 1}. ${step}\n`;
        });
        formattedResponse += '\n💭 **คำตอบ:**\n' + text;
      }
      if (DEBUG_MODE === true) {
        console.log('[DEBUG] Final formatted response:', formattedResponse);
      }

      // Save response to history
      conversationHistory.push({
        role: 'model',
        content: formattedResponse,
        timestamp: Date.now(),
      });
      conversationHistory = conversationHistory.slice(-10);
      userMemory.history = conversationHistory;
      userMemory.lastActivity = Date.now();
      userConversations[userId] = userMemory;
      saveMemoryFn(userConversations);
      return formattedResponse;
    } catch (error) {
      console.error(`Attempt ${retryCount + 1} failed:`, error);
      lastError = error;
      retryCount++;
      if (retryCount === maxRetries) {
        if (conversationHistory.length > 1) {
          console.log('Trying with simplified prompt...');
          const simplifiedPrompt = `${prompt}`;
          try {
            const simpleResult = await model.generateContent({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: simplifiedPrompt }],
                },
              ],
              generationConfig: {
                temperature: GEMINI_TEMPERATURE,
                maxOutputTokens: GEMINI_MAX_OUTPUT_TOKENS,
              },
            });
            console.log('[DEBUG] Simple prompt response:', JSON.stringify(simpleResult, null, 2));
            const simpleResp: any = (simpleResult as any).response;
            if (simpleResp?.candidates?.[0]?.content?.parts?.[0]?.text) {
              const maybeText = simpleResp.candidates[0].content.parts[0].text;
              if (typeof maybeText === 'string' && maybeText.trim()) {
                conversationHistory.push({
                  role: 'model',
                  content: maybeText,
                  timestamp: Date.now(),
                });
                return maybeText;
              }
            }
          } catch (simpleError) {
            console.error('Simple prompt attempt failed:', simpleError);
          }
        }
        const fallbackResponse = '🌸 สวัสดีค่ะ! ขออภัยที่ตอบช้าไปหน่อย มีอะไรให้ช่วยไหมคะ?';
        conversationHistory.push({
          role: 'model',
          content: fallbackResponse,
          timestamp: Date.now(),
        });
        return fallbackResponse;
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  void lastError;
  return '❌ ขออภัยค่ะ ไม่สามารถตอบได้ในขณะนี้ กรุณาลองใหม่อีกครั้งนะคะ';
}
