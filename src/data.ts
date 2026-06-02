/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NetflixContent, Episode, Milestone, TriviaQuestion } from "./types";

export const INITIAL_NETFLIX_CONTENT: NetflixContent = {
  title: "Nuestro primer mes",
  releaseDate: "03/05/2026",
  duration: "30 días",
  rating: "+19",
  genres: ["Romance", "Comedia"],
  cast: [
    "Karen Nicolle Nuñez Rodriguez",
    "Joan Sebastian Salgado Rodriguez"
  ],
  description: "Un joven soñador y una chica increíble se cruzan en el momento perfecto del destino. Con risas incontrolables, conversaciones interminables y pequeños gestos que derriten el corazón, descubren que lo que parecía un giro casual de la vida se convertiría en la comedia romántica del año. Protagonizada por su complicidad única, esta temporada de 30 días demuestra de forma divertida y tierna que los mejores capítulos siempre se escriben de a dos.",
  backdropUrl: "/src/assets/images/couple_backdrop_1780371997543.png",
  imageRotation: 0,
  imageScale: 1,
  imagePositionX: 0,
  imagePositionY: 0,
  matchScore: 99
};

export const INITIAL_EPISODES: Episode[] = [
  {
    id: 1,
    title: "El reencuentro",
    duration: "Día 1",
    description: "Dos mundos que estaban separados, se vuelven a encontrar. Un simple chiste de la vida donde dara inicio a charlas inesperedas",
    thumbnail: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop",
    date: "03/08/2025"
  },
  {
    id: 2,
    title: "Desvelos interminables",
    duration: "Día 7",
    description: "Cuando hablar hasta las 3 de la mañana sobre sueños, miedos y tonterías cotidianas se convirtió en el horario estelar y la mejor parte de cada jornada.",
    thumbnail: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop",
    date: "10/08/2025"
  },
  {
    id: 3,
    title: "La primera cita",
    duration: "Día 14",
    description: "Mariposas voraces en el estómago, manos un poco temblorosas y una risa nerviosa al verse en persona. El inicio de nuestro cuento favorito.",
    thumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop",
    date: "28/08/2025"
  },
  {
    id: 4,
    title: "Cómplices del idioma secreto",
    duration: "Día 21",
    description: "Nacen los primeros 'chistes internos', miradas que lo dicen todo en medio de la gente y apodos cariñosos compartidos en voz baja.",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop",
    date: "29/09/2025"
  },
  {
    id: 5,
    title: "¡Feliz primer mes!",
    duration: "Día 30",
    description: "El gran clímax de la temporada. 30 días de risas compartidas, mimos sinceros, aprendizajes mutuos y la firme certeza de que esto es solo el primer capítulo.",
    thumbnail: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop",
    date: "02/06/2026"
  }
];

export const INITIAL_MILESTONES: Milestone[] = [
  {
    id: "m1",
    title: "Conectar al instante",
    date: "03/05/2026",
    description: "Esa maravillosa sensación de conocerse de toda la vida a los pocos minutos de interactuar.",
    completed: true
  },
  {
    id: "m2",
    title: "La primera llamada maratónica",
    date: "Día 5",
    description: "Comenzar una llamada rápida de saludo que se extiende misteriosamente por más de 3 horas.",
    completed: true
  },
  {
    id: "m3",
    title: "Poner nuestra primera foto juntos",
    date: "Día 15",
    description: "Compartir esa hermosa imagen donde ambos salimos radiantes e inmortalizamos nuestra complicidad.",
    completed: true
  },
  {
    id: "m4",
    title: "Crear nuestro propio sticker de WhatsApp",
    date: "Día 20",
    description: "Esa foto tonta de nosotros que se convierte en el sticker más usado en nuestros chats diarios.",
    completed: true
  },
  {
    id: "m5",
    title: "Sobrevivir a la primera comedia juntos",
    date: "Día 25",
    description: "Elegir qué ver en streaming tardando una hora, para luego quedarnos dormidos abrazados a los 10 minutos.",
    completed: true
  },
  {
    id: "m6",
    title: "Celebrar nuestros primeros 30 días",
    date: "02/06/2026",
    description: "Llegar a este maravilloso hito con más amor, risas y ansias de que vengan muchísimos meses más.",
    completed: true
  }
];

export const INITIAL_TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    id: 1,
    q: "¿En qué fecha exacta comenzó esta maravillosa comedia romántica?",
    options: ["03/05/2026", "23/05/2026", "03/04/2026", "02/06/2026"],
    correct: "03/05/2026",
    feedback: "¡Exacto! El 03 de mayo de 2026 comenzó el contador que hoy marca 30 maravillosos días."
  },
  {
    id: 2,
    q: "¿Quién de los dos tiene el papel estelar en hacer reír al otro sin parar?",
    options: ["Karen Nicolle", "Joan Sebastian", "Ambos por igual", "El gato de la casa"],
    correct: "Ambos por igual",
    feedback: "¡Así es! Es una producción codirigida donde las risas son el ingrediente principal."
  },
  {
    id: 3,
    q: "¿Cuál es la duración oficial de esta primera temporada de amor?",
    options: ["30 días", "1 año", "100 horas", "Toda la vida (Secuela en camino)"],
    correct: "30 días",
    feedback: "¡Exactamente! 30 días de pura complicidad, romance y diversión."
  }
];
