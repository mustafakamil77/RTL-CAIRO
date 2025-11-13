import { editor } from "@silverbulletmd/silverbullet/syscalls";

// جلب خط كايرو مرة واحدة فقط....
function loadCairoFont() {
  if (!document.getElementById("cairo-font-link")) {
    const link = document.createElement("link");
    link.id = "cairo-font-link";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap";
    document.head.appendChild(link);
  }
}

const RTL_CSS_ID = "sb-rtl-support-style";

// CSS مخصص لدعم كل الحالات (RTL ذكي، خط كايرو، حجم خط مرن)
function getRtlCss(fontSize: string = "1.1em") {
  return `
.cm-editor, .sb-editor, body {
  direction: rtl !important;
  unicode-bidi: plaintext !important;
  font-family: 'Cairo', Arial, sans-serif !important;
  font-size: ${fontSize};
  letter-spacing: 0.01em;
  line-height: 1.85em;
  background: inherit;
}
.cm-content {
  direction: initial !important; /* حتى لا يتعارض مع RTL الذكي لكودميرور */
}
/* دعم تعايش العربي والإنجليزي بسطر واحد */
.cm-line, .cm-content {
  unicode-bidi: embed;
  font-family: inherit;
}

/* حوافز شكلية ومراعاة العناوين */
h1, h2, h3, h4, h5, h6 {
  direction: rtl !important;
  font-family: 'Cairo', Arial, sans-serif !important;
}

/* حل مؤقت لعرض أرقام LTR داخل نص عربي */
.num-en {
  direction: ltr !important;
  unicode-bidi: embed;
}

`;
}

// إضافة الأنماط
function enableRtl(fontSize: string) {
  loadCairoFont();
  let styleEl = document.getElementById(RTL_CSS_ID) as HTMLStyleElement;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = RTL_CSS_ID;
    document.head.appendChild(styleEl);
  }
  styleEl.innerHTML = getRtlCss(fontSize);
}

// إزالة الأنماط
function disableRtl() {
  document.getElementById(RTL_CSS_ID)?.remove();
}

export async function enableRTLCommand() {
  enableRtl("1.18em");
  await editor.flashNotification("تم تفعيل دعم الكتابة من اليمين لليسار مع خط كايرو ودمج عربي-إنجليزي.");
}

export async function disableRTLCommand() {
  disableRtl();
  await editor.flashNotification("تم تعطيل دعم RTL وخط كايرو.");
}

// أمر لضبط حجم الخط ديناميكيًا
export async function setFontSizeCommand() {
  const result = await editor.prompt("الرجاء إدخال حجم الخط مثال (1em أو 18px أو 120%)", "1.18em");
  if (result) {
    enableRtl(result);
    await editor.flashNotification(`تم ضبط حجم الخط إلى ${result}`);
  }
}

// كشف حالة التفعيل
export async function isRtlEnabledCommand() {
  const enabled = !!document.getElementById(RTL_CSS_ID);
  await editor.flashNotification(`وضع RTL حالياً: ${enabled ? "مُفعّل" : "غير مفعل"}`);
}

export const commands = [
  {
    name: "RTL: تفعيل الوضع العربي بخط كايرو",
    callback: enableRTLCommand,
  },
  {
    name: "RTL: تعطيل الكتابة من اليمين لليسار",
    callback: disableRTLCommand,
  },
  {
    name: "RTL: ضبط حجم الخط",
    callback: setFontSizeCommand,
  },
  {
    name: "RTL: معرفة حالة التفعيل",
    callback: isRtlEnabledCommand,
  },
];