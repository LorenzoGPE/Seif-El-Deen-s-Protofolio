// settings
// ======= Elements =======
// ======= Helpers =======
function darken(hex, amount) {
  if (!hex || hex[0] !== '#') return hex || '#000000';
  let c = hex.substring(1);
  let num = parseInt(c, 16);

  let r = (num >> 16) - amount;
  let g = ((num >> 8) & 0xFF) - amount;
  let b = (num & 0xFF) - amount;

  r = Math.max(0, r);
  g = Math.max(0, g);
  b = Math.max(0, b);

  return "#" + (r << 16 | g << 8 | b)
    .toString(16)
    .padStart(6, "0");
}

function language_change(lang) {
  // تكمّل هنا لو عايز تغيّر نصوص أو direction للصفحة
  console.log("language_change:", lang);
}

// ======= Main (run after DOM ready) =======
window.addEventListener('DOMContentLoaded', () => {
  // ===== get elements AFTER DOM is ready =====
  const color_picker = document.getElementById("color");
  const theme_radios = document.querySelectorAll("input[name=theme]");
  const language_radios = document.querySelectorAll("input[name=language]");

  // safety: لو عنصر مش موجود، ما نعملش errors
  // ======= Theme Selector =======
  if (theme_radios && theme_radios.length > 0) {
    theme_radios.forEach(radio => {
      radio.addEventListener("change", () => {
        if (radio.checked) {
          // save theme
          localStorage.setItem("theme", radio.value);

          // apply theme
          if (radio.value === "light") {
            document.documentElement.style.setProperty("--mode", "#ffffff");
            document.documentElement.style.setProperty("--text", "#000000");
          } else {
            document.documentElement.style.setProperty("--mode", "#000000");
            document.documentElement.style.setProperty("--text", "#ffffff");
          }
        }
      });
    });
  }

  // ======= Color Picker =======
  if (color_picker) {
    // apply immediately if user picks (use 'input' for live preview)
    color_picker.addEventListener("input", () => {
      const c1 = color_picker.value;
      const c2 = darken(c1, 30);

      localStorage.setItem("color", c1);
      localStorage.setItem("color2", c2);

      document.documentElement.style.setProperty("--color", c1);
      document.documentElement.style.setProperty("--color2", c2);
    });
  }

  // ======= Language Selector =======
  if (language_radios && language_radios.length > 0) {
    language_radios.forEach(radio => {
      radio.addEventListener("change", () => {
        if (radio.checked) {
          localStorage.setItem("language", radio.value);
          language_change(radio.value);
        }
      });
    });
  }

  // ======= Restore settings on load (apply to page) =======
  apply_settings();

  // ensure UI controls reflect saved values
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    const el = document.getElementById(savedTheme);
    if (el && el.type === 'radio') el.checked = true;
  }

  const savedColor = localStorage.getItem("color");
  if (savedColor && color_picker) {
    color_picker.value = savedColor;
  }

  const savedLang = localStorage.getItem("language");
  if (savedLang) {
    const elL = document.getElementById(savedLang);
    if (elL && elL.type === 'radio') elL.checked = true;
    language_change(savedLang);
  }
}); // DOMContentLoaded

// ======= apply_settings function (available globally) =======
function apply_settings() {
  // === Theme ===
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    if (savedTheme === "light") {
      document.documentElement.style.setProperty("--mode", "#ffffff");
      document.documentElement.style.setProperty("--text", "#000000");
    } else {
      document.documentElement.style.setProperty("--mode", "#000000");
      document.documentElement.style.setProperty("--text", "#ffffff");
    }
  }

  // === Colors ===
  const savedColor = localStorage.getItem("color");
  const savedColor2 = localStorage.getItem("color2");

  if (savedColor) {
    document.documentElement.style.setProperty("--color", savedColor);
  }
  if (savedColor2) {
    document.documentElement.style.setProperty("--color2", savedColor2);
  }

  // === Language ===
  const savedLang = localStorage.getItem("language");
  if (savedLang) {
    language_change(savedLang);
  }
}

function reset_settings() {
  // === Default values ===
  const defaultColor = "#6a00ff";
  const defaultColor2 = "#3a0073";
  const defaultTheme = "dark";
  const defaultText = "#ffffff";
  const defaultMode = "#000000";
  const defaultLang = "English";
  document.getElementById("dark").checked = true
  document.getElementById("English").checked = true
  document.getElementById("color").value = "#6a00ff";

  // === Update localStorage ===
  localStorage.setItem("color", defaultColor);
  localStorage.setItem("color2", defaultColor2);
  localStorage.setItem("theme", defaultTheme);
  localStorage.setItem("text", defaultText);
  localStorage.setItem("mode", defaultMode);
  localStorage.setItem("language", defaultLang);

  // === Update CSS variables ===
  document.documentElement.style.setProperty("--color", defaultColor);
  document.documentElement.style.setProperty("--color2", defaultColor2);
  document.documentElement.style.setProperty("--mode", defaultMode);
  document.documentElement.style.setProperty("--text", defaultText);

  // === Update Color Picker ===
  color_picker.value = defaultColor;

  // === Update Theme Radios ===
  theme_radios.forEach(radio => {
    radio.checked = radio.value === defaultTheme;
  });

  // === Update Language Radios ===
  language_radios.forEach(radio => {
    radio.checked = radio.value === defaultLang;
  });
  language_change(defaultLang);
}

