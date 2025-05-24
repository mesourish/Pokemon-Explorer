const CACHE_DB_NAME = "pokemon_cache";
const CACHE_STORE_NAME = "pokemon";
const CACHE_EXPIRY = Infinity;
let offset = 0;
const limit = 20;
let allPokemon = [];
let isLoading = false;
let isSearching = false;

async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(CACHE_DB_NAME, 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(CACHE_STORE_NAME, { keyPath: "key" });
    };
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

async function getFromCache(key) {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(CACHE_STORE_NAME, "readonly");
    const store = tx.objectStore(CACHE_STORE_NAME);
    const request = store.get(key);
    request.onsuccess = () => {
      const data = request.result;
      resolve(data ? data.value : null);
    };
  });
}

async function setInCache(key, value) {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(CACHE_STORE_NAME, "readwrite");
    const store = tx.objectStore(CACHE_STORE_NAME);
    store.put({ key, value, timestamp: Date.now() });
    tx.oncomplete = () => resolve();
  });
}

async function fetchAllPokemon() {
  try {
    const cachedList = await getFromCache("all_pokemon");
    if (cachedList) {
      allPokemon = cachedList;
      return;
    }
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=10000"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Pokémon list");
    }
    const data = await response.json();
    allPokemon = data.results.map((p) => ({ name: p.name, url: p.url }));
    allPokemon.sort((a, b) => a.name.localeCompare(b.name));
    await setInCache("all_pokemon", allPokemon);
  } catch (error) {
    console.error("Error fetching Pokémon list:", error);
    document.getElementById("pokemonList").innerHTML =
      '<p class="text-red-500">Failed to load Pokémon list. Please try again later.</p>';
  }
}

async function fetchPokemonDetails(name) {
  try {
    const cachedDetails = await getFromCache(`pokemon_${name}`);
    if (cachedDetails) return cachedDetails;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch details for ${name}`);
    }
    const data = await response.json();
    await setInCache(`pokemon_${name}`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching details for ${name}:`, error);
    return null;
  }
}

async function fetchPokemonSpecies(name) {
  try {
    const baseName = name.includes("-mega") ? name.split("-mega")[0] : name;
    const cacheKey = `species_${baseName}`;
    const cachedSpecies = await getFromCache(cacheKey);
    if (cachedSpecies) return cachedSpecies;
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${baseName}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch species for ${baseName}`);
    }
    const data = await response.json();
    await setInCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching species for ${name}:`, error);
    return null;
  }
}

async function displayPokemonList(pokemon, append = false) {
  const listDiv = document.getElementById("pokemonList");
  if (!append) listDiv.innerHTML = "";
  const fragment = document.createDocumentFragment();
  for (const p of pokemon) {
    const details = await fetchPokemonDetails(p.name);
    if (!details) continue;
    const card = document.createElement("div");
    const primaryType = details.types?.[0]?.type?.name || "normal";
    card.className = `pokemon-card glass p-6 rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300 ${
      append ? "load-more-enter" : "card-enter"
    } type-${primaryType} shadow-lg`;
    card.innerHTML = `
                    <div class="flex flex-col items-center">
                        <img src="${
                          details.sprites?.front_default ||
                          "https://via.placeholder.com/96"
                        }" alt="${
      p.name
    }" class="w-24 h-24 mb-4" loading="lazy">
                        <span class="text-base capitalize text-center text-white pokemon-font">${
                          p.name
                        }</span>
                    </div>
                `;
    card.addEventListener("click", () => showPokemonDetailsPage(p.name));
    fragment.appendChild(card);
  }
  listDiv.prepend(fragment);
}

async function showPokemonDetailsPage(name) {
  const mainPage = document.getElementById("mainPage");
  const detailsPage = document.getElementById("detailsPage");
  const detailsDiv = document.getElementById("pokemonDetails");
  mainPage.classList.add("hidden");
  detailsPage.classList.remove("hidden");

  const details = await fetchPokemonDetails(name);
  const species = await fetchPokemonSpecies(name);
  if (!details) {
    detailsDiv.innerHTML = `<p class="text-red-500">Failed to load details for ${name}. Please try again later.</p>`;
    return;
  }
  const primaryType = details.types?.[0]?.type?.name || "normal";
  detailsDiv.innerHTML = `
                <h2 class="text-2xl font-bold text-white capitalize mb-4 pokemon-font">${name}</h2>
                <img src="${
                  details.sprites?.other?.["official-artwork"]?.front_default ||
                  "https://via.placeholder.com/192"
                }" alt="${name}" class="w-32 h-32 mx-auto mb-4" loading="lazy">
                <p class="text-sm mb-2 text-white"><strong>Height:</strong> ${
                  details.height / 10
                } m</p>
                <p class="text-sm mb-2 text-white"><strong>Weight:</strong> ${
                  details.weight / 10
                } kg</p>
                <p class="text-sm mb-2 text-white"><strong>Types:</strong> ${details.types
                  .map((t) => t.type.name)
                  .join(", ")}</p>
                <p class="text-sm mb-2 text-white"><strong>Abilities:</strong> ${details.abilities
                  .map((a) => a.ability.name)
                  .join(", ")}</p>
                <p class="text-sm mb-2 text-white"><strong>Habitat:</strong> ${
                  species?.habitat?.name || "Unknown"
                }</p>
                <p class="text-sm text-white"><strong>Description:</strong> ${
                  species?.flavor_text_entries?.find(
                    (e) => e.language.name === "en"
                  )?.flavor_text || "No description"
                }</p>
            `;
  detailsDiv.classList.add(`type-${primaryType}`);
}

function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  const autocompleteList = document.getElementById("autocompleteList");
  searchInput.addEventListener("input", async (e) => {
    const query = e.target.value.toLowerCase().trim();
    autocompleteList.innerHTML = "";
    autocompleteList.classList.add("hidden");
    if (!query) {
      isSearching = false;
      offset = 0;
      await displayPokemonList(allPokemon.slice(0, limit));
      setupInfiniteScroll();
      return;
    }
    isSearching = true;
    const filtered = allPokemon.filter((p) =>
      p.name.toLowerCase().includes(query)
    );
    if (filtered.length) {
      autocompleteList.classList.remove("hidden");
      filtered.slice(0, 10).forEach((p) => {
        const option = document.createElement("div");
        option.className =
          "autocomplete-item p-2 hover:bg-gray-200 hover:text-black text-sm capitalize text-white pokemon-font";
        option.innerText = p.name;
        option.addEventListener("click", async () => {
          searchInput.value = p.name;
          autocompleteList.classList.add("hidden");
          await displayPokemonList([p]);
        });
        autocompleteList.appendChild(option);
      });
      await displayPokemonList(filtered.slice(0, limit));
    } else {
      document.getElementById("pokemonList").innerHTML =
        '<p class="text-gray-400">No Pokémon found.</p>';
    }
  });
}

function setupInfiniteScroll() {
  const sentinel = document.getElementById("sentinel");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !isLoading && !isSearching) {
        isLoading = true;
        loadingSpinner.classList.remove("hidden");
        offset += limit;
        const nextPokemon = allPokemon.slice(offset, offset + limit);
        if (nextPokemon.length) {
          displayPokemonList(nextPokemon, true).then(() => {
            isLoading = false;
            loadingSpinner.classList.add("hidden");
          });
        } else {
          observer.disconnect();
          loadingSpinner.classList.add("hidden");
        }
      }
    },
    {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    }
  );
  observer.observe(sentinel);
}

(async () => {
  await fetchAllPokemon();
  await displayPokemonList(allPokemon.slice(0, limit));
  setupSearch();
  setupInfiniteScroll();
  const detailsPage = document.getElementById("detailsPage");
  detailsPage.addEventListener("click", (e) => {
    if (e.target.id === "closeBtn" || e.target === detailsPage) {
      detailsPage.classList.add("hidden");
      document.getElementById("mainPage").classList.remove("hidden");
    }
  });
})();
