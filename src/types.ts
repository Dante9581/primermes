/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Episode {
  id: number;
  title: string;
  duration: string;
  description: string;
  thumbnail: string;
  date: string;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  description: string;
  completed: boolean;
}

export interface TriviaQuestion {
  id: number;
  q: string;
  options: string[];
  correct: string;
  feedback: string;
}

export interface NetflixContent {
  title: string;
  releaseDate: string;
  duration: string;
  rating: string;
  genres: string[];
  cast: string[];
  description: string;
  backdropUrl: string;
  imageRotation: number;
  imageScale: number;
  imagePositionX: number;
  imagePositionY: number;
  matchScore: number;
}
