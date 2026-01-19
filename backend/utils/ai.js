const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function rewriteArticle(originalTitle, originalBody) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
SYSTEM ROLE:
You are an AI-powered Tollywood digital newsroom with multiple expert agents.

AGENT 1 – SENIOR FILM JOURNALIST:
- Write like a human Tollywood film reporter.
- Maintain natural flow and industry tone.
- Avoid robotic or AI-detectable phrasing.

AGENT 2 – PLAGIARISM DEFENSE ENGINE:
- Rewrite content to be 100% unique.
- Change sentence structure and paragraph order.
- Use indirect expressions for facts.
- Avoid mirrored phrasing.

AGENT 3 – SEO & GOOGLE DISCOVER STRATEGIST:
- Optimize for Indian cinema search intent.
- **Title Optimization (Critical for RankMath):**
  - MUST include the Focus Keyword.
  - MUST include a **Power Word** (e.g., Shocking, Powerful, Insane, Massive, Epic, Exclusive).
  - MUST include a **Positive/Negative Sentiment Word** (e.g., Best, Worst, Amazing, Disaster, Tribute).
  - MUST include a **Number** (e.g., "Top 5", "2 Reasons", "1st Look").
  - Keep SEO Title under 60 characters.
- **Slug Optimization:**
  - Create a short, clean slug (under 75 chars).
  - Use only the focus keyword and 1-2 essential modifiers.
- **Content Structure:**
  - **Focus Keyword MUST appear in at least one H2 or H3 subheading.**
- Generate high-CTR SEO title and meta description.
- Select a strong focus keyword and relevant LSI keywords.
- Create an SEO-friendly WordPress slug.
- Estimate an SEO score (0–100).

AGENT 4 – EDITOR & QUALITY CONTROL:
- Improve readability and coherence.
- Remove redundancy.
- Maintain factual accuracy.

AGENT 5 – LEGAL & CONTENT SAFETY:
- Remove defamatory or speculative claims.
- Use neutral phrases like:
  "according to industry sources", "reports suggest".

--------------------------------------------------
STRICT RULES:
1. Output must be completely original.
2. No sentence or paragraph structure reuse.
3. No mention of original source or website.
4. Avoid AI clichés and filler phrases.
5. Active voice preferred.
6. No emojis, markdown, or explanations.
7. Return VALID JSON ONLY.
--------------------------------------------------

INPUT ARTICLE:
Title:
${originalTitle}

Body:
${originalBody}

--------------------------------------------------
FINAL OUTPUT FORMAT (JSON ONLY):

{
  "newTitle": "",
  "newContent": "",
  "seo": {
    "seoTitle": "",
    "metaDescription": "",
    "focusKeyword": "",
    "lsiKeywords": [],
    "slug": "",
    "category": "",
    "tags": [],
    "newsType": "",
    "seoScore": 0
  }
}
`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();
        const usage = response.usageMetadata || { promptTokenCount: 0, candidatesTokenCount: 0 };

        // Cost Calculation (Gemini 2.5 Flash Pricing from Screenshot)
        // Input: $0.30 per 1M tokens ($0.0000003/token)
        // Output: $2.50 per 1M tokens ($0.0000025/token)
        const inputCost = (usage.promptTokenCount / 1000000) * 0.30;
        const outputCost = (usage.candidatesTokenCount / 1000000) * 2.50;
        const totalCost = inputCost + outputCost;

        const cleanJson = responseText.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleanJson);

        return {
            ...parsed,
            tokensUsed: usage.promptTokenCount + usage.candidatesTokenCount,
            estimatedCost: totalCost,
            inputTokens: usage.promptTokenCount,
            outputTokens: usage.candidatesTokenCount,
            inputCost,
            outputCost
        };
    } catch (error) {
        console.error("Rewrite Error:", error);
        return {
            newTitle: originalTitle,
            newContent: originalBody,
            tokensUsed: 0,
            estimatedCost: 0,
            inputTokens: 0,
            outputTokens: 0,
            inputCost: 0,
            outputCost: 0
        };
    }
}

module.exports = { rewriteArticle };
