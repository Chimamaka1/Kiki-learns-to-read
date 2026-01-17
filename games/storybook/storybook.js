// CVC Storybook
const stories = [
  {
    title: "The Big Cat",
    pages: [
      { text: "A <span class='cvc-word'>cat</span> sat on a <span class='cvc-word'>mat</span>.", emoji: "🐱" },
      { text: "The <span class='cvc-word'>cat</span> was <span class='cvc-word'>big</span>.", emoji: "🐱" },
      { text: "The <span class='cvc-word'>cat</span> had a <span class='cvc-word'>hat</span>.", emoji: "🎩🐱" },
      { text: "The <span class='cvc-word'>cat</span> ran to a <span class='cvc-word'>rat</span>.", emoji: "🐱🐀" },
      { text: "The <span class='cvc-word'>cat</span> and <span class='cvc-word'>rat</span> are pals!", emoji: "🐱❤️🐀" }
    ]
  },
  {
    title: "The Red Hen",
    pages: [
      { text: "A <span class='cvc-word'>hen</span> sat in a <span class='cvc-word'>pen</span>.", emoji: "🐔" },
      { text: "The <span class='cvc-word'>hen</span> was <span class='cvc-word'>red</span>.", emoji: "🐔" },
      { text: "The <span class='cvc-word'>hen</span> saw a <span class='cvc-word'>bug</span>.", emoji: "🐔🐛" },
      { text: "The <span class='cvc-word'>hen</span> ate the <span class='cvc-word'>bug</span>.", emoji: "🐔" },
      { text: "The <span class='cvc-word'>hen</span> was happy!", emoji: "🐔😊" }
    ]
  },
  {
    title: "The Hot Sun",
    pages: [
      { text: "The <span class='cvc-word'>sun</span> is <span class='cvc-word'>hot</span>.", emoji: "☀️" },
      { text: "A <span class='cvc-word'>man</span> sat in the <span class='cvc-word'>sun</span>.", emoji: "👨☀️" },
      { text: "The <span class='cvc-word'>man</span> got a <span class='cvc-word'>hat</span>.", emoji: "👨🎩" },
      { text: "The <span class='cvc-word'>hat</span> is on his head.", emoji: "👨🎩" },
      { text: "Now the <span class='cvc-word'>man</span> is not <span class='cvc-word'>hot</span>!", emoji: "👨😊" }
    ]
  },
  {
    title: "The Wet Dog",
    pages: [
      { text: "A <span class='cvc-word'>dog</span> ran in the rain.", emoji: "🐕🌧️" },
      { text: "The <span class='cvc-word'>dog</span> got <span class='cvc-word'>wet</span>.", emoji: "🐕💦" },
      { text: "The <span class='cvc-word'>dog</span> ran to a <span class='cvc-word'>tub</span>.", emoji: "🐕🛁" },
      { text: "The <span class='cvc-word'>dog</span> sat in the <span class='cvc-word'>tub</span>.", emoji: "🐕🛁" },
      { text: "Now the <span class='cvc-word'>dog</span> is dry!", emoji: "🐕✨" }
    ]
  },
  {
    title: "The Little Bug",
    pages: [
      { text: "A <span class='cvc-word'>bug</span> sat on a <span class='cvc-word'>rug</span>.", emoji: "🐛" },
      { text: "The <span class='cvc-word'>bug</span> was <span class='cvc-word'>red</span>.", emoji: "🐛" },
      { text: "The <span class='cvc-word'>bug</span> saw a <span class='cvc-word'>cup</span>.", emoji: "🐛☕" },
      { text: "The <span class='cvc-word'>bug</span> ran to the <span class='cvc-word'>cup</span>.", emoji: "🐛☕" },
      { text: "The <span class='cvc-word'>bug</span> had a sip!", emoji: "🐛😋" }
    ]
  },
  {
    title: "The Fun Pig",
    pages: [
      { text: "A <span class='cvc-word'>pig</span> ran in the <span class='cvc-word'>mud</span>.", emoji: "🐷" },
      { text: "The <span class='cvc-word'>pig</span> had <span class='cvc-word'>fun</span>.", emoji: "🐷😊" },
      { text: "The <span class='cvc-word'>pig</span> met a <span class='cvc-word'>hen</span>.", emoji: "🐷🐔" },
      { text: "The <span class='cvc-word'>pig</span> and <span class='cvc-word'>hen</span> ran.", emoji: "🐷🐔💨" },
      { text: "They had <span class='cvc-word'>fun</span> together!", emoji: "🐷🐔❤️" }
    ]
  }
];

let currentStory = null;
let currentPage = 0;

// Speech helper - always available in global scope
function speakText(text) {
  try {
    // Remove HTML tags for speech
    const cleanText = text.replace(/<[^>]*>/g, '');
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech unavailable:', e);
  }
}

function goBack() {
  window.history.back();
}

function displayStoryList() {
  const storyList = document.getElementById('story-list');
  storyList.innerHTML = '';

  stories.forEach((story, index) => {
    const card = document.createElement('div');
    card.className = 'story-card';
    card.innerHTML = `
      <h3>${story.title}</h3>
      <p>${story.pages.length} pages</p>
    `;
    card.onclick = () => openStory(index);
    storyList.appendChild(card);
  });
}

function openStory(index) {
  currentStory = stories[index];
  currentPage = 0;
  document.querySelector('.story-selector').classList.add('hidden');
  document.getElementById('story-reader').classList.remove('hidden');
  displayPage();
}

function closeStory() {
  currentStory = null;
  currentPage = 0;
  document.querySelector('.story-selector').classList.remove('hidden');
  document.getElementById('story-reader').classList.add('hidden');
}

function displayPage() {
  if (!currentStory) return;

  const page = currentStory.pages[currentPage];
  document.getElementById('story-title').textContent = currentStory.title;
  document.getElementById('story-text').innerHTML = page.text;
  document.getElementById('story-image').textContent = page.emoji || '';
  document.getElementById('page-number').textContent = `Page ${currentPage + 1} of ${currentStory.pages.length}`;

  // Enable/disable navigation buttons
  document.getElementById('prev-page').disabled = currentPage === 0;
  document.getElementById('next-page').disabled = currentPage === currentStory.pages.length - 1;
}

function nextPage() {
  if (currentStory && currentPage < currentStory.pages.length - 1) {
    currentPage++;
    displayPage();
  }
}

function prevPage() {
  if (currentStory && currentPage > 0) {
    currentPage--;
    displayPage();
  }
}

function readPage() {
  if (currentStory) {
    const page = currentStory.pages[currentPage];
    speakText(page.text);
  }
}

function readWord() {
  speakText("Click on any colored word to hear it!");
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  displayStoryList();

  // Use event delegation for CVC word clicks (works on dynamically added content)
  const storyText = document.getElementById('story-text');
  storyText.addEventListener('click', (e) => {
    if (e.target.classList.contains('cvc-word')) {
      e.target.classList.add('highlighted');
      speakText(e.target.textContent);
      setTimeout(() => {
        e.target.classList.remove('highlighted');
      }, 500);
    }
  });

  document.getElementById('prev-page').onclick = prevPage;
  document.getElementById('next-page').onclick = nextPage;
  document.getElementById('read-page').onclick = readPage;
  document.getElementById('read-word').onclick = readWord;
  document.getElementById('close-story').onclick = closeStory;
});
