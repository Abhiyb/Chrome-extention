// Common utility to create a popup
function createPopup(content) {
  const popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "10px";
  popup.style.right = "10px";
  popup.style.padding = "15px";
  popup.style.color = "white";
  popup.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  popup.style.border = "1px solid #333";
  popup.style.borderRadius = "10px";
  popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
  popup.style.maxWidth = "300px";
  popup.style.fontFamily = "Arial, sans-serif";
  popup.style.zIndex = "10000";
  popup.innerHTML = content;
  return popup;
}

// Function to show meaning
function showMeaningPopup(data) {
  const content = `
    <strong>Meaning</strong>
    <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer;">X</button>
    <p>${data?.meanings[0]?.definitions[0]?.definition || "No definition found"}</p>
  `;
  document.body.appendChild(createPopup(content));
}

// Function to show summary
function showSummaryPopup(summary) {
  const content = `
    <strong>Summary</strong>
    <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer;">X</button>
    <p>${summary || "Failed to generate summary"}</p>
  `;
  document.body.appendChild(createPopup(content));
}

// Function to show pronunciation
function showPronunciationPopup(data) {
  const content = `
    <strong>Pronunciation</strong>
    <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer;">X</button>
    <p>${data.pronunciation}</p>
    <button onclick="playPronunciation('${data.text}')" style="cursor: pointer;">Play Pronunciation</button>
  `;
  document.body.appendChild(createPopup(content));
}

// Function to show language selection
function showLanguageSelectionPopup(text) {
  const content = `
    <strong>Select Language</strong>
    <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer;">X</button>
    <select id="language-select">
      <option value="Spanish">Spanish</option>
      <option value="French">French</option>
      <option value="German">German</option>
      <option value="Chinese">Chinese</option>
      <option value="Japanese">Japanese</option>
      <option value="Hindi">Hindi</option>
    </select>
    <button onclick="translateText()">Translate</button>
  `;
  document.body.appendChild(createPopup(content));

  // Translation logic
  function translateText() {
    const selectedLanguage = document.getElementById("language-select").value;
    chrome.runtime.sendMessage({
      action: "translateSelectedText",
      text,
      targetLanguage: selectedLanguage,
    }, (response) => {
      showTranslationPopup(response.translation);
    });
  }
}

// Show translated text in a popup
function showTranslationPopup(translation) {
  const content = `
    <strong>Translation</strong>
    <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer;">X</button>
    <p>${translation || "Translation failed"}</p>
  `;
  document.body.appendChild(createPopup(content));
}
