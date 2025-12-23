
import React from 'react';
import { StoryTheme } from './types';

export const THEMES: { id: StoryTheme; label: string; icon: string; prompt: string }[] = [
  { 
    id: 'noir', 
    label: 'Noir', 
    icon: '🕵️', 
    prompt: 'Uno stile cupo, cinico, tipico dei detective degli anni 40.' 
  },
  { 
    id: 'fantasy', 
    label: 'Fantasy', 
    icon: '🧙‍♂️', 
    prompt: 'Un mondo magico, epico e incantato.' 
  },
  { 
    id: 'fantascienza', 
    label: 'Sci-Fi', 
    icon: '🚀', 
    prompt: 'Ambientazione futuristica, tecnologica o aliena.' 
  },
  { 
    id: 'horror', 
    label: 'Horror', 
    icon: '👻', 
    prompt: 'Atmosfera inquietante, brividi e finale spiazzante.' 
  },
  { 
    id: 'poetico', 
    label: 'Poetico', 
    icon: '✨', 
    prompt: 'Linguaggio lirico, delicato e sognante.' 
  },
  { 
    id: 'ironico', 
    label: 'Ironico', 
    icon: '🎭', 
    prompt: 'Stile divertente, sarcastico e leggero.' 
  },
];

export const SUGGESTIONS = [
  "Un orologio rotto",
  "L'ultima goccia di caffè",
  "Una chiave arrugginita",
  "Un cane che parla",
  "La pioggia di martedì",
  "Un'ombra troppo lunga"
];
