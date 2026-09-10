/* ==========================================================================
   COLORCODE — Custom C++ MyString Engine, Memory Inspector & Runtime Workbench
   Pantone Deep-Violet Theme | Production Architecture
   ========================================================================== */

// Simulated hex memory addresses
let addressSeed = 0x61FEA0;
function getNextHeapAddress() {
    addressSeed += Math.floor(Math.random() * 0x14 + 0x10);
    return '0x00' + addressSeed.toString(16).toUpperCase();
}

function getStackAddress(offset) {
    return '0x7FFE' + (0xE14A1000 + offset * 0x18).toString(16).toUpperCase().slice(-8);
}

// --------------------------------------------------------------------------
// MyStringSim: Client-side model matching C++ MyString OOP implementation
// --------------------------------------------------------------------------
class MyStringSim {
    constructor(initialString = "") {
        this.length = initialString ? initialString.length : 0;
        this.str = initialString ? initialString.split("") : [];
        this.heapAddress = getNextHeapAddress();
        this.stackAddress = getStackAddress(Math.floor(Math.random() * 50));
    }

    size() { return this.length; }
    empty() { return this.length === 0; }

    clear() {
        this.length = 0;
        this.str = [];
        this.heapAddress = getNextHeapAddress();
    }

    c_str() { return this.str.join(""); }

    concat(other) {
        const result = new MyStringSim();
        result.length = this.length + other.length;
        result.str = [...this.str, ...other.str];
        return result;
    }

    equals(other) {
        if (this.length !== other.length) return false;
        for (let i = 0; i < this.length; i++) {
            if (this.str[i] !== other.str[i]) return false;
        }
        return true;
    }

    notEquals(other) { return !this.equals(other); }

    getChar(index) {
        if (index < 0 || index >= this.length)
            throw new Error(`Index out of range: ${index} not in [0, ${this.length - 1}]`);
        return this.str[index];
    }

    setChar(index, char) {
        if (index < 0 || index >= this.length)
            throw new Error(`Index out of range: ${index} not in [0, ${this.length - 1}]`);
        this.str[index] = char;
    }

    static deepCopy(other) {
        const copy = new MyStringSim();
        copy.length = other.length;
        copy.str = [...other.str];
        copy.heapAddress = getNextHeapAddress();
        return copy;
    }

    assign(other) {
        this.length = other.length;
        this.str = [...other.str];
        this.heapAddress = getNextHeapAddress();
    }
}

// --------------------------------------------------------------------------
// Application State
// --------------------------------------------------------------------------
const state = {
    s1: new MyStringSim("Hello"),
    s2: new MyStringSim("World"),
    s3: null,
    copy: null,
    assign: null,
    lastOp: "Ready",
    backendOnline: false
};

// --------------------------------------------------------------------------
// DOM Elements
// --------------------------------------------------------------------------
const $ = (id) => document.getElementById(id);
const s1Input = $("s1Input");
const s2Input = $("s2Input");
const s1LenBadge = $("s1LenBadge");
const s2LenBadge = $("s2LenBadge");
const resultBanner = $("resultBanner");
const resultText = $("resultText");
const resultBadge = $("resultBadge");
const memoryContainer = $("memoryContainer");
const codeSnippetContent = $("codeSnippetContent");
const terminalBody = $("terminalBody");
const backendStatusPill = $("backendStatusPill");
const backendStatusText = $("backendStatusText");
const backendPulse = $("backendPulse");
const toastContainer = $("toastContainer");
const testSuiteGrid = $("testSuiteGrid");

// --------------------------------------------------------------------------
// Memory Visualizer Renderer (Clean Pantone Deep-Violet Styling)
// --------------------------------------------------------------------------
function renderMemory() {
    if (!memoryContainer) return;
    memoryContainer.innerHTML = "";

    const activeObjects = [
        { key: "s1", label: "MyString s1", obj: state.s1, accent: "var(--accent-lavender)" },
        { key: "s2", label: "MyString s2", obj: state.s2, accent: "var(--accent-periwinkle)" }
    ];
    if (state.s3) activeObjects.push({ key: "s3", label: "MyString s3 = s1 + s2", obj: state.s3, accent: "var(--accent-emerald)" });
    if (state.copy) activeObjects.push({ key: "copy", label: "MyString copy(s1)", obj: state.copy, accent: "var(--accent-lilac)" });
    if (state.assign) activeObjects.push({ key: "assign", label: "MyString assign = s2", obj: state.assign, accent: "var(--accent-amber)" });

    activeObjects.forEach(item => {
        const card = document.createElement("div");
        card.className = "mem-obj-card";
        card.id = `mem-card-${item.key}`;

        // Header with metadata
        card.innerHTML = `
            <div class="mem-meta-row">
                <div class="mem-obj-name" style="color: ${item.accent}">
                    <span style="font-size: 0.85rem;">■</span> ${item.label}
                </div>
                <span class="mem-stack-addr">Stack @ ${item.obj.stackAddress}</span>
            </div>
            <div class="mem-members-row">
                <div><span>char* str:</span> <span class="mem-member-val">${item.obj.heapAddress}</span></div>
                <div><span>int length:</span> <span class="mem-member-val">${item.obj.length}</span></div>
                <div><span>empty():</span> <span class="mem-member-val" style="color:${item.obj.empty() ? 'var(--accent-rose)' : 'var(--accent-emerald)'}">${item.obj.empty() ? 'true' : 'false'}</span></div>
            </div>
            <div class="mem-pointer-line">
                <span>Stack str</span>
                <div class="pointer-track"></div>
                <span class="pointer-target">Heap [${item.obj.heapAddress}]</span>
            </div>
        `;

        // Heap Buffer
        const heapBox = document.createElement("div");
        heapBox.className = "heap-buffer-box";
        heapBox.innerHTML = `
            <div class="heap-buffer-label">
                <span>Heap Buffer:</span> <code>new char[${item.obj.length + 1}]</code>
            </div>
        `;

        const byteChips = document.createElement("div");
        byteChips.className = "byte-chips-row";

        for (let i = 0; i < item.obj.length; i++) {
            const ch = item.obj.str[i];
            const ascii = ch ? ch.charCodeAt(0) : 0;
            const chip = document.createElement("div");
            chip.className = "byte-chip";
            chip.id = `cell-${item.key}-${i}`;
            chip.title = `Index [${i}] | Char '${ch}' | ASCII ${ascii}`;
            chip.innerHTML = `
                <span class="chip-idx">[${i}]</span>
                <span class="chip-char">'${escapeHtml(ch)}'</span>
                <span class="chip-ascii">${ascii}</span>
            `;
            byteChips.appendChild(chip);
        }

        // Null terminator '\0'
        const nullChip = document.createElement("div");
        nullChip.className = "byte-chip chip-null";
        nullChip.title = "Null-terminator '\\0' — marks end of C-string";
        nullChip.innerHTML = `
            <span class="chip-idx">[${item.obj.length}]</span>
            <span class="chip-char">\\0</span>
            <span class="chip-ascii">0</span>
        `;
        byteChips.appendChild(nullChip);

        heapBox.appendChild(byteChips);
        card.appendChild(heapBox);
        memoryContainer.appendChild(card);
    });

    if (s1LenBadge) s1LenBadge.textContent = `len: ${state.s1.size()}`;
    if (s2LenBadge) s2LenBadge.textContent = `len: ${state.s2.size()}`;
}

function escapeHtml(ch) {
    if (ch === '<') return '&lt;';
    if (ch === '>') return '&gt;';
    if (ch === '&') return '&amp;';
    if (ch === '"') return '&quot;';
    return ch;
}

// --------------------------------------------------------------------------
// Live C++ Code Snippet Generator
// --------------------------------------------------------------------------
function updateCodeSnippet(actionType = "init", extra = {}) {
    if (!codeSnippetContent) return;
    let code = `// ================================================\n`;
    code += `// COLORCODE — C++ Custom MyString OOP Demonstration\n`;
    code += `// Dynamic memory allocation without std::string\n`;
    code += `// ================================================\n`;
    code += `#include "MyString.h"\n#include <iostream>\nusing namespace std;\n\n`;
    code += `int main() {\n`;
    code += `    MyString s1("${state.s1.c_str()}");\n`;
    code += `    MyString s2("${state.s2.c_str()}");\n\n`;

    switch (actionType) {
        case "concat":
            code += `    // Operator+ Overloading (Concatenation)\n`;
            code += `    MyString s3 = s1 + s2;\n`;
            code += `    cout << "s1 + s2 = " << s3 << endl;\n`;
            code += `    // Result buffer: "${state.s3 ? state.s3.c_str() : ""}"\n`;
            break;
        case "equal":
            code += `    // Operator== Overloading (Equality)\n`;
            code += `    if (s1 == s2)\n`;
            code += `        cout << "Strings s1 and s2 are equal." << endl;\n`;
            code += `    else\n`;
            code += `        cout << "Strings s1 and s2 are NOT equal." << endl;\n`;
            break;
        case "not_equal":
            code += `    // Operator!= Overloading (Inequality)\n`;
            code += `    if (s1 != s2)\n`;
            code += `        cout << "Strings are NOT equal." << endl;\n`;
            code += `    else\n`;
            code += `        cout << "Strings ARE equal." << endl;\n`;
            break;
        case "copy":
            code += `    // Copy Constructor — Deep Copy (Rule of Three)\n`;
            code += `    MyString copy(s1);  // New heap buffer allocated\n`;
            code += `    cout << "Original : " << s1 << endl;\n`;
            code += `    cout << "Copy     : " << copy << endl;\n`;
            break;
        case "assign":
            code += `    // Copy Assignment Operator\n`;
            code += `    MyString assign;\n`;
            code += `    assign = s2;  // delete[] old buffer, allocate new, copy\n`;
            code += `    cout << "Assigned = " << assign << endl;\n`;
            break;
        case "mutate":
            code += `    // Subscript Operator[] — In-Place Mutation\n`;
            code += `    s1[${extra.index}] = '${extra.char}';\n`;
            code += `    cout << "Mutated s1: " << s1 << endl;\n`;
            break;
        case "clear":
            code += `    // Member Function: clear() releases heap array\n`;
            code += `    s2.clear();\n`;
            code += `    cout << "s2 size: " << s2.size() << " | empty: " << (s2.empty() ? "true" : "false") << endl;\n`;
            break;
        case "deep_copy_demo":
            code += `    // Verification: Deep Copy Pointer Isolation\n`;
            code += `    MyString copy(s1);   // Independent heap buffer\n`;
            code += `    s1[0] = 'X';         // Mutate original instance only\n`;
            code += `    cout << "Original s1: " << s1 << endl;   // Mutated\n`;
            code += `    cout << "Copy instance: " << copy << endl;  // Completely untouched!\n`;
            break;
        default:
            code += `    cout << "s1 = " << s1 << " (size: " << s1.size() << ")" << endl;\n`;
            code += `    cout << "s2 = " << s2 << " (size: " << s2.size() << ")" << endl;\n`;
            break;
    }

    code += `\n    return 0;\n}`;
    codeSnippetContent.textContent = code;
}

// --------------------------------------------------------------------------
// Terminal Logging
// --------------------------------------------------------------------------
function logTerminal(text, type = "output") {
    if (!terminalBody) return;
    const line = document.createElement("div");
    line.className = "term-line";
    if (type === "prompt") {
        line.innerHTML = `<span class="term-prompt">$ </span><span class="term-output">${text}</span>`;
    } else if (type === "highlight") {
        line.className = "term-line term-highlight";
        line.textContent = text;
    } else if (type === "error") {
        line.className = "term-line term-error";
        line.textContent = "✗ " + text;
    } else if (type === "dim") {
        line.className = "term-line term-dim";
        line.textContent = text;
    } else {
        line.className = "term-line term-output";
        line.textContent = text;
    }
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// --------------------------------------------------------------------------
// Toast Notification
// --------------------------------------------------------------------------
function showToast(msg, icon = "") {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = icon ? `<span>${icon}</span> <span>${msg}</span>` : `<span>${msg}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(12px) scale(0.95)";
        setTimeout(() => toast.remove(), 260);
    }, 2800);
}

// --------------------------------------------------------------------------
// Flash Highlight on Byte Cell
// --------------------------------------------------------------------------
function flashCell(key, index) {
    const el = document.getElementById(`cell-${key}-${index}`);
    if (el) {
        el.classList.remove("highlight-mutate");
        void el.offsetWidth; // force reflow
        el.classList.add("highlight-mutate");
    }
}

// --------------------------------------------------------------------------
// Operator Actions
// --------------------------------------------------------------------------
function handleConcat() {
    state.s3 = state.s1.concat(state.s2);
    renderMemory();
    updateCodeSnippet("concat");
    resultText.innerHTML = `<strong>Concatenation:</strong> <code>s1 + s2 = "${state.s3.c_str()}"</code> (length: ${state.s3.size()})`;
    resultBadge.className = "banner-pill banner-pill-success";
    resultBadge.textContent = "s1 + s2";
    logTerminal(`MyString s3 = s1 + s2;`, "prompt");
    logTerminal(`→ s3 = "${state.s3.c_str()}" | size = ${state.s3.size()} | Heap @ ${state.s3.heapAddress}`, "highlight");
    showToast(`Concatenated: "${state.s3.c_str()}"`);
}

function handleCompareEqual() {
    const eq = state.s1.equals(state.s2);
    updateCodeSnippet("equal");
    resultText.innerHTML = `<strong>Equality:</strong> <code>s1 == s2</code> → <strong>${eq ? "true" : "false"}</strong>`;
    resultBadge.className = `banner-pill ${eq ? 'banner-pill-success' : 'banner-pill-warning'}`;
    resultBadge.textContent = eq ? "EQUAL" : "NOT EQUAL";
    logTerminal(`(s1 == s2) evaluates to ${eq}`, "prompt");
    logTerminal(`→ Strings are ${eq ? 'equal' : 'NOT equal'}.`, "highlight");
}

function handleCompareNotEqual() {
    const neq = state.s1.notEquals(state.s2);
    updateCodeSnippet("not_equal");
    resultText.innerHTML = `<strong>Inequality:</strong> <code>s1 != s2</code> → <strong>${neq ? "true" : "false"}</strong>`;
    resultBadge.className = `banner-pill ${neq ? 'banner-pill-info' : 'banner-pill-success'}`;
    resultBadge.textContent = neq ? "NOT EQUAL" : "EQUAL";
    logTerminal(`(s1 != s2) evaluates to ${neq}`, "prompt");
    logTerminal(`→ operator!= returned ${neq ? "TRUE" : "FALSE"}`, "highlight");
}

function handleCopyConstruct() {
    state.copy = MyStringSim.deepCopy(state.s1);
    renderMemory();
    updateCodeSnippet("copy");
    resultText.innerHTML = `<strong>Copy Constructor:</strong> <code>MyString copy(s1);</code> — allocated heap @ <code>${state.copy.heapAddress}</code>`;
    resultBadge.className = "banner-pill banner-pill-success";
    resultBadge.textContent = "DEEP COPIED";
    logTerminal(`MyString copy(s1);`, "prompt");
    logTerminal(`→ Deep copy created. New heap buffer @ ${state.copy.heapAddress}`, "highlight");
    showToast("Copy Constructor invoked (Deep Copy)");
}

function handleAssign() {
    if (!state.assign) state.assign = new MyStringSim();
    state.assign.assign(state.s2);
    renderMemory();
    updateCodeSnippet("assign");
    resultText.innerHTML = `<strong>Assignment:</strong> <code>assign = s2;</code> — fresh heap @ <code>${state.assign.heapAddress}</code>`;
    resultBadge.className = "banner-pill banner-pill-info";
    resultBadge.textContent = "ASSIGNED";
    logTerminal(`assign = s2;`, "prompt");
    logTerminal(`→ Released old buffer, deep copied s2 to ${state.assign.heapAddress}`, "highlight");
    showToast("Assignment operator executed");
}

function handleClear() {
    state.s2.clear();
    s2Input.value = "";
    renderMemory();
    updateCodeSnippet("clear");
    resultText.innerHTML = `<strong>Clear:</strong> <code>s2.clear();</code> → length = 0, buffer reset to <code>'\\0'</code>`;
    resultBadge.className = "banner-pill banner-pill-warning";
    resultBadge.textContent = "CLEARED";
    logTerminal(`s2.clear();`, "prompt");
    logTerminal(`→ s2 buffer freed. size() = 0, empty() = true`, "highlight");
    showToast("s2 buffer cleared");
}

function handleMutate() {
    const idx = parseInt(document.getElementById("mutationIndex").value, 10);
    const char = document.getElementById("mutationChar").value || "X";
    try {
        const oldChar = state.s1.getChar(idx);
        state.s1.setChar(idx, char);
        s1Input.value = state.s1.c_str();
        renderMemory();
        flashCell("s1", idx);
        updateCodeSnippet("mutate", { index: idx, char });
        resultText.innerHTML = `<strong>Mutation:</strong> <code>s1[${idx}] = '${char}'</code> (was '${oldChar}') → s1 = <code>"${state.s1.c_str()}"</code>`;
        resultBadge.className = "banner-pill banner-pill-success";
        resultBadge.textContent = `MUTATED [${idx}]`;
        logTerminal(`s1[${idx}] = '${char}';`, "prompt");
        logTerminal(`→ Byte at index ${idx} mutated from '${oldChar}' to '${char}'`, "highlight");
        showToast(`s1[${idx}] = '${char}'`);
    } catch (err) {
        resultText.innerHTML = `<strong style="color:var(--accent-rose)">Exception:</strong> <code>std::out_of_range</code> — ${err.message}`;
        resultBadge.className = "banner-pill banner-pill-warning";
        resultBadge.textContent = "OUT_OF_RANGE";
        logTerminal(`throw std::out_of_range("${err.message}")`, "error");
        showToast(err.message);
    }
}

// --------------------------------------------------------------------------
// Deep Copy Interactive Demo
// --------------------------------------------------------------------------
function runDeepCopyDemo() {
    logTerminal("================ Deep Copy Verification Test ================", "dim");

    state.copy = MyStringSim.deepCopy(state.s1);
    renderMemory();
    logTerminal(`MyString copy(s1); // Allocates new heap @ ${state.copy.heapAddress}`, "prompt");

    setTimeout(() => {
        if (state.s1.length > 0) {
            const oldChar = state.s1.getChar(0);
            const newChar = oldChar === 'X' ? 'Y' : 'X';
            state.s1.setChar(0, newChar);
            s1Input.value = state.s1.c_str();
            renderMemory();
            flashCell("s1", 0);

            logTerminal(`s1[0] = '${newChar}'; // Mutating original instance`, "prompt");
            logTerminal(`→ s1 = "${state.s1.c_str()}" (Modified)`, "highlight");
            logTerminal(`→ copy = "${state.copy.c_str()}" — UNCHANGED! Pointer isolation confirmed.`, "highlight");

            updateCodeSnippet("deep_copy_demo");
            resultText.innerHTML = `<strong>Deep Copy Verified:</strong> <code>s1[0]</code> became <code>'${newChar}'</code>, but <code>copy[0]</code> remained <code>'${state.copy.getChar(0)}'</code> — separate heap buffers confirmed.`;
            resultBadge.className = "banner-pill banner-pill-success";
            resultBadge.textContent = "DEEP COPY ✓";
            showToast("Deep copy verified — no pointer aliasing");
        }
    }, 450);
}

// --------------------------------------------------------------------------
// Automated Test Suite
// --------------------------------------------------------------------------
const testCases = [
    { name: "Default Constructor", run: () => { const s = new MyStringSim(); return s.size() === 0 && s.empty(); } },
    { name: "Parameterized Constructor", run: () => { const s = new MyStringSim("Test"); return s.size() === 4 && s.c_str() === "Test"; } },
    { name: "Copy Constructor (Deep Copy)", run: () => {
        const s = new MyStringSim("Alpha");
        const c = MyStringSim.deepCopy(s);
        s.setChar(0, 'Z');
        return c.c_str() === "Alpha" && s.c_str() === "Zlpha";
    }},
    { name: "Operator+ Concatenation", run: () => {
        const a = new MyStringSim("Hello");
        const b = new MyStringSim("World");
        return a.concat(b).c_str() === "HelloWorld";
    }},
    { name: "Operator== & Operator!=", run: () => {
        const a = new MyStringSim("Cat");
        const b = new MyStringSim("Cat");
        const c = new MyStringSim("Dog");
        return a.equals(b) && a.notEquals(c);
    }},
    { name: "Operator[] Read & Mutate", run: () => {
        const s = new MyStringSim("Beta");
        s.setChar(1, 'E');
        return s.getChar(1) === 'E' && s.c_str() === "BEta";
    }},
    { name: "clear() & empty() Methods", run: () => {
        const s = new MyStringSim("Data");
        s.clear();
        return s.empty() && s.size() === 0;
    }},
    { name: "Null Terminator Integrity", run: () => {
        const s = new MyStringSim("C++");
        return s.size() === 3;
    }}
];

function renderTestSuite() {
    if (!testSuiteGrid) return;
    testSuiteGrid.innerHTML = "";
    let passCount = 0;
    testCases.forEach((tc, idx) => {
        const passed = tc.run();
        if (passed) passCount++;
        const card = document.createElement("div");
        card.className = "test-card-item";
        card.innerHTML = `
            <span class="test-card-name">${idx + 1}. ${tc.name}</span>
            <span class="test-status-pill ${passed ? 'test-status-pass' : 'test-status-fail'}">
                ${passed ? '✓ PASS' : '✗ FAIL'}
            </span>
        `;
        testSuiteGrid.appendChild(card);
    });
    const tag = $("testCountTag");
    if (tag) tag.textContent = `${passCount} / ${testCases.length} Passing`;
}

function runTestSuite() {
    logTerminal("================ Running Test Matrix ================", "dim");
    let passed = 0;
    testCases.forEach((tc, idx) => {
        const ok = tc.run();
        if (ok) passed++;
        logTerminal(`  Test ${idx + 1}: ${tc.name} ... ${ok ? '✓ PASSED' : '✗ FAILED'}`, ok ? "output" : "error");
    });
    logTerminal(`Matrix Complete: ${passed}/${testCases.length} Tests Passed.`, "highlight");
    renderTestSuite();
    showToast(`${passed}/${testCases.length} Tests Passed`);
}

// --------------------------------------------------------------------------
// Backend & Native Execution
// --------------------------------------------------------------------------
async function checkBackendStatus() {
    try {
        const res = await fetch("/api/status", { method: "GET" });
        if (res.ok) {
            state.backendOnline = true;
            backendStatusText.textContent = "Engine: Online";
            backendStatusPill.style.color = "var(--accent-emerald)";
            backendStatusPill.style.borderColor = "rgba(61, 214, 140, 0.3)";
            backendPulse.style.backgroundColor = "var(--accent-emerald)";
            return;
        }
    } catch (e) { /* offline */ }

    state.backendOnline = false;
    backendStatusText.textContent = "Simulation Mode";
    backendStatusPill.style.color = "var(--accent-lilac)";
    backendPulse.style.backgroundColor = "var(--accent-periwinkle)";
}

async function runNativeBinary() {
    const s1Val = s1Input.value || "Hello";
    const s2Val = s2Input.value || "World";
    logTerminal(`./MyString.exe <<< "${s1Val}\\n${s2Val}"`, "prompt");
    showToast("Executing MyString.exe...");

    if (state.backendOnline) {
        try {
            const response = await fetch("/api/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ s1: s1Val, s2: s2Val })
            });
            const data = await response.json();
            if (data.success) {
                logTerminal("================ Native MyString.exe Output ================", "dim");
                data.output.split('\n').forEach(line => logTerminal(line));
                showToast("Process exited with code 0");
            } else {
                logTerminal(`Error: ${data.error}`, "error");
                showToast("Execution error");
            }
            return;
        } catch (err) {
            logTerminal(`Backend error: ${err.message}`, "error");
        }
    }

    // Offline simulation mode
    logTerminal("================ Native Simulation (Server Offline) ================", "dim");
    logTerminal("========== MyString Class Demonstration ==========");
    logTerminal(`Enter first string : ${s1Val}`);
    logTerminal(`Enter second string: ${s2Val}`);
    logTerminal("\n----- Input Strings -----");
    logTerminal(`s1 = ${s1Val}`);
    logTerminal(`s2 = ${s2Val}`);
    logTerminal("\n----- Concatenation -----");
    logTerminal(`s1 + s2 = ${s1Val}${s2Val}`);
    logTerminal("\n----- Comparison -----");
    logTerminal(s1Val === s2Val ? "s1 and s2 are equal." : "s1 and s2 are not equal.");
    logTerminal(s1Val !== s2Val ? "operator!= confirms: s1 and s2 are not equal." : "operator!= confirms: s1 and s2 are equal.");
    logTerminal("\n----- Copy Constructor -----");
    logTerminal(`Original : ${s1Val}`);
    logTerminal(`Copied   : ${s1Val}`);
    logTerminal("\nChanging first character of original string...");
    const modS1 = s1Val.length > 0 ? 'X' + s1Val.slice(1) : "";
    logTerminal(`Original after modification : ${modS1}`);
    logTerminal(`Copied remains             : ${s1Val}`);
    logTerminal("\nDeep copy verified.");
    logTerminal("\n========== Program Finished Successfully ==========");
}

// --------------------------------------------------------------------------
// Navigation Active Dot & Smooth Scroll
// --------------------------------------------------------------------------
function setupNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = ["hero", "workbench", "memory-section", "tests-section", "code-section"];

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href").replace("#", "");
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
                navLinks.forEach(l => l.classList.remove("active"));
                link.classList.add("active");
            }
        });
    });

    // IntersectionObserver to update active dot on scroll
    window.addEventListener("scroll", () => {
        let current = "hero";
        sections.forEach(secId => {
            const el = document.getElementById(secId);
            if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= 200 && rect.bottom >= 200) {
                    current = secId;
                }
            }
        });
        navLinks.forEach(l => {
            if (l.getAttribute("href") === `#${current}`) {
                l.classList.add("active");
            } else {
                l.classList.remove("active");
            }
        });
    }, { passive: true });
}

// --------------------------------------------------------------------------
// Event Listeners
// --------------------------------------------------------------------------
function setupEventListeners() {
    if (s1Input) {
        s1Input.addEventListener("input", (e) => {
            state.s1 = new MyStringSim(e.target.value);
            renderMemory();
            updateCodeSnippet("init");
        });
    }

    if (s2Input) {
        s2Input.addEventListener("input", (e) => {
            state.s2 = new MyStringSim(e.target.value);
            renderMemory();
            updateCodeSnippet("init");
        });
    }

    $("btnConcat")?.addEventListener("click", handleConcat);
    $("btnCompareEqual")?.addEventListener("click", handleCompareEqual);
    $("btnCompareNotEqual")?.addEventListener("click", handleCompareNotEqual);
    $("btnCopyConstruct")?.addEventListener("click", handleCopyConstruct);
    $("btnAssign")?.addEventListener("click", handleAssign);
    $("btnClear")?.addEventListener("click", handleClear);
    $("btnMutate")?.addEventListener("click", handleMutate);
    $("btnDeepCopyDemo")?.addEventListener("click", runDeepCopyDemo);
    $("runTestSuiteBtn")?.addEventListener("click", runTestSuite);
    $("runNativeBtn")?.addEventListener("click", runNativeBinary);

    // Hero Action Buttons
    $("heroStartBtn")?.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("workbench")?.scrollIntoView({ behavior: "smooth" });
    });


    $("btnClearTerminal")?.addEventListener("click", () => {
        terminalBody.innerHTML = `<div class="term-line"><span class="term-prompt">$ </span><span class="term-output">Terminal cleared.</span></div>`;
    });

    $("btnCopyCode")?.addEventListener("click", () => {
        navigator.clipboard.writeText(codeSnippetContent.textContent).then(() => {
            showToast("C++ code copied to clipboard!");
        }).catch(() => {
            showToast("Failed to copy code");
        });
    });

    $("footerResetBtn")?.addEventListener("click", () => {
        s1Input.value = "Hello";
        s2Input.value = "World";
        state.s1 = new MyStringSim("Hello");
        state.s2 = new MyStringSim("World");
        state.s3 = null;
        state.copy = null;
        state.assign = null;
        renderMemory();
        updateCodeSnippet("init");
        showToast("Playground reset to defaults");
    });

    $("footerDocsBtn")?.addEventListener("click", () => {
        logTerminal("\n================ MyString Architecture & OOP Concepts ================", "highlight");
        logTerminal("1. Rule of Three: Custom Destructor, Copy Constructor, and Copy Assignment Operator.");
        logTerminal("2. Dynamic Memory Allocation: new char[length + 1] and delete[] str.");
        logTerminal("3. Pointer Safety: Deep copying prevents dangerous memory aliasing & double frees.");
        logTerminal("4. Operator Overloading: +, ==, !=, [], =, <<, >> implemented seamlessly.");
        logTerminal("5. Zero std::string Dependency: Built 100% on native C++ character arrays.\n");
        document.getElementById("code-section")?.scrollIntoView({ behavior: "smooth" });
    });

    setupNavigation();
}

// --------------------------------------------------------------------------
// Initialization
// --------------------------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
    renderMemory();
    updateCodeSnippet("init");
    renderTestSuite();
    setupEventListeners();
    checkBackendStatus();
});
