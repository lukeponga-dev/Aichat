/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {marked} from 'marked';
import OpenAI from 'openai';

// This key is proxied by the development server
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const modelSelect = document.getElementById('model-select') as HTMLSelectElement;
const promptInput = document.getElementById('prompt-input') as HTMLTextAreaElement;
const generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
const outputDiv = document.getElementById('output') as HTMLDivElement;
const loader = document.getElementById('loader') as HTMLDivElement;

const openai = new OpenAI({
  apiKey: GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  dangerouslyAllowBrowser: true,
});

async function generateContent() {
  if (!promptInput.value) {
    outputDiv.innerHTML = '<p>Please enter a prompt.</p>';
    return;
  }

  generateBtn.disabled = true;
  loader.classList.remove('hidden');
  outputDiv.innerHTML = '';

  const selectedModel = modelSelect.value;
  const prompt = promptInput.value;

  try {
    const response = await openai.chat.completions.create({
      model: selectedModel,
      messages: [
        {role: 'system', content: 'You are a helpful assistant.'},
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.choices[0].message.content ?? '';
    if (content) {
        outputDiv.innerHTML = await marked.parse(content);
    } else {
        outputDiv.innerHTML = '<p>Received an empty response from the model.</p>';
    }
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    outputDiv.innerHTML = `<p style="color: red;">An error occurred: ${errorMessage}</p>`;
  } finally {
    generateBtn.disabled = false;
    loader.classList.add('hidden');
  }
}

generateBtn.addEventListener('click', generateContent);
