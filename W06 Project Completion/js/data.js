// js/data.js
export async function fetchRecipes(url = './data/recipes.json') {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Network error: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Fetch error', err);
    throw err;
  }
}
