/**
 * Gemini AI Utility
 * Port from Kuniko Module with adaptations for Shioru
 */

const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");

/**
 * Check for inappropriate content
 * @param {string} prompt - User prompt to check
 * @returns {boolean} - True if content is inappropriate
 */
function isInappropriateContent(prompt) {
    return /(porn|sex|nsfw|xxx|18\+|explicit|nude|naked|cum)/i.test(prompt);
}

/**
 * Generate response from Gemini AI
 * @param {string} prompt - User prompt
 * @param {string} systemPrompt - System prompt/personality
 * @param {object} configs - Gemini configuration object
 * @returns {Promise<string>} - AI response
 */
async function geminiResponse(prompt, systemPrompt, configs) {
    const { apiKey, model, temperature, maxOutputTokens } = configs;

    if (!apiKey) {
        console.log("❗Warning: No GEMINI_API_KEY found");
        return "❌ ไม่มี API Key สำหรับ Gemini";
    }

    if (isInappropriateContent(prompt)) {
        console.log("Inappropriate content detected");
        return "❌ ขออภัยค่ะ เนื้อหานี้ไม่เหมาะสม";
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const aiModel = genAI.getGenerativeModel({
        model: model || "gemini-2.0-flash-exp",
        generationConfig: {
            temperature: temperature || 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: maxOutputTokens || 8192,
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

    const maxRetries = 5;
    let retryCount = 0;
    let lastError = null;

    while (retryCount < maxRetries) {
        try {
            console.log(`Gemini API attempt ${retryCount + 1} of ${maxRetries}`);

            // Build context with system prompt
            const context = `${systemPrompt}\n\n${prompt}`;

            const result = await aiModel.generateContent({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: context }],
                    },
                ],
                generationConfig: {
                    temperature: temperature || 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: maxOutputTokens || 8192,
                },
            });

            const response = result.response;

            // Extract text from response
            let text = null;
            try {
                if (
                    response &&
                    response.candidates &&
                    response.candidates.length > 0
                ) {
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
            } catch (parseError) {
                console.error("Error parsing response:", parseError);
            }

            if (!text) {
                console.log("No text found in response");
                lastError = new Error("No text found in response");
                retryCount++;
                await new Promise((resolve) => setTimeout(resolve, 2000));
                continue;
            }

            if (typeof text !== "string") {
                console.log("Response text is not a string:", typeof text);
                lastError = new Error("Response text is not a string");
                retryCount++;
                await new Promise((resolve) => setTimeout(resolve, 2000));
                continue;
            }

            if (text.trim() === "") {
                console.log("Response text is empty after trimming");
                lastError = new Error("Empty response received");
                retryCount++;
                await new Promise((resolve) => setTimeout(resolve, 2000));
                continue;
            }

            // Success!
            return text;
        } catch (error) {
            console.error(`Attempt ${retryCount + 1} failed:`, error);
            lastError = error;
            retryCount++;

            if (retryCount === maxRetries) {
                // Try simplified prompt as last resort
                try {
                    console.log("Trying simplified prompt...");
                    const simpleResult = await aiModel.generateContent({
                        contents: [
                            {
                                role: "user",
                                parts: [{ text: prompt }],
                            },
                        ],
                        generationConfig: {
                            temperature: temperature || 0.7,
                            maxOutputTokens: maxOutputTokens || 8192,
                        },
                    });

                    const simpleResp = simpleResult.response;
                    if (
                        simpleResp?.candidates?.[0]?.content?.parts?.[0]?.text
                    ) {
                        const maybeText =
                            simpleResp.candidates[0].content.parts[0].text;
                        if (typeof maybeText === "string" && maybeText.trim()) {
                            return maybeText;
                        }
                    }
                } catch (simpleError) {
                    console.error("Simple prompt attempt failed:", simpleError);
                }

                // Final fallback
                return "🌸 สวัสดีค่ะ! ขออภัยที่ตอบช้าไปหน่อย มีอะไรให้ช่วยไหมคะ?";
            }

            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }

    void lastError;
    return "❌ ขออภัยค่ะ ไม่สามารถตอบได้ในขณะนี้ กรุณาลองใหม่ภายหลัง";
}

module.exports = {
    geminiResponse,
    isInappropriateContent,
};
