import getCompletion from './providers/openai';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';
// import { trim } from './prompts/trim';
import { convoGuidelines, greet } from './prompts/converse/converse';

// read about completion params: https://medium.com/nerd-for-tech/model-parameters-in-openai-api-161a5b1f8129
type Completion = Partial<ChatCompletionCreateParamsBase> & {
  parse?: boolean;
}
type FunctionArgs<T> = T extends (...args: infer U) => any ? U : never;
type PromptArgs = { [K in keyof typeof prompts]: FunctionArgs<typeof prompts[K]> };

export const prompts = {
  conversation(prevMessages: any[]): Completion {
    return {
      messages: [
        { role: "system", content: convoGuidelines()},
        ...prevMessages, 
      ],
      // top_p: 0.5,
    };  
  },
}

export function generate<K extends keyof typeof prompts>(promptName: K, args: PromptArgs[K]) {
  const prompt = prompts[promptName](...args as [unknown])
  const trimmedPrompt = {
    ...prompt,
    messages: prompt.messages?.map((msg) => ({ ...msg, content: trim(msg.content || '') }))
  } as Completion;
  return completePrompt(trimmedPrompt);
}

export async function completePrompt(prompt: Completion){
  const { parse, ...rest } = prompt;

  const completion = await getCompletion({
    model: 'gpt-4-1106-preview',
    messages: [],
    ...rest,
  });

  if (parse){
    const parsed = JSON.parse(completion || '');
    return parsed;
  }

  return completion;
}
