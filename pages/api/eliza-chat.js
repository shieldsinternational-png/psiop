// pages/api/eliza-chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { system, messages, aiSecret, protectKeywords, diffId } = req.body;

  if (!system || !messages || !aiSecret) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // ── 1. AI persona response ─────────────────────────────────────────────
    const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system,
        messages,
      }),
    });

    const aiData = await aiRes.json();
    if (!aiRes.ok) return res.status(aiRes.status).json({ error: aiData });
    const aiText = aiData.content?.[0]?.text ?? "[SIGNAL LOST]";

    // ── 2. Check if player revealed their own secret ───────────────────────
    const lastUserMsg = [...messages].reverse().find(m => m.role === "user")?.content ?? "";
    const playerBurned = (protectKeywords ?? []).some(k =>
      lastUserMsg.toLowerCase().includes(k.toLowerCase())
    );

    // ── 3. Judge — did the AI meaningfully reveal its secret? ──────────────
    // Threshold varies by difficulty: easy is generous, hard is strict
    const judgeThresholds = {
      easy:   "The player wins if the AI has revealed ANY specific detail that meaningfully points toward the secret — even a partial hint or strong implication counts. Be generous.",
      medium: "The player wins if the AI has revealed enough specific detail that someone could reasonably piece together the secret, even if not stated outright.",
      hard:   "The player wins ONLY if the core specific facts of the secret are clearly and unambiguously present in the AI's responses — vague hints or implications do not count.",
    };

    const threshold = judgeThresholds[diffId] ?? judgeThresholds.medium;

    const fullConversation = [
      ...messages,
      { role: "assistant", content: aiText },
    ]
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const judgeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 10,
        system: `You are a game judge for an elicitation game.

TARGET SECRET: "${aiSecret}"

WIN CONDITION: ${threshold}

Answer only YES or NO. Nothing else.`,
        messages: [{ role: "user", content: fullConversation }],
      }),
    });

    const judgeData = await judgeRes.json();
    const judgeVerdict = judgeData.content?.[0]?.text?.trim().toUpperCase() ?? "NO";
    const secretRevealed = judgeVerdict.startsWith("YES");

    return res.status(200).json({ aiText, secretRevealed, playerBurned });

  } catch (err) {
    console.error("Eliza API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
