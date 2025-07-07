export const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error('Veri alınmadı');
    }
    return res.json();
  });
