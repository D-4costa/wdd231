export function formatTime(t){ return t; }
export function formatServings(s){ return s; }
export function formatList(arr){ return arr.map(i=>`<li>${escapeHtml(i)}</li>`).join(''); }

function escapeHtml(s){
  return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}
export { escapeHtml };
