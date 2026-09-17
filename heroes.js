window.HEROES = {
  0: {
    id: "goethe",
    name: "Иоганн Вольфганг фон Гёте",
    base: "heroes/goethe/base.webp?v=6",
    frames: Array.from({length:16}, (_,i)=>`heroes/goethe/nod_${String(i+1).padStart(2,"0")}.webp?v=6`),
    timing: {
      rest: 1900,
      down: 1800,
      hold: 320,
      up: 2050,
      gap: [14000,19000]
    }
  }
};
