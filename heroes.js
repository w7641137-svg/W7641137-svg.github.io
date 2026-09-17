window.HEROES = {
  0: {
    id: "goethe",
    name: "Иоганн Вольфганг фон Гёте",
    base: "heroes/goethe/frame_01.webp",
    frames: Array.from({length:10}, (_,i)=>`heroes/goethe/frame_${String(i+1).padStart(2,"0")}.webp`),
    restBefore: 1900,
    gap: [14000,19000]
  }
};
