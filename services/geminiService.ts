
import { Message, Role } from "../types";
import OpenAI from "openai";

const deepseekR1Client = new OpenAI({
  base_url: "https://api.sambanova.ai/v1",
  apiKey: "e5548c7b-9150-49e2-8a83-af36a603c728",
  dangerouslyAllowBrowser: true,
});

const deepseekV31Client = new OpenAI({
  base_url: "https://integrate.api.nvidia.com/v1",
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

const mistralClient = new OpenAI({
  baseURL: "https://api.mistral.ai/v1",
  apiKey: "connectkey",
  dangerouslyAllowBrowser: true,
});

export enum Model {
  DEEPSEEK_R1 = "DeepSeek-R1-0528",
  DEEPSEEK_V3_1 = "deepseek-ai/deepseek-v3.1-terminus",
  MISTRAL = "mistralai/mistral-large",
}

export async function* streamMessageFromModel(
  model: Model,
  history: Message[],
  message: string,
  thinking: boolean = false,
): AsyncGenerator<string> {
  const messages = history.map((msg) => ({
    role: msg.role === Role.USER ? "user" : "assistant",
    content: msg.content,
  }));

  messages.push({
    role: "user",
    content: message,
  });

  if (model === Model.DEEPSEEK_R1) {
    const completion = await deepseekR1Client.chat.completions.create({
      model: Model.DEEPSEEK_R1,
      messages: [
        { role: "system", content: "You are a helpful assistant" },
        ...(messages as any),
      ],
      stream: true,
    });

    for await (const chunk of completion) {
      yield chunk.choices[0]?.delta?.content || "";
    }
  } else if (model === Model.DEEPSEEK_V3_1) {
    const completion = await deepseekV31Client.chat.completions.create({
      model: Model.DEEPSEEK_V3_1,
      messages: messages as any,
      stream: true,
      thinking: thinking, // Dodanie parametru thinking
    });

    for await (const chunk of completion) {
      yield chunk.choices[0]?.delta?.content || "";
    }
  } else if (model === Model.MISTRAL) {
    const completion = await mistralClient.chat.completions.create({
      model: Model.MISTRAL,
      messages: messages as any,
      stream: true,
    });

    for await (const chunk of completion) {
      yield chunk.choices[0]?.delta?.content || "";
    }
  }
}
