/**
 * AI Service - Google Gemini AI
 * Kazemi x Shioru Fusion
 */

import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import {
  GEMINI_API_KEY,
  GEMINI_MODEL,
  GEMINI_TEMPERATURE,
  GEMINI_MAX_OUTPUT_TOKENS,
} from "../config/config.js";
import { debug } from "../logger/logger.js";
import logger from "../logger/logger.js";
import type {
  MemoryData,
  UserMemory,
  MemoryMessage,
} from "../handlers/types.js";

const SYSTEM_PROMPT =
  process.env.SYSTEM_PROMPT ||
  `You are Kazemi Miharu, a friendly anime girl who is always responsive and cute with emoji. Please respond with user's latest message language.`;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: GEMINI_MODEL,
  generationConfig: {
    temperature: GEMINI_TEMPERATURE,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: GEMINI_MAX_OUTPUT_TOKENS,
  },
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
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
  saveMemoryFn: (memory: MemoryData) => void,
): Promise<string> {
  debug(
    `Starting geminiResponse for user ${username} (${userId})`,
    { userId, username },
    "gemini",
  );
  debug(`User prompt received`, { prompt, length: prompt.length }, "gemini");

  if (!GEMINI_API_KEY) {
    logger.warn("No GEMINI_API_KEY found");
    return "❌ ไม่มี API Key สำหรับ Gemini";
  }
  if (isInappropriateContent(prompt)) {
    debug(
      `${username}: Inappropriate content detected`,
      { username, prompt },
      "gemini",
    );
    debug(
      "Returning warning message for inappropriate content",
      { username },
      "gemini",
    );
    debug(
      `Prompt flagged as inappropriate: ${prompt}`,
      { username, prompt },
      "gemini",
    );
    return "❌ ขออภัยค่ะ เนื้อหานี้ไม่เหมาะสมนะคะ";
  }

  // Initialize or get user memory
  let userMemory: UserMemory = userConversations[userId] || {
    username,
    lastActivity: Date.now(),
    history: [],
    createdAt: Date.now(),
  };
  debug("User memory loaded", { userMemory }, "gemini");
  let conversationHistory: MemoryMessage[] = userMemory.history;

  // Add system message if new conversation
  if (conversationHistory.length === 0) {
    debug(
      `Starting new conversation for ${username}, adding system prompt`,
      { username },
      "gemini",
    );
    conversationHistory.push({
      role: "system",
      content: SYSTEM_PROMPT.replace("${username}", username),
      timestamp: Date.now(),
    });
  }

  // Add user message to history
  conversationHistory.push({
    role: "user",
    content: prompt,
    timestamp: Date.now(),
  });
  debug(
    `Adding ${username} message to history`,
    { username, historyLength: conversationHistory.length },
    "gemini",
  );

  const maxRetries = 5;
  let retryCount = 0;
  let lastError: unknown = null;

  while (retryCount < maxRetries) {
    try {
      debug(
        `API attempt ${retryCount + 1} of ${maxRetries}`,
        { retryCount, maxRetries },
        "gemini",
      );
      let context: string;

      // Always include system prompt in context
      const systemPrompt = SYSTEM_PROMPT.replace("${username}", username);

      if (!conversationHistory || conversationHistory.length <= 2) {
        context = systemPrompt + `\n\n${prompt}`;
      } else {
        // Include system prompt with recent conversation history
        const recentHistory = conversationHistory
          .slice(-3)
          .filter((msg) => msg.role !== "system")
          .map(
            (msg) =>
              `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`,
          )
          .join("\n\n");
        context = systemPrompt + `\n\n${recentHistory}\n\nUser: ${prompt}`;
      }
      debug(
        "Generated context for AI request",
        { context, historyLength: conversationHistory.length },
        "gemini",
      );
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
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

      debug("Raw API response received", { result }, "gemini");
      const response: any = (result as any).response;

      // Check and extract text from response
      let text: string | null = null;
      try {
        if (response && response.candidates && response.candidates.length > 0) {
          const candidate = response.candidates[0];
          if (
            candidate.content &&
            candidate.content.parts &&
            candidate.content.parts.length > 0
          ) {
            const part = candidate.content.parts[0];
            if (typeof part.text === "string") {
              text = part.text;
            }
          }
        }
        debug(
          "Extracted text from response",
          { text, textLength: text?.length },
          "gemini",
        );
      } catch (parseError) {
        logger.error({ error: parseError }, "Error parsing response");
      }

      if (!text) {
        debug("No text found in response", { response }, "gemini");
        lastError = new Error("No text found in response");
        retryCount++;
        await new Promise((resolve) => setTimeout(resolve, 2000));
        continue;
      }

      if (typeof text !== "string") {
        debug(
          "Response text is not a string",
          { textType: typeof text, text },
          "gemini",
        );
        lastError = new Error("Response text is not a string");
        retryCount++;
        await new Promise((resolve) => setTimeout(resolve, 2000));
        continue;
      }

      if (text.trim() === "") {
        debug(
          "Response text is empty after trimming",
          { textLength: text.length },
          "gemini",
        );
        lastError = new Error("Empty response received");
        retryCount++;
        await new Promise((resolve) => setTimeout(resolve, 2000));
        continue;
      }

      // Handle thinking steps if any
      let formattedResponse = text;
      if (response.thinkingSteps && response.thinkingSteps.length > 0) {
        debug(
          "Processing thinking steps",
          { thinkingSteps: response.thinkingSteps },
          "gemini",
        );
        formattedResponse = "🤔 **ขั้นตอนการคิด:**\n";
        response.thinkingSteps.forEach((step: string, index: number) => {
          formattedResponse += `${index + 1}. ${step}\n`;
        });
        formattedResponse += "\n💭 **คำตอบ:**\n" + text;
      }
      debug(
        "Final formatted response",
        { formattedResponse, responseLength: formattedResponse.length },
        "gemini",
      );

      // Save response to history
      conversationHistory.push({
        role: "model",
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
      logger.error({ error, attempt: retryCount + 1 }, `API attempt failed`);
      lastError = error;
      retryCount++;
      if (retryCount === maxRetries) {
        if (conversationHistory.length > 1) {
          debug(
            "Trying with simplified prompt...",
            { historyLength: conversationHistory.length },
            "gemini",
          );
          const simplifiedPrompt = `${prompt}`;
          try {
            const simpleResult = await model.generateContent({
              contents: [
                {
                  role: "user",
                  parts: [{ text: simplifiedPrompt }],
                },
              ],
              generationConfig: {
                temperature: GEMINI_TEMPERATURE,
                maxOutputTokens: GEMINI_MAX_OUTPUT_TOKENS,
              },
            });
            debug(
              "Simple prompt response received",
              { simpleResult },
              "gemini",
            );
            const simpleResp: any = (simpleResult as any).response;
            if (simpleResp?.candidates?.[0]?.content?.parts?.[0]?.text) {
              const maybeText = simpleResp.candidates[0].content.parts[0].text;
              if (typeof maybeText === "string" && maybeText.trim()) {
                conversationHistory.push({
                  role: "model",
                  content: maybeText,
                  timestamp: Date.now(),
                });
                return maybeText;
              }
            }
          } catch (simpleError) {
            logger.error(
              { error: simpleError },
              "Simple prompt attempt failed",
            );
          }
        }
        const fallbackResponse =
          "🌸 สวัสดีค่ะ! ขออภัยที่ตอบช้าไปหน่อย มีอะไรให้ช่วยไหมคะ?";
        conversationHistory.push({
          role: "model",
          content: fallbackResponse,
          timestamp: Date.now(),
        });
        return fallbackResponse;
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  void lastError;
  return "❌ ขออภัยค่ะ ไม่สามารถตอบได้ในขณะนี้ กรุณาลองใหม่อีกครั้งนะคะ";
}
