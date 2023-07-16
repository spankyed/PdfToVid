const winston = require("winston");

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

module.exports = logger;

logger.log("debug", "Hello, Winston!");
logger.debug("The is the home '/' route.");
logger.error("Events Error: Unauthenticated user");

// const openai = require('openai');
// const fs = require('fs');
// const pdf = require('pdf-parse');
// const fetch = require('node-fetch');
// const yaml = require('yaml');
// const util = require('util');
// const ora = require('ora');
// const textwrap = require('textwrap');

// const prompts = [
//   'Can you give me a very clear explanation of the core assertions, implications, and mechanics elucidated in this paper?',
//   "Can you explain the value of this in basic terms? Like you're talking to a CEO. So what? What's the bottom line here?",
//   'Can you give me an analogy or metaphor that will help explain this to a broad audience.',
// ];

// // File operations
// const saveFile = (filepath, content) => {
//   fs.writeFileSync(filepath, content, 'utf8');
// };

// const openFile = (filepath) => {
//   return fs.readFileSync(filepath, 'utf8');
// };

// const saveYaml = (filepath, data) => {
//   fs.writeFileSync(filepath, yaml.stringify(data), 'utf8');
// };

// const openYaml = (filepath) => {
//   return yaml.parse(fs.readFileSync(filepath, 'utf8'));
// };

// // API functions
// const chatbot = async (conversation, model = "gpt-4-0613", temperature = 0) => {
//   const spinner = ora('Thinking...').start();
//   try {
//     const response = await openai.ChatCompletion.create({
//       model: model,
//       messages: conversation,
//       temperature: temperature,
//     });
//     const text = response['choices'][0]['message']['content'];
//     spinner.stop();
//     return { text, total_tokens: response['usage']['total_tokens'] };
//   } catch (error) {
//     console.error(`Error communicating with OpenAI: "${error}"`);
//     spinner.stop();
//     throw error;
//   }
// };

// const chatPrint = (text) => {
//   const formattedText = textwrap.wrap(text, { width: 120 });
//   console.log(`\n\n\nCHATBOT:\n\n${formattedText}`);
// };

// // Main function
// const main = async () => {
//   openai.apiKey = openFile('key_openai.txt').trim();

//   const pdfFiles = fs.readdirSync('input/').filter(f => f.endsWith('.pdf'));

//   for (const pdfFile of pdfFiles) {
//     const filename = 'output/' + pdfFile.replace('.pdf', '.txt');
//     if (fs.existsSync(filename)) {
//       continue;
//     }

//     const dataBuffer = fs.readFileSync('input/' + pdfFile);
//     const paper = await pdf(dataBuffer);
//     let paperText = paper.text;
//     if (paperText.length > 22000) {
//       paperText = paperText.substring(0, 22000);
//     }

//     let allMessages = [{ role: 'system', content: paperText }];
//     let report = '';
//     for (const p of prompts) {
//       allMessages.push({ role: 'user', content: p });
//       const { text } = await chatbot(allMessages);
//       chatPrint(text);
//       allMessages.push({ role: 'assistant', content: text });
//       report += `\n\n\n\nQ: ${p}\n\nA: ${text}`;
//     }

//     saveFile(filename, report.trim());
// };

// main().catch(console.error);


'[ total of'