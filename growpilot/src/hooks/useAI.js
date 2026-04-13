import { useState, useCallback } from 'react';
import { chatSystemPrompt } from '../data/mockData';

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

// Fallback responses when API key is missing or fails
const chatFallbacks = [
  "Yes! Cooking Oil 1L is available for ₹180. We have 20 bottles in stock. Would you like to place an order? 🛒",
  "Rice 5kg is currently ₹320 per bag. Please note we're running low (only 5 bags left). I'd recommend ordering soon! 📦",
  "We're open from 8 AM to 10 PM daily. Our store is located at MG Road, Bangalore. Feel free to visit or order online!",
  "Sugar 1kg is available for ₹48, but we're almost out — only 2 packets remain. Order quickly before it's gone! ⚠️",
  "Today's best deals: Rice 5kg at ₹320 and Cooking Oil at ₹180. We also have Tea Powder 500g at ₹190. Need help ordering? 😊",
];

let fallbackIndex = 0;
const getFallback = () => {
  const response = chatFallbacks[fallbackIndex % chatFallbacks.length];
  fallbackIndex++;
  return response;
};

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendChatMessage = useCallback(async (conversationHistory) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!ANTHROPIC_API_KEY) {
        // Use fallback for demo without key
        await new Promise(r => setTimeout(r, 1200));
        return getFallback();
      }
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 400,
          system: chatSystemPrompt,
          messages: conversationHistory,
        }),
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      return data.content[0].text;
    } catch (err) {
      setError(err.message);
      await new Promise(r => setTimeout(r, 800));
      return getFallback();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateMarketing = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);

    const fallbackContent = {
      instagram: `🎉 Big savings on ${formData.productName}! Get ${formData.offerPercent}% OFF this ${formData.occasion}. Limited stock available at Sharma General Store! 🛒`,
      whatsapp: `Namaste! 🙏 Exciting offer from Sharma General Store!\n\n✨ ${formData.offerPercent}% OFF on ${formData.productName}!\n📅 ${formData.occasion} Special\n⏰ Limited time offer!\n\nOrder now: 98765 43210`,
      facebook: `🎊 Celebrating ${formData.occasion} with amazing offers!\n\n💰 ${formData.offerPercent}% discount on ${formData.productName}\n🏪 Visit Sharma General Store\n📍 MG Road, Bangalore\n📞 Call: 98765 43210`,
      hashtags: [`#${formData.occasion?.replace(/\s/g, '')}Sale`, "#SharmaBangalore", "#MSMEIndia", "#LocalStore", "#Deals"],
      callToAction: "Order Now & Save Big! 🛍️",
    };

    try {
      if (!ANTHROPIC_API_KEY) {
        await new Promise(r => setTimeout(r, 2000));
        return fallbackContent;
      }
      const prompt = `Generate promotional marketing content for a small Indian grocery business called "Sharma General Store".

Product: ${formData.productName}
Offer: ${formData.offerPercent}% discount
Occasion: ${formData.occasion}
Platform focus: ${formData.platform}

Return ONLY valid JSON (no markdown, no explanation):
{
  "instagram": "Instagram post text with emojis (max 150 chars, energetic)",
  "whatsapp": "WhatsApp message (friendly, conversational, max 200 chars, use line breaks)",
  "facebook": "Facebook post (engaging, include store details, max 180 chars)",
  "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "callToAction": "Short CTA phrase (max 8 words)"
}`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 600,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      const text = data.content[0].text.replace(/```json|```/g, "").trim();
      return JSON.parse(text);
    } catch (err) {
      setError(err.message);
      await new Promise(r => setTimeout(r, 1000));
      return fallbackContent;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { sendChatMessage, generateMarketing, isLoading, error };
}
