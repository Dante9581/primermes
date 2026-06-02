/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from "react";
import {
  Play,
  Plus,
  ThumbsUp,
  VolumeX,
  Volume2,
  Calendar,
  Clock,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Settings,
  Flame,
  ArrowRight,
  Heart,
  Share2,
  Tv,
  Film,
  Camera,
  Layers,
  ChevronRight,
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { NetflixContent, Episode, Milestone, TriviaQuestion } from "./types";
import {
  INITIAL_NETFLIX_CONTENT,
  INITIAL_EPISODES,
  INITIAL_MILESTONES,
  INITIAL_TRIVIA_QUESTIONS
} from "./data";
import InteractivePlay from "./components/InteractivePlay";
import EditorModal from "./components/EditorModal";

export default function App() {
  const [content, setContent] = useState<NetflixContent>(INITIAL_NETFLIX_CONTENT);
  const [episodes, setEpisodes] = useState<Episode[]>(INITIAL_EPISODES);
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);
  const [triviaQuestions, setTriviaQuestions] = useState<TriviaQuestion[]>(INITIAL_TRIVIA_QUESTIONS);
  
  const [isMuted, setIsMuted] = useState(true);
  const [selectedTab, setSelectedTab] = useState<"episodes" | "milestones" | "details">("episodes");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCaptureMode, setIsCaptureMode] = useState(false);
  const [likeRating, setLikeRating] = useState<"none" | "liked" | "double-liked">("none");
  const [addedToList, setAddedToList] = useState(true);

  const captureAreaRef = useRef<HTMLDivElement>(null);

  // Toggle checklist milestones
  const toggleMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  // Percent of milestones completed
  const completedMilestonesCount = milestones.filter((m) => m.completed).length;
  const milestonesPercent = Math.round((completedMilestonesCount / milestones.length) * 100);

  // Quick reset to default content
  const handleReset = () => {
    if (confirm("¿Estás seguro de que deseas restablecer todos los valores predeterminados?")) {
      setContent(INITIAL_NETFLIX_CONTENT);
      setEpisodes(INITIAL_EPISODES);
      setMilestones(INITIAL_MILESTONES);
      setTriviaQuestions(INITIAL_TRIVIA_QUESTIONS);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] font-sans text-neutral-200 antialiased selection:bg-[#E50914] selection:text-white pb-16">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#141414]/90 backdrop-blur-md border-b border-zinc-800/40 px-4 md:px-8 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3">
            {/* Custom stylized Netflix style logo */}
            <span 
              className="text-2xl md:text-3xl font-black tracking-tighter text-[#E50914] font-display uppercase animate-pulse cursor-pointer select-none"
              onClick={() => setIsCaptureMode(false)}
            >
              NUESTRASFLIX
            </span>
            <div className="hidden sm:flex items-center gap-6 ml-8 text-xs font-semibold text-neutral-400">
              <span className="text-white hover:text-white cursor-pointer transition">Inicio</span>
              <span className="hover:text-white cursor-pointer transition">Series</span>
              <span className="hover:text-white cursor-pointer transition">Comedias Románticas</span>
              <span className="hover:text-white cursor-pointer transition">Mi Lista (Activa)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {!isCaptureMode && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 py-1.5 px-3 bg-zinc-900/60 hover:bg-zinc-800 text-xs font-semibold text-neutral-200 rounded-lg border border-zinc-800/80 transition cursor-pointer"
                  id="open_editor_top_btn"
                >
                  <Settings className="w-3.5 h-3.5 text-neutral-400 animate-spin-slow" />
                  Personalizar
                </button>

                <button
                  onClick={() => setIsCaptureMode(true)}
                  className="flex items-center gap-1.5 py-1.5 px-3 bg-[#E50914] hover:bg-[#b80710] text-xs font-bold text-white rounded-lg transition shadow-md shadow-[#E50914]/20 cursor-pointer"
                  id="capture_mode_top_btn"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Modo Captura
                </button>
              </>
            )}

            {isCaptureMode && (
              <button
                onClick={() => setIsCaptureMode(false)}
                className="py-1.5 px-3.5 bg-neutral-100 hover:bg-white text-zinc-950 text-xs font-extrabold rounded-lg transition flex items-center gap-1.5"
                id="exit_capture_mode_btn"
              >
                Volver a Controles
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-5xl mx-auto px-4 pt-4 md:pt-8">
        
        {/* Banner Announcement when in capture mode */}
        <AnimatePresence>
          {isCaptureMode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-red-900/20 border border-red-900/30 rounded-xl p-4 mb-6 text-sm text-red-200 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <Camera className="w-5 h-5 shrink-0 animate-bounce" />
                <p>
                  <strong>Modo Captura Activado:</strong> Se han ocultado todos los controles del sistema para que puedas tomar una captura de pantalla perfecta de tu tarjeta personalizada de Netflix. ¡Listo para compartir en redes!
                </p>
              </div>
              <button
                onClick={() => setIsCaptureMode(false)}
                className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-lg transition"
              >
                Salir
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Netflix Informational Container Block (Immersive UI Style) */}
        <div 
          ref={captureAreaRef}
          id="netflix_display_card"
          className="bg-[#181818] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative shadow-black/90"
        >
          {/* Backdrop Image Screen Hero */}
          <div className="relative aspect-[16/9] w-full bg-[#141414] overflow-hidden select-none">
            
            {/* The Background Photo Container */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-full h-full bg-cover bg-center transition-all duration-300"
                style={{
                  backgroundImage: `url(${content.backdropUrl})`,
                  transform: `
                    scale(${content.imageScale}) 
                    rotate(${content.imageRotation}deg) 
                    translate(${content.imagePositionX}px, ${content.imagePositionY}px)
                  `,
                }}
              />
            </div>

            {/* Immersive UI Composition Gradients */}
            <div 
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(20,20,20,0.95) 15%, rgba(20,20,20,0.6) 50%, rgba(20,20,20,0) 85%),
                  radial-gradient(circle at 75% 50%, rgba(229, 9, 20, 0.15) 0%, transparent 60%),
                  linear-gradient(to top, rgba(20,20,20,1) 5%, rgba(20,20,20,0) 35%)
                `,
              }}
            />

            {/* Immersive UI Backlight Glow (Couple Silhouette Accent Indicator) */}
            <div className="absolute right-[12%] top-[12%] w-[250px] h-[250px] md:w-[480px] md:h-[480px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none z-10 animate-pulse duration-5000" />

            {/* Back Arrow or close mockup symbol for aesthetics */}
            <div className="absolute top-4 md:top-6 left-4 md:left-6 z-20 flex items-center gap-2">
              <span className="bg-[#141414]/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] md:text-xs font-bold text-[#46d369] tracking-wider flex items-center gap-1 border border-zinc-800/40 shadow">
                ⭐ {content.matchScore}% de coincidencia
              </span>
            </div>

            {/* Custom Logo Text and Action Controls */}
            <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 right-4 md:right-8 z-20">
              
              {/* Type Category */}
              <div className="flex items-center gap-1.5 mb-1 md:mb-2 text-[10px] md:text-xs font-black text-[#E50914] uppercase tracking-widest">
                <Tv className="w-3.5 h-3.5 fill-[#E50914] stroke-[#E50914]" />
                Un original de Nuestrasflix
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-none text-white mb-3 md:mb-5 drop-shadow-2xl font-sans uppercase">
                {content.title}
              </h1>

              {/* Action buttons (Netflix-Inspired Immersive UI Aesthetics) */}
              <div className="flex flex-wrap items-center gap-3.5 mt-3">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="bg-white text-black px-6 md:px-8 py-2.5 md:py-3 rounded-lg flex items-center gap-2.5 font-bold text-sm md:text-lg hover:bg-opacity-80 transition cursor-pointer active:scale-95 shadow-md shadow-black/40"
                  id="playback_play_btn"
                >
                  <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                  Reproducir
                </button>

                {!isCaptureMode && (
                  <>
                    <button
                      onClick={() => setAddedToList(!addedToList)}
                      className={`bg-zinc-700/60 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-lg flex items-center gap-2 font-bold text-xs md:text-sm hover:bg-zinc-600/80 transition cursor-pointer relative group ${
                        addedToList ? "text-[#E50914] bg-zinc-850 border border-[#E50914]/20" : ""
                      }`}
                      id="toggle_mylist_btn"
                    >
                      <Plus className={`w-4 h-4 transition-transform ${addedToList ? "rotate-45 text-[#E50914]" : ""}`} />
                      {addedToList ? "En mi lista" : "Mi lista"}
                    </button>

                    <button
                      onClick={() => {
                        if (likeRating === "liked") setLikeRating("double-liked");
                        else if (likeRating === "double-liked") setLikeRating("none");
                        else setLikeRating("liked");
                      }}
                      className={`p-3 rounded-lg border text-xs md:text-sm transition-all cursor-pointer ${
                        likeRating !== "none"
                          ? "bg-red-950/20 border-[#E50914] text-[#E50914]"
                          : "bg-zinc-800/80 border-neutral-700 text-white hover:bg-zinc-700/80"
                      }`}
                      id="toggle_like_btn"
                    >
                      <ThumbsUp className={`w-4 h-4 ${likeRating === "double-liked" ? "scale-110 text-pink-500 fill-pink-500" : likeRating === "liked" ? "fill-[#E50914] text-[#E50914]" : ""}`} />
                    </button>
                  </>
                )}

                {/* Rightmost Volume Icon style indicator */}
                <div className="ml-auto">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-3 rounded-lg bg-[#141414]/60 border border-zinc-800 text-neutral-300 hover:text-white transition cursor-pointer"
                    id="toggle_mute_btn"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#E50914] animate-pulse" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Header Metadata and Description Column Details (Immersive UI Style) */}
          <div className="p-6 md:p-8 bg-gradient-to-b from-[#181818] to-[#141414] font-sans border-t border-zinc-850">
            
            {/* Grid structure splitting description and Cast sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start border-b border-zinc-800/80 pb-8">
              
              {/* Left 2 Cols: Sinopsis and Quick stats */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-bold select-none">
                  {/* Match score */}
                  <span className="text-[#46d369]">{content.matchScore}% para ti</span>
                  
                  {/* Release date */}
                  <span className="text-neutral-400">{content.releaseDate}</span>

                  {/* Rating Badge */}
                  <span className="border border-neutral-500/60 px-2 py-0.5 text-xs text-neutral-300 font-semibold rounded-sm">
                    {content.rating}
                  </span>

                  {/* Movie Duration */}
                  <span className="text-neutral-300 font-semibold">{content.duration}</span>

                  {/* Quality Badges */}
                  <span className="border border-neutral-500/60 px-1.5 py-0.5 text-[10px] rounded-sm text-neutral-450 font-bold uppercase tracking-wider scale-90">
                    4K Ultra HD
                  </span>
                </div>

                {/* SINOPSIS DESCRIPTION */}
                <p className="text-sm md:text-base text-neutral-200 leading-relaxed font-normal drop-shadow-sm">
                  {content.description}
                </p>

                {/* Little Romantic Quote Indicator (Immersive UI Accent) */}
                <div className="bg-[#E50914]/5 border-l-4 border-[#E50914] p-4 rounded-r-xl text-neutral-300 text-xs md:text-sm italic leading-relaxed">
                  "Karen Nicolle Nuñez Rodriguez y Joan Sebastian Salgado Rodriguez codirigen este éxito de taquilla diaria, demostrando que 30 días bastan para iniciar la mejor historia jamás contada."
                </div>
              </div>

              {/* Right column: Cast, Genres, Attributes */}
              <div className="text-xs md:text-sm space-y-3.5 text-neutral-450 border-t lg:border-t-0 border-zinc-800/80 pt-6 lg:pt-0">
                <div>
                  <span className="text-zinc-500 font-semibold">Reparto: </span>
                  <span className="text-neutral-300">
                    {content.cast.map((actor, actorIdx) => (
                      <span key={actor} className="hover:underline hover:text-white cursor-pointer transition">
                        {actor}
                        {actorIdx < content.cast.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </span>
                </div>

                <div>
                  <span className="text-zinc-500 font-semibold">Géneros: </span>
                  <span className="text-neutral-300 uppercase tracking-wider text-xs">
                    {content.genres.map((g, gIdx) => (
                      <span key={g} className="hover:underline hover:text-white cursor-pointer transition">
                        {g}
                        {gIdx < content.genres.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </span>
                </div>

                <div>
                  <span className="text-zinc-500 font-semibold">Este título es: </span>
                  <span className="text-neutral-350">Romántico, Apasionado, Memorable, Lleno de risas</span>
                </div>

                <div>
                  <span className="text-zinc-500 font-semibold">Estado actual: </span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-950/20 px-2.5 py-0.5 rounded-full border border-emerald-900/50 text-xs font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" /> Completando la Temp. 1
                  </span>
                </div>
              </div>
            </div>

            {/* In-app Navigation / Info Tabs (Omitted completely or simplified in capture mode for cleanliness) */}
            <div className="mt-8">
              
              {/* Tab Toggles */}
              <div className="flex border-b border-zinc-800 text-xs md:text-sm font-bold uppercase tracking-wider text-neutral-400 mb-6 gap-6 md:gap-8 overflow-x-auto pb-1 scrollbar-none select-none">
                <button
                  onClick={() => setSelectedTab("episodes")}
                  className={`pb-3 border-b-2 px-1 transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    selectedTab === "episodes" ? "border-[#E50914] text-white" : "border-transparent hover:text-white"
                  }`}
                  id="tab_select_episodes"
                >
                  <Tv className="w-4 h-4" />
                  Episodios ({episodes.length})
                </button>
                <button
                  onClick={() => setSelectedTab("milestones")}
                  className={`pb-3 border-b-2 px-1 transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    selectedTab === "milestones" ? "border-[#E50914] text-white" : "border-transparent hover:text-white"
                  }`}
                  id="tab_select_milestones"
                >
                  <Flame className="w-4 h-4" />
                  Nuestros Logros ({milestonesPercent}%)
                </button>
                <button
                  onClick={() => setSelectedTab("details")}
                  className={`pb-3 border-b-2 px-1 transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    selectedTab === "details" ? "border-[#E50914] text-white" : "border-transparent hover:text-white"
                  }`}
                  id="tab_select_details"
                >
                  <UserCheck className="w-4 h-4" />
                  Información Técnica
                </button>
              </div>

              {/* Tab Display Panel */}
              <div>
                
                {selectedTab === "episodes" && (
                  <div className="space-y-6">
                    <p className="text-xs text-neutral-400">
                      Disfruta de la cronología de nuestra historia. Una recopilación exclusiva de nuestros momentos icónicos desde el primer día:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {episodes.map((ep) => (
                        <div
                          key={ep.id}
                          className="bg-[#1f1f1f]/50 border border-zinc-800/80 rounded-xl overflow-hidden group hover:border-[#E50914]/30 hover:bg-[#1f1f1f]/80 transition-all duration-300"
                        >
                          <div className="relative aspect-video bg-[#141414]">
                            <img
                              src={ep.thumbnail}
                              alt={ep.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute right-3 bottom-3 bg-black/85 text-[10px] font-bold px-2 py-0.5 rounded border border-neutral-850 text-neutral-300">
                              {ep.duration}
                            </div>
                            <div className="absolute left-3 top-3 bg-[#E50914] text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow shadow-black">
                              Cap. {ep.id}
                            </div>
                          </div>
                          
                          <div className="p-4 space-y-1.5">
                            <div className="flex justify-between items-center gap-2">
                              <h4 className="text-sm font-bold text-neutral-200 group-hover:text-white transition line-clamp-1">
                                {ep.title}
                              </h4>
                              <span className="text-[10px] text-zinc-500 font-mono shrink-0">{ep.date}</span>
                            </div>
                            <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2 font-sans">
                              {ep.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTab === "milestones" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#181818] p-5 rounded-xl border border-zinc-800">
                      <div>
                        <h4 className="text-base font-bold text-neutral-200">
                          Hitos acumulados en estos {content.duration}
                        </h4>
                        <p className="text-xs text-neutral-400 mt-1 font-sans">
                          Celebramos cada pequeño paso y sonrisa cosechada en este primer mes juntos.
                        </p>
                      </div>

                      {/* Percent Slider visual */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="w-32 bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-850">
                          <div
                            className="bg-gradient-to-r from-[#E50914] to-rose-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${milestonesPercent}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold font-mono text-red-500">
                          {milestonesPercent}% Completado
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          onClick={() => !isCaptureMode && toggleMilestone(milestone.id)}
                          className={`p-4 rounded-xl border text-left transition ${
                            isCaptureMode ? "" : "cursor-pointer"
                          } ${
                            milestone.completed
                              ? "bg-[#E50914]/5 border-[#E50914]/30 text-white"
                              : "bg-[#1f1f1f]/50 border-zinc-800/80 text-neutral-400 hover:border-zinc-700 hover:bg-[#1f1f1f]/80"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={milestone.completed}
                              readOnly
                              disabled={isCaptureMode}
                              className="mt-1 accent-[#E50914] cursor-pointer h-4 w-4 shrink-0"
                            />
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <h5 className={`text-sm font-bold ${milestone.completed ? "text-neutral-200" : "text-neutral-400"}`}>
                                  {milestone.title}
                                </h5>
                                <span className="text-[10px] font-mono text-neutral-500">{milestone.date}</span>
                              </div>
                              <p className="text-xs text-neutral-400 leading-relaxed">
                                {milestone.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTab === "details" && (
                  <div className="space-y-6 max-w-2xl">
                    <div className="bg-[#181818] border border-zinc-800 rounded-xl p-5 space-y-4">
                      <h4 className="text-sm font-bold text-neutral-200 flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-[#E50914]" />
                        Ficha Técnica Oficial del Elenco
                      </h4>

                      <div className="divide-y divide-zinc-800/65 text-xs">
                        <div className="py-3 flex justify-between">
                          <span className="text-zinc-500 font-medium">Nombre de la Actriz Principal:</span>
                          <span className="text-neutral-100 font-semibold">{content.cast[0]}</span>
                        </div>
                        <div className="py-3 flex justify-between">
                          <span className="text-zinc-500 font-medium">Nombre del Actor Principal:</span>
                          <span className="text-neutral-100 font-semibold">{content.cast[1]}</span>
                        </div>
                        <div className="py-3 flex justify-between">
                          <span className="text-zinc-500 font-medium">Fecha de Estreno Original:</span>
                          <span className="text-neutral-100 font-semibold">{content.releaseDate}</span>
                        </div>
                        <div className="py-3 flex justify-between">
                          <span className="text-zinc-500 font-medium">Presupuesto de Producción:</span>
                          <span className="text-emerald-400 font-semibold">Conversaciones sin fin & Abrazos tiernos</span>
                        </div>
                        <div className="py-3 flex justify-between">
                          <span className="text-zinc-500 font-medium">Productores Ejecutivos:</span>
                          <span className="text-neutral-100 font-semibold">El Destino & El Cariño Mutuo</span>
                        </div>
                      </div>
                    </div>

                    {!isCaptureMode && (
                      <button
                        onClick={handleReset}
                        className="py-2.5 px-4 bg-zinc-900 hover:bg-red-950/20 border border-zinc-800 hover:border-red-900/30 text-xs font-semibold rounded-lg text-neutral-400 hover:text-red-400 transition"
                        id="reset_content_btn"
                      >
                        Restablecer a Valores del Estreno
                      </button>
                    )}
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Editor sidebar overlay modal drawer */}
      <AnimatePresence>
        {isEditing && (
          <EditorModal
            content={content}
            onChange={(updated) => setContent(updated)}
            episodes={episodes}
            onEpisodesChange={(updatedEps) => setEpisodes(updatedEps)}
            milestones={milestones}
            onMilestonesChange={(updatedMiles) => setMilestones(updatedMiles)}
            triviaQuestions={triviaQuestions}
            onTriviaQuestionsChange={(updatedTrivia) => setTriviaQuestions(updatedTrivia)}
            onClose={() => setIsEditing(false)}
          />
        )}
      </AnimatePresence>

      {/* Interactive cinema / slideshow playback overlay */}
      <AnimatePresence>
        {isPlaying && (
          <InteractivePlay
            content={content}
            episodes={episodes}
            triviaQuestions={triviaQuestions}
            onClose={() => setIsPlaying(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
