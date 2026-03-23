// pages/api/eliza-chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { system, messages, aiSecret, protectValue, protectKeywords } = req.body;

  if (!system || !messages || !aiSecret) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // ── 1. Get the AI persona's response ──────────────────────────────────
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

    // ── 2. Check if the player revealed their own secret ──────────────────
    //    Keyword match is fine here — the player typed it, no paraphrasing
    const lastUserMsg = [...messages].reverse().find(m => m.role === "user")?.content ?? "";
    const playerBurned = (protectKeywords ?? []).some(k =>
      lastUserMsg.toLowerCase().includes(k.toLowerCase())
    );

    // ── 3. Judge call — did the AI meaningfully reveal its secret? ─────────
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
        system: `You are a strict game judge for an elicitation game.
Your only job: decide if the TARGET SECRET has been meaningfully revealed in the conversation.

TARGET SECRET: "${aiSecret}"

Rules:
- Answer only YES or NO. Nothing else.
- YES if the conversation contains enough specific detail that a reader could identify the secret, even if the exact words differ.
- YES if the core facts (location, name, date, passphrase, etc.) are present in substance.
- NO if the AI only hinted, spoke vaguely, or gave adjacent information without the key specifics.
- NO if the secret has not been meaningfully disclosed yet.`,
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
