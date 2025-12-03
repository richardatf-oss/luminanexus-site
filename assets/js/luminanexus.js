// luminanexus/assets/js/luminanexus.js
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

  // Keep a simple conversation history in memory (optional)
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

  if (chatForm && chatWindow && chatTextarea) {
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = chatTextarea.value.trim();
      if (!text) return;

      // Show user message in UI
      appendMessage("user", text);
      convo.push({ role: "user", content: text });

      // Clear input
      chatTextarea.value = "";
      chatTextarea.focus();

      // Call Netlify function
      setLoading(true);

      try {
        const response = await fetch("/.netlify/functions/chavruta-gpt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
            conversation: convo,
            source: "luminanexus-chavruta-page",
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        // Adjust this line if your function uses a different field name
        const replyText =
          data.reply ||
          data.message ||
          "I received your question, but something went wrong parsing the reply.";

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
    });
  }
})();
