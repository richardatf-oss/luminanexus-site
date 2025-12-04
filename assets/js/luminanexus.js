// assets/js/luminanexus.js
(function () {
  // Set footer year(s)
  const yearSpanList = document.querySelectorAll("#year");
  const year = new Date().getFullYear();
  yearSpanList.forEach((el) => (el.textContent = year));

  // === ChavrutaGPT wiring ===
  const chatForm = document.querySelector(".ln-chat-form");
  const chatWindow = document.querySelector(".ln-chat-window");
  const chatTextarea = document.querySelector(".ln-input-textarea");
  const chatButton = chatForm ? chatForm.querySelector("button[type='submit']") : null;
  const modeSelect = document.querySelector(".ln-mode-select");
  const saveButton = document.querySelector(".ln-session-save");
  const newButton = document.querySelector(".ln-session-new");
  const pinButton = document.querySelector(".ln-session-pin");
  const pinnedList = document.querySelector(".ln-pinned-list");
  const sefariaInput = document.querySelector(".ln-sefaria-input");
  const sefariaInsert = document.querySelector(".ln-sefaria-insert");

  const convo = [];
  const pinnedInsights = [];

  // --- Simple chime using Web Audio (if available) ---
  function playChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880; // A5
      gain.gain.value = 0.08;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch (e) {
      // fail silently
    }
  }

  function appendMessage(role, text) {
    if (!chatWindow) return;

    const msg = document.createElement("div");
    msg.classList.add("ln-chat-message");
    msg.classList.add(role === "assistant" ? "ln-chat-message-ai" : "ln-chat-message-user");
    msg.setAttribute("data-role", role);

    const label = document.createElement("div");
    label.classList.add("ln-chat-label");
    label.textContent = role === "assistant" ? "ChavrutaGPT" : "You";

    const bubble = document.createElement("div");
    bubble.classList.add("ln-chat-bubble");
    bubble.textContent = text;

    msg.appendChild(label);
    msg.appendChild(bubble);
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    requestAnimationFrame(() => {
      msg.classList.add("ln-chat-message-enter");
    });
  }

  function setLoading(isLoading) {
    if (!chatButton) return;
    if (isLoading) {
      chatButton.disabled = true;
      chatButton.textContent = "Thinking…";
    } else {
      chatButton.disabled = false;
      chatButton.textContent = "Send to ChavrutaGPT";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const text = chatTextarea.value.trim();
    if (!text) return;

    appendMessage("user", text);
    convo.push({ role: "user", content: text });

    chatTextarea.value = "";
    chatTextarea.focus();
    setLoading(true);

    try {
      const mode = modeSelect ? modeSelect.value : "questions";

      const params = new URLSearchParams({
        message: text,
        conversation: JSON.stringify(convo),
        source: "luminanexus-chavruta-page",
        mode,
      });

      const response = await fetch(
        `/.netlify/functions/chavruta-gpt?${params.toString()}`,
        { method: "GET" }
      );

      if (!response.ok) {
        let bodyInfo = "";
        try {
          const data = await response.json();
          bodyInfo = data.reply || JSON.stringify(data);
        } catch (e) {
          bodyInfo = await response.text();
        }
        appendMessage(
          "assistant",
          `Server error (${response.status}): ${bodyInfo}`
        );
        convo.push({ role: "assistant", content: bodyInfo });
        return;
      }

      const data = await response.json();
      const replyText =
        data.reply ||
        data.message ||
        data.text ||
        "I received a response from the server, but I couldn’t find a 'reply' field in it.";

      appendMessage("assistant", replyText);
      convo.push({ role: "assistant", content: replyText });
      playChime();
    } catch (err) {
      console.error("ChavrutaGPT error:", err);
      appendMessage(
        "assistant",
        "I’m sorry — I couldn’t reach the ChavrutaGPT function right now. Please try again in a moment."
      );
      convo.push({
        role: "assistant",
        content:
          "I’m sorry — I couldn’t reach the ChavrutaGPT function right now. Please try again in a moment.",
      });
    } finally {
      setLoading(false);
    }
  }

  function buildSessionText() {
    const lines = [];
    lines.push("ChavrutaGPT Session – LuminaNexus");
    lines.push("--------------------------------");
    convo.forEach((turn) => {
      const speaker = turn.role === "assistant" ? "ChavrutaGPT" : "You";
      lines.push(`${speaker}: ${turn.content}`);
      lines.push("");
    });
    return lines.join("\n");
  }

  async function handleSaveClick() {
    const text = buildSessionText();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        alert("Chavruta session copied to your clipboard.");
      } else {
        window.prompt("Copy your chavruta session:", text);
      }
    } catch (err) {
      console.error("Clipboard error:", err);
      window.prompt("Copy your chavruta session:", text);
    }
  }

  function handleNewSession() {
    convo.length = 0;
    if (chatWindow) {
      chatWindow.innerHTML = "";
      appendMessage(
        "assistant",
        "Shalom. We are beginning a new session. What would you like to learn together now?"
      );
    }
  }

  function renderPinnedInsights() {
    if (!pinnedList) return;
    pinnedList.innerHTML = "";
    pinnedInsights.forEach((text, index) => {
      const li = document.createElement("li");
      li.textContent = text;
      li.title = "Pinned insight " + (index + 1);
      pinnedList.appendChild(li);
    });
  }

  function handlePinLastInsight() {
    // Find last assistant turn
    for (let i = convo.length - 1; i >= 0; i--) {
      if (convo[i].role === "assistant") {
        pinnedInsights.push(convo[i].content);
        renderPinnedInsights();
        return;
      }
    }
    alert("No assistant insight to pin yet.");
  }

  function handleSefariaInsert() {
    if (!sefariaInput || !chatTextarea) return;
    const ref = sefariaInput.value.trim();
    if (!ref) return;

    // Simple Sefaria link builder (underscores instead of spaces)
    const slug = ref.replace(/\s+/g, "_");
    const link = `https://www.sefaria.org/${encodeURIComponent(slug)}`;

    const existing = chatTextarea.value.trim();
    const insertText = `${ref} — you can open it on Sefaria here: ${link}`;

    chatTextarea.value = existing
      ? existing + "\n\n" + insertText
      : insertText;

    chatTextarea.focus();
  }

  if (chatForm && chatWindow && chatTextarea) {
    chatForm.addEventListener("submit", handleSubmit);
  }
  if (saveButton) {
    saveButton.addEventListener("click", handleSaveClick);
  }
  if (newButton) {
    newButton.addEventListener("click", handleNewSession);
  }
  if (pinButton) {
    pinButton.addEventListener("click", handlePinLastInsight);
  }
  if (sefariaInsert) {
    sefariaInsert.addEventListener("click", handleSefariaInsert);
  }
})();
