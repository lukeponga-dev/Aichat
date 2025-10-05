/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {marked} from 'marked';
import {GoogleGenAI} from '@google/genai';
import hljs from 'highlight.js';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

// Configure marked to use highlight.js for syntax highlighting
marked.setOptions({
  highlight: (code, lang) => {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-', // for CSS classes
});


// Input elements
const systemInstructionInput = document.getElementById('system-instruction-input') as HTMLTextAreaElement;
const promptInput = document.getElementById('prompt-input') as HTMLTextAreaElement;
const generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
const outputDiv = document.getElementById('output') as HTMLDivElement;
const loader = document.getElementById('loader') as HTMLDivElement;

// Settings elements
const temperatureSlider = document.getElementById('temperature-slider') as HTMLInputElement;
const temperatureValue = document.getElementById('temperature-value') as HTMLSpanElement;
const topPSlider = document.getElementById('top-p-slider') as HTMLInputElement;
const topPValue = document.getElementById('top-p-value') as HTMLSpanElement;
const topKSlider = document.getElementById('top-k-slider') as HTMLInputElement;
const topKValue = document.getElementById('top-k-value') as HTMLSpanElement;

// Update displayed values when sliders change
temperatureSlider.addEventListener('input', () => {
  temperatureValue.textContent = temperatureSlider.value;
});

topPSlider.addEventListener('input', () => {
  topPValue.textContent = topPSlider.value;
});

topKSlider.addEventListener('input', () => {
  topKValue.textContent = topKSlider.value;
});


async function generateContent() {
  if (!promptInput.value) {
    outputDiv.innerHTML = '<p>Please enter a prompt.</p>';
    return;
  }

  generateBtn.disabled = true;
  loader.classList.remove('hidden');
  outputDiv.innerHTML = '';

  const systemInstruction = systemInstructionInput.value;
  const prompt = promptInput.value;
  
  // Get settings values
  const temperature = parseFloat(temperatureSlider.value);
  const topP = parseFloat(topPSlider.value);
  const topK = parseInt(topKSlider.value, 10);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: temperature,
        topP: topP,
        topK: topK,
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