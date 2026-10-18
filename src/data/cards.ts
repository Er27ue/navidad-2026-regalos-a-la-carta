export type CategoryId = "iniciales" | "frases" | "santa" | "nacimiento" | "decoracion";

export interface Card {
  id: string;
  name: string;
  category: CategoryId;
  image: string;
  accent?: string;
}

export const categories: { id: CategoryId; label: string; blurb: string; cover: string }[] = [
  { id: "iniciales", label: "Iniciales", blurb: "Letras vestidas de acebo", cover: "/cards/001.jpg" },
  { id: "frases", label: "Frases navideñas", blurb: "Merry Christmas, Ho Ho Ho y más", cover: "/cards/021.jpg" },
  { id: "santa", label: "Santa y amigos", blurb: "Santa, renos, gnomos y ternura", cover: "/cards/020.jpg" },
  { id: "nacimiento", label: "Nacimiento", blurb: "El verdadero sentido", cover: "/cards/032.jpg" },
  { id: "decoracion", label: "Decoración", blurb: "Coronas, lazos, velas y pinos", cover: "/cards/018.jpg" },
];

// [number, name, category] — image lives at /public/cards/NNN.jpg
const raw: [number, string, CategoryId][] = [
  [1, "Inicial P", "iniciales"], [2, "Inicial B", "iniciales"], [3, "Inicial I", "iniciales"],
  [4, "Inicial N", "iniciales"], [5, "Inicial K", "iniciales"], [6, "Inicial T", "iniciales"],
  [7, "Inicial F", "iniciales"], [8, "Inicial Y", "iniciales"], [9, "Inicial M", "iniciales"],
  [10, "Inicial D", "iniciales"], [11, "Inicial H", "iniciales"], [12, "Ho Ho Ho escocés", "frases"],
  [13, "Inicial U", "iniciales"], [14, "Inicial O", "iniciales"], [15, "Ramo con esferas", "decoracion"],
  [16, "Puerta roja", "decoracion"], [17, "Vela de acebo", "decoracion"], [18, "Corona verde", "decoracion"],
  [19, "Pino con lazo", "decoracion"], [20, "Santa clásico", "santa"], [21, "Holly Jolly Merry Happy", "frases"],
  [22, "Warm Winter Wishes", "frases"], [23, "Merry Christmas to you", "frases"], [24, "Puerta de madera", "decoracion"],
  [25, "Petirrojo invernal", "decoracion"], [26, "Pesebre con animales", "nacimiento"], [27, "Ho Ho Ho festivo", "frases"],
  [28, "Farol rojo", "decoracion"], [29, "Rama nevada", "decoracion"], [30, "Lazo escocés", "decoracion"],
  [31, "Guirnalda roja", "decoracion"], [32, "Sagrada Familia", "nacimiento"], [33, "Merry Christmas colorido", "frases"],
  [34, "Ho Ho Ho muñeco", "frases"], [35, "Guirnalda de piñas", "decoracion"], [36, "Santa de pie", "santa"],
  [37, "Lazo marfil", "decoracion"], [38, "Merry Christmas gorro", "frases"], [39, "Merry Christmas acuarela", "frases"],
  [40, "Ho Ho Ho trineo", "frases"], [41, "Puertita navideña", "decoracion"], [42, "Ángel dorado", "nacimiento"],
  [43, "Lazo con esferas", "decoracion"], [44, "Cinta candy", "decoracion"], [45, "Virgen y niño", "nacimiento"],
  [46, "Moño rojo", "decoracion"], [47, "Farol y petirrojo", "decoracion"], [48, "Merry Christmas campanas", "frases"],
  [49, "Regalo a rayas", "decoracion"], [50, "Merry Christmas duende", "frases"], [51, "Cascabeles", "decoracion"],
  [52, "Arbolito en maceta", "decoracion"], [53, "Corona con moño", "decoracion"], [54, "Pino en cesta", "decoracion"],
  [55, "Ho! Ho! Ho!", "frases"], [56, "Traje de Santa", "santa"], [57, "Piñas de pino", "decoracion"],
  [58, "Ho! bastones", "frases"], [59, "María", "nacimiento"], [60, "Jarrón invernal", "decoracion"],
  [61, "Casita roja", "decoracion"], [62, "Reno Merry Christmas", "frases"], [63, "Christmas caligrafía", "frases"],
  [64, "Pino dorado", "decoracion"], [65, "Santa bailarín", "santa"], [66, "Guirnalda con moño", "decoracion"],
  [67, "Merry Christmas arbolitos", "frases"], [68, "Rama de invierno", "decoracion"], [69, "Tronco festivo", "decoracion"],
  [70, "Frascos de eucalipto", "decoracion"], [71, "Love Christmas", "frases"], [72, "Carita de reno", "santa"],
  [73, "Feliz Ho Ho", "santa"], [74, "Ramillete", "decoracion"], [75, "Velas y poinsettia", "decoracion"],
  [76, "Ho Ho Ho Santa", "santa"], [77, "Vela de canela", "decoracion"], [78, "Merry Christmas bloque", "frases"],
  [79, "Angelitos", "nacimiento"], [80, "Guirnalda natural", "decoracion"], [81, "Arbolito de corazones", "decoracion"],
  [82, "Sagrada Familia acuarela", "nacimiento"], [83, "Merry Christmas acebo", "frases"], [84, "Feliz Navidad en auto", "santa"],
  [85, "Renito tierno", "santa"], [86, "Osito navideño", "santa"], [87, "Merry Christmas ilustrado", "frases"],
  [88, "Estrellas colgantes", "decoracion"], [89, "Gnomo en trineo", "santa"], [90, "Gnomo estrella", "santa"],
  [91, "Estrella roja", "decoracion"], [92, "Santa North Pole", "santa"], [93, "Calcetines rojos", "decoracion"],
  [94, "Calcetines tejidos", "decoracion"], [95, "Guirnalda de faroles", "decoracion"], [96, "Gnomo con esfera", "santa"],
  [97, "Gnomo y renos", "santa"], [98, "Duendecita", "santa"], [99, "Angelita", "nacimiento"],
  [100, "Ángel navideño", "nacimiento"], [101, "Patrón de pinos", "decoracion"], [102, "Esferas festivas", "decoracion"],
  [103, "Esferas colgantes", "decoracion"], [104, "Happy Holidays", "frases"],
];

export const cards: Card[] = raw.map(([n, name, category]) => ({
  id: `c${n}`,
  name,
  category,
  image: `/cards/${String(n).padStart(3, "0")}.jpg`,
}));
