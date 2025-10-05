/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {marked} from 'marked';
import {GoogleGenAI} from '@google/genai';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

const promptInput = document.getElementById('prompt-input') as HTMLTextAreaElement;
const generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
const outputDiv = document.getElementById('output') as HTMLDivElement;
const loader = document.getElementById('loader') as HTMLDivElement;

async function generateContent() {
  if (!promptInput.value) {
    outputDiv.innerHTML = '<p>Please enter a prompt.</p>';
    return;
  }

  generateBtn.disabled = true;
  loader.classList.remove('hidden');
  outputDiv.innerHTML = '';

  const prompt = promptInput.value;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a helpful assistant.',
      }
    });

    const content = response.text;
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