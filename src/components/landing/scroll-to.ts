// In-page navigation for the landing: scroll to a section top minus the 60px
// fixed-header offset. `smooth` should be the resolved motion switch — reduced
// motion (or a paused scene) jumps instantly.
export function scrollToId(id: string, smooth: boolean) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 60;
  window.scrollTo({ top: Math.max(0, y), behavior: smooth ? "smooth" : "auto" });
}

export function scrollToTop(smooth: boolean) {
  window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
}
