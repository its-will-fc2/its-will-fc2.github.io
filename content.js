// ---------------------------------------------------------------------------
// PORTFOLIO CONTENT — pulled from Will Huang's resume.
// Edit this file to update copy without touching game logic.
// ---------------------------------------------------------------------------
const PORTFOLIO_CONTENT = {
  about: {
    title: "About Me",
    html: `
      <p><span class="entry-title">Will Huang</span> — Cambridge, ON</p>
      <p>Computer Science student specializing in <b>cybersecurity</b>, currently pursuing a
      BSc in Computer Science at <b>Wilfrid Laurier University</b> (expected Aug 2027).
      Previously completed a BSc in Mathematics with a Minor in Computer Science &amp; Statistics
      at the <b>University of Toronto Mississauga</b> (2020–2023).</p>
      <p>Focused on network security, threat detection, and building hands-on security tools —
      from AI-assisted SOC log analysis to CTF exploitation. Comfortable across Python, C/C++,
      Docker, and Linux, with growing experience applying LLMs to security automation.</p>
    `
  },
  education: {
    title: "Education",
    html: `
      <ul>
        <li><span class="entry-title">Wilfrid Laurier University</span> — Waterloo, ON<br>
        BSc in Computer Science <span class="entry-date">(Expected Aug 2027)</span></li>
        <li><span class="entry-title">University of Toronto Mississauga</span> — Mississauga, ON<br>
        BSc in Mathematics, Minor in Computer Science &amp; Statistics
        <span class="entry-date">(Sept 2020 – Apr 2023)</span></li>
      </ul>
    `
  },
  skills: {
    title: "Skills",
    html: `
      <p><span class="entry-title">Languages:</span> Python, C, C++, Java, JavaScript, HTML, CSS, Swift, R, SQL</p>
      <p><span class="entry-title">Frameworks:</span> PyTorch, TensorFlow, Pandas, Node.js, Express.js, React, Bootstrap</p>
      <p><span class="entry-title">Tools:</span> Git, Docker, MongoDB, Linux/Unix, LLM APIs, Microsoft Office</p>
    `
  },
  experience: {
    title: "Experience",
    html: `
      <ul>
        <li><span class="entry-title">Michael Hill Fine Jeweller</span> — Sales Professional &amp; Key Holder
        <span class="entry-date">(May 2023 – Present)</span><br>
        Delivered personalized in-store and virtual consultations; exceeded weekly sales targets
        and corporate KPIs by 20%, ranking top 10% regionally; managed opening/closing, staff
        supervision, and security protocols as key holder.</li>
        <li><span class="entry-title">Pandora</span> — Sales Representative
        <span class="entry-date">(Nov 2022 – May 2023)</span><br>
        Assisted customers with luxury product selection and processed multi-method financial
        transactions securely.</li>
        <li><span class="entry-title">Osiris Vertical Farm</span> — Data Analyst
        <span class="entry-date">(Apr 2022 – Apr 2023)</span><br>
        Optimized plant health by analyzing environmental and growth data using Python, Pandas,
        and R; applied predictive modelling and regression analysis to forecast growth cycles.</li>
      </ul>
    `
  },
  projects: {
    title: "Projects",
    html: `
      <ul>
        <li><span class="entry-title">Mini-Agentic SOC Log Parser</span>
        <span class="entry-date">(May 2026)</span><br>
        Containerized Python + Docker AI threat-detection agent using the Google Gemini API to
        identify SQL injection and brute-force SSH attacks from live logs in real time. Built a
        structured JSON threat-classification pipeline to parse attacker IPs and trigger
        simulated iptables blocking rules with zero manual input.</li>
        <li><span class="entry-title">Keylogger</span>
        <span class="entry-date">(Dec 2025)</span><br>
        Cross-platform Python application using pynput to capture keyboard input and serialize it
        to JSON. Implemented multi-threaded data handling via threading.Timer to periodically POST
        collected data to a remote server.</li>
        <li><span class="entry-title">Capture The Flag</span>
        <span class="entry-date">(Mar 2024)</span><br>
        Secured exploit flags via reverse engineering, active penetration testing, and ethical
        hacking workflows; diagnosed packet data and system anomalies to isolate attack signatures
        using hands-on log analysis tools.</li>
      </ul>
    `
  },
  certifications: {
    title: "Certifications",
    html: `
      <ul>
        <li>Microsoft — Intro to Microsoft Defender XDR Threat Protection</li>
        <li>Google Cybersecurity Professional Certificate — Network Security, Security Risks &amp; Foundations</li>
        <li>Deep Learning &amp; AI — Build Deep Learning Models with TensorFlow Skill Path, Artificial Intelligence A-Z</li>
        <li>Cybersecurity &amp; Ethical Hacking — The Complete Cyber Security Course, Learn Ethical Hacking</li>
        <li>Software Development — The Complete SQL Bootcamp, Beginning C++, Learn React, Intro to Swift</li>
      </ul>
    `
  },
  contact: {
    title: "Contact",
    html: `
      <p>Let's connect:</p>
      <ul>
        <li>Email: osha09@pm.me</li>
        <li>Phone: 647-700-8630</li>
        <li>LinkedIn: (link on résumé)</li>
        <li>Location: Cambridge, ON</li>
      </ul>
    `
  }
};
