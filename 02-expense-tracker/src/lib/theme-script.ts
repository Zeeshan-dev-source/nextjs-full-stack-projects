// Runs before hydration so the correct theme is applied on first paint
// (no light-mode flash for dark-mode users). Mirrors the logic in
// preferences.ts.
export const themeInitScript = `(function () {
  try {
    var stored = localStorage.getItem("theme");
    var dark =
      stored === "dark" ||
      (stored !== "light" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    var root = document.documentElement;
    root.classList.toggle("dark", dark);
    root.style.colorScheme = dark ? "dark" : "light";
  } catch (e) {}
})();`;
