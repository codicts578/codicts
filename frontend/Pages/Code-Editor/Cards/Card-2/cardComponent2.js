(function () {
    const $ = (id) => document.getElementById(id);

    const cardBg = $('cardBg');
    const borderClr = $('borderClr');
    const textClr = $('textClr');
    const animSpeed = $('animSpeed');
    const cardHeight = $('cardHeight');
    const text1 = $('text1');
    const text2 = $('text2');
    const text3 = $('text3');

    const expandCard = $('expandCard');
    const codeEditor = $('codeEditor');
    const copyBtn = $('copyFinalCodeBtn');
    const exportCodeBtn = $('exportCodeBtn');
    const syncStatus = $('syncStatus');

    let currentPlatform = 'web';
    let debounceTimer;

    function showToastMessage(msg, isError = false) {
        const existingToast = document.querySelector('.toast-msg');
        if(existingToast) existingToast.remove();
        const toast = document.createElement('div');
        toast.className = 'toast-msg';
        toast.style.color = isError ? '#f87171' : '#e2e8f0';
        toast.innerHTML = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    function debounce(fn, delay = 100) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(fn, delay);
    }

    function escapeHtml(str) { 
        return str ? str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]) : ''; 
    }
    function escapeXml(str) { 
        return str ? str.replace(/[<>&]/g, m => ({'<':'&lt;','>':'&gt;','&':'&amp;'})[m]) : ''; 
    }

    function getDesign() {
        return {
            cardBg: cardBg?.value || '#212121',
            borderClr: borderClr?.value || '#ff5a91',
            textClr: textClr?.value || '#ff568e',
            animSpeed: animSpeed?.value || '0.4',
            cardHeight: cardHeight?.value || '300',
            text1: text1?.value || 'HOVER ME',
            text2: text2?.value || 'HOVER ME',
            text3: text3?.value || 'HOVER ME'
        };
    }

    function applyCardDesign() {
        const items = document.querySelectorAll('.expand-card__item');
        const spans = [document.getElementById('span1'), document.getElementById('span2'), document.getElementById('span3')];
        const d = getDesign();

        if (expandCard) {
            expandCard.style.backgroundColor = d.cardBg;
            expandCard.style.height = d.cardHeight + 'px';
        }

        items.forEach(item => {
            item.style.backgroundColor = d.cardBg;
            item.style.borderColor = d.borderClr;
            item.style.transition = `all ${d.animSpeed}s cubic-bezier(0.4,0,0.2,1)`;
        });

        spans.forEach((span, i) => {
            if (span) {
                span.style.color = d.textClr;
                span.style.transition = `all ${d.animSpeed}s cubic-bezier(0.4,0,0.2,1)`;
            }
        });

        if (spans[0]) spans[0].textContent = d.text1;
        if (spans[1]) spans[1].textContent = d.text2;
        if (spans[2]) spans[2].textContent = d.text3;

        updateCodeForPlatform();
        if (syncStatus) {
            syncStatus.textContent = '✓ design updated';
            setTimeout(() => { if(syncStatus) syncStatus.textContent = '✓ ready to copy'; }, 1500);
        }
    }

    // ========== PLATFORM CODE GENERATORS ==========
    function generateWebCode() {
        const d = getDesign();
        return `<!-- Expand Card Component - Web -->
<style>
.expand-card {
display: flex;
gap: 5px;
padding: .4em;
max-width: 350px;
height: ${d.cardHeight}px;
background: ${d.cardBg};
}
.expand-card__item {
flex: 1;
border: 1px solid ${d.borderClr};
display: flex;
justify-content: center;
align-items: center;
transition: all ${d.animSpeed}s cubic-bezier(0.4, 0, 0.2, 1);
background: ${d.cardBg};
}
.expand-card__item:hover { flex: 4; }
.expand-card__item span {
transform: rotate(-90deg);
color: ${d.textClr};
transition: all ${d.animSpeed}s cubic-bezier(0.4, 0, 0.2, 1);
min-width: 14em;
padding: .5em;
text-align: center;
text-transform: uppercase;
letter-spacing: .1em;
font-weight: 600;
font-size: 0.85rem;
}
.expand-card__item:hover span { transform: rotate(0); }
</style>

<div class="expand-card">
<div class="expand-card__item"><span>${escapeHtml(d.text1)}</span></div>
<div class="expand-card__item"><span>${escapeHtml(d.text2)}</span></div>
<div class="expand-card__item"><span>${escapeHtml(d.text3)}</span></div>
</div>`;
    }

    function generateReactCode() {
        const d = getDesign();
        return `// ExpandCard.tsx - React Component
import React, { useState } from 'react';
import './ExpandCard.css';

interface ExpandCardProps {
texts?: string[];
cardBg?: string;
borderColor?: string;
textColor?: string;
animSpeed?: number;
cardHeight?: number;
}

const ExpandCard: React.FC<ExpandCardProps> = ({
texts = ["${escapeHtml(d.text1)}", "${escapeHtml(d.text2)}", "${escapeHtml(d.text3)}"],
cardBg = "${d.cardBg}",
borderColor = "${d.borderClr}",
textColor = "${d.textClr}",
animSpeed = ${parseFloat(d.animSpeed)},
cardHeight = ${parseInt(d.cardHeight)},
}) => {
const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

return (
<div className="expand-card" style={{ height: cardHeight, background: cardBg }}>
{texts.map((text, idx) => (
<div
    key={idx}
    className={\`expand-card__item \${hoveredIndex === idx ? 'expanded' : ''}\`}
    style={{
    borderColor: borderColor,
    background: cardBg,
    transition: \`all \${animSpeed}s cubic-bezier(0.4,0,0.2,1)\`,
    flex: hoveredIndex === idx ? 4 : 1,
    }}
    onMouseEnter={() => setHoveredIndex(idx)}
    onMouseLeave={() => setHoveredIndex(null)}
>
    <span style={{
    color: textColor,
    transition: \`all \${animSpeed}s cubic-bezier(0.4,0,0.2,1)\`,
    transform: hoveredIndex === idx ? 'rotate(0)' : 'rotate(-90deg)',
    }}>{text}</span>
</div>
))}
</div>
);
};
export default ExpandCard;

/* ExpandCard.css */
.expand-card {
display: flex;
gap: 5px;
padding: .4em;
max-width: 350px;
}
.expand-card__item {
flex: 1;
overflow: hidden;
cursor: pointer;
border-radius: 2px;
border-width: 1px;
border-style: solid;
display: flex;
justify-content: center;
align-items: center;
}
.expand-card__item span {
min-width: 14em;
padding: .5em;
text-align: center;
text-transform: uppercase;
letter-spacing: .1em;
font-weight: 600;
font-size: 0.85rem;
}`;
    }

    function generateAndroidCode() {
        const d = getDesign();
        return `<!-- Android XML Layout - Expand Card Style -->
<!-- res/drawable/expand_card_item_bg.xml -->
<shape xmlns:android="http://schemas.android.com/apk/res/android">
<solid android:color="${d.cardBg}"/>
<stroke android:width="1dp" android:color="${d.borderClr}"/>
<corners android:radius="2dp"/>
</shape>

<!-- res/layout/activity_main.xml -->
<LinearLayout
android:layout_width="match_parent"
android:layout_height="${parseInt(d.cardHeight)}dp"
android:orientation="horizontal"
android:gravity="center"
android:background="${d.cardBg}"
android:padding="4dp"
android:weightSum="3">

<TextView
android:id="@+id/item1"
android:layout_width="0dp"
android:layout_height="match_parent"
android:layout_weight="1"
android:text="${escapeXml(d.text1)}"
android:textColor="${d.textClr}"
android:gravity="center"
android:rotation="-90"
android:background="@drawable/expand_card_item_bg"
android:textSize="14sp"
android:textStyle="bold"
android:textAllCaps="true"
android:letterSpacing="0.1" />

<TextView
android:id="@+id/item2"
android:layout_width="0dp"
android:layout_height="match_parent"
android:layout_weight="1"
android:text="${escapeXml(d.text2)}"
android:textColor="${d.textClr}"
android:gravity="center"
android:rotation="-90"
android:background="@drawable/expand_card_item_bg"
android:textSize="14sp"
android:textStyle="bold"
android:textAllCaps="true" />

<TextView
android:id="@+id/item3"
android:layout_width="0dp"
android:layout_height="match_parent"
android:layout_weight="1"
android:text="${escapeXml(d.text3)}"
android:textColor="${d.textClr}"
android:gravity="center"
android:rotation="-90"
android:background="@drawable/expand_card_item_bg"
android:textSize="14sp"
android:textStyle="bold"
android:textAllCaps="true" />
</LinearLayout>

<!-- For hover/expand animation, use ObjectAnimator or ViewPropertyAnimator on touch/click -->`;
    }

    function generateTkinterCode() {
        const d = getDesign();
        return `# Python Tkinter - Expand Card Style
import tkinter as tk

root = tk.Tk()
root.title("Expand Card")
root.configure(bg='#0b1120')

class ExpandCard(tk.Frame):
def __init__(self, parent, texts, card_bg, border_color, text_color, anim_speed, card_height):
super().__init__(parent, bg=card_bg, height=card_height, width=350)
self.texts = texts
self.card_bg = card_bg
self.border_color = border_color
self.text_color = text_color
self.anim_speed = anim_speed
self.hovered = [False, False, False]
self.items = []

for i, txt in enumerate(texts):
    item = tk.Label(
        self, text=txt, bg=card_bg, fg=text_color,
        font=("Inter", 12, "bold"), justify="center"
    )
    item.config(
        highlightbackground=border_color,
        highlightcolor=border_color,
        highlightthickness=1,
        relief="solid",
        wraplength=100
    )
    item.bind("<Enter>", lambda e, idx=i: self.on_hover(idx, True))
    item.bind("<Leave>", lambda e, idx=i: self.on_hover(idx, False))
    item.pack(side="left", fill="both", expand=True, padx=2, pady=2)
    self.items.append(item)

def on_hover(self, idx, enter):
for i, item in enumerate(self.items):
    weight = 4 if (enter and i == idx) else 1
    item.pack_configure(expand=True if weight == 4 else False)

card = ExpandCard(
root,
texts=["${escapeXml(d.text1)}", "${escapeXml(d.text2)}", "${escapeXml(d.text3)}"],
card_bg="${d.cardBg}",
border_color="${d.borderClr}",
text_color="${d.textClr}",
anim_speed=${parseFloat(d.animSpeed)},
card_height=${parseInt(d.cardHeight)}
)
card.pack(pady=50, padx=50)
root.geometry("500x500")
root.mainloop()`;
    }

    function updateCodeForPlatform() {
        if (!codeEditor) return;
        let code = '';
        if (currentPlatform === 'web') code = generateWebCode();
        else if (currentPlatform === 'react') code = generateReactCode();
        else if (currentPlatform === 'android') code = generateAndroidCode();
        else if (currentPlatform === 'tkinter') code = generateTkinterCode();
        codeEditor.value = code;
    }

    async function copyCode() {
        try {
            await navigator.clipboard.writeText(codeEditor.value);
            copyBtn.innerText = '✓ Copied!';
            showToastMessage('Code copied to clipboard');
            if (syncStatus) syncStatus.textContent = '✓ copied';
            setTimeout(() => {
                copyBtn.innerText = 'Copy Code';
                if (syncStatus) syncStatus.textContent = '✓ ready to copy';
            }, 1500);
        } catch (err) {
            showToastMessage('Copy failed', true);
        }
    }

    function exportCodeFile() {
        const code = codeEditor.value;
        let ext = 'txt';
        if (currentPlatform === 'web') ext = 'html';
        else if (currentPlatform === 'react') ext = 'tsx';
        else if (currentPlatform === 'android') ext = 'xml';
        else if (currentPlatform === 'tkinter') ext = 'py';
        const blob = new Blob([code], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `expand_card.${ext}`;
        a.click();
        URL.revokeObjectURL(a.href);
        showToastMessage(`📁 ${ext.toUpperCase()} file exported`);
        if (syncStatus) syncStatus.textContent = '✓ exported';
        setTimeout(() => { if(syncStatus) syncStatus.textContent = '✓ ready to copy'; }, 1500);
    }

    // Event listeners
    const inputs = [cardBg, borderClr, textClr, animSpeed, cardHeight, text1, text2, text3];
    inputs.forEach(el => {
        el?.addEventListener('input', () => debounce(applyCardDesign));
    });

    copyBtn?.addEventListener('click', copyCode);
    exportCodeBtn?.addEventListener('click', exportCodeFile);

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPlatform = btn.getAttribute('data-platform');
            updateCodeForPlatform();
        });
    });

    // Initialize
    applyCardDesign();
})();