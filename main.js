// ---------------------------------------------------------------------------
// Interactive Terminal Portfolio — vanilla JS, no build step, no dependencies.
// ---------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
  const output = document.getElementById("output");
  const input = document.getElementById("cmd-input");

  if (!output || !input) {
    console.error("Terminal init failed: #output or #cmd-input not found in DOM.");
    return;
  }

  // Clean block-letter ASCII banner spelling "WILL HUANG" — built from a
  // fixed 5-row glyph table so every letter is guaranteed legible (no
  // hand-drawn font drift like the previous version had).
  const ASCII_BANNER = [
    "#   # ##### #     #        #   # #   #  ###  #   #  #### ",
    "#   #   #   #     #        #   # #   # #   # ##  # #     ",
    "# # #   #   #     #        ##### #   # ##### # # # # ### ",
    "## ##   #   #     #        #   # #   # #   # #  ## #   # ",
    "#   # ##### ##### #####    #   # ##### #   # #   #  #### "
  ];

  const ALIASES = {
    "about me": "about",
    "aboutme": "about",
    "aboutus": "about",
    "who are you": "about",
    "edu": "education",
    "school": "education",
    "cert": "certifications",
    "certs": "certifications",
    "work": "experience",
    "job": "experience",
    "jobs": "experience",
    "project": "projects",
    "contacts": "contact",
    "contact me": "contact",
    "email": "contact",
    "cls": "clear"
  };

  function printLine(text, cls) {
    const div = document.createElement("div");
    div.className = "line" + (cls ? " " + cls : "");
    div.textContent = text;
    output.appendChild(div);
  }

  function printBlock(lines, cls) {
    lines.forEach(function (l) { printLine(l, cls); });
  }

  function scrollToBottom() {
    output.scrollTop = output.scrollHeight;
  }

  function typeBlock(lines, cls, done) {
    let i = 0;
    function next() {
      if (i >= lines.length) { if (done) done(); return; }
      printLine(lines[i], cls);
      scrollToBottom();
      i++;
      setTimeout(next, 16);
    }
    next();
  }

  function printBanner() {
    printBlock(ASCII_BANNER, "dim");
    printLine("");
    printLine("Welcome to Will Huang's interactive terminal portfolio.", "prompt-line");
    printLine("Type 'help' to see available commands, or 'about' to get started.", "dim");
    printLine("");
    scrollToBottom();
  }

  function printHelp() {
    printLine("----------------------------------------", "dim");
    printLine("  AVAILABLE COMMANDS", "section-title");
    printLine("----------------------------------------", "dim");
    printLine("about            - who I am");
    printLine("education        - degrees & schools");
    printLine("skills           - languages, frameworks, tools");
    printLine("experience       - work history");
    printLine("projects         - security & dev projects");
    printLine("certifications   - certs & courses completed");
    printLine("contact          - how to reach me");
    printLine("whoami           - quick identity check");
    printLine("clear            - clear the screen");
    printLine("help             - show this list again");
    printLine("");
    printLine("tip: try 'skills --verbose', 'project 1/2/3', or 'sudo hire will'", "dim");
    scrollToBottom();
  }

  function handleCommand(raw) {
    const trimmed = raw.trim();
    printLine("will@portfolio:~$ " + raw, "cmd-echo");

    if (trimmed === "") { scrollToBottom(); return; }

    let cmd = trimmed.toLowerCase();
    if (ALIASES[cmd]) cmd = ALIASES[cmd];

    if (cmd === "clear" || cmd === "cls") {
      output.innerHTML = "";
      return;
    }

    if (cmd === "help") { printHelp(); return; }

    if (cmd === "whoami") {
      printLine("will  -  cybersecurity student  -  Cambridge, ON");
      scrollToBottom();
      return;
    }

    if (cmd === "sudo hire will") {
      printLine("[sudo] password for recruiter:", "dim");
      typeBlock([
        "Access granted.",
        "Will Huang has been added to the shortlist.",
        "Reach out: osha09@pm.me | 647-700-8630",
        ""
      ], "section-title");
      return;
    }

    if (typeof PORTFOLIO_CONTENT === "undefined") {
      printLine("error: content.js failed to load. Check script order in index.html.", "error");
      scrollToBottom();
      return;
    }

    if (PORTFOLIO_CONTENT[cmd]) {
      typeBlock(PORTFOLIO_CONTENT[cmd], null, function () { printLine(""); scrollToBottom(); });
      return;
    }

    printLine("command not found: " + raw, "error");
    printLine("type 'help' for a list of available commands.", "dim");
    scrollToBottom();
  }

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault();
      const val = input.value;
      input.value = "";
      handleCommand(val);
    }
  });

  const terminalWrap = document.getElementById("terminal-wrap") || document.body;
  terminalWrap.addEventListener("click", function () { input.focus(); });
  window.addEventListener("load", function () { input.focus(); });
  input.focus();

  printBanner();
});
