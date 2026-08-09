/**
 * Static asana registry — explicitly imports all pose config JSON files.
 *
 * WHY THIS EXISTS:
 * The previous approach used Node.js fs.readdirSync/fs.readFileSync to read
 * public/asanas/ at runtime. This works locally but FAILS on Vercel because
 * dynamic filesystem reads are not statically traceable by the bundler —
 * so the JSON files are not included in the serverless function package.
 *
 * By using explicit static imports, Next.js can trace every file at build time
 * and bundle them correctly for all deployment platforms including Vercel.
 *
 * To add a new pose: add its folder under public/asanas/ AND add an import here.
 */

import tadasana from '../../public/asanas/tadasana/config.json';
import balasana from '../../public/asanas/balasana/config.json';
import bhujangasana from '../../public/asanas/bhujangasana/config.json';
import catCowFlow from '../../public/asanas/cat-cow-flow/config.json';
import suryaNamaskar from '../../public/asanas/surya-namaskar/config.json';
import trikonasana from '../../public/asanas/trikonasana/config.json';
import utkatasana from '../../public/asanas/utkatasana/config.json';
import virabhadrasanaII from '../../public/asanas/virabhadrasana-ii/config.json';
import vrikshasana from '../../public/asanas/vrikshasana/config.json';
import adhoMukhaSvanasana from '../../public/asanas/adho-mukha-svanasana/config.json';
import savasana from '../../public/asanas/savasana/config.json';
import virasana from '../../public/asanas/virasana/config.json';
import baddhaKonasana from '../../public/asanas/baddha-konasana/config.json';
import setuBandhasana from '../../public/asanas/setu-bandhasana/config.json';
import paschimottanasana from '../../public/asanas/paschimottanasana/config.json';
import virabhadrasana1 from '../../public/asanas/virabhadrasana-1/config.json';

/** All asanas in display order */
export const ALL_ASANAS = [
  tadasana,
  balasana,
  bhujangasana,
  catCowFlow,
  vrikshasana,
  adhoMukhaSvanasana,
  savasana,
  virasana,
  baddhaKonasana,
  setuBandhasana,
  paschimottanasana,
  suryaNamaskar,
  utkatasana,
  trikonasana,
  virabhadrasanaII,
  virabhadrasana1,
];

/**
 * Look up a single asana by its id field (matches the folder name).
 * @param {string} id
 * @returns {object|null}
 */
export function getAsanaById(id) {
  return ALL_ASANAS.find((a) => a.id === id) ?? null;
}

/**
 * Return every asana (used by the home page listing).
 * @returns {object[]}
 */
export function getAllAsanas() {
  return ALL_ASANAS;
}
