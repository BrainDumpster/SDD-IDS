/**
 * IDS Dropdown single-select (popup) — uses theme CSS variables.
 * Fallback visual contract from components/ids/dropdown-single-select.
 */
(function (global) {
  function createDropdown(root, options) {
    const opts = options || {};
    const placeholder = opts.placeholder || "Select…";
    const disabled = !!opts.disabled;

    root.classList.add("ids-dropdown");
    root.innerHTML = "";

    const field = document.createElement("button");
    field.type = "button";
    field.className = "ids-dd-field";
    field.id = opts.triggerId || "";
    field.setAttribute("aria-haspopup", "listbox");
    field.setAttribute("aria-expanded", "false");
    field.disabled = disabled;

    const valueSlot = document.createElement("span");
    valueSlot.className = "ids-dd-value ids-dd-placeholder";
    valueSlot.textContent = placeholder;

    const caret = document.createElement("span");
    caret.className = "ids-dd-caret";
    caret.setAttribute("aria-hidden", "true");
    caret.innerHTML =
      '<svg width="10" height="10" viewBox="0 0 10 10"><path fill="currentColor" d="M1 3.5L5 7.5L9 3.5H1Z"/></svg>';

    field.appendChild(valueSlot);
    field.appendChild(caret);

    const menu = document.createElement("div");
    menu.className = "ids-dd-menu";
    menu.setAttribute("role", "listbox");
    menu.hidden = true;

    root.appendChild(field);
    root.appendChild(menu);

    let items = [];
    let selected = null;
    let open = false;

    function renderMenu() {
      menu.innerHTML = "";
      if (!items.length) {
        const empty = document.createElement("div");
        empty.className = "ids-dd-empty";
        empty.textContent = opts.emptyText || "No options";
        menu.appendChild(empty);
        return;
      }
      items.forEach((item) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "ids-dd-option";
        btn.setAttribute("role", "option");
        btn.dataset.value = item.value;
        btn.textContent = item.label;
        if (selected && selected.value === item.value) {
          btn.classList.add("is-selected");
          btn.setAttribute("aria-selected", "true");
        }
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          select(item);
          setOpen(false);
        });
        menu.appendChild(btn);
      });
    }

    function setOpen(next) {
      if (field.disabled) return;
      open = next;
      field.setAttribute("aria-expanded", open ? "true" : "false");
      root.classList.toggle("is-open", open);
      menu.hidden = !open;
      if (open) renderMenu();
    }

    function select(item) {
      selected = item;
      valueSlot.textContent = item ? item.label : placeholder;
      valueSlot.classList.toggle("ids-dd-placeholder", !item);
      if (typeof opts.onChange === "function") opts.onChange(item);
      renderMenu();
    }

    field.addEventListener("click", (e) => {
      e.stopPropagation();
      setOpen(!open);
    });

    document.addEventListener("click", (e) => {
      if (!root.contains(e.target)) setOpen(false);
    });

    field.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
      }
    });

    return {
      setItems(next) {
        items = Array.isArray(next) ? next : [];
        if (selected && !items.some((i) => i.value === selected.value)) {
          selected = null;
          valueSlot.textContent = placeholder;
          valueSlot.classList.add("ids-dd-placeholder");
        }
        renderMenu();
      },
      getValue() {
        return selected ? selected.value : null;
      },
      getSelected() {
        return selected;
      },
      setValue(value) {
        const item = items.find((i) => i.value === value) || null;
        select(item);
      },
      setDisabled(d) {
        field.disabled = !!d;
        if (d) setOpen(false);
      },
      clear() {
        select(null);
      },
    };
  }

  function setThemeStylesheet(themeCssPath) {
    const link = document.getElementById("ds-theme-link");
    if (!link) return;
    let name = "ids-theme.css";
    if (themeCssPath) {
      const base = String(themeCssPath).split("/").pop();
      if (base) name = base;
    }
    link.href = `/theme/${name}`;
  }

  global.IdsDropdown = { createDropdown, setThemeStylesheet };
})(window);
