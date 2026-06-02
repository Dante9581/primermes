/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { X, Play, Pause, Heart, Sparkles, AlertCircle, Music, Film } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { NetflixContent, Episode, TriviaQuestion } from "../types";

interface InteractivePlayProps {
  onClose: () => void;
  content: NetflixContent;
  episodes: Episode[];
  triviaQuestions: TriviaQuestion[];
}

export default function InteractivePlay({ onClose, content, episodes, triviaQuestions }: InteractivePlayProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeEpisodeIndex, setActiveEpisodeIndex] = useState(0);
  const [triviaScore, setTriviaScore] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"slideshow" | "trivia">("slideshow");

  // Slideshow automatic advance
  useEffect(() => {
    if (!isPlaying || activeTab !== "slideshow") return;

    const interval = setInterval(() => {
      setActiveEpisodeIndex((prev) => (prev + 1) % episodes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, episodes.length, activeTab]);

  const activeEpisode = episodes[activeEpisodeIndex];
  const questions = triviaQuestions && triviaQuestions.length > 0 ? triviaQuestions : [
    {
      id: 1,
      q: "¿En qué fecha exacta comenzó esta maravillosa segunda temporada?",
      options: ["03/05/2025", "23/05/2026", "03/04/2026", "02/06/2026"],
      correct: "03/05/2025",
      feedback: "¡Exacto! El 02 de mayo de 2025 comenzó el contador que hoy marca 10 maravillosos meses."
    }
  ];

  const handleAnswerSelect = (option: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option);
    const isCorrect = option === questions[currentQuestionIndex].correct;
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setTriviaScore(correctCount);
    }
  };

  const restartTrivia = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setCorrectCount(0);
    setTriviaScore(null);
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto flex flex-col items-center justify-start py-8 px-4 font-sans text-white">
      {/* Top Controls */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Film className="w-6 h-6 text-red-600 animate-pulse" />
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-red-600 via-pink-500 to-red-600 bg-clip-text text-transparent">
            NETFLIX SPECIAL PRESENTATION
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition"
          aria-label="Cerrar reproductor"
          id="close_player_btn"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-xl p-1 mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab("slideshow")}
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition cursor-pointer ${
            activeTab === "slideshow" ? "bg-[#E50914] text-white shadow-lg" : "text-neutral-400 hover:text-white"
          }`}
          id="tab_slideshow"
        >
          <Film className="w-4 h-4" />
          Nuestra Temporada
        </button>
        <button
          onClick={() => setActiveTab("trivia")}
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition cursor-pointer ${
            activeTab === "trivia" ? "bg-[#E50914] text-white shadow-lg" : "text-neutral-400 hover:text-white"
          }`}
          id="tab_trivia"
        >
          <Heart className="w-4 h-4" />
          Test de Compatibilidad
        </button>
      </div>

      <div className="w-full max-w-4xl bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden p-6 shadow-2xl relative">
        <AnimatePresence mode="wait">
          {activeTab === "slideshow" && (
            <motion.div
              key="slideshow_panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col gap-6"
            >
              <div className="relative h-[180px] sm:h-[260px] md:h-[320px] lg:h-[360px] w-full rounded-xl overflow-hidden bg-neutral-900 group">
                {/* Background Banner */}
                <div
                  className="absolute inset-0 bg-cover bg-center filter blur-md opacity-25 scale-105"
                  style={{
                    backgroundImage: `url(${
                      activeEpisode.thumbnail.startsWith("http")
                        ? activeEpisode.thumbnail
                        : content.backdropUrl
                    })`,
                  }}
                />

                {/* Primary Content Image */}
                <img
                  src={
                    activeEpisode.thumbnail.startsWith("http")
                      ? activeEpisode.thumbnail
                      : content.backdropUrl
                  }
                  alt={activeEpisode.title}
                  className="absolute inset-0 w-full h-full object-contain z-10"
                  referrerPolicy="no-referrer"
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20 z-20 flex flex-col justify-end p-6 md:p-8" />

                {/* Media Control Overlays */}
                <div className="absolute right-6 top-6 z-30 flex items-center gap-2">
                  <span className="bg-[#E50914]/90 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                    Capítulo {activeEpisode.id}
                  </span>
                  <span className="bg-black/75 text-neutral-300 text-xs font-medium px-2.5 py-1 rounded border border-neutral-700">
                    {activeEpisode.duration}
                  </span>
                </div>
              </div>

              {/* Controls and metadata below */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-900 pb-5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-sans text-neutral-100 flex items-center gap-2">
                    {activeEpisode.title}
                    <Heart className="w-5 h-5 text-[#E50914] fill-[#E50914] animate-pulse inline" />
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-1">{activeEpisode.date} • Dirigido por Karen & Joan</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveEpisodeIndex((prev) => (prev - 1 + episodes.length) % episodes.length)}
                    className="p-3 bg-neutral-900 rounded-full hover:bg-neutral-800 transition text-sm font-semibold cursor-pointer"
                    aria-label="Anterior capítulo"
                    id="prev_chapter_btn"
                  >
                    ◀
                  </button>
                  <button
                    onClick={() => setIsPlaying((p) => !p)}
                    className="flex items-center justify-center gap-2 py-3 px-5 sm:px-6 bg-[#E50914] hover:bg-[#b80710] font-bold rounded-full transition text-xs sm:text-sm shadow-md shadow-[#E50914]/20 cursor-pointer"
                    id="play_pause_btn"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-white animate-pulse" /> Pausar
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" /> Reproducir
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveEpisodeIndex((prev) => (prev + 1) % episodes.length)}
                    className="p-3 bg-neutral-900 rounded-full hover:bg-neutral-800 transition text-sm font-semibold cursor-pointer"
                    aria-label="Siguiente capítulo"
                    id="next_chapter_btn"
                  >
                    ▶
                  </button>
                </div>
              </div>

              <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-4 md:p-5 max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-850">
                <h4 className="text-[10px] uppercase font-black tracking-widest text-[#E50914] mb-1.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-ping" />
                  Sinopsis del Capítulo
                </h4>
                <p className="text-neutral-200 text-xs sm:text-sm leading-relaxed font-sans">{activeEpisode.description}</p>
              </div>

              {/* Mini Indicators */}
              <div className="flex justify-center gap-1.5 mt-2">
                {episodes.map((ep, idx) => (
                  <button
                    key={ep.id}
                    onClick={() => {
                      setActiveEpisodeIndex(idx);
                      setIsPlaying(false);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === activeEpisodeIndex ? "w-8 bg-[#E50914]" : "w-2 bg-neutral-800 hover:bg-neutral-700"
                    }`}
                    aria-label={`Ir al capítulo ${idx + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "trivia" && (
            <motion.div
              key="trivia_panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <Heart className="w-12 h-12 text-pink-500 mx-auto mb-3 animate-bounce" />
                <h3 className="text-2xl font-bold font-sans">¿Qué tanto sabes sobre nosotros?</h3>
                <p className="text-sm text-neutral-400 mt-1">
                  Responde las preguntas para desbloquear tu nivel de compatibilidad romántica de este primer mes.
                </p>
              </div>

              {triviaScore === null ? (
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-6 mt-4">
                  {/* Indicator info */}
                  <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      Pregunta {currentQuestionIndex + 1} de {questions.length}
                    </span>
                    <span className="bg-neutral-800 text-neutral-300 text-xs px-2.5 py-1 rounded">
                      Correctas: {correctCount}
                    </span>
                  </div>

                  {/* Question */}
                  <h4 className="text-lg font-semibold text-neutral-100">{questions[currentQuestionIndex].q}</h4>

                  {/* Options */}
                  <div className="grid grid-cols-1 gap-3">
                    {questions[currentQuestionIndex].options.map((option) => {
                      const isSelected = selectedAnswer === option;
                      const isCorrect = option === questions[currentQuestionIndex].correct;
                      let btnStyle = "bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700";

                      if (selectedAnswer !== null) {
                        if (isCorrect) {
                          btnStyle = "bg-emerald-600 border-emerald-500 text-white";
                        } else if (isSelected) {
                          btnStyle = "bg-rose-600 border-rose-500 text-white";
                        } else {
                          btnStyle = "bg-neutral-900 text-neutral-500 border-neutral-900 opacity-60";
                        }
                      }

                      return (
                        <button
                          key={option}
                          onClick={() => handleAnswerSelect(option)}
                          className={`w-full text-left py-3.5 px-5 rounded-lg border text-sm font-medium transition duration-200 ${btnStyle}`}
                          disabled={selectedAnswer !== null}
                          id={`trivia_option_${option.replace(/\s+/g, "_")}`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback and next button */}
                  {selectedAnswer !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-t border-neutral-800 pt-4 mt-4 space-y-4"
                    >
                      <p className="text-sm leading-relaxed text-neutral-300">
                        {questions[currentQuestionIndex].feedback}
                      </p>
                      <button
                        onClick={handleNextQuestion}
                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
                        id="trivia_next_btn"
                      >
                        {currentQuestionIndex < questions.length - 1 ? "Siguiente Pregunta" : "Ver Resultados"}
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center space-y-6"
                >
                  <div className="inline-block p-4 rounded-full bg-pink-500/10 text-pink-500 mb-3">
                    <Sparkles className="w-12 h-12" />
                  </div>
                  <div>
                    <h4 className="text-3xl font-extrabold text-neutral-100">
                      {triviaScore === questions.length ? "¡100% Amor Incondicional! 💖" : "¡Excelente Sincronía! 💕"}
                    </h4>
                    <p className="text-neutral-400 mt-2 max-w-md mx-auto text-sm md:text-base">
                      Acertaste {triviaScore} de {questions.length} preguntas de compatibilidad.
                    </p>
                  </div>

                  <div className="bg-neutral-950 p-5 rounded-lg border border-neutral-800 text-left space-y-3 font-mono text-xs text-neutral-400 max-w-md mx-auto">
                    <p>🍿 <strong className="text-neutral-200">Director's Note:</strong></p>
                    <p className="leading-relaxed">
                      "Karen y Joan demuestran que la química de la comedia romántica no es suerte, sino el resultado de
                      30 días de conversaciones sinceras, bromas inolvidables y mucha dulzura mutua."
                    </p>
                  </div>

                  <button
                    onClick={restartTrivia}
                    className="py-3 px-8 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-lg transition"
                    id="trivia_retry_btn"
                  >
                    Repetir Test
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
