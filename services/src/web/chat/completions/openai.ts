// https://github.com/openai/openai-cookbook/blob/main/examples/How_to_format_inputs_to_ChatGPT_models.ipynb
import dotenv from 'dotenv';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let runNumber = getRunNumber() || 0;
let responseNumber = 0;

function getRunNumber() {
  const runNumberFile = path.join('/Users/spankyed/Develop/Projects/CodeGPT/files/completions', 'run_number.txt');
  if (fs.existsSync(runNumberFile)) {
    const number = parseInt(fs.readFileSync(runNumberFile, 'utf-8'), 10);
    fs.writeFileSync(runNumberFile, (number + 1).toString());
    return number + 1;
  } else {
    fs.writeFileSync(runNumberFile, '1');
    return 1;
  }
}
export default async function getCompletion(cmpl: ChatCompletionCreateParamsBase) {
  const completion = await openai.chat.completions.create(cmpl);

  let gptResponse; 

  if (cmpl.functions) {
    gptResponse = completion.choices[0]['message']['function_call']['arguments']
  } else {
    gptResponse = completion.choices[0].message.content as string;
  }

  if (!gptResponse) {
    console.error("Error: GPT-4 response is null.");
    return; // Skip to the next iteration of the while loop
  }

  responseNumber++;

  // Save full response to a file
  const now = new Date();
  const timeLabel = `${now.getHours()}-${now.getMinutes()}`;
  const label = `${runNumber}_${responseNumber}_${timeLabel}`;
  const filePath = path.join('/Users/spankyed/Develop/Projects/CodeGPT/files/completions', label);

  fs.writeFileSync(filePath, gptResponse);

  return gptResponse;
}

