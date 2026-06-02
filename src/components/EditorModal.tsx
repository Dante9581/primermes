/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ChangeEvent } from "react";
import { X, Settings, RotateCw, ZoomIn, Image as ImageIcon, Sparkles, Check, HelpCircle, Film, Award, HelpCircle as QuestionIcon } from "lucide-react";
import { NetflixContent, Episode, Milestone, TriviaQuestion } from "../types";

interface EditorModalProps {
  onClose: () => void;
  content: NetflixContent;
  onChange: (updated: NetflixContent) => void;
  episodes: Episode[];
  onEpisodesChange: (updated: Episode[]) => void;
  milestones: Milestone[];
  onMilestonesChange: (updated: Milestone[]) => void;
  triviaQuestions: TriviaQuestion[];
  onTriviaQuestionsChange: (updated: TriviaQuestion[]) => void;
}

type EditorTab = "hero" | "episodes" | "milestones" | "trivia";

export default function EditorModal({
  onClose,
  content,
  onChange,
  episodes,
  onEpisodesChange,
  milestones,
  onMilestonesChange,
  triviaQuestions,
  onTriviaQuestionsChange
}: EditorModalProps) {
  // Tabs state
  const [activeTab, setActiveTab] = useState<EditorTab>("hero");

  // Hero fields
  const [title, setTitle] = useState(content.title);
  const [releaseDate, setReleaseDate] = useState(content.releaseDate);
  const [duration, setDuration] = useState(content.duration);
  const [rating, setRating] = useState(content.rating);
  const [genresInput, setGenresInput] = useState(content.genres.join(", "));
  const [castInput, setCastInput] = useState(content.cast.join(", "));
  const [description, setDescription] = useState(content.description);
  const [imageRotation, setImageRotation] = useState(content.imageRotation);
  const [imageScale, setImageScale] = useState(content.imageScale);
  const [imageX, setImageX] = useState(content.imagePositionX);
  const [imageY, setImageY] = useState(content.imagePositionY);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(
    content.backdropUrl.includes("couple_backdrop") ? null : content.backdropUrl
  );

  // Sub-items states
  const [localEpisodes, setLocalEpisodes] = useState<Episode[]>(episodes);
  const [localMilestones, setLocalMilestones] = useState<Milestone[]>(milestones);
  const [localTriviaQuestions, setLocalTriviaQuestions] = useState<TriviaQuestion[]>(triviaQuestions);

  // Selector pointers
  const [selectedEpisodeIdx, setSelectedEpisodeIdx] = useState<number>(0);
  const [selectedMilestoneIdx, setSelectedMilestoneIdx] = useState<number>(0);
  const [selectedTriviaIdx, setSelectedTriviaIdx] = useState<number>(0);

  // Helper selectors
  const currentEpisode = localEpisodes[selectedEpisodeIdx] || localEpisodes[0];
  const currentMilestone = localMilestones[selectedMilestoneIdx] || localMilestones[0];
  const currentTrivia = localTriviaQuestions[selectedTriviaIdx] || localTriviaQuestions[0];

  // Updaters for episodes
  const updateEpisodeField = (field: keyof Episode, value: any) => {
    setLocalEpisodes((prev) =>
      prev.map((ep, idx) => (idx === selectedEpisodeIdx ? { ...ep, [field]: value } : ep))
    );
  };

  const handleEpisodeImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          updateEpisodeField("thumbnail", reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Updaters for achievements
  const updateMilestoneField = (field: keyof Milestone, value: any) => {
    setLocalMilestones((prev) =>
      prev.map((mil, idx) => (idx === selectedMilestoneIdx ? { ...mil, [field]: value } : mil))
    );
  };

  // Updaters for compatibility test questions
  const updateTriviaField = (field: keyof TriviaQuestion, value: any) => {
    setLocalTriviaQuestions((prev) =>
      prev.map((q, idx) => (idx === selectedTriviaIdx ? { ...q, [field]: value } : q))
    );
  };

  const updateTriviaOption = (optIdx: number, val: string) => {
    setLocalTriviaQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx !== selectedTriviaIdx) return q;
        const newOptions = [...q.options];
        newOptions[optIdx] = val;
        
        // Ensure that if this edited choice was the correct one, the correct reference stays linked
        const wasCorrect = q.options[optIdx] === q.correct;
        return {
          ...q,
          options: newOptions,
          correct: wasCorrect ? val : q.correct
        };
      })
    );
  };

  // Master Save Coordinator
  const saveChanges = () => {
    // 1. Update cover & general info
    const updatedContent: NetflixContent = {
      ...content,
      title,
      releaseDate,
      duration,
      rating,
      genres: genresInput.split(",").map((s) => s.trim()).filter(Boolean),
      cast: castInput.split(",").map((s) => s.trim()).filter(Boolean),
      description,
      imageRotation,
      imageScale,
      imagePositionX: imageX,
      imagePositionY: imageY,
    };
    onChange(updatedContent);

    // 2. Dispatch episodes
    onEpisodesChange(localEpisodes);

    // 3. Dispatch achievements/milestones
    onMilestonesChange(localMilestones);

    // 4. Dispatch compatibility trivia questions
    onTriviaQuestionsChange(localTriviaQuestions);

    onClose();
  };

  // General image coordinator
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setLocalImageUrl(reader.result);
          onChange({
            ...content,
            backdropUrl: reader.result,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const useDefaultAIImage = () => {
    setLocalImageUrl(null);
    onChange({
      ...content,
      backdropUrl: "/src/assets/images/couple_backdrop_1780371997543.png",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end font-sans text-neutral-100">
      <div className="w-full max-w-lg bg-neutral-900 h-full overflow-y-auto shadow-2xl flex flex-col border-l border-neutral-850">
        
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-red-600 animate-spin-slow" />
            <h2 className="text-lg font-bold tracking-tight">Estudio de Personalización</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-850 transition cursor-pointer"
            aria-label="Cerrar editor"
            id="close_editor_modal_btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Administration Section Tabs */}
        <div className="flex border-b border-neutral-850 bg-neutral-950/20 text-xs font-bold scrollbar-none overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("hero")}
            className={`flex-1 min-w-[80px] text-center py-3.5 border-b-2 transition cursor-pointer ${
              activeTab === "hero" ? "border-red-600 text-white bg-neutral-800/10" : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Portada Hero
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("episodes")}
            className={`flex-1 min-w-[80px] text-center py-3.5 border-b-2 transition cursor-pointer ${
              activeTab === "episodes" ? "border-red-600 text-white bg-neutral-800/10" : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Capítulos ({localEpisodes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("milestones")}
            className={`flex-1 min-w-[80px] text-center py-3.5 border-b-2 transition cursor-pointer ${
              activeTab === "milestones" ? "border-red-600 text-white bg-neutral-800/10" : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Logros ({localMilestones.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("trivia")}
            className={`flex-1 min-w-[80px] text-center py-3.5 border-b-2 transition cursor-pointer ${
              activeTab === "trivia" ? "border-red-600 text-white bg-neutral-800/10" : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Trivia/Quiz
          </button>
        </div>

        {/* Tab configuration panels */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          
          {activeTab === "hero" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Image Control Card */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-red-500" />
                  Foto de Portada Principal
                </h3>

                <div className="p-4 bg-neutral-950/40 border border-neutral-800/60 rounded-xl space-y-4">
                  <p className="text-xs text-neutral-400">
                    Cambia la foto principal de la portada. Puedes rotarla para selfies de teléfonos, ajustar escala y mover los ejes X o Y.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={useDefaultAIImage}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        !localImageUrl
                          ? "bg-red-600/10 text-red-400 border-red-500/50"
                          : "bg-neutral-950 border-neutral-850 text-neutral-300 hover:bg-neutral-900"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Foto por Defecto
                    </button>
                    <label className="py-2 px-3 rounded-lg text-xs font-semibold border bg-neutral-950 border-neutral-850 text-neutral-300 hover:bg-neutral-900 cursor-pointer flex items-center justify-center gap-1.5 transition">
                      <ImageIcon className="w-3.5 h-3.5" />
                      Subir mi Foto
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Positioning Tools */}
                  <div className="pt-2 border-t border-neutral-850 space-y-3.5 text-xs text-neutral-300">
                    <div className="flex justify-between items-center">
                      <span className="font-medium flex items-center gap-1">
                        <RotateCw className="w-3.5 h-3.5 text-neutral-400" />
                        Girar Foto
                      </span>
                      <span className="font-mono text-neutral-500">{imageRotation}°</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const nextRot = (imageRotation + 90) % 360;
                        setImageRotation(nextRot);
                        onChange({ ...content, imageRotation: nextRot });
                      }}
                      className="w-full py-2 bg-neutral-950 hover:bg-neutral-900 rounded-lg font-bold border border-neutral-850 flex items-center justify-center gap-1.5 text-neutral-200 cursor-pointer text-[11px]"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      Girar +90° (Perfecto para selfies)
                    </button>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium flex items-center gap-1">
                          <ZoomIn className="w-3.5 h-3.5 text-neutral-400" />
                          Escalar / Zoom
                        </span>
                        <span className="font-mono text-neutral-450">{imageScale.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="3.0"
                        step="0.05"
                        value={imageScale}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setImageScale(val);
                          onChange({ ...content, imageScale: val });
                        }}
                        className="w-full accent-red-600 bg-neutral-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-neutral-400">Posición X</span>
                          <span className="font-mono text-neutral-500">{imageX}px</span>
                        </div>
                        <input
                          type="range"
                          min="-300"
                          max="300"
                          step="5"
                          value={imageX}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setImageX(val);
                            onChange({ ...content, imagePositionX: val });
                          }}
                          className="w-full accent-red-600 bg-neutral-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-neutral-400">Posición Y</span>
                          <span className="font-mono text-neutral-500">{imageY}px</span>
                        </div>
                        <input
                          type="range"
                          min="-300"
                          max="300"
                          step="5"
                          value={imageY}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setImageY(val);
                            onChange({ ...content, imagePositionY: val });
                          }}
                          className="w-full accent-red-600 bg-neutral-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Title & metadata panel */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  Metadatos Generales del Banner
                </h3>

                <div className="space-y-3.5 bg-neutral-950/40 p-4 rounded-xl border border-neutral-800/60 text-xs">
                  <div className="space-y-1">
                    <label className="text-neutral-400 font-semibold block">Título Principal</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-sm text-neutral-100 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold block">Estreno/Fecha</label>
                      <input
                        type="text"
                        value={releaseDate}
                        onChange={(e) => setReleaseDate(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-sm text-neutral-100 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold block">Duración</label>
                      <input
                        type="text"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-sm text-neutral-100 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold block">Edad / Rating</label>
                      <input
                        type="text"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-sm text-neutral-100 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold block">Géneros</label>
                      <input
                        type="text"
                        value={genresInput}
                        onChange={(e) => setGenresInput(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-sm text-neutral-100 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-400 font-semibold block">Elenco (Separado por comas)</label>
                    <input
                      type="text"
                      value={castInput}
                      onChange={(e) => setCastInput(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-sm text-neutral-100 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-400 font-semibold block">Sinopsis</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-xs text-neutral-100 focus:outline-none focus:border-red-600 resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === "episodes" && (
            <div className="space-y-5 animate-fadeIn">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Film className="w-4 h-4 text-red-500" />
                Edición de Capítulos
              </h3>

              {/* Grid Selector */}
              <div className="grid grid-cols-5 gap-2">
                {localEpisodes.map((ep, idx) => (
                  <button
                    key={ep.id}
                    type="button"
                    onClick={() => setSelectedEpisodeIdx(idx)}
                    className={`py-3.5 px-1 rounded-lg text-center font-bold text-xs transition border cursor-pointer ${
                      selectedEpisodeIdx === idx
                        ? "bg-[#E50914] text-white border-red-500 shadow-md shadow-red-950/20"
                        : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    Cap {ep.id}
                  </button>
                ))}
              </div>

              {/* Editing block for current episode */}
              <div className="p-4 bg-neutral-955/60 rounded-xl border border-neutral-800/80 space-y-4 text-xs">
                <div className="flex items-center gap-2 pb-2.5 border-b border-neutral-800/60">
                  <span className="w-2 h-2 rounded-full bg-[#E50914] animate-ping" />
                  <span className="font-extrabold text-[#E50914] uppercase tracking-wider">
                    Modificando Capítulo {currentEpisode.id} ({currentEpisode.duration})
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-neutral-400 font-semibold block">Título del Capítulo</label>
                    <input
                      type="text"
                      value={currentEpisode.title}
                      onChange={(e) => updateEpisodeField("title", e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-sm text-neutral-100 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold block">Fecha de Estreno</label>
                      <input
                        type="text"
                        value={currentEpisode.date}
                        onChange={(e) => updateEpisodeField("date", e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-sm text-neutral-100 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold block">Duración / Distintivo</label>
                      <input
                        type="text"
                        value={currentEpisode.duration}
                        onChange={(e) => updateEpisodeField("duration", e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-sm text-neutral-100 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  {/* Picture / Thumbnail Edit block */}
                  <div className="space-y-2 pt-2 border-t border-neutral-800/50">
                    <label className="text-neutral-400 font-semibold block">Foto del Capítulo (Miniatura)</label>
                    
                    <div className="flex gap-4 items-center bg-black/30 p-2.5 rounded-lg border border-neutral-800">
                      <img
                        src={currentEpisode.thumbnail}
                        alt="Preview"
                        className="w-20 h-12 object-cover rounded border border-neutral-700 bg-neutral-900 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 space-y-1.5">
                        <label className="py-1.5 px-3 rounded text-[11px] font-bold border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-850 bg-neutral-950 text-neutral-300 cursor-pointer text-center block transition">
                          Subir Archivo de Foto
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleEpisodeImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-500 block">O pega una URL de imagen de internet:</span>
                      <input
                        type="text"
                        value={currentEpisode.thumbnail}
                        onChange={(e) => updateEpisodeField("thumbnail", e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full bg-neutral-950 border border-neutral-850 rounded-lg py-1.5 px-2 text-xs text-neutral-350 focus:outline-none focus:border-red-600 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-neutral-800/50">
                    <label className="text-neutral-400 font-semibold block">Sinopsis / Descripción del Capítulo</label>
                    <textarea
                      value={currentEpisode.description}
                      onChange={(e) => updateEpisodeField("description", e.target.value)}
                      rows={4}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none focus:border-red-600 resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "milestones" && (
            <div className="space-y-5 animate-fadeIn">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-red-500" />
                Edición de Logros / Hitos
              </h3>

              {/* Grid selector buttons */}
              <div className="grid grid-cols-3 gap-2">
                {localMilestones.map((mil, idx) => (
                  <button
                    key={mil.id}
                    type="button"
                    onClick={() => setSelectedMilestoneIdx(idx)}
                    className={`py-3 px-1.5 rounded-lg text-center font-bold text-xs transition border cursor-pointer ${
                      selectedMilestoneIdx === idx
                        ? "bg-[#E50914] text-white border-red-500 shadow-md shadow-red-950/20"
                        : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    Logro {idx + 1}
                  </button>
                ))}
              </div>

              {/* Editing card */}
              <div className="p-4 bg-neutral-955/60 rounded-xl border border-neutral-800/80 space-y-4 text-xs">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/60">
                  <Award className="w-4 h-4 text-pink-500" />
                  <span className="font-extrabold text-[#E50914] uppercase tracking-wider">
                    Modificando Logro {selectedMilestoneIdx + 1}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-neutral-400 font-semibold block">Título del Logro</label>
                    <input
                      type="text"
                      value={currentMilestone.title}
                      onChange={(e) => updateMilestoneField("title", e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-sm text-neutral-100 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-400 font-semibold block">Fecha / Día Estimado</label>
                    <input
                      type="text"
                      value={currentMilestone.date}
                      onChange={(e) => updateMilestoneField("date", e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-sm text-neutral-100 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-400 font-semibold block">Descripción Completa</label>
                    <textarea
                      value={currentMilestone.description}
                      onChange={(e) => updateMilestoneField("description", e.target.value)}
                      rows={4}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 px-3 text-xs text-neutral-100 focus:outline-none focus:border-red-600 resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "trivia" && (
            <div className="space-y-5 animate-fadeIn">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <QuestionIcon className="w-4 h-4 text-red-500" />
                Edición de Test de Compatibilidad
              </h3>

              {/* Indicators */}
              <div className="grid grid-cols-3 gap-2">
                {localTriviaQuestions.map((q, idx) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setSelectedTriviaIdx(idx)}
                    className={`py-3 px-1 rounded-lg text-center font-bold text-xs transition border cursor-pointer ${
                      selectedTriviaIdx === idx
                        ? "bg-[#E50914] text-white border-red-500 shadow-md shadow-red-950/20"
                        : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    Pregunta {idx + 1}
                  </button>
                ))}
              </div>

              {/* Question editing panel */}
              <div className="p-4 bg-neutral-955/60 rounded-xl border border-neutral-800/80 space-y-4 text-xs">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 inline-block animate-pulse" />
                  <span className="font-extrabold text-[#E50914] uppercase tracking-wider">
                    Modificando Pregunta {selectedTriviaIdx + 1}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-neutral-400 font-semibold block">Pregunta del Test</label>
                    <textarea
                      value={currentTrivia.q}
                      onChange={(e) => updateTriviaField("q", e.target.value)}
                      rows={2}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 px-3 text-sm text-neutral-100 focus:outline-none focus:border-red-600 resize-none"
                    />
                  </div>

                  {/* Option arrays */}
                  <div className="space-y-2.5">
                    <span className="font-semibold text-neutral-400 block pb-1 border-b border-neutral-850">
                      Opciones del Examen
                    </span>
                    <div className="grid grid-cols-1 gap-2.5">
                      {currentTrivia.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex gap-2 items-center">
                          <span className="text-[10px] font-bold text-neutral-400 min-w-[20px]">
                            {optIdx + 1}.
                          </span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => updateTriviaOption(optIdx, e.target.value)}
                            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg py-2 px-3 text-xs text-neutral-200 focus:outline-none focus:border-red-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pick Correct Option */}
                  <div className="space-y-1 pt-2 border-t border-neutral-850">
                    <label className="text-neutral-300 font-bold block">Opción Correcta</label>
                    <select
                      value={currentTrivia.correct}
                      onChange={(e) => updateTriviaField("correct", e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-xs text-neutral-100 focus:outline-none focus:border-red-600 cursor-pointer"
                    >
                      {currentTrivia.options.map((opt, idx) => (
                        <option key={idx} value={opt}>
                          Opción {idx + 1}: {opt || "(sin texto)"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Explanation feedback */}
                  <div className="space-y-1">
                    <label className="text-neutral-400 font-semibold block">Comentario / Mensaje al acertar</label>
                    <input
                      type="text"
                      value={currentTrivia.feedback}
                      onChange={(e) => updateTriviaField("feedback", e.target.value)}
                      placeholder="¡Excelente! Estuviste genial..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-xs text-neutral-200 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-neutral-800 bg-neutral-950 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border border-neutral-800 hover:bg-neutral-800 rounded-xl text-xs font-semibold transition cursor-pointer"
            id="editor_cancel_btn"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={saveChanges}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-red-950/30 flex items-center justify-center gap-1.5 cursor-pointer"
            id="editor_save_btn"
          >
            <Check className="w-4 h-4" />
            Guardar Todo
          </button>
        </div>
      </div>
    </div>
  );
}
