const STORAGE_KEY = "izaba-menua-planner-v1";
const SERVICE_KEYS = ["breakfast", "lunch", "snack", "dinner"];
const SERVICE_LABELS = {
  breakfast: "Gosaria",
  lunch: "Bazkaria",
  snack: "Askaria",
  dinner: "Afaria"
};
const ALLERGENS = [
  {
    key: "gluten",
    label: "Zeliakoak / glutena",
    short: "Glutena",
    className: "allergen-gluten",
    note: "Ogia, pasta, gailetak, saltxitxak, albondigak, saldak eta saltsak bereizi eta etiketa berrikusi.",
    terms: ["gluten", "zeliako", "ogi", "moldeko", "pasta", "gaileta", "frankfurt", "albondiga", "iragazki"]
  },
  {
    key: "nuts",
    label: "Fruitu lehorrak",
    short: "Fruitu lehorrak",
    className: "allergen-nuts",
    note: "Fruitu lehorrak edo kakahueteak atera aurretik anoa bereziak itxi eta aparte utzi.",
    terms: ["fruitu lehor", "kakahuete", "intxaur", "almendra", "hur", "pistatxo", "arrasto"]
  },
  {
    key: "crustacean",
    label: "Krustazeoak",
    short: "Krustazeoak",
    className: "allergen-crustacean",
    note: "Itsaski edo krustazeorik sartuz gero, erabili tresna eta gainazal bereiziak.",
    terms: ["krustazeo", "ganba", "langostino", "otarrain", "karramarro", "zigala", "itsaski", "marisko"]
  },
  {
    key: "dairy",
    label: "Esnekiak",
    short: "Esnekiak",
    className: "allergen-dairy",
    note: "Gazta, esnea, gurina, esnegaina, jogurta eta natillak bereizi laktosarik edo esnekirik hartu ezin dutenentzat.",
    terms: ["esne", "gazta", "gurin", "esnegain", "jogurt", "natilla", "philadelphia", "lakt"]
  }
];

/**
 * @typedef {Object} Ingredient
 * @property {string} name
 * @property {string} category
 * @property {string} unit
 * @property {number|null} amountMin
 * @property {number|null} amountMax
 * @property {boolean} scalable
 * @property {string} purchaseType
 * @property {string} note
 */

/**
 * @typedef {Object} Recipe
 * @property {string} id
 * @property {string} title
 * @property {string[]} mealTypes
 * @property {number} basePeople
 * @property {Ingredient[]} ingredients
 * @property {string} notes
 * @property {string[]} tags
 */

/**
 * @typedef {Object} PlannerDay
 * @property {string} id
 * @property {string} date
 * @property {string} label
 * @property {{breakfast: string|null, lunch: string|null, snack: string|null, dinner: string|null}} slots
 */

/**
 * @typedef {Object} PlannerState
 * @property {number} version
 * @property {number} people
 * @property {{start: string, end: string}} dateRange
 * @property {{key: string, label: string}[]} services
 * @property {Record<string, Recipe>} recipes
 * @property {PlannerDay[]} days
 */

const dom = {
  startDateInput: document.getElementById("startDateInput"),
  endDateInput: document.getElementById("endDateInput"),
  peopleInput: document.getElementById("peopleInput"),
  statusBox: document.getElementById("statusBox"),
  allergenGuide: document.getElementById("allergenGuide"),
  calendarGrid: document.getElementById("calendarGrid"),
  selectedDayTitle: document.getElementById("selectedDayTitle"),
  selectedDayMeta: document.getElementById("selectedDayMeta"),
  selectedDayMeals: document.getElementById("selectedDayMeals"),
  dayNeedsMeta: document.getElementById("dayNeedsMeta"),
  dayNeedsBody: document.getElementById("dayNeedsBody"),
  totalNeedsBody: document.getElementById("totalNeedsBody"),
  recipeGrid: document.getElementById("recipeGrid"),
  recipeSearchInput: document.getElementById("recipeSearchInput"),
  saveButton: document.getElementById("saveButton"),
  exportButton: document.getElementById("exportButton"),
  importButton: document.getElementById("importButton"),
  importFile: document.getElementById("importFile"),
  resetButton: document.getElementById("resetButton"),
  printButton: document.getElementById("printButton"),
  newRecipeButton: document.getElementById("newRecipeButton"),
  recipeDialog: document.getElementById("recipeDialog"),
  recipeForm: document.getElementById("recipeForm"),
  dialogTitle: document.getElementById("dialogTitle"),
  closeDialogButton: document.getElementById("closeDialogButton"),
  cancelRecipeButton: document.getElementById("cancelRecipeButton"),
  recipeIdInput: document.getElementById("recipeIdInput"),
  recipeTitleInput: document.getElementById("recipeTitleInput"),
  recipeBasePeopleInput: document.getElementById("recipeBasePeopleInput"),
  recipeTagsInput: document.getElementById("recipeTagsInput"),
  recipeNotesInput: document.getElementById("recipeNotesInput"),
  ingredientRows: document.getElementById("ingredientRows"),
  ingredientRowTemplate: document.getElementById("ingredientRowTemplate"),
  addIngredientButton: document.getElementById("addIngredientButton")
};

/** @type {PlannerState} */
let state = loadState();
let selectedDayId = state.days[0]?.id || "";
let dragged = null;
let recipeSearch = "";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  const fallback = clone(window.IZABA_DEFAULT_DATA);
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return fallback;
    return normalizeState(JSON.parse(saved), fallback);
  } catch (error) {
    console.warn("Saved planner data could not be loaded", error);
    return fallback;
  }
}

function normalizeState(candidate, fallback) {
  if (!candidate || typeof candidate !== "object") return fallback;
  const normalized = {
    version: 1,
    people: Number(candidate.people) > 0 ? Math.round(Number(candidate.people)) : fallback.people,
    dateRange: {
      start: candidate.dateRange?.start || fallback.dateRange.start,
      end: candidate.dateRange?.end || fallback.dateRange.end
    },
    services: fallback.services,
    recipes: candidate.recipes && typeof candidate.recipes === "object" ? candidate.recipes : fallback.recipes,
    days: Array.isArray(candidate.days) && candidate.days.length ? candidate.days : fallback.days
  };

  normalized.days = normalized.days.map((day, index) => ({
    id: day.id || day.date || `day-${index + 1}`,
    date: day.date || normalized.dateRange.start,
    label: day.label || `${index + 1}. eguna`,
    slots: normalizeSlots(day.slots)
  }));

  Object.values(normalized.recipes).forEach((recipe) => {
    recipe.id = recipe.id || slugify(recipe.title || "errezeta");
    recipe.title = recipe.title || "Errezeta berria";
    recipe.mealTypes = Array.isArray(recipe.mealTypes) && recipe.mealTypes.length ? recipe.mealTypes : ["lunch"];
    recipe.basePeople = Number(recipe.basePeople) > 0 ? Number(recipe.basePeople) : normalized.people;
    recipe.ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients.map(normalizeIngredient) : [];
    recipe.notes = recipe.notes || "";
    recipe.tags = Array.isArray(recipe.tags) ? recipe.tags : [];
  });

  return normalized;
}

function normalizeSlots(slots) {
  const normalized = {};
  SERVICE_KEYS.forEach((key) => {
    normalized[key] = slots && typeof slots[key] === "string" ? slots[key] : null;
  });
  return normalized;
}

function normalizeIngredient(ingredient) {
  return {
    name: ingredient?.name || "",
    category: ingredient?.category || "Orokorra",
    unit: ingredient?.unit || "",
    amountMin: numberOrNull(ingredient?.amountMin),
    amountMax: numberOrNull(ingredient?.amountMax),
    scalable: ingredient?.scalable !== false,
    purchaseType: ingredient?.purchaseType || "Han erosi / txandaka",
    note: ingredient?.note || ""
  };
}

function numberOrNull(value) {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function persist(message) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, updatedAt: new Date().toISOString() }));
  setStatus(message || "Gordeta.");
}

function setStatus(message) {
  dom.statusBox.textContent = message;
}

function render() {
  ensureSelectedDay();
  syncControls();
  renderAllergenGuide();
  renderCalendar();
  renderSelectedDay();
  renderNeeds();
  renderRecipes();
}

function syncControls() {
  dom.startDateInput.value = state.dateRange.start;
  dom.endDateInput.value = state.dateRange.end;
  dom.peopleInput.value = state.people;
}

function renderCalendar() {
  dom.calendarGrid.textContent = "";

  state.days.forEach((day, index) => {
    const toneClass = `day-tone-${index % 10}`;
    const card = el("article", `day-card ${toneClass}${day.id === selectedDayId ? " is-selected" : ""}`);
    card.dataset.dayId = day.id;

    const head = el("div", "day-head");
    const titleWrap = el("div");
    titleWrap.append(el("h3", "", day.label), el("span", "date-label", formatDate(day.date)));
    const selectButton = el("button", "button small-button", "Aukeratu");
    selectButton.type = "button";
    selectButton.dataset.action = "select-day";
    selectButton.dataset.dayId = day.id;
    head.append(titleWrap, selectButton);
    card.appendChild(head);

    const dayAllergens = allergensForDay(day);
    if (dayAllergens.length) {
      card.appendChild(renderAllergenBadges(dayAllergens, "day-allergens"));
    }

    SERVICE_KEYS.forEach((serviceKey) => {
      card.appendChild(renderSlot(day, serviceKey));
    });

    dom.calendarGrid.appendChild(card);
  });
}

function renderSlot(day, serviceKey) {
  const slot = el("section", `meal-slot service-${serviceKey}`);
  slot.dataset.dayId = day.id;
  slot.dataset.service = serviceKey;

  const head = el("div", "slot-head");
  head.appendChild(el("strong", "", SERVICE_LABELS[serviceKey]));
  slot.appendChild(head);

  const recipeId = day.slots[serviceKey];
  const recipe = recipeId ? state.recipes[recipeId] : null;

  if (recipe) {
    slot.appendChild(renderAssignedRecipeCard(day, serviceKey, recipe));
  } else {
    slot.appendChild(el("p", "empty-state", "Hutsik"));
    slot.appendChild(renderAddControl(day, serviceKey));
  }

  return slot;
}

function renderAssignedRecipeCard(day, serviceKey, recipe) {
  const card = el("div", "meal-card");
  card.draggable = true;
  card.dataset.recipeId = recipe.id;
  card.dataset.dayId = day.id;
  card.dataset.service = serviceKey;

  card.appendChild(el("div", "recipe-title", recipe.title));
  card.appendChild(el("div", "recipe-meta", `${recipe.basePeople} laguneko oinarria · ${recipe.ingredients.length} osagai`));
  card.appendChild(renderTags(recipe.tags));
  card.appendChild(renderAllergenBadges(recipeAllergens(recipe)));

  const actions = el("div", "card-actions");
  actions.appendChild(actionButton("Editatu", "edit-recipe", { recipeId: recipe.id }));
  actions.appendChild(actionButton("Kendu", "clear-slot", { dayId: day.id, service: serviceKey }, "danger"));
  card.appendChild(actions);

  const details = el("details", "move-control");
  details.appendChild(el("summary", "", "Mugitu"));
  const destination = destinationSelect(day.id, serviceKey);
  const moveButton = actionButton("Mugitu", "move-assignment", { dayId: day.id, service: serviceKey }, "small");
  details.append(destination, moveButton);
  card.appendChild(details);

  return card;
}

function renderAddControl(day, serviceKey) {
  const wrapper = el("div", "empty-actions");
  const select = el("select");
  select.dataset.role = "add-recipe-select";
  select.dataset.dayId = day.id;
  select.dataset.service = serviceKey;

  const options = recipesForService(serviceKey);
  select.appendChild(new Option("Errezeta aukeratu", ""));
  options.forEach((recipe) => select.appendChild(new Option(recipe.title, recipe.id)));

  const button = actionButton("Jarri", "add-to-slot", { dayId: day.id, service: serviceKey }, "small");
  wrapper.append(select, button);
  return wrapper;
}

function renderSelectedDay() {
  const day = getSelectedDay();
  if (!day) {
    dom.selectedDayTitle.textContent = "Eguna";
    dom.selectedDayMeta.textContent = "Aukeratu egutegiko egun bat.";
    dom.selectedDayMeals.textContent = "";
    return;
  }

  dom.selectedDayTitle.textContent = day.label;
  dom.selectedDayMeta.textContent = `${formatDate(day.date)} · ${state.people} lagun`;
  dom.selectedDayMeals.textContent = "";

  const dayAllergens = allergensForDay(day);
  if (dayAllergens.length) {
    dom.selectedDayMeals.appendChild(renderAllergenBadges(dayAllergens, "selected-day-alerts"));
  }

  const list = el("div", "selected-meal-list");
  SERVICE_KEYS.forEach((serviceKey) => {
    const recipe = state.recipes[day.slots[serviceKey]];
    const item = el("article", `selected-meal service-${serviceKey}`);
    item.appendChild(el("h3", "", SERVICE_LABELS[serviceKey]));
    if (!recipe) {
      item.appendChild(el("p", "", "Zerbitzu hau hutsik dago."));
    } else {
      item.appendChild(el("div", "recipe-title", recipe.title));
      item.appendChild(renderTags(recipe.tags));
      item.appendChild(renderAllergenBadges(recipeAllergens(recipe)));
      if (recipe.notes) item.appendChild(el("p", "", recipe.notes));
      const actions = el("div", "card-actions");
      actions.appendChild(actionButton("Editatu", "edit-recipe", { recipeId: recipe.id }, "small"));
      actions.appendChild(actionButton("Kendu", "clear-slot", { dayId: day.id, service: serviceKey }, "small"));
      item.appendChild(actions);
    }
    list.appendChild(item);
  });

  dom.selectedDayMeals.appendChild(list);
}

function renderNeeds() {
  const selected = getSelectedDay();
  const dayNeeds = selected ? calculateNeeds([selected]) : [];
  dom.dayNeedsMeta.textContent = selected ? `${selected.label} · ${state.people} lagun` : "Aukeratutako egunaren arabera.";
  renderNeedsRows(dom.dayNeedsBody, dayNeeds, false);

  const totalNeeds = calculateNeeds(state.days);
  renderNeedsRows(dom.totalNeedsBody, totalNeeds, true);
}

function renderNeedsRows(target, rows, includeNote) {
  target.textContent = "";
  if (!rows.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = includeNote ? 5 : 4;
    cell.textContent = "Ez dago kalkulatzeko osagairik.";
    row.appendChild(cell);
    target.appendChild(row);
    return;
  }

  rows.forEach((item) => {
    const row = document.createElement("tr");
    row.append(
      el("td", "", item.category),
      el("td", "", item.name),
      el("td", "", item.amountText),
      cellWithPurchase(item.purchaseType)
    );
    if (includeNote) row.appendChild(el("td", "", item.note));
    target.appendChild(row);
  });
}

function renderRecipes() {
  const query = recipeSearch.trim().toLowerCase();
  const recipes = Object.values(state.recipes)
    .filter((recipe) => recipeMatches(recipe, query))
    .sort((a, b) => a.title.localeCompare(b.title, "eu"));

  dom.recipeGrid.textContent = "";
  if (!recipes.length) {
    dom.recipeGrid.appendChild(el("p", "empty-state", "Ez da errezetarik aurkitu."));
    return;
  }

  recipes.forEach((recipe) => dom.recipeGrid.appendChild(renderRecipeLibraryCard(recipe)));
}

function renderRecipeLibraryCard(recipe) {
  const card = el("article", "recipe-card");
  card.draggable = true;
  card.dataset.recipeId = recipe.id;
  card.dataset.source = "library";

  card.appendChild(el("div", "recipe-title", recipe.title));
  card.appendChild(el("div", "recipe-meta", `${recipe.mealTypes.map((key) => SERVICE_LABELS[key]).join(", ")} · ${recipe.basePeople} lagun · ${recipe.ingredients.length} osagai`));
  card.appendChild(renderTags(recipe.tags));
  card.appendChild(renderAllergenBadges(recipeAllergens(recipe)));
  if (recipe.notes) card.appendChild(el("p", "muted", recipe.notes));

  const assign = el("div", "recipe-card-actions");
  const serviceSelect = el("select");
  serviceSelect.dataset.role = "library-service-select";
  recipe.mealTypes.forEach((serviceKey) => serviceSelect.appendChild(new Option(SERVICE_LABELS[serviceKey], serviceKey)));
  const assignButton = actionButton("Aukeratutako egunean jarri", "assign-library", { recipeId: recipe.id }, "small");
  assign.append(serviceSelect, assignButton);
  card.appendChild(assign);

  const actions = el("div", "card-actions");
  actions.appendChild(actionButton("Editatu", "edit-recipe", { recipeId: recipe.id }, "small"));
  actions.appendChild(actionButton("Bikoiztu", "duplicate-recipe", { recipeId: recipe.id }, "small"));
  actions.appendChild(actionButton("Ezabatu", "delete-recipe", { recipeId: recipe.id }, "danger small"));
  card.appendChild(actions);

  return card;
}

function renderTags(tags) {
  const wrap = el("div", "tags");
  (tags || []).slice(0, 5).forEach((tag) => wrap.appendChild(el("span", "tag", tag)));
  return wrap;
}

function renderAllergenGuide() {
  if (!dom.allergenGuide || dom.allergenGuide.children.length) return;
  ALLERGENS.forEach((allergen) => {
    const card = el("article", `allergen-guide-card ${allergen.className}`);
    card.append(
      el("strong", "", allergen.label),
      el("p", "", allergen.note)
    );
    dom.allergenGuide.appendChild(card);
  });
}

function allergensForDay(day) {
  const found = new Map();
  SERVICE_KEYS.forEach((serviceKey) => {
    const recipe = state.recipes[day.slots[serviceKey]];
    if (!recipe) return;
    recipeAllergens(recipe).forEach((allergen) => found.set(allergen.key, allergen));
  });
  return [...found.values()];
}

function recipeAllergens(recipe) {
  const haystack = normalizeSearchText([
    recipe.title,
    recipe.notes,
    ...(recipe.tags || []),
    ...recipe.ingredients.map((ingredient) => `${ingredient.name} ${ingredient.category} ${ingredient.note}`)
  ].join(" "));
  return ALLERGENS.filter((allergen) => allergen.terms.some((term) => containsAllergenTerm(haystack, term)));
}

function containsAllergenTerm(haystack, term) {
  const normalizedTerm = normalizeSearchText(term);
  if (!normalizedTerm) return false;
  if (normalizedTerm.includes(" ")) return haystack.includes(normalizedTerm);
  const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegExp(normalizedTerm)}[a-z0-9]*`);
  return pattern.test(haystack);
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderAllergenBadges(allergens, className = "") {
  const wrap = el("div", `allergen-row ${className}`.trim());
  (allergens || []).forEach((allergen) => {
    const badge = el("span", `allergen-badge ${allergen.className}`, allergen.short);
    badge.title = allergen.note;
    wrap.appendChild(badge);
  });
  return wrap;
}

function calculateNeeds(days) {
  const map = new Map();
  days.forEach((day) => {
    SERVICE_KEYS.forEach((serviceKey) => {
      const recipe = state.recipes[day.slots[serviceKey]];
      if (!recipe) return;
      const ratio = state.people / Math.max(1, Number(recipe.basePeople) || state.people);
      recipe.ingredients.forEach((ingredient) => addScaledIngredient(map, ingredient, ratio));
    });
  });

  return [...map.values()]
    .map(formatNeedItem)
    .sort((a, b) => `${a.category} ${a.name}`.localeCompare(`${b.category} ${b.name}`, "eu"));
}

function addScaledIngredient(map, ingredient, ratio) {
  const item = normalizeIngredient(ingredient);
  const key = [
    item.name.trim().toLowerCase(),
    item.category.trim().toLowerCase(),
    item.unit.trim().toLowerCase(),
    item.purchaseType.trim().toLowerCase(),
    item.scalable ? "scale" : "fixed"
  ].join("|");

  if (!map.has(key)) {
    map.set(key, {
      name: item.name,
      category: item.category || "Orokorra",
      unit: item.unit,
      purchaseType: item.purchaseType,
      scalable: item.scalable,
      amountMin: 0,
      amountMax: 0,
      hasNumeric: false,
      hasRange: false,
      notes: new Set()
    });
  }

  const aggregate = map.get(key);
  if (item.note) aggregate.notes.add(item.note);

  if (!item.scalable || item.amountMin === null) {
    aggregate.scalable = false;
    aggregate.notes.add(item.note || "behar adina");
    return;
  }

  aggregate.hasNumeric = true;
  const scaledMin = item.amountMin * ratio;
  const scaledMax = (item.amountMax ?? item.amountMin) * ratio;
  aggregate.amountMin += scaledMin;
  aggregate.amountMax += scaledMax;
  if (item.amountMax !== null && item.amountMax !== item.amountMin) aggregate.hasRange = true;
}

function formatNeedItem(item) {
  const note = [...item.notes].filter(Boolean).join(" · ");
  if (!item.hasNumeric || !item.scalable) {
    return { ...item, amountText: note || "behar adina", note };
  }

  const min = roundAmount(item.amountMin, item.unit);
  const max = roundAmount(item.amountMax, item.unit);
  const amountText = item.hasRange && max !== min
    ? `${formatNumber(min)}-${formatNumber(max)} ${item.unit}`.trim()
    : `${formatNumber(min)} ${item.unit}`.trim();

  return { ...item, amountText, note };
}

function roundAmount(value, unit) {
  if (!Number.isFinite(value)) return 0;
  const normalized = (unit || "").toLowerCase();
  if (normalized === "kg" || normalized === "l") return Math.round(value * 10) / 10;
  if (normalized === "g") return Math.ceil(value / 50) * 50;
  return Math.ceil(value);
}

function formatNumber(value) {
  return value.toLocaleString("eu-ES", { maximumFractionDigits: 1 });
}

function cellWithPurchase(purchaseType) {
  const cell = document.createElement("td");
  const pill = el("span", `purchase-pill${purchaseType.includes("Han") ? " local" : ""}`, purchaseType);
  cell.appendChild(pill);
  return cell;
}

function recipeMatches(recipe, query) {
  if (!query) return true;
  const haystack = [
    recipe.title,
    recipe.notes,
    ...(recipe.tags || []),
    ...recipe.ingredients.map((ingredient) => `${ingredient.name} ${ingredient.category} ${ingredient.note}`)
  ].join(" ");
  return normalizeSearchText(haystack).includes(normalizeSearchText(query));
}

function normalizeSearchText(text) {
  return (text || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function recipesForService(serviceKey) {
  return Object.values(state.recipes)
    .filter((recipe) => recipe.mealTypes.includes(serviceKey))
    .sort((a, b) => a.title.localeCompare(b.title, "eu"));
}

function destinationSelect(currentDayId, currentService) {
  const select = el("select");
  select.dataset.role = "destination-select";
  state.days.forEach((day) => {
    SERVICE_KEYS.forEach((serviceKey) => {
      const option = new Option(`${day.label} · ${SERVICE_LABELS[serviceKey]}`, `${day.id}|${serviceKey}`);
      if (day.id === currentDayId && serviceKey === currentService) option.disabled = true;
      select.appendChild(option);
    });
  });
  return select;
}

function getSelectedDay() {
  return state.days.find((day) => day.id === selectedDayId) || state.days[0] || null;
}

function ensureSelectedDay() {
  if (!state.days.some((day) => day.id === selectedDayId)) {
    selectedDayId = state.days[0]?.id || "";
  }
}

function updateDateRange() {
  const start = dom.startDateInput.value;
  const end = dom.endDateInput.value;
  if (!start || !end) return;
  if (start > end) {
    dom.endDateInput.value = start;
  }
  rebuildDays(start, dom.endDateInput.value);
  state.dateRange = { start, end: dom.endDateInput.value };
  selectedDayId = state.days[0]?.id || "";
  persist("Datak eguneratuta.");
  render();
}

function rebuildDays(start, end) {
  const dates = datesBetween(start, end);
  const oldByDate = new Map(state.days.map((day) => [day.date, day]));
  const defaults = window.IZABA_DEFAULT_DATA.days;
  state.days = dates.map((date, index) => {
    const existing = oldByDate.get(date);
    if (existing) return existing;
    const defaultDay = defaults[index];
    return {
      id: date,
      date,
      label: defaultDay?.label || `${index + 1}. eguna`,
      slots: defaultDay ? clone(defaultDay.slots) : emptySlots()
    };
  });
}

function datesBetween(start, end) {
  const dates = [];
  const current = new Date(`${start}T00:00:00`);
  const last = new Date(`${end}T00:00:00`);
  while (current <= last && dates.length < 62) {
    dates.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function emptySlots() {
  return { breakfast: null, lunch: null, snack: null, dinner: null };
}

function assignRecipe(dayId, serviceKey, recipeId) {
  const day = state.days.find((item) => item.id === dayId);
  if (!day || !SERVICE_KEYS.includes(serviceKey)) return;
  day.slots[serviceKey] = recipeId || null;
  selectedDayId = day.id;
  persist("Errezeta jarrita.");
  render();
}

function clearSlot(dayId, serviceKey) {
  assignRecipe(dayId, serviceKey, null);
}

function moveAssignment(fromDayId, fromService, toDayId, toService) {
  const fromDay = state.days.find((day) => day.id === fromDayId);
  const toDay = state.days.find((day) => day.id === toDayId);
  if (!fromDay || !toDay || !SERVICE_KEYS.includes(fromService) || !SERVICE_KEYS.includes(toService)) return;
  const sourceRecipe = fromDay.slots[fromService];
  if (!sourceRecipe) return;
  const targetRecipe = toDay.slots[toService];
  toDay.slots[toService] = sourceRecipe;
  fromDay.slots[fromService] = targetRecipe || null;
  selectedDayId = toDay.id;
  persist("Platera mugituta.");
  render();
}

function dropRecipeOnDay(targetDayId) {
  if (!dragged) return;
  const targetDay = state.days.find((day) => day.id === targetDayId);
  const recipe = state.recipes[dragged.recipeId];
  if (!targetDay || !recipe) return;

  const candidateServices = serviceCandidatesForRecipe(recipe, dragged.service);
  const emptyService = candidateServices.find((serviceKey) => !targetDay.slots[serviceKey]);

  if (dragged.source === "library") {
    if (!emptyService) {
      setStatus("Egun horretan ez dago errezeta horrentzako leku librerik.");
      return;
    }
    assignRecipe(targetDay.id, emptyService, recipe.id);
    return;
  }

  if (targetDay.id === dragged.dayId) {
    setStatus("Platera egun berean dago.");
    return;
  }

  const targetService = emptyService || (SERVICE_KEYS.includes(dragged.service) ? dragged.service : candidateServices[0]);
  if (!targetService) {
    setStatus("Ezin izan da platera egun horretan kokatu.");
    return;
  }
  moveAssignment(dragged.dayId, dragged.service, targetDay.id, targetService);
}

function serviceCandidatesForRecipe(recipe, preferredService) {
  const candidates = [];
  if (SERVICE_KEYS.includes(preferredService)) candidates.push(preferredService);
  (recipe.mealTypes || []).forEach((serviceKey) => {
    if (SERVICE_KEYS.includes(serviceKey) && !candidates.includes(serviceKey)) candidates.push(serviceKey);
  });
  if (!candidates.length) candidates.push(...SERVICE_KEYS);
  return candidates;
}

function duplicateRecipe(recipeId) {
  const recipe = state.recipes[recipeId];
  if (!recipe) return;
  const copy = clone(recipe);
  copy.id = uniqueRecipeId(`${slugify(recipe.title)}-kopia`);
  copy.title = `${recipe.title} (kopia)`;
  state.recipes[copy.id] = copy;
  persist("Errezeta bikoiztuta.");
  render();
}

function deleteRecipe(recipeId) {
  const recipe = state.recipes[recipeId];
  if (!recipe) return;
  if (!confirm(`Ezabatu "${recipe.title}"? Egutegiko agerraldiak hutsik geratuko dira.`)) return;
  delete state.recipes[recipeId];
  state.days.forEach((day) => {
    SERVICE_KEYS.forEach((serviceKey) => {
      if (day.slots[serviceKey] === recipeId) day.slots[serviceKey] = null;
    });
  });
  persist("Errezeta ezabatuta.");
  render();
}

function openRecipeDialog(recipeId) {
  const recipe = recipeId ? state.recipes[recipeId] : null;
  dom.dialogTitle.textContent = recipe ? "Errezeta editatu" : "Errezeta berria";
  dom.recipeIdInput.value = recipe?.id || "";
  dom.recipeTitleInput.value = recipe?.title || "";
  dom.recipeBasePeopleInput.value = recipe?.basePeople || state.people || 53;
  dom.recipeTagsInput.value = (recipe?.tags || []).join(", ");
  dom.recipeNotesInput.value = recipe?.notes || "";

  dom.recipeForm.querySelectorAll('input[name="mealType"]').forEach((input) => {
    input.checked = recipe ? recipe.mealTypes.includes(input.value) : input.value === "lunch";
  });

  dom.ingredientRows.textContent = "";
  const ingredients = recipe?.ingredients?.length ? recipe.ingredients : [blankIngredient()];
  ingredients.forEach((ingredient) => addIngredientRow(ingredient));

  if (typeof dom.recipeDialog.showModal === "function") {
    dom.recipeDialog.showModal();
  } else {
    dom.recipeDialog.setAttribute("open", "");
  }
}

function closeRecipeDialog() {
  if (typeof dom.recipeDialog.close === "function") {
    dom.recipeDialog.close();
  } else {
    dom.recipeDialog.removeAttribute("open");
  }
}

function addIngredientRow(ingredient = blankIngredient()) {
  const row = dom.ingredientRowTemplate.content.firstElementChild.cloneNode(true);
  row.querySelector('[data-field="name"]').value = ingredient.name || "";
  row.querySelector('[data-field="category"]').value = ingredient.category || "";
  row.querySelector('[data-field="unit"]').value = ingredient.unit || "";
  row.querySelector('[data-field="amountMin"]').value = ingredient.amountMin ?? "";
  row.querySelector('[data-field="amountMax"]').value = ingredient.amountMax ?? "";
  row.querySelector('[data-field="purchaseType"]').value = ingredient.purchaseType || "Han erosi / txandaka";
  row.querySelector('[data-field="scalable"]').checked = ingredient.scalable !== false;
  row.querySelector('[data-field="note"]').value = ingredient.note || "";
  dom.ingredientRows.appendChild(row);
}

function blankIngredient() {
  return {
    name: "",
    category: "Orokorra",
    unit: "kg",
    amountMin: null,
    amountMax: null,
    scalable: true,
    purchaseType: "Han erosi / txandaka",
    note: ""
  };
}

function saveRecipeFromForm() {
  const currentId = dom.recipeIdInput.value;
  const title = dom.recipeTitleInput.value.trim();
  const mealTypes = [...dom.recipeForm.querySelectorAll('input[name="mealType"]:checked')].map((input) => input.value);

  if (!title) {
    setStatus("Errezetak izena behar du.");
    return;
  }
  if (!mealTypes.length) {
    setStatus("Aukeratu zerbitzu mota bat gutxienez.");
    return;
  }

  const id = currentId || uniqueRecipeId(slugify(title));
  const recipe = {
    id,
    title,
    mealTypes,
    basePeople: Math.max(1, Number(dom.recipeBasePeopleInput.value) || state.people || 53),
    tags: dom.recipeTagsInput.value.split(",").map((tag) => tag.trim()).filter(Boolean),
    notes: dom.recipeNotesInput.value.trim(),
    ingredients: collectIngredientRows()
  };

  state.recipes[id] = recipe;
  persist("Errezeta gordeta.");
  closeRecipeDialog();
  render();
}

function collectIngredientRows() {
  return [...dom.ingredientRows.querySelectorAll(".ingredient-row")]
    .map((row) => {
      const ingredient = {
        name: row.querySelector('[data-field="name"]').value.trim(),
        category: row.querySelector('[data-field="category"]').value.trim() || "Orokorra",
        unit: row.querySelector('[data-field="unit"]').value.trim(),
        amountMin: numberOrNull(row.querySelector('[data-field="amountMin"]').value),
        amountMax: numberOrNull(row.querySelector('[data-field="amountMax"]').value),
        purchaseType: row.querySelector('[data-field="purchaseType"]').value,
        scalable: row.querySelector('[data-field="scalable"]').checked,
        note: row.querySelector('[data-field="note"]').value.trim()
      };
      if (ingredient.amountMin === null) ingredient.scalable = false;
      return ingredient;
    })
    .filter((ingredient) => ingredient.name);
}

function uniqueRecipeId(base) {
  let id = base || "errezeta";
  let counter = 2;
  while (state.recipes[id]) {
    id = `${base}-${counter}`;
    counter += 1;
  }
  return id;
}

function slugify(text) {
  return (text || "errezeta")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "errezeta";
}

function exportJson() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `izaba-menua-${state.dateRange.start}-${state.dateRange.end}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setStatus("JSON esportatuta.");
}

function importJson(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      state = normalizeState(JSON.parse(reader.result), clone(window.IZABA_DEFAULT_DATA));
      selectedDayId = state.days[0]?.id || "";
      persist("JSON inportatuta.");
      render();
    } catch (error) {
      console.error(error);
      setStatus("Ezin izan da JSON fitxategia inportatu.");
    }
  });
  reader.readAsText(file);
}

function resetState() {
  if (!confirm("Hasierako Izaba plana berrezarri? Gordetako aldaketak galduko dira.")) return;
  localStorage.removeItem(STORAGE_KEY);
  state = clone(window.IZABA_DEFAULT_DATA);
  selectedDayId = state.days[0]?.id || "";
  persist("Hasierako plana berrezarrita.");
  render();
}

function actionButton(text, action, data = {}, variant = "") {
  const button = el("button", `button small-button ${variant}`.trim(), text);
  button.type = "button";
  button.dataset.action = action;
  Object.entries(data).forEach(([key, value]) => {
    button.dataset[key] = value;
  });
  return button;
}

function el(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function formatDate(isoDate) {
  return new Intl.DateTimeFormat("eu-ES", {
    weekday: "short",
    day: "numeric",
    month: "short"
  }).format(new Date(`${isoDate}T00:00:00`));
}

dom.startDateInput.addEventListener("change", updateDateRange);
dom.endDateInput.addEventListener("change", updateDateRange);
function updatePeopleFromInput() {
  state.people = Math.max(1, Math.round(Number(dom.peopleInput.value) || state.people || 1));
  persist("Lagun kopurua eguneratuta.");
  render();
}

dom.peopleInput.addEventListener("input", updatePeopleFromInput);
dom.peopleInput.addEventListener("change", updatePeopleFromInput);

dom.saveButton.addEventListener("click", () => persist("Gordeta."));
dom.exportButton.addEventListener("click", exportJson);
dom.importButton.addEventListener("click", () => dom.importFile.click());
dom.importFile.addEventListener("change", () => {
  importJson(dom.importFile.files[0]);
  dom.importFile.value = "";
});
dom.resetButton.addEventListener("click", resetState);
dom.printButton.addEventListener("click", () => window.print());
dom.newRecipeButton.addEventListener("click", () => openRecipeDialog());
dom.recipeSearchInput.addEventListener("input", () => {
  recipeSearch = dom.recipeSearchInput.value;
  renderRecipes();
});

dom.calendarGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;

  if (action === "select-day") {
    selectedDayId = button.dataset.dayId;
    render();
  }

  if (action === "clear-slot") {
    clearSlot(button.dataset.dayId, button.dataset.service);
  }

  if (action === "edit-recipe") {
    openRecipeDialog(button.dataset.recipeId);
  }

  if (action === "add-to-slot") {
    const select = button.parentElement.querySelector('[data-role="add-recipe-select"]');
    if (select.value) assignRecipe(button.dataset.dayId, button.dataset.service, select.value);
  }

  if (action === "move-assignment") {
    const select = button.parentElement.querySelector('[data-role="destination-select"]');
    if (!select?.value) return;
    const [toDayId, toService] = select.value.split("|");
    moveAssignment(button.dataset.dayId, button.dataset.service, toDayId, toService);
  }
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button || dom.calendarGrid.contains(button)) return;
  const action = button.dataset.action;

  if (action === "edit-recipe") openRecipeDialog(button.dataset.recipeId);
  if (action === "duplicate-recipe") duplicateRecipe(button.dataset.recipeId);
  if (action === "delete-recipe") deleteRecipe(button.dataset.recipeId);
  if (action === "assign-library") {
    const day = getSelectedDay();
    const select = button.parentElement.querySelector('[data-role="library-service-select"]');
    if (day && select?.value) assignRecipe(day.id, select.value, button.dataset.recipeId);
  }
  if (action === "clear-slot") clearSlot(button.dataset.dayId, button.dataset.service);
});

document.addEventListener("dragstart", (event) => {
  const card = event.target.closest("[draggable='true'][data-recipe-id]");
  if (!card) return;
  dragged = {
    recipeId: card.dataset.recipeId,
    source: card.dataset.source || "calendar",
    dayId: card.dataset.dayId || null,
    service: card.dataset.service || null
  };
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", dragged.recipeId);
});

document.addEventListener("dragover", (event) => {
  const slot = event.target.closest(".meal-slot");
  const dayCard = event.target.closest(".day-card");
  if (!slot && !dayCard) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
  if (slot) {
    slot.classList.add("drag-over");
    dayCard?.classList.remove("day-drag-over");
    return;
  }
  dayCard.classList.add("day-drag-over");
});

document.addEventListener("dragleave", (event) => {
  const slot = event.target.closest(".meal-slot");
  const dayCard = event.target.closest(".day-card");
  const nextTarget = event.relatedTarget;
  if (slot && !slot.contains(nextTarget)) slot.classList.remove("drag-over");
  if (dayCard && !dayCard.contains(nextTarget)) dayCard.classList.remove("day-drag-over");
});

document.addEventListener("drop", (event) => {
  const slot = event.target.closest(".meal-slot");
  const dayCard = event.target.closest(".day-card");
  if ((!slot && !dayCard) || !dragged) return;
  event.preventDefault();
  clearDragHighlights();

  if (dragged.source === "library") {
    if (slot) {
      assignRecipe(slot.dataset.dayId, slot.dataset.service, dragged.recipeId);
    } else {
      dropRecipeOnDay(dayCard.dataset.dayId);
    }
  } else {
    if (slot) {
      moveAssignment(dragged.dayId, dragged.service, slot.dataset.dayId, slot.dataset.service);
    } else {
      dropRecipeOnDay(dayCard.dataset.dayId);
    }
  }
  dragged = null;
});

document.addEventListener("dragend", () => {
  dragged = null;
  clearDragHighlights();
});

function clearDragHighlights() {
  document.querySelectorAll(".drag-over").forEach((slot) => slot.classList.remove("drag-over"));
  document.querySelectorAll(".day-drag-over").forEach((card) => card.classList.remove("day-drag-over"));
}

dom.recipeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveRecipeFromForm();
});
dom.closeDialogButton.addEventListener("click", closeRecipeDialog);
dom.cancelRecipeButton.addEventListener("click", closeRecipeDialog);
dom.addIngredientButton.addEventListener("click", () => addIngredientRow());
dom.ingredientRows.addEventListener("click", (event) => {
  const button = event.target.closest(".remove-ingredient");
  if (!button) return;
  const row = button.closest(".ingredient-row");
  if (dom.ingredientRows.children.length === 1) {
    row.querySelectorAll("input").forEach((input) => {
      if (input.type !== "checkbox") input.value = "";
    });
    row.querySelector('[data-field="scalable"]').checked = true;
  } else {
    row.remove();
  }
});

window.addEventListener("beforeprint", () => {
  const selected = getSelectedDay();
  if (selected) selectedDayId = selected.id;
  renderSelectedDay();
  renderNeeds();
});

render();
setStatus(localStorage.getItem(STORAGE_KEY) ? "Gordetako plana kargatuta." : "Hasierako plana kargatuta.");
