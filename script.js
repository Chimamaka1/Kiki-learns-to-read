// --- 1. CVC Word List ---
const cvcWords = [
    // a words (Short 'a' as in 'cat')
    "bat", "cat", "hat", "mat", "pat", "rat", "sat",
    "can", "fan", "man", "pan", "ran", "tan", "van",
    "bag", "lag", "rag", "tag", "wag",
    "dam", "ham", "jam", "ram", "yam",
    "cab", "gab", "lab", "nab", "tab",
    "dad", "had", "mad", "pad", "sad",

    // e words (Short 'e' as in 'bed')
    "bed", "fed", "led", "red", "wed",
    "beg", "leg", "peg",
    "den", "hen", "men", "pen", "ten",
    "get", "jet", "met", "net", "pet", "set", "vet", "wet", "yet",

    // i words (Short 'i' as in 'pig')
    "bib", "fib", "rib",
    "bid", "did", "hid", "kid", "lid", "rid",
    "big", "dig", "fig", "jig", "pig", "wig",
    "bin", "fin", "pin", "tin", "win",
    "fit", "hit", "kit", "lit", "sit",

    // o words (Short 'o' as in 'dog')
    "bob", "cob", "job", "mob", "rob", "sob",
    "cod", "pod", "rod",
    "dog", "fog", "hog", "jog", "log",
    "box", "fox", "pox",
    "cot", "dot", "got", "hot", "pot", "rot",
    "cop", "hop", "mop", "pop", "top",

    // u words (Short 'u' as in 'sun')
    "bub", "cub", "hub", "nub", "rub", "sub", "tub",
    "bud", "cud", "mud",
    "bug", "hug", "jug", "mug", "rug", "tug",
    "bun", "fun", "gun", "nun", "run", "sun",
    "cut", "hut", "nut",
];

// --- 2. DOM Elements and Global Variables ---
const wordDisplay = document.getElementById('word-display');
const newWordButton = document.getElementById('new-word-button');
let currentWord = '';

// --- 3. Application Functions ---

/**
 * Generates and displays a new random CVC word on the screen.
 */
function displayNewWord() {
    // 1. Clear the previous word
    wordDisplay.innerHTML = '';

    // 2. Pick a random word
    const randomIndex = Math.floor(Math.random() * cvcWords.length);
    currentWord = cvcWords[randomIndex];

    // 3. Create a clickable element for each letter
    for (const letter of currentWord) {
        const letterSpan = document.createElement('span');
        letterSpan.classList.add('letter');
        letterSpan.textContent = letter.toUpperCase();
        letterSpan.dataset.letter = letter; // Store the lowercase letter for the sound function
        letterSpan.addEventListener('click', handleLetterClick);
        wordDisplay.appendChild(letterSpan);
    }
}

/**
 * Handles the click event on a letter.
 * @param {Event} event - The click event object.
 */
function handleLetterClick(event) {
    const letter = event.target.dataset.letter;

    // Visual feedback: briefly change the background color
    event.target.style.backgroundColor = '#a0c4ff'; 
    setTimeout(() => {
        event.target.style.backgroundColor = '#e6f2ff';
    }, 200);

    // Call the ElevenLabs sound function
    playPhoneticSound(letter);
}


// --- 4. ElevenLabs API Integration Setup ---

/**
 * Plays the phonetic sound for a given letter using the ElevenLabs API.
 * The function fetches the generated audio stream and plays it.
 * * @param {string} letter - The letter to generate the phonetic sound for (e.g., 'c', 'a', 't').
 */
async function playPhoneticSound(letter) {
    // 🛑 IMPORTANT: REPLACE THESE PLACEHOLDERS WITH YOUR ACTUAL KEYS!
    const ELEVEN_LABS_API_KEY = "YOUR_ELEVEN_LABS_API_KEY"; 
    
    // Recommended Voice ID for clear, educational narration (Rachel)
    const VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; 
    
    const API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
    // --------------------------------------------------------
    
    // The text to be spoken by the TTS engine. 
    // This prompts the engine to pronounce the *sound* of the letter.
    const phoneticText = `The sound of the letter ${letter}.`; 

    if (ELEVEN_LABS_API_KEY === "YOUR_ELEVEN_LABS_API_KEY") {
        console.warn("ElevenLabs API Key is not set. Using browser console log as a mock.");
        console.log(`[MOCK SOUND PLAYED]: ${letter}`);
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': ELEVEN_LABS_API_KEY,
            },
            body: JSON.stringify({
                text: phoneticText,
                model_id: "eleven_multilingual_v2", 
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.8
                }
            })
        });

        if (!response.ok) {
            // Log the error response body for better debugging
            const errorBody = await response.text();
            throw new Error(`ElevenLabs API request failed: ${response.statusText}. Response body: ${errorBody}`);
        }

        // 1. Convert the MP3 audio stream response into a Blob
        const audioBlob = await response.blob();
        
        // 2. Create a URL for the Blob and an Audio object
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        // 3. Play the sound
        audio.play();

    } catch (error) {
        console.error("ElevenLabs API Error:", error);
    }
}


// --- 5. Event Listeners and Initialization ---

// Start a new word when the button is clicked
newWordButton.addEventListener('click', displayNewWord);

// Display the first word when the page loads
document.addEventListener('DOMContentLoaded', displayNewWord);
