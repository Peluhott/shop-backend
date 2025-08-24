// routes/admin.chat.ts
import { Router } from "express";
import OpenAI from "openai";
import { toolsCC } from "./tool";
import { SYSTEM_PROMPT } from "../ai/system";
import { dispatchAdminQuery } from "../ai/dispatch";
import type { AdminArgs } from "../ai/types";
import type { ChatCompletionMessageToolCall } from "openai/resources/index";

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

router.post("/admin/chat", async (req, res) => {
  try {
    const text = String(req.body.text ?? "");
    const user = req.user as { id: number; isAdmin: boolean } | undefined;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // 1) Let the model decide on a tool call
    const cc1 = await openai.chat.completions.create({
      model: "gpt-5.1",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text }
      ],
      tools: toolsCC
    });

    const msg1 = cc1.choices[0]?.message;
    const toolCall = msg1?.tool_calls?.[0];

    // 2) If it called our tool, parse args and dispatch
    if (toolCall?.function?.name === "admin_query") {
      const args: AdminArgs = JSON.parse(toolCall.function.arguments ?? "{}");
      const rows = await dispatchAdminQuery(args, { userId: user.id, isAdmin: user.isAdmin });

      // 3) Ask the model to format the rows nicely
      const cc2 = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: text },
          {
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify({ rows })
          }
        ]
      });

      const answer = cc2.choices[0]?.message?.content ?? "Done.";
      return res.json({ message: answer, data: rows });
    }

    // No tool call—just return the model's plain reply
    const answer = msg1?.content ?? "I didn't understand.";
    return res.json({ message: answer });
  } catch (err: any) {
    console.error("admin/chat error:", err);
    return res.status(500).json({ message: "Server error", error: err?.message });
  }
});

export default router;
