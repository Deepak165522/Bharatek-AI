import Chat from "../models/Chat.js";
import User from "../models/User.js";
import openai from "../configs/openai.js";
import axios from "axios";
import imagekit from "../configs/imageKit.js";
// Text-based AI Chat Message Controller
export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check credits
    if (req.user.credits < 1) {
      return res.json({
        success: false,
        message: "You don't have enough credits to use this feature"
      });
    }
    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false
    })

    const lowerPrompt = prompt.toLowerCase();

if (lowerPrompt.includes("time") && lowerPrompt.includes("india")) {

  const nowUTC = new Date();

  // Convert UTC to IST (UTC + 5:30)
  const istTime = new Date(nowUTC.getTime() + (5.5 * 60 * 60 * 1000));

  const formattedTime = istTime.toLocaleString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  const reply = {
    role: "assistant",
    content: `Current time in India (IST):\n${formattedTime}`,
    timestamp: Date.now(),
    isImage: false
  };

  res.json({ success: true, reply });

  chat.messages.push(reply);
  await chat.save();

  return;
}


const now = new Date();

const currentTimeIST = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true
}).format(now);

   const today = new Date().toDateString();

// Take last 10 messages only (cost control)
const history = chat.messages.slice(-10).map(msg => ({
  role: msg.role,
  content: msg.content
}));

const messages = [
  {
    role: "system",
    content: `
You are a highly intelligent and professional AI assistant.

Current Date: ${today}
Current Time (India IST): ${currentTimeIST}

Rules:
- If coding is asked, return clean and working code only.
- If explanation is asked, use simple and clear language.
- If math is asked, show step-by-step solution.
- If greeting, respond in a friendly way.
- Always use the provided current date and time if asked.
- Avoid unnecessary long answers.
- Stay accurate and confident.

Always provide structured and high-quality responses.
`
  },
  ...history
];


const { choices } = await openai.chat.completions.create({
  model: "gemini-3-flash-preview",
  temperature: 0.3,
  max_tokens: 1000,
  messages
});

const reply = {
  role: "assistant",
  content: choices[0].message.content,
  timestamp: Date.now(),
  isImage: false
};








// const reply = {
//   ...choices[0].message,
//   timestamp: Date.now(),
//   isImage: false
// };

res.json({ success: true, reply });

chat.messages.push(reply);
await chat.save();

await User.updateOne(
  { _id: userId },
  { $inc: { credits: -1 } }
);

} catch (error) {
  res.json({ success: false, message: error.message });
}

}


// Image Generation Message Controller
export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check credits
    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message: "You don't have enough credits to use this feature"
      });
    }

    const {prompt, chatId, isPublished} = req.body;
    const chat = await Chat.findOne({ userId, _id: chatId });

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false
    })


    const encodedPrompt = encodeURIComponent(prompt);

// Construct ImageKit AI generation URL
const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

// Trigger generation by fetching from ImageKit
const aiImageResponse = await axios.get(generatedImageUrl, {
  responseType: "arraybuffer"
});

// Convert to Base64
const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString("base64")}`;

// Upload to ImageKit Media Library
const uploadResponse = await imagekit.upload({
  file: base64Image,
  fileName: `${Date.now()}.png`,
  folder: "quickgpt"
});

const reply = {
  role: 'assistant',
  content: uploadResponse.url,
  timestamp: Date.now(),
  isImage: true,
  isPublished
};

res.json({ success: true, reply });


chat.messages.push(reply);
await chat.save();

await User.updateOne(
  { _id: userId },
  { $inc: { credits: -2 } }
);



  } catch (error) {
    res.json({ success: false, message: error.message });

  }
};

