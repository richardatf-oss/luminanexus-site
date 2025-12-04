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

  const convo = [];

  function appendMessage(role, text) {
    if (!chatWindow) return;

    const msg = document.createElement("div");
    msg.classList.add("ln-chat-message");
    msg.classList.add(role === "assistant" ? "ln-chat-message-ai" : "ln-chat-message-user");

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

    // trigger enter animation
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

      console.log("Calling Chavruta function with:", { text, convo, mode });

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

      console.log("Chavruta response status:", response.status);

      if (!response.ok) {
        let bodyInfo = "";
        try {
          const data = await response.json();
          bodyInfo = data.reply || JSON.stringify(data);
        } catch (e) {
          bodyInfo = await response.text();
        }
        console.error("Non-OK response body:", bodyInfo);
        appendMessage(
          "assistant",
          `Server error (${response.status}): ${bodyInfo}`
        );
        return;
      }

      const data = await response.json();
      console.log("Chavruta response JSON:", data);

      const replyText =
        data.reply ||
        data.message ||
        data.text ||
        "I received a response from the server, but I couldn’t find a 'reply' field in it.";

      appendMessage("assistant", replyText);
      convo.push({ role: "assistant", content: replyText });
    } catch (err) {
      console.error("ChavrutaGPT error:", err);
      appendMessage(
        "assistant",
        "I’m sorry — I couldn’t reach the ChavrutaGPT function right now. Please try again in a moment."
      );
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
        // Fallback – open prompt for manual copy
        window.prompt("Copy your chavruta session:", text);
      }
    } catch (err) {
      console.error("Clipboard error:", err);
      window.prompt("Copy your chavruta session:", text);
    }
  }

  if (chatForm && chatWindow && chatTextarea) {
    chatForm.addEventListener("submit", handleSubmit);
  }

  if (saveButton) {
    saveButton.addEventListener("click", handleSaveClick);
  }
})();
