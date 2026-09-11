// ---------------------------------------------------------------------------
// Interactive Terminal Portfolio — vanilla JS, no build step, no dependencies.
// Type commands into the input field. See COMMANDS below for the full list.
// ---------------------------------------------------------------------------

const output = document.getElementById("output");
const input = document.getElementById("cmd-input");

const ASCII_BANNER = [
"  _    _ _____ _      _         _   _ _    _          _   _  _____ ",
" | |  | |_   _| |    | |       | | | | |  | |        | | | |/ ____|",
" | |  | | | | | |    | |       | |_| | |  | | ___ __ _| |_| | |  __ ",
" | |  | | | | | |    | |       |  _  | |  | |/ __/ _` | __| | | |_ |",
" | |__| |_| |_| |____| |____   | | | | |__| | (_| (_| | |_| | |__| |",
"  \\____/|_____|______|______|  |_| |_|\\____/ \\___\\__,_|\\__|_|\\_____|",
];

const COMMAND_LIST = ["about","education","skills","experience","projects","certifications","contact","help","clear","whoami","sudo hire will"];

function printLine(text, cls) {
  const div = document.createElement("div");
  div.className = "line" + (cls ? " " + cls : "");
  div.textContent = text;
  output.appendChild(div);
}

function printBlock(lines, cls) {
  lines.forEach(l => printLine(l, cls));
}

function printHTMLLine(html, cls) {
  const div = document.createElement("div");
  div.className = "line" + (cls ? " " + cls : "");
  div.innerHTML = html;
  output.appendChild(div);
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
    setTimeout(next, 18);
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
  const cmd = raw.trim().toLowerCase();
  printLine("will@portfolio:~$ " + raw, "cmd-echo");

  if (cmd === "") { scrollToBottom(); return; }

  if (cmd === "clear") {
    output.innerHTML = "";
    return;
  }

  if (cmd === "help") {
    printHelp();
    return;
  }

  if (cmd === "whoami") {
    printLine("will  -  cybersecurity student  -  Cambridge, ON");
    scrollToBottom();
    return;
  }

  if (cmd === "sudo hire will") {
    printLine("[sudo] password for recruiter: ", "dim");
    typeBlock([
      "Access granted.",
      "Will Huang has been added to the shortlist.",
      "Reach out: osha09@pm.me | 647-700-8630",
      ""
    ], "section-title");
    return;
  }

  if (PORTFOLIO_CONTENT[cmd]) {
    typeBlock(PORTFOLIO_CONTENT[cmd], null, () => { printLine(""); scrollToBottom(); });
    return;
  }

  printLine(`command not found: ${raw}`, "error");
  printLine("type 'help' for a list of available commands.", "dim");
  scrollToBottom();
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const val = input.value;
    input.value = "";
    handleCommand(val);
  }
});

document.addEventListener("click", () => input.focus());

printBanner();
