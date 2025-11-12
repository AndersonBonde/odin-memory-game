import { useCallback, useEffect, useState } from "react";

function useGiphy(tag, amount) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const api_key = import.meta.env.VITE_API_KEY;

  async function fetchSingleGif(tag) {
    const url = `https://api.giphy.com/v1/gifs/random?api_key=${api_key}&tag=${tag}`;
    const res = await fetch(url);
    const json = await res.json();
    return json.data;
  }
  
  const load = useCallback(async() => {
    async function fetchUnique(tag, amount) {
      const gifs = [];
      const ids = new Set();

      while (gifs.length < amount) {
        const needed = amount - gifs.length;
        const promises = Array.from({ length: needed }, () => fetchSingleGif(tag));
        const results = await Promise.all(promises);

        for (const gif of results) {
          if (!ids.has(gif.id)) {
            gifs.push(gif);
            ids.add(gif.id);
          } else {
            let newGif;
            do {
              newGif = await fetchSingleGif();
            } while (ids.has(newGif.id));
            gifs.push(newGif);
            ids.add(newGif.id);
          }

          if (gifs.length >= amount) break;
        }
      }

      return gifs;
    }

    setLoading(true);
    const gifs = await fetchUnique(tag, amount);
    setData(gifs);
    setLoading(false);
  }, [tag, amount]);
  
  useEffect(() => {
    load();
  }, [load]);

  return { data, setData, loading, reload: () => load() };
}

export { useGiphy }
