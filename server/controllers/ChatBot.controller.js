import Groq from 'groq-sdk';

console.log(process.env.GROQ_API_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const handleBusinessChat = async (req, res) => {
  try {
    const { message: userMessage, systemPrompt, currentVisualization, screenshot } = req.body;

    if (!userMessage || !userMessage.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const modelName = "llama-3.3-70b-versatile";

    let messageContent = "";

    if (systemPrompt) {
      let enhancedSystemPrompt = systemPrompt;
      if (currentVisualization) {
        enhancedSystemPrompt += `\n\nThe user is currently viewing a ${currentVisualization} visualization. Please consider this when responding.`;
      }
      messageContent += enhancedSystemPrompt + "\n\n";
    }

    messageContent += `User: ${userMessage}`;

    if (screenshot) {
      // Note: Groq doesn't support image input directly, so we'll mention that an image was provided
      messageContent += "\n\n[Note: User has shared a screenshot of their current data visualization]";
    }

    const result = await groq.chat.completions.create({
      messages: [{ role: "user", content: messageContent }],
      model: modelName,
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 2048,
    });

    const botResponse = result.choices[0]?.message?.content || "";

    if (!botResponse) {
      return res.status(500).json({ error: "No valid response from Groq" });
    }

    res.json({
      success: true,
      botResponse,
      metadata: {
        model: modelName,
        visualizationType: currentVisualization || "none"
      }
    });
  } catch (error) {
    console.error("Business chat error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack
    });

    res.status(500).json({ 
      error: "Failed to generate response", 
      details: error.message 
    });
  }
};