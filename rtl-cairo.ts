import { syscalls } from "./deps.ts";
export async function enableRTL() {
  const style = `
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600&display=swap');
    .cm-content, textarea, input, [contenteditable="true"] {
      direction: rtl !important;
      text-align: right !important;
      font-family: 'Cairo', sans-serif !important;
    }
  `;
  
  const styleTag = document.createElement("style");
  styleTag.innerHTML = style;
  document.head.appendChild(styleTag);

  await editor.flashNotification("تم تفعيل الكتابة من اليمين إلى اليسار بخط Cairo");
}
