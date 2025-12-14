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


// --- 2. Phonetic Mapping Table (The Fix for Phonics) ---
// Maps the letter to its short phonetic sound using the International Phonetic Alphabet (IPA).
const phoneticMap = {
    // Vowels (Short sounds)
    'a': 'æ', // as in 'cat'
    'e': 'ɛ', // as in 'bed'
    'i': 'ɪ', // as in 'pig'
    'o': 'ɒ', // as in 'dog' (or 'ɑ' in US English)
    'u': 'ʌ', // as in 'sun'
    
    // Consonants (Phonetic sounds)
    'b': 'b', 'c': 'k', 'd': 'd', 'f': 'f', 'g': 'g', 
    'h': 'h', 'j': 'dʒ', 'k': 'k', 'l': 'l', 'm': 'm', 
    'n': 'n', 'p': 'p', 'r': 'r', 's': 's', 't': 't', 
    'v': 'v', 'w': 'w', 'y': 'j', 'z': 'z', 
    'x': 'ks' // Note: 'x' is two sounds, but 'ks' is often used phonetically
};


// --- 3. DOM Elements and Global Variables ---
const wordDisplay = document.getElementById('word-display');
const newWordButton = document.getElementById('new-word-button');
let currentWord = '';


// --- 4. Application Functions ---

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


// --- 5. ElevenLabs API Integration with SSML (The Fix) ---

/**
 * Plays the phonetic sound for a given letter using the ElevenLabs API,
 * using SSML and IPA to ensure correct short vowel/consonant sounds.
 * @param {string} letter - The letter to generate the sound for.
 */
async function playPhoneticSound(letter) {
    // 🛑 IMPORTANT: REPLACE THESE PLACEHOLDERS WITH YOUR ACTUAL KEYS!
    const ELEVEN_LABS_API_KEY = "sk_cbe515f7e047e94226f77b71f0a370e9afb7eaac81cdefed"; 
    
    // Recommended Voice ID for clear, educational narration (Rachel)
    const VOICE_ID = "CHVXSypvQaXLYlmLWvLY"; 
    
    const API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
    // --------------------------------------------------------
    
    const lowerLetter = letter.toLowerCase();
    const phoneme = phoneticMap[lowerLetter];

    if (!phoneme) {
        console.error(`Phoneme not found for letter: ${letter}`);
        // Fallback to simple letter name pronunciation
        return;
    }

    // 1. Construct the SSML payload
    // The <phoneme> tag with the IPA alphabet and 'ph' attribute forces the phonetic pronunciation.
    const SSML_TEXT = `<speak>
        /a/
    </speak>`;

    if (ELEVEN_LABS_API_KEY === "YOUR_ELEVEN_LABS_API_KEY") {
        console.warn("ElevenLabs API Key is not set. Mocking phonetic sound in console.");
        console.log(`[MOCK PHONETIC SOUND PLAYED]: IPA /${phoneme}/`);
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
                // Send the SSML string
                text: SSML_TEXT, 
                model_id: "eleven_multilingual_v2", 
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.8
                }
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`ElevenLabs API request failed: ${response.statusText}. Response body: ${errorBody}`);
        }

        // 2. Convert the MP3 audio stream response into a Blob
        const audioBlob = await response.blob();
        
        // 3. Create a URL for the Blob and an Audio object
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        // 4. Play the sound
        audio.play();

    } catch (error) {
        console.error("ElevenLabs API Error:", error);
    }
}


// --- 6. Event Listeners and Initialization ---

// Start a new word when the button is clicked
newWordButton.addEventListener('click', displayNewWord);

// Display the first word when the page loads
document.addEventListener('DOMContentLoaded', displayNewWord);


