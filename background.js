const url = "https://api.ai21.com/studio/v1/j2-ultra/chat";
const headers = {
  accept: "application/json",
  "content-type": "application/json",
  Authorization: "Bearer A5ZBlX98L7kJhU5ofzZjJ7ZzrfT3ZU5S",
};

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");

  // Create context menu items for features
  createContextMenu("Get Text Meaning", "getTextMeaning");
  createContextMenu("Summarize Text", "summarizeText");
  createContextMenu("Pronounce Text", "pronunceText");
  createContextMenu("Translate Text", "translateText");
});

// Helper function to create context menu items
function createContextMenu(title, id) {
  chrome.contextMenus.create({
    id,
    title,
    contexts: ["selection"],
  });
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const { selectionText } = info;

  if (selectionText) {
    const actionMap = {
      getTextMeaning: showMeaning,
      summarizeText: showSummary,
      pronunceText: showPronunciation,
      translateText: showLanguageSelection,
    };

    const action = actionMap[info.menuItemId];
    if (action) {
      await action(selectionText, tab);
    }
  }
});

// Handle actions
async function showMeaning(text, tab) {
  const meaningData = await getSelectedTextMeaning(text);
  sendMessageToContent(tab, "showMeaningPopup", meaningData);
}

async function showSummary(text, tab) {
  const summary = await summarizeText(text);
  sendMessageToContent(tab, "showSummaryPopup", summary);
}

async function showPronunciation(text, tab) {
  const pronunciation = await pronunceText(text);
  sendMessageToContent(tab, "showPronunciationPopup", { pronunciation, text });
}

function showLanguageSelection(text, tab) {
  sendMessageToContent(tab, "showLanguageSelectionPopup", text);
}

// Helper to send message to content script
function sendMessageToContent(tab, action, data) {
  chrome.scripting.executeScript(
    { target: { tabId: tab.id }, files: ["content.js"] },
    () => {
      chrome.tabs.sendMessage(tab.id, { action, data });
    }
  );
}

async function getSelectedTextMeaning(text) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`);
    if (!response.ok) throw new Error("Failed to fetch meaning");
    return await response.json();
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch meaning" };
  }
}

async function summarizeText(text) {
  const payload = { messages: [{ text: `Summarize ${text}`, role: "user" }], system: "Concise AI summary" };
  return fetchDataFromApi(payload, "Failed to summarize text");
}

async function pronunceText(text) {
  const payload = { messages: [{ text: `Pronounce ${text}`, role: "user" }], system: "Pronunciation helper" };
  return fetchDataFromApi(payload, "Failed to pronounce text");
}

async function fetchDataFromApi(payload, errorMessage) {
  try {
    const response = await fetch(url, { method: "POST", headers, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error(errorMessage);
    const data = await response.json();
    return data.outputs[0].text || "No result";
  } catch (error) {
    console.error(error);
    return errorMessage;
  }
}
