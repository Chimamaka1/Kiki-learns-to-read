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

    const soundCache = {};

function playPhoneticSound(letter) {
  const lowerLetter = letter.toLowerCase();

  if (!soundCache[lowerLetter]) {
    soundCache[lowerLetter] = new Audio(`sounds/${lowerLetter}.mp3`);
  }

  const audio = soundCache[lowerLetter];
  audio.currentTime = 0;
  audio.play().catch(err => {
    console.error("Audio play failed:", err);
  });
}

// --- 6. Event Listeners and Initialization ---

// Start a new word when the button is clicked
newWordButton.addEventListener('click', displayNewWord);

// Display the first word when the page loads
document.addEventListener('DOMContentLoaded', displayNewWord);


