// src/service/openai.js
export const callIA = async (prompt) => {
  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Eres un asistente de productividad, responde breve en español." },
          { role: "user", content: prompt }
        ],
        max_tokens: 120,
        temperature: 0.6
      })
    });

    const data = await resp.json();
    if (data.error) {
      console.error("❌ Error API:", data.error);
      return "Error en la API de OpenAI";
    }
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("❌ Error en llamada:", error);
    return "No se pudo conectar con OpenAI.";
  }
};
