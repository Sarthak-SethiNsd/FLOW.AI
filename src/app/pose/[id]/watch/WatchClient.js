'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Chatbot from '@/components/Chatbot';
import { ChevronRight, ChevronLeft, ArrowLeft, Volume2, RotateCcw, Play, Square } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
//  JOINT KEYS — used for interpolation
// ═══════════════════════════════════════════════════════════════════════════════
const JOINT_KEYS = [
  'head','shoulder_L','shoulder_R','elbow_L','elbow_R',
  'wrist_L','wrist_R','hip_L','hip_R','knee_L','knee_R',
  'ankle_L','ankle_R','mid_spine',
];

// ═══════════════════════════════════════════════════════════════════════════════
//  ASANA SKELETON DATA
// ═══════════════════════════════════════════════════════════════════════════════
const ASANA_GUIDE_DATA = {

  tadasana: {
    label: 'ताड़ासन · TADASANA · Mountain Pose',
    viewBox: '0 0 400 560',
    matY: 510,
    viewType: 'front',
    steps: [
      // 1 - Relaxed stand: arms hang straight at sides
      { head:{x:200,y:74}, shoulder_L:{x:152,y:140}, shoulder_R:{x:248,y:140},
        elbow_L:{x:150,y:202}, elbow_R:{x:250,y:202},
        wrist_L:{x:148,y:266}, wrist_R:{x:252,y:266},
        hip_L:{x:170,y:292}, hip_R:{x:230,y:292},
        knee_L:{x:168,y:394}, knee_R:{x:232,y:394},
        ankle_L:{x:166,y:502}, ankle_R:{x:234,y:502},
        mid_spine:{x:200,y:218}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.06} },
      // 2 - Press feet: body slightly taller, legs more engaged
      { head:{x:200,y:70}, shoulder_L:{x:150,y:136}, shoulder_R:{x:250,y:136},
        elbow_L:{x:148,y:198}, elbow_R:{x:252,y:198},
        wrist_L:{x:146,y:262}, wrist_R:{x:254,y:262},
        hip_L:{x:170,y:288}, hip_R:{x:230,y:288},
        knee_L:{x:168,y:388}, knee_R:{x:232,y:388},
        ankle_L:{x:168,y:502}, ankle_R:{x:232,y:502},
        mid_spine:{x:200,y:214}, isHoldStep:false, altShift:{tx:0,ty:6,scale:1.07} },
      // 3 - Roll shoulders back: shoulder nodes widen, chest opens
      { head:{x:200,y:64}, shoulder_L:{x:140,y:128}, shoulder_R:{x:260,y:128},
        elbow_L:{x:144,y:190}, elbow_R:{x:256,y:190},
        wrist_L:{x:148,y:254}, wrist_R:{x:252,y:254},
        hip_L:{x:170,y:284}, hip_R:{x:230,y:284},
        knee_L:{x:168,y:384}, knee_R:{x:232,y:384},
        ankle_L:{x:168,y:502}, ankle_R:{x:232,y:502},
        mid_spine:{x:200,y:206}, isHoldStep:false, altShift:{tx:-10,ty:0,scale:1.08} },
      // 4 - Crown rises: head noticeably higher, full spine elongated
      { head:{x:200,y:46}, shoulder_L:{x:138,y:116}, shoulder_R:{x:262,y:116},
        elbow_L:{x:142,y:178}, elbow_R:{x:258,y:178},
        wrist_L:{x:146,y:242}, wrist_R:{x:254,y:242},
        hip_L:{x:170,y:276}, hip_R:{x:230,y:276},
        knee_L:{x:168,y:376}, knee_R:{x:232,y:376},
        ankle_L:{x:168,y:502}, ankle_R:{x:232,y:502},
        mid_spine:{x:200,y:196}, isHoldStep:true, altShift:{tx:-14,ty:0,scale:1.1} },
      // 5 - HOLD Mountain Pose
      { head:{x:200,y:46}, shoulder_L:{x:138,y:116}, shoulder_R:{x:262,y:116},
        elbow_L:{x:142,y:178}, elbow_R:{x:258,y:178},
        wrist_L:{x:146,y:242}, wrist_R:{x:254,y:242},
        hip_L:{x:170,y:276}, hip_R:{x:230,y:276},
        knee_L:{x:168,y:376}, knee_R:{x:232,y:376},
        ankle_L:{x:168,y:502}, ankle_R:{x:232,y:502},
        mid_spine:{x:200,y:196}, isHoldStep:true, altShift:{tx:22,ty:-10,scale:1.12} },
      // 6 - Release: return to step 1 relaxed
      { head:{x:200,y:74}, shoulder_L:{x:152,y:140}, shoulder_R:{x:248,y:140},
        elbow_L:{x:150,y:202}, elbow_R:{x:250,y:202},
        wrist_L:{x:148,y:266}, wrist_R:{x:252,y:266},
        hip_L:{x:170,y:292}, hip_R:{x:230,y:292},
        knee_L:{x:168,y:394}, knee_R:{x:232,y:394},
        ankle_L:{x:166,y:502}, ankle_R:{x:234,y:502},
        mid_spine:{x:200,y:218}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.06} },
    ],
  },

  balasana: {
    label: "बालासन · BALASANA · Child's Pose",
    viewBox: '0 0 560 380',
    matY: 355,
    viewType: 'side',
    steps: [
      // 1 - Kneeling upright on heels, arms beside body
      { head:{x:168,y:92}, shoulder_L:{x:178,y:150}, shoulder_R:{x:194,y:156},
        elbow_L:{x:182,y:212}, elbow_R:{x:198,y:218},
        wrist_L:{x:184,y:272}, wrist_R:{x:200,y:278},
        hip_L:{x:232,y:302}, hip_R:{x:248,y:308},
        knee_L:{x:182,y:355}, knee_R:{x:198,y:355},
        ankle_L:{x:288,y:355}, ankle_R:{x:304,y:355},
        mid_spine:{x:206,y:228}, isHoldStep:false, altShift:{tx:20,ty:0,scale:1.06} },
      // 2 - Arms sweep overhead
      { head:{x:168,y:92}, shoulder_L:{x:178,y:150}, shoulder_R:{x:194,y:156},
        elbow_L:{x:168,y:86}, elbow_R:{x:184,y:92},
        wrist_L:{x:166,y:48}, wrist_R:{x:182,y:54},
        hip_L:{x:232,y:302}, hip_R:{x:248,y:308},
        knee_L:{x:182,y:355}, knee_R:{x:198,y:355},
        ankle_L:{x:288,y:355}, ankle_R:{x:304,y:355},
        mid_spine:{x:206,y:228}, isHoldStep:false, altShift:{tx:-18,ty:0,scale:1.1} },
      // 3 - Hinge forward: torso lowering toward knees
      { head:{x:118,y:172}, shoulder_L:{x:148,y:188}, shoulder_R:{x:164,y:194},
        elbow_L:{x:92,y:202}, elbow_R:{x:108,y:208},
        wrist_L:{x:50,y:216}, wrist_R:{x:66,y:222},
        hip_L:{x:246,y:290}, hip_R:{x:262,y:296},
        knee_L:{x:190,y:355}, knee_R:{x:206,y:355},
        ankle_L:{x:292,y:355}, ankle_R:{x:308,y:355},
        mid_spine:{x:196,y:238}, isHoldStep:false, altShift:{tx:-20,ty:8,scale:1.08} },
      // 4 - Forehead on mat, arms stretched long in front
      { head:{x:48,y:352}, shoulder_L:{x:106,y:324}, shoulder_R:{x:122,y:330},
        elbow_L:{x:48,y:355}, elbow_R:{x:64,y:355},
        wrist_L:{x:16,y:355}, wrist_R:{x:32,y:355},
        hip_L:{x:308,y:264}, hip_R:{x:324,y:270},
        knee_L:{x:246,y:355}, knee_R:{x:262,y:355},
        ankle_L:{x:340,y:355}, ankle_R:{x:356,y:355},
        mid_spine:{x:208,y:314}, isHoldStep:false, altShift:{tx:0,ty:-16,scale:1.07} },
      // 5 - HOLD Child's Pose
      { head:{x:46,y:352}, shoulder_L:{x:104,y:322}, shoulder_R:{x:120,y:328},
        elbow_L:{x:46,y:355}, elbow_R:{x:62,y:355},
        wrist_L:{x:14,y:355}, wrist_R:{x:30,y:355},
        hip_L:{x:306,y:262}, hip_R:{x:322,y:268},
        knee_L:{x:244,y:355}, knee_R:{x:260,y:355},
        ankle_L:{x:338,y:355}, ankle_R:{x:354,y:355},
        mid_spine:{x:206,y:312}, isHoldStep:true, altShift:{tx:26,ty:-10,scale:1.12} },
      // 6 - Rise back to kneeling
      { head:{x:168,y:92}, shoulder_L:{x:178,y:150}, shoulder_R:{x:194,y:156},
        elbow_L:{x:182,y:212}, elbow_R:{x:198,y:218},
        wrist_L:{x:184,y:272}, wrist_R:{x:200,y:278},
        hip_L:{x:232,y:302}, hip_R:{x:248,y:308},
        knee_L:{x:182,y:355}, knee_R:{x:198,y:355},
        ankle_L:{x:288,y:355}, ankle_R:{x:304,y:355},
        mid_spine:{x:206,y:228}, isHoldStep:false, altShift:{tx:20,ty:0,scale:1.06} },
    ],
  },

  vrikshasana: {
    label: 'वृक्षासन · VRIKSHASANA · Tree Pose',
    viewBox: '0 0 400 560',
    matY: 510,
    viewType: 'front',
    steps: [
      // 1 - Stand tall, feet together, arms at sides
      { head:{x:200,y:68}, shoulder_L:{x:154,y:130}, shoulder_R:{x:246,y:130},
        elbow_L:{x:152,y:194}, elbow_R:{x:248,y:194},
        wrist_L:{x:150,y:260}, wrist_R:{x:250,y:260},
        hip_L:{x:172,y:286}, hip_R:{x:228,y:286},
        knee_L:{x:170,y:388}, knee_R:{x:230,y:388},
        ankle_L:{x:192,y:502}, ankle_R:{x:208,y:502},
        mid_spine:{x:200,y:208}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.05} },
      // 2 - Shift weight left, right heel slightly lifts
      { head:{x:198,y:68}, shoulder_L:{x:152,y:130}, shoulder_R:{x:244,y:130},
        elbow_L:{x:150,y:194}, elbow_R:{x:246,y:194},
        wrist_L:{x:148,y:260}, wrist_R:{x:248,y:260},
        hip_L:{x:170,y:286}, hip_R:{x:226,y:286},
        knee_L:{x:168,y:388}, knee_R:{x:228,y:388},
        ankle_L:{x:188,y:502}, ankle_R:{x:210,y:488},
        mid_spine:{x:198,y:208}, isHoldStep:false, altShift:{tx:4,ty:0,scale:1.06} },
      // 3 - Right knee bends outward, foot on left inner calf
      { head:{x:198,y:68}, shoulder_L:{x:152,y:130}, shoulder_R:{x:244,y:130},
        elbow_L:{x:150,y:194}, elbow_R:{x:246,y:194},
        wrist_L:{x:148,y:260}, wrist_R:{x:248,y:260},
        hip_L:{x:170,y:286}, hip_R:{x:226,y:286},
        knee_L:{x:168,y:388}, knee_R:{x:278,y:352},
        ankle_L:{x:188,y:502}, ankle_R:{x:178,y:398},
        mid_spine:{x:198,y:208}, isHoldStep:false, altShift:{tx:-14,ty:0,scale:1.08} },
      // 4 - Palms join at heart (Anjali Mudra)
      { head:{x:198,y:68}, shoulder_L:{x:152,y:130}, shoulder_R:{x:244,y:130},
        elbow_L:{x:164,y:158}, elbow_R:{x:216,y:158},
        wrist_L:{x:192,y:176}, wrist_R:{x:208,y:176},
        hip_L:{x:170,y:286}, hip_R:{x:226,y:286},
        knee_L:{x:168,y:388}, knee_R:{x:282,y:316},
        ankle_L:{x:188,y:502}, ankle_R:{x:176,y:370},
        mid_spine:{x:198,y:208}, isHoldStep:false, altShift:{tx:18,ty:-4,scale:1.1} },
      // 5 - HOLD: arms raised overhead in V or prayer
      { head:{x:198,y:62}, shoulder_L:{x:152,y:126}, shoulder_R:{x:244,y:126},
        elbow_L:{x:168,y:70}, elbow_R:{x:224,y:70},
        wrist_L:{x:178,y:36}, wrist_R:{x:214,y:36},
        hip_L:{x:170,y:286}, hip_R:{x:226,y:286},
        knee_L:{x:168,y:388}, knee_R:{x:282,y:316},
        ankle_L:{x:188,y:502}, ankle_R:{x:176,y:370},
        mid_spine:{x:198,y:206}, isHoldStep:true, altShift:{tx:24,ty:-14,scale:1.14} },
      // 6 - Lower right foot, return to stand
      { head:{x:200,y:68}, shoulder_L:{x:154,y:130}, shoulder_R:{x:246,y:130},
        elbow_L:{x:152,y:194}, elbow_R:{x:248,y:194},
        wrist_L:{x:150,y:260}, wrist_R:{x:250,y:260},
        hip_L:{x:172,y:286}, hip_R:{x:228,y:286},
        knee_L:{x:170,y:388}, knee_R:{x:230,y:388},
        ankle_L:{x:192,y:502}, ankle_R:{x:208,y:502},
        mid_spine:{x:200,y:208}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.05} },
    ],
  },

  bhujangasana: {
    label: 'भुजंगासन · BHUJANGASANA · Cobra Pose',
    viewBox: '0 0 560 340',
    matY: 318,
    viewType: 'prone',
    steps: [
      // 1 - Prone tabletop setup (flat)
      { head:{x:58,y:296}, shoulder_L:{x:114,y:296}, shoulder_R:{x:114,y:308},
        elbow_L:{x:174,y:295}, elbow_R:{x:174,y:307},
        wrist_L:{x:228,y:294}, wrist_R:{x:228,y:306},
        hip_L:{x:306,y:296}, hip_R:{x:306,y:308},
        knee_L:{x:380,y:296}, knee_R:{x:380,y:308},
        ankle_L:{x:444,y:296}, ankle_R:{x:444,y:308},
        mid_spine:{x:210,y:296}, isHoldStep:false, altShift:{tx:0,ty:-8,scale:1.06} },
      // 2 - Palms placed under shoulders, elbows tucked in close
      { head:{x:58,y:296}, shoulder_L:{x:114,y:296}, shoulder_R:{x:114,y:308},
        elbow_L:{x:114,y:314}, elbow_R:{x:114,y:324},
        wrist_L:{x:114,y:296}, wrist_R:{x:114,y:308},
        hip_L:{x:306,y:296}, hip_R:{x:306,y:308},
        knee_L:{x:380,y:296}, knee_R:{x:380,y:308},
        ankle_L:{x:444,y:296}, ankle_R:{x:444,y:308},
        mid_spine:{x:210,y:296}, isHoldStep:false, altShift:{tx:12,ty:-4,scale:1.05} },
      // 3 - Head and chest begin to peel up
      { head:{x:44,y:270}, shoulder_L:{x:106,y:284}, shoulder_R:{x:106,y:296},
        elbow_L:{x:110,y:314}, elbow_R:{x:110,y:322},
        wrist_L:{x:106,y:296}, wrist_R:{x:106,y:306},
        hip_L:{x:306,y:296}, hip_R:{x:306,y:308},
        knee_L:{x:380,y:296}, knee_R:{x:380,y:308},
        ankle_L:{x:444,y:296}, ankle_R:{x:444,y:308},
        mid_spine:{x:204,y:290}, isHoldStep:false, altShift:{tx:-14,ty:-10,scale:1.08} },
      // 4 - Chest fully lifted, shoulders rolled back and down
      { head:{x:30,y:238}, shoulder_L:{x:88,y:264}, shoulder_R:{x:88,y:276},
        elbow_L:{x:102,y:312}, elbow_R:{x:102,y:320},
        wrist_L:{x:88,y:296}, wrist_R:{x:88,y:306},
        hip_L:{x:306,y:296}, hip_R:{x:306,y:308},
        knee_L:{x:380,y:296}, knee_R:{x:380,y:308},
        ankle_L:{x:444,y:296}, ankle_R:{x:444,y:308},
        mid_spine:{x:192,y:280}, isHoldStep:false, altShift:{tx:-24,ty:-14,scale:1.1} },
      // 5 - Full Cobra HOLD
      { head:{x:26,y:228}, shoulder_L:{x:84,y:256}, shoulder_R:{x:84,y:268},
        elbow_L:{x:100,y:310}, elbow_R:{x:100,y:318},
        wrist_L:{x:86,y:294}, wrist_R:{x:86,y:304},
        hip_L:{x:306,y:296}, hip_R:{x:306,y:308},
        knee_L:{x:380,y:296}, knee_R:{x:380,y:308},
        ankle_L:{x:444,y:296}, ankle_R:{x:444,y:308},
        mid_spine:{x:190,y:272}, isHoldStep:true, altShift:{tx:36,ty:-20,scale:1.14} },
      // 6 - Lower back down to flat (return to step 1)
      { head:{x:58,y:296}, shoulder_L:{x:114,y:296}, shoulder_R:{x:114,y:308},
        elbow_L:{x:174,y:295}, elbow_R:{x:174,y:307},
        wrist_L:{x:228,y:294}, wrist_R:{x:228,y:306},
        hip_L:{x:306,y:296}, hip_R:{x:306,y:308},
        knee_L:{x:380,y:296}, knee_R:{x:380,y:308},
        ankle_L:{x:444,y:296}, ankle_R:{x:444,y:308},
        mid_spine:{x:210,y:296}, isHoldStep:false, altShift:{tx:0,ty:-8,scale:1.06} },
    ],
  },

  utkatasana: {
    label: 'उत्कटासन · UTKATASANA · Chair Pose',
    viewBox: '0 0 400 560',
    matY: 510,
    viewType: 'front',
    steps: [
      // 1 - Stand upright
      { head:{x:200,y:68}, shoulder_L:{x:152,y:132}, shoulder_R:{x:248,y:132},
        elbow_L:{x:150,y:196}, elbow_R:{x:250,y:196},
        wrist_L:{x:148,y:262}, wrist_R:{x:252,y:262},
        hip_L:{x:168,y:288}, hip_R:{x:232,y:288},
        knee_L:{x:166,y:390}, knee_R:{x:234,y:390},
        ankle_L:{x:164,y:502}, ankle_R:{x:236,y:502},
        mid_spine:{x:200,y:210}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.05} },
      // 2 - Arms sweep UP overhead alongside ears
      { head:{x:200,y:68}, shoulder_L:{x:152,y:132}, shoulder_R:{x:248,y:132},
        elbow_L:{x:162,y:68}, elbow_R:{x:238,y:68},
        wrist_L:{x:165,y:36}, wrist_R:{x:235,y:36},
        hip_L:{x:168,y:288}, hip_R:{x:232,y:288},
        knee_L:{x:166,y:390}, knee_R:{x:234,y:390},
        ankle_L:{x:164,y:502}, ankle_R:{x:236,y:502},
        mid_spine:{x:200,y:210}, isHoldStep:false, altShift:{tx:-16,ty:-10,scale:1.08} },
      // 3 - Knees start to bend, hips sink
      { head:{x:194,y:84}, shoulder_L:{x:150,y:150}, shoulder_R:{x:246,y:150},
        elbow_L:{x:163,y:82}, elbow_R:{x:237,y:82},
        wrist_L:{x:166,y:50}, wrist_R:{x:234,y:50},
        hip_L:{x:162,y:308}, hip_R:{x:238,y:308},
        knee_L:{x:154,y:408}, knee_R:{x:246,y:408},
        ankle_L:{x:150,y:502}, ankle_R:{x:250,y:502},
        mid_spine:{x:200,y:232}, isHoldStep:false, altShift:{tx:-14,ty:4,scale:1.06} },
      // 4 - Full Chair: thighs near parallel, torso leans forward
      { head:{x:188,y:114}, shoulder_L:{x:150,y:176}, shoulder_R:{x:246,y:176},
        elbow_L:{x:166,y:116}, elbow_R:{x:234,y:116},
        wrist_L:{x:169,y:84}, wrist_R:{x:231,y:84},
        hip_L:{x:150,y:334}, hip_R:{x:250,y:334},
        knee_L:{x:134,y:432}, knee_R:{x:266,y:432},
        ankle_L:{x:130,y:502}, ankle_R:{x:270,y:502},
        mid_spine:{x:200,y:260}, isHoldStep:false, altShift:{tx:28,ty:12,scale:1.1} },
      // 5 - HOLD Chair Pose
      { head:{x:188,y:114}, shoulder_L:{x:150,y:176}, shoulder_R:{x:246,y:176},
        elbow_L:{x:166,y:116}, elbow_R:{x:234,y:116},
        wrist_L:{x:169,y:84}, wrist_R:{x:231,y:84},
        hip_L:{x:150,y:334}, hip_R:{x:250,y:334},
        knee_L:{x:134,y:432}, knee_R:{x:266,y:432},
        ankle_L:{x:130,y:502}, ankle_R:{x:270,y:502},
        mid_spine:{x:200,y:260}, isHoldStep:true, altShift:{tx:36,ty:18,scale:1.14} },
      // 6 - Rise back to standing
      { head:{x:200,y:68}, shoulder_L:{x:152,y:132}, shoulder_R:{x:248,y:132},
        elbow_L:{x:150,y:196}, elbow_R:{x:250,y:196},
        wrist_L:{x:148,y:262}, wrist_R:{x:252,y:262},
        hip_L:{x:168,y:288}, hip_R:{x:232,y:288},
        knee_L:{x:166,y:390}, knee_R:{x:234,y:390},
        ankle_L:{x:164,y:502}, ankle_R:{x:236,y:502},
        mid_spine:{x:200,y:210}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.05} },
    ],
  },

  'adho-mukha-svanasana': {
    label: 'अधोमुखश्वानासन · ADHO MUKHA SVANASANA · Downward Dog',
    viewBox: '0 0 560 380',
    matY: 355,
    viewType: 'side',
    steps: [
      // 1 - Tabletop: hands & knees on mat, spine flat
      { head:{x:132,y:222}, shoulder_L:{x:172,y:242}, shoulder_R:{x:188,y:248},
        elbow_L:{x:172,y:296}, elbow_R:{x:188,y:302},
        wrist_L:{x:172,y:348}, wrist_R:{x:188,y:348},
        hip_L:{x:292,y:242}, hip_R:{x:308,y:248},
        knee_L:{x:292,y:296}, knee_R:{x:308,y:302},
        ankle_L:{x:292,y:348}, ankle_R:{x:308,y:348},
        mid_spine:{x:232,y:242}, isHoldStep:false, altShift:{tx:12,ty:0,scale:1.05} },
      // 2 - Tuck toes: ankles shift slightly forward
      { head:{x:132,y:222}, shoulder_L:{x:172,y:242}, shoulder_R:{x:188,y:248},
        elbow_L:{x:172,y:296}, elbow_R:{x:188,y:302},
        wrist_L:{x:172,y:348}, wrist_R:{x:188,y:348},
        hip_L:{x:292,y:242}, hip_R:{x:308,y:248},
        knee_L:{x:292,y:296}, knee_R:{x:308,y:302},
        ankle_L:{x:314,y:348}, ankle_R:{x:330,y:348},
        mid_spine:{x:232,y:242}, isHoldStep:false, altShift:{tx:12,ty:0,scale:1.05} },
      // 3 - Knees lift: bent knees, hips rising
      { head:{x:152,y:246}, shoulder_L:{x:192,y:264}, shoulder_R:{x:208,y:270},
        elbow_L:{x:182,y:304}, elbow_R:{x:198,y:310},
        wrist_L:{x:172,y:348}, wrist_R:{x:188,y:348},
        hip_L:{x:296,y:194}, hip_R:{x:312,y:200},
        knee_L:{x:280,y:268}, knee_R:{x:296,y:274},
        ankle_L:{x:320,y:334}, ankle_R:{x:336,y:334},
        mid_spine:{x:242,y:228}, isHoldStep:false, altShift:{tx:-10,ty:-6,scale:1.08} },
      // 4 - Full Downward Dog: inverted V, hips high
      { head:{x:178,y:270}, shoulder_L:{x:204,y:248}, shoulder_R:{x:220,y:254},
        elbow_L:{x:188,y:298}, elbow_R:{x:204,y:304},
        wrist_L:{x:172,y:348}, wrist_R:{x:188,y:348},
        hip_L:{x:322,y:112}, hip_R:{x:338,y:118},
        knee_L:{x:352,y:236}, knee_R:{x:368,y:242},
        ankle_L:{x:382,y:348}, ankle_R:{x:398,y:348},
        mid_spine:{x:262,y:180}, isHoldStep:false, altShift:{tx:-22,ty:10,scale:1.1} },
      // 5 - HOLD Downward Dog
      { head:{x:178,y:270}, shoulder_L:{x:204,y:248}, shoulder_R:{x:220,y:254},
        elbow_L:{x:188,y:298}, elbow_R:{x:204,y:304},
        wrist_L:{x:172,y:348}, wrist_R:{x:188,y:348},
        hip_L:{x:322,y:112}, hip_R:{x:338,y:118},
        knee_L:{x:352,y:236}, knee_R:{x:368,y:242},
        ankle_L:{x:382,y:348}, ankle_R:{x:398,y:348},
        mid_spine:{x:262,y:180}, isHoldStep:true, altShift:{tx:24,ty:-12,scale:1.14} },
    ],
  },

  'cat-cow-flow': {
    label: 'मार्जरीआसन-बितिलासन · CAT-COW · Spine Warmup',
    viewBox: '0 0 560 380',
    matY: 355,
    viewType: 'side',
    steps: [
      // 1 - Neutral Tabletop: spine flat
      { head:{x:132,y:222}, shoulder_L:{x:172,y:242}, shoulder_R:{x:188,y:248},
        elbow_L:{x:172,y:296}, elbow_R:{x:188,y:302},
        wrist_L:{x:172,y:348}, wrist_R:{x:188,y:348},
        hip_L:{x:292,y:242}, hip_R:{x:308,y:248},
        knee_L:{x:292,y:296}, knee_R:{x:308,y:302},
        ankle_L:{x:292,y:348}, ankle_R:{x:308,y:348},
        mid_spine:{x:232,y:242}, isHoldStep:false, altShift:{tx:10,ty:0,scale:1.05} },
      // 2 - Cat: spine arches high UP, head drops down (chin to chest)
      { head:{x:140,y:272}, shoulder_L:{x:172,y:248}, shoulder_R:{x:188,y:254},
        elbow_L:{x:172,y:302}, elbow_R:{x:188,y:308},
        wrist_L:{x:172,y:348}, wrist_R:{x:188,y:348},
        hip_L:{x:292,y:248}, hip_R:{x:308,y:254},
        knee_L:{x:292,y:298}, knee_R:{x:308,y:304},
        ankle_L:{x:292,y:348}, ankle_R:{x:308,y:348},
        mid_spine:{x:232,y:168}, isHoldStep:false, altShift:{tx:-10,ty:-10,scale:1.08} },
      // 3 - Cat HOLD
      { head:{x:140,y:272}, shoulder_L:{x:172,y:248}, shoulder_R:{x:188,y:254},
        elbow_L:{x:172,y:302}, elbow_R:{x:188,y:308},
        wrist_L:{x:172,y:348}, wrist_R:{x:188,y:348},
        hip_L:{x:292,y:248}, hip_R:{x:308,y:254},
        knee_L:{x:292,y:298}, knee_R:{x:308,y:304},
        ankle_L:{x:292,y:348}, ankle_R:{x:308,y:348},
        mid_spine:{x:232,y:168}, isHoldStep:true, altShift:{tx:-10,ty:-10,scale:1.08} },
      // 4 - Cow: belly drops DOWN, head lifts (looking forward/up)
      { head:{x:122,y:186}, shoulder_L:{x:172,y:240}, shoulder_R:{x:188,y:246},
        elbow_L:{x:172,y:294}, elbow_R:{x:188,y:300},
        wrist_L:{x:172,y:348}, wrist_R:{x:188,y:348},
        hip_L:{x:292,y:240}, hip_R:{x:308,y:246},
        knee_L:{x:292,y:294}, knee_R:{x:308,y:300},
        ankle_L:{x:292,y:348}, ankle_R:{x:308,y:348},
        mid_spine:{x:232,y:292}, isHoldStep:false, altShift:{tx:14,ty:12,scale:1.1} },
      // 5 - Return to Neutral Tabletop
      { head:{x:132,y:222}, shoulder_L:{x:172,y:242}, shoulder_R:{x:188,y:248},
        elbow_L:{x:172,y:296}, elbow_R:{x:188,y:302},
        wrist_L:{x:172,y:348}, wrist_R:{x:188,y:348},
        hip_L:{x:292,y:242}, hip_R:{x:308,y:248},
        knee_L:{x:292,y:296}, knee_R:{x:308,y:302},
        ankle_L:{x:292,y:348}, ankle_R:{x:308,y:348},
        mid_spine:{x:232,y:242}, isHoldStep:false, altShift:{tx:10,ty:0,scale:1.05} },
    ],
  },

  'surya-namaskar': {
    label: 'सूर्य नमस्कार · SURYA NAMASKAR · Sun Salutation',
    viewBox: '0 0 560 400',
    matY: 370,
    viewType: 'side',
    steps: [
      // 1 - Stand, palms joined at heart (Namaskar)
      { head:{x:144,y:86}, shoulder_L:{x:144,y:130}, shoulder_R:{x:160,y:136},
        elbow_L:{x:158,y:154}, elbow_R:{x:174,y:160},
        wrist_L:{x:146,y:168}, wrist_R:{x:150,y:168},
        hip_L:{x:148,y:242}, hip_R:{x:164,y:248},
        knee_L:{x:148,y:308}, knee_R:{x:164,y:314},
        ankle_L:{x:148,y:366}, ankle_R:{x:164,y:366},
        mid_spine:{x:152,y:188}, isHoldStep:false, altShift:{tx:5,ty:0,scale:1.05} },
      // 2 - Inhale arms up, slight back arch
      { head:{x:158,y:96}, shoulder_L:{x:158,y:136}, shoulder_R:{x:174,y:142},
        elbow_L:{x:146,y:78}, elbow_R:{x:162,y:84},
        wrist_L:{x:136,y:44}, wrist_R:{x:152,y:50},
        hip_L:{x:138,y:244}, hip_R:{x:154,y:250},
        knee_L:{x:142,y:308}, knee_R:{x:158,y:314},
        ankle_L:{x:148,y:366}, ankle_R:{x:164,y:366},
        mid_spine:{x:148,y:190}, isHoldStep:false, altShift:{tx:-14,ty:-10,scale:1.08} },
      // 3 - Exhale forward fold
      { head:{x:130,y:318}, shoulder_L:{x:142,y:278}, shoulder_R:{x:158,y:284},
        elbow_L:{x:136,y:318}, elbow_R:{x:152,y:324},
        wrist_L:{x:124,y:360}, wrist_R:{x:140,y:360},
        hip_L:{x:148,y:228}, hip_R:{x:164,y:234},
        knee_L:{x:148,y:298}, knee_R:{x:164,y:304},
        ankle_L:{x:148,y:366}, ankle_R:{x:164,y:366},
        mid_spine:{x:148,y:256}, isHoldStep:false, altShift:{tx:-8,ty:14,scale:1.06} },
      // 4 - Right foot steps back: low lunge
      { head:{x:162,y:228}, shoulder_L:{x:190,y:250}, shoulder_R:{x:206,y:256},
        elbow_L:{x:190,y:304}, elbow_R:{x:206,y:310},
        wrist_L:{x:190,y:352}, wrist_R:{x:206,y:352},
        hip_L:{x:264,y:260}, hip_R:{x:280,y:266},
        knee_L:{x:190,y:288}, knee_R:{x:328,y:316},
        ankle_L:{x:190,y:352}, ankle_R:{x:368,y:366},
        mid_spine:{x:228,y:256}, isHoldStep:false, altShift:{tx:16,ty:-4,scale:1.06} },
      // 5 - Plank: body straight diagonal
      { head:{x:142,y:254}, shoulder_L:{x:176,y:266}, shoulder_R:{x:192,y:272},
        elbow_L:{x:176,y:310}, elbow_R:{x:192,y:316},
        wrist_L:{x:176,y:352}, wrist_R:{x:192,y:352},
        hip_L:{x:276,y:286}, hip_R:{x:292,y:292},
        knee_L:{x:336,y:314}, knee_R:{x:352,y:320},
        ankle_L:{x:394,y:348}, ankle_R:{x:410,y:354},
        mid_spine:{x:226,y:276}, isHoldStep:false, altShift:{tx:0,ty:-10,scale:1.07} },
      // 6 - Ashtanga: knees-chest-chin on mat
      { head:{x:118,y:316}, shoulder_L:{x:160,y:326}, shoulder_R:{x:176,y:332},
        elbow_L:{x:160,y:352}, elbow_R:{x:176,y:356},
        wrist_L:{x:160,y:352}, wrist_R:{x:176,y:356},
        hip_L:{x:270,y:272}, hip_R:{x:286,y:278},
        knee_L:{x:330,y:352}, knee_R:{x:346,y:358},
        ankle_L:{x:394,y:352}, ankle_R:{x:410,y:358},
        mid_spine:{x:212,y:304}, isHoldStep:false, altShift:{tx:12,ty:0,scale:1.05} },
      // 7 - Cobra: prone, chest lifts
      { head:{x:104,y:234}, shoulder_L:{x:158,y:262}, shoulder_R:{x:174,y:268},
        elbow_L:{x:170,y:306}, elbow_R:{x:186,y:312},
        wrist_L:{x:158,y:350}, wrist_R:{x:174,y:350},
        hip_L:{x:272,y:338}, hip_R:{x:288,y:344},
        knee_L:{x:332,y:350}, knee_R:{x:348,y:356},
        ankle_L:{x:392,y:350}, ankle_R:{x:408,y:356},
        mid_spine:{x:208,y:300}, isHoldStep:false, altShift:{tx:-22,ty:-12,scale:1.1} },
      // 8 - Downward Dog: inverted V
      { head:{x:182,y:280}, shoulder_L:{x:210,y:260}, shoulder_R:{x:226,y:266},
        elbow_L:{x:196,y:304}, elbow_R:{x:212,y:310},
        wrist_L:{x:182,y:350}, wrist_R:{x:198,y:350},
        hip_L:{x:292,y:182}, hip_R:{x:308,y:188},
        knee_L:{x:330,y:264}, knee_R:{x:346,y:270},
        ankle_L:{x:372,y:350}, ankle_R:{x:388,y:350},
        mid_spine:{x:250,y:220}, isHoldStep:false, altShift:{tx:24,ty:-10,scale:1.14} },
      // 9 - Right foot forward: lunge
      { head:{x:174,y:226}, shoulder_L:{x:202,y:248}, shoulder_R:{x:218,y:254},
        elbow_L:{x:202,y:302}, elbow_R:{x:218,y:308},
        wrist_L:{x:202,y:352}, wrist_R:{x:218,y:352},
        hip_L:{x:282,y:258}, hip_R:{x:298,y:264},
        knee_L:{x:202,y:286}, knee_R:{x:342,y:316},
        ankle_L:{x:202,y:352}, ankle_R:{x:382,y:366},
        mid_spine:{x:242,y:254}, isHoldStep:false, altShift:{tx:16,ty:-4,scale:1.06} },
      // 10 - Rise to stand, arms up (Urdhva Hastasana)
      { head:{x:158,y:96}, shoulder_L:{x:158,y:136}, shoulder_R:{x:174,y:142},
        elbow_L:{x:146,y:78}, elbow_R:{x:162,y:84},
        wrist_L:{x:136,y:44}, wrist_R:{x:152,y:50},
        hip_L:{x:138,y:244}, hip_R:{x:154,y:250},
        knee_L:{x:142,y:308}, knee_R:{x:158,y:314},
        ankle_L:{x:148,y:366}, ankle_R:{x:164,y:366},
        mid_spine:{x:148,y:190}, isHoldStep:true, altShift:{tx:-14,ty:-10,scale:1.08} },
    ],
  },

  trikonasana: {
    label: 'त्रिकोणासन · TRIKONASANA · Triangle Pose',
    viewBox: '0 0 440 560',
    matY: 510,
    viewType: 'front',
    steps: [
      // 1 - Stand wide, arms T-shape parallel to ground
      { head:{x:220,y:80}, shoulder_L:{x:148,y:148}, shoulder_R:{x:292,y:148},
        elbow_L:{x:80,y:148}, elbow_R:{x:360,y:148},
        wrist_L:{x:16,y:148}, wrist_R:{x:424,y:148},
        hip_L:{x:180,y:268}, hip_R:{x:260,y:268},
        knee_L:{x:158,y:370}, knee_R:{x:282,y:370},
        ankle_L:{x:126,y:502}, ankle_R:{x:314,y:502},
        mid_spine:{x:220,y:210}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.05} },
      // 2 - Turn right foot out 90 degrees
      { head:{x:220,y:80}, shoulder_L:{x:148,y:148}, shoulder_R:{x:292,y:148},
        elbow_L:{x:80,y:148}, elbow_R:{x:360,y:148},
        wrist_L:{x:16,y:148}, wrist_R:{x:424,y:148},
        hip_L:{x:180,y:268}, hip_R:{x:260,y:268},
        knee_L:{x:158,y:370}, knee_R:{x:282,y:370},
        ankle_L:{x:126,y:502}, ankle_R:{x:318,y:502},
        mid_spine:{x:220,y:210}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.05} },
      // 3 - Hinge sideways: torso tilts right, arms still extended
      { head:{x:254,y:128}, shoulder_L:{x:192,y:182}, shoulder_R:{x:258,y:152},
        elbow_L:{x:130,y:202}, elbow_R:{x:316,y:126},
        wrist_L:{x:68,y:222}, wrist_R:{x:374,y:100},
        hip_L:{x:172,y:278}, hip_R:{x:252,y:270},
        knee_L:{x:152,y:370}, knee_R:{x:278,y:370},
        ankle_L:{x:120,y:502}, ankle_R:{x:316,y:502},
        mid_spine:{x:216,y:218}, isHoldStep:false, altShift:{tx:-14,ty:0,scale:1.06} },
      // 4 - Full Triangle HOLD: bottom hand to shin, top arm vertical
      { head:{x:242,y:172}, shoulder_L:{x:194,y:228}, shoulder_R:{x:260,y:176},
        elbow_L:{x:206,y:296}, elbow_R:{x:268,y:112},
        wrist_L:{x:218,y:362}, wrist_R:{x:276,y:46},
        hip_L:{x:174,y:280}, hip_R:{x:252,y:272},
        knee_L:{x:148,y:372}, knee_R:{x:274,y:372},
        ankle_L:{x:118,y:502}, ankle_R:{x:308,y:502},
        mid_spine:{x:208,y:250}, isHoldStep:true, altShift:{tx:24,ty:-12,scale:1.12} },
      // 5 - Rise back upright
      { head:{x:220,y:80}, shoulder_L:{x:148,y:148}, shoulder_R:{x:292,y:148},
        elbow_L:{x:80,y:148}, elbow_R:{x:360,y:148},
        wrist_L:{x:16,y:148}, wrist_R:{x:424,y:148},
        hip_L:{x:180,y:268}, hip_R:{x:260,y:268},
        knee_L:{x:158,y:370}, knee_R:{x:282,y:370},
        ankle_L:{x:126,y:502}, ankle_R:{x:314,y:502},
        mid_spine:{x:220,y:210}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.05} },
    ],
  },

  'virabhadrasana-ii': {
    label: 'वीरभद्रासन II · VIRABHADRASANA II · Warrior II',
    viewBox: '0 0 480 440',
    matY: 388,
    viewType: 'front',
    steps: [
      // 1 - Stand centered, feet together
      { head:{x:240,y:66}, shoulder_L:{x:204,y:122}, shoulder_R:{x:276,y:122},
        elbow_L:{x:188,y:178}, elbow_R:{x:292,y:178},
        wrist_L:{x:182,y:234}, wrist_R:{x:298,y:234},
        hip_L:{x:218,y:244}, hip_R:{x:262,y:244},
        knee_L:{x:216,y:316}, knee_R:{x:264,y:316},
        ankle_L:{x:214,y:382}, ankle_R:{x:266,y:382},
        mid_spine:{x:240,y:184}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.05} },
      // 2 - Step feet wide, hands on hips (elbows bent in)
      { head:{x:240,y:66}, shoulder_L:{x:204,y:122}, shoulder_R:{x:276,y:122},
        elbow_L:{x:178,y:158}, elbow_R:{x:284,y:158},
        wrist_L:{x:190,y:194}, wrist_R:{x:272,y:194},
        hip_L:{x:206,y:220}, hip_R:{x:276,y:220},
        knee_L:{x:166,y:298}, knee_R:{x:314,y:298},
        ankle_L:{x:130,y:382}, ankle_R:{x:350,y:382},
        mid_spine:{x:240,y:172}, isHoldStep:false, altShift:{tx:10,ty:0,scale:1.06} },
      // 3 - Turn toes (visual same as step 2)
      { head:{x:240,y:66}, shoulder_L:{x:204,y:122}, shoulder_R:{x:276,y:122},
        elbow_L:{x:178,y:158}, elbow_R:{x:284,y:158},
        wrist_L:{x:190,y:194}, wrist_R:{x:272,y:194},
        hip_L:{x:206,y:220}, hip_R:{x:276,y:220},
        knee_L:{x:166,y:298}, knee_R:{x:314,y:298},
        ankle_L:{x:130,y:382}, ankle_R:{x:350,y:382},
        mid_spine:{x:240,y:172}, isHoldStep:false, altShift:{tx:10,ty:0,scale:1.06} },
      // 4 - Lengthen spine: head slightly higher
      { head:{x:240,y:58}, shoulder_L:{x:202,y:116}, shoulder_R:{x:278,y:116},
        elbow_L:{x:176,y:152}, elbow_R:{x:286,y:152},
        wrist_L:{x:190,y:188}, wrist_R:{x:272,y:188},
        hip_L:{x:206,y:216}, hip_R:{x:274,y:216},
        knee_L:{x:166,y:294}, knee_R:{x:314,y:294},
        ankle_L:{x:130,y:382}, ankle_R:{x:350,y:382},
        mid_spine:{x:240,y:168}, isHoldStep:false, altShift:{tx:10,ty:0,scale:1.06} },
      // 5 - Arms extend to T-shape
      { head:{x:240,y:58}, shoulder_L:{x:202,y:116}, shoulder_R:{x:278,y:116},
        elbow_L:{x:140,y:116}, elbow_R:{x:340,y:116},
        wrist_L:{x:78,y:116}, wrist_R:{x:402,y:116},
        hip_L:{x:206,y:216}, hip_R:{x:274,y:216},
        knee_L:{x:166,y:294}, knee_R:{x:314,y:294},
        ankle_L:{x:130,y:382}, ankle_R:{x:350,y:382},
        mid_spine:{x:240,y:168}, isHoldStep:false, altShift:{tx:-18,ty:0,scale:1.08} },
      // 6 - Bend front (right) knee over ankle
      { head:{x:240,y:94}, shoulder_L:{x:202,y:148}, shoulder_R:{x:278,y:148},
        elbow_L:{x:140,y:148}, elbow_R:{x:340,y:148},
        wrist_L:{x:78,y:148}, wrist_R:{x:402,y:148},
        hip_L:{x:204,y:248}, hip_R:{x:274,y:248},
        knee_L:{x:154,y:324}, knee_R:{x:330,y:276},
        ankle_L:{x:130,y:382}, ankle_R:{x:350,y:382},
        mid_spine:{x:240,y:202}, isHoldStep:false, altShift:{tx:22,ty:12,scale:1.1} },
      // 7 - HOLD Warrior II: gaze over front hand
      { head:{x:240,y:94}, shoulder_L:{x:202,y:148}, shoulder_R:{x:278,y:148},
        elbow_L:{x:140,y:148}, elbow_R:{x:340,y:148},
        wrist_L:{x:78,y:148}, wrist_R:{x:402,y:148},
        hip_L:{x:204,y:248}, hip_R:{x:274,y:248},
        knee_L:{x:154,y:324}, knee_R:{x:330,y:276},
        ankle_L:{x:130,y:382}, ankle_R:{x:350,y:382},
        mid_spine:{x:240,y:202}, isHoldStep:true, altShift:{tx:26,ty:14,scale:1.14} },
      // 8 - Return to center stand
      { head:{x:240,y:66}, shoulder_L:{x:204,y:122}, shoulder_R:{x:276,y:122},
        elbow_L:{x:188,y:178}, elbow_R:{x:292,y:178},
        wrist_L:{x:182,y:234}, wrist_R:{x:298,y:234},
        hip_L:{x:218,y:244}, hip_R:{x:262,y:244},
        knee_L:{x:216,y:316}, knee_R:{x:264,y:316},
        ankle_L:{x:214,y:382}, ankle_R:{x:266,y:382},
        mid_spine:{x:240,y:184}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.05} },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
//  EASING
// ═══════════════════════════════════════════════════════════════════════════════
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  JOINT BADGE
// ═══════════════════════════════════════════════════════════════════════════════
function JointBadge({ cx, cy, label, dx = -14, dy = -14 }) {
  return (
    <>
      <circle cx={cx + dx} cy={cy + dy} r={8.5}
        fill="#6d28d9" stroke="rgba(255,255,255,0.22)" strokeWidth={1.2}/>
      <text x={cx + dx} y={cy + dy + 3.5}
        textAnchor="middle" fill="white"
        fontSize={8.5} fontWeight="bold" fontFamily="system-ui,sans-serif">
        {label}
      </text>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SVG SKELETON (receives already-interpolated coords as prop)
// ═══════════════════════════════════════════════════════════════════════════════
function YogaSVG({ asanaId, coords, showAltView }) {
  const data = ASANA_GUIDE_DATA[asanaId];
  if (!data || !coords) return null;

  const alt     = coords.altShift || { tx: 0, ty: 0, scale: 1 };
  const isFront = data.viewType === 'front';
  const isProne = data.viewType === 'prone';

  const svgTransform = showAltView
    ? `translate(${alt.tx}px,${alt.ty}px) scale(${alt.scale})`
    : 'translate(0,0) scale(1)';

  const vbParts = data.viewBox.split(' ');
  const vbW = parseInt(vbParts[2], 10);
  const vbH = parseInt(vbParts[3], 10);

  const neckX = isFront
    ? (coords.shoulder_L.x + coords.shoulder_R.x) / 2
    : coords.shoulder_L.x;
  const neckY = coords.shoulder_L.y;
  const spBotX = isFront
    ? (coords.hip_L.x + coords.hip_R.x) / 2
    : coords.hip_L.x;
  const spBotY = coords.hip_L.y;
  const spTopX = isFront
    ? (coords.shoulder_L.x + coords.shoulder_R.x) / 2
    : coords.shoulder_L.x;
  const spTopY = coords.shoulder_L.y;

  const headR = isProne ? 18 : 23;

  return (
    <svg viewBox={data.viewBox}
      className="w-full h-full select-none"
      style={{ display:'block', transform: svgTransform,
               transition:'transform 0.85s cubic-bezier(0.4,0,0.2,1)',
               transformOrigin:'50% 50%' }}>
      <defs>
        <linearGradient id={`bg-${asanaId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0d0821"/>
          <stop offset="100%" stopColor="#130d24"/>
        </linearGradient>
        <radialGradient id={`amb-${asanaId}`} cx="50%" cy="88%" r="55%">
          <stop offset="0%"   stopColor="#5b21b6" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#5b21b6" stopOpacity="0"/>
        </radialGradient>
        <filter id={`glow-${asanaId}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <rect width={vbW} height={vbH} fill={`url(#bg-${asanaId})`}/>
      <rect width={vbW} height={vbH} fill={`url(#amb-${asanaId})`}/>

      {/* Grid dots */}
      <g opacity="0.08" fill="#7c3aed">
        {[1,2,3,4,5,6].flatMap(c =>
          [1,2,3].map(r => (
            <circle key={`${c}${r}`} cx={c*(vbW/7)} cy={r*(vbH/4)} r={1.2}/>
          ))
        )}
      </g>

      {/* Mat */}
      <rect x="40" y={data.matY} width={vbW - 80} height="14" rx="7"
        fill="#3b0764" stroke="#7c3aed" strokeWidth={0.8} opacity="0.9"/>

      {/* ── SKELETON ── */}
      <g strokeLinecap="round" strokeLinejoin="round" filter={`url(#glow-${asanaId})`}>
        {/* Back limbs (dimmer) */}
        <line x1={coords.hip_R.x}      y1={coords.hip_R.y}
              x2={coords.knee_R.x}     y2={coords.knee_R.y}      stroke="#4c1d95" strokeWidth={5}/>
        <line x1={coords.knee_R.x}     y1={coords.knee_R.y}
              x2={coords.ankle_R.x}    y2={coords.ankle_R.y}     stroke="#4c1d95" strokeWidth={5}/>
        <line x1={coords.shoulder_R.x} y1={coords.shoulder_R.y}
              x2={coords.elbow_R.x}    y2={coords.elbow_R.y}     stroke="#5b21b6" strokeWidth={3.5}/>
        <line x1={coords.elbow_R.x}    y1={coords.elbow_R.y}
              x2={coords.wrist_R.x}    y2={coords.wrist_R.y}     stroke="#5b21b6" strokeWidth={3.5}/>

        {/* Front limbs (bright) */}
        <line x1={coords.hip_L.x}      y1={coords.hip_L.y}
              x2={coords.knee_L.x}     y2={coords.knee_L.y}      stroke="#8b5cf6" strokeWidth={6}/>
        <line x1={coords.knee_L.x}     y1={coords.knee_L.y}
              x2={coords.ankle_L.x}    y2={coords.ankle_L.y}     stroke="#7c3aed" strokeWidth={6}/>

        {/* Shoulder bar */}
        <line x1={coords.shoulder_L.x} y1={coords.shoulder_L.y}
              x2={coords.shoulder_R.x} y2={coords.shoulder_R.y} stroke="#9f7aea" strokeWidth={3.5}/>
        {/* Hip bar */}
        <line x1={coords.hip_L.x}      y1={coords.hip_L.y}
              x2={coords.hip_R.x}      y2={coords.hip_R.y}      stroke="#7c3aed" strokeWidth={3.5}/>

        {/* Spine */}
        <path d={`M${spBotX} ${spBotY} Q${coords.mid_spine.x} ${coords.mid_spine.y} ${spTopX} ${spTopY}`}
          fill="none" stroke="#a78bfa" strokeWidth={5}/>

        {/* Neck */}
        <line x1={neckX} y1={neckY} x2={coords.head.x} y2={coords.head.y}
          stroke="#c4b5fd" strokeWidth={3.5}/>

        {/* Left arm */}
        <line x1={coords.shoulder_L.x} y1={coords.shoulder_L.y}
              x2={coords.elbow_L.x}    y2={coords.elbow_L.y}    stroke="#c4b5fd" strokeWidth={4}/>
        <line x1={coords.elbow_L.x}    y1={coords.elbow_L.y}
              x2={coords.wrist_L.x}    y2={coords.wrist_L.y}    stroke="#c4b5fd" strokeWidth={4}/>

        {/* Head */}
        <circle cx={coords.head.x} cy={coords.head.y} r={headR}
          fill="#0d0821" stroke="#c4b5fd" strokeWidth={2.5}/>

        {/* Front joint nodes */}
        <circle cx={coords.ankle_L.x}    cy={coords.ankle_L.y}    r={5.5} fill="#e2e8f0"/>
        <circle cx={coords.knee_L.x}     cy={coords.knee_L.y}     r={6.5} fill="#7c3aed" stroke="#c4b5fd" strokeWidth={1.5}/>
        <circle cx={coords.hip_L.x}      cy={coords.hip_L.y}      r={7}   fill="#6d28d9" stroke="#c4b5fd" strokeWidth={1.5}/>
        <circle cx={coords.shoulder_L.x} cy={coords.shoulder_L.y} r={7}   fill="#6d28d9" stroke="#c4b5fd" strokeWidth={1.5}/>
        <circle cx={coords.elbow_L.x}    cy={coords.elbow_L.y}    r={5.5} fill="#9f7aea"/>
        <circle cx={coords.wrist_L.x}    cy={coords.wrist_L.y}    r={5}   fill="#e9d5ff"/>
      </g>

      {/* Joint number badges */}
      <JointBadge cx={coords.wrist_L.x}    cy={coords.wrist_L.y}    label="1" dx={14}  dy={-14}/>
      <JointBadge cx={coords.elbow_L.x}    cy={coords.elbow_L.y}    label="2" dx={-16} dy={-14}/>
      <JointBadge cx={coords.shoulder_L.x} cy={coords.shoulder_L.y} label="3" dx={-16} dy={-14}/>
      <JointBadge cx={coords.hip_L.x}      cy={coords.hip_L.y}      label="1" dx={-16} dy={isProne ? -14 : 16}/>
      <JointBadge cx={coords.knee_L.x}     cy={coords.knee_L.y}     label="2" dx={-16} dy={isProne ? -14 : 16}/>
      <JointBadge cx={coords.ankle_L.x}    cy={coords.ankle_L.y}    label="3" dx={-16} dy={isProne ? -14 : 14}/>

      {/* Breathe pulse on hold steps */}
      {coords.isHoldStep && (
        <g>
          <circle cx={vbW - 50} cy={42} r={1} fill="none" stroke="#a78bfa" strokeWidth={1.5}>
            <animate attributeName="r"       values="1;22;1"   keyTimes="0;0.5;1" dur="4s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0;0.5;0" keyTimes="0;0.5;1" dur="4s" repeatCount="indefinite"/>
          </circle>
          <text x={vbW - 50} y={76} textAnchor="middle"
            fontFamily="sans-serif" fontSize={8} fill="#8b5cf6" opacity="0.6" letterSpacing="2">
            BREATHE
          </text>
        </g>
      )}

      {/* Alt view badge */}
      {showAltView && (
        <>
          <rect x="10" y="10" width="90" height="20" rx="4" fill="#6d28d9" opacity="0.9"/>
          <text x="55" y="23" textAnchor="middle" fill="white"
            fontSize={8} fontWeight="bold" fontFamily="system-ui" letterSpacing="1.2">
            ALT VIEW ●
          </text>
        </>
      )}

      {/* Pose label */}
      <text x={vbW / 2} y={vbH - 5}
        textAnchor="middle" fontFamily="Georgia,serif"
        fontSize={10} fill="#7c3aed" letterSpacing={2} opacity={0.85}>
        {data.label}
      </text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN WATCH CLIENT
// ═══════════════════════════════════════════════════════════════════════════════
const ANIM_DURATION = 900; // ms for step transition

export default function WatchClient({ asana }) {
  const data = ASANA_GUIDE_DATA[asana.id];
  const steps = asana.steps;

  const [stepIndex,    setStepIndex]    = useState(0);
  const [animCoords,   setAnimCoords]   = useState(
    data ? data.steps[0] : null
  );
  const [audioState,   setAudioState]   = useState('playing');
  const [visualState,  setVisualState]  = useState('playing');
  const [showAltView,  setShowAltView]  = useState(false);

  // Refs for JS animation
  const rafRef          = useRef(null);
  const fromCoordsRef   = useRef(data ? data.steps[0] : null);
  const toCoordsRef     = useRef(data ? data.steps[0] : null);
  const animStartRef    = useRef(null);

  // Refs for visual alt-view timer
  const altTimerRef             = useRef(null);
  const visualRemainingRef      = useRef(2500);
  const visualTimerStartRef     = useRef(null);
  const [visualCountdown, setVisualCountdown] = useState(2.5);

  // ── JS-DRIVEN SKELETON INTERPOLATION ──────────────────────────────────────
  const startInterpolation = useCallback((fromStep, toStep) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    fromCoordsRef.current = fromStep;
    toCoordsRef.current   = toStep;
    animStartRef.current  = performance.now();

    function tick(now) {
      const elapsed = now - animStartRef.current;
      const rawT    = Math.min(elapsed / ANIM_DURATION, 1);
      const t       = easeInOut(rawT);

      const interpolated = { isHoldStep: toStep.isHoldStep, altShift: toStep.altShift };
      JOINT_KEYS.forEach(k => {
        const from = fromCoordsRef.current[k];
        const to   = toCoordsRef.current[k];
        if (!from || !to) return;
        interpolated[k] = {
          x: from.x + (to.x - from.x) * t,
          y: from.y + (to.y - from.y) * t,
        };
      });
      setAnimCoords(interpolated);

      if (rawT < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromCoordsRef.current = toStep;
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // ── AUDIO ─────────────────────────────────────────────────────────────────
  const playFromBeginning = useCallback((text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setAudioState('playing');
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate  = 0.78;
    utt.onend   = () => setAudioState('completed');
    utt.onerror = () => setAudioState('completed');
    window.speechSynthesis.speak(utt);
  }, []);

  const handleStopAudio = () => {
    window.speechSynthesis?.pause();
    setAudioState('paused');
  };
  const handleContinueAudio = () => {
    if (window.speechSynthesis?.paused) {
      window.speechSynthesis.resume();
      setAudioState('playing');
    } else {
      playFromBeginning(steps[stepIndex].voice_prompt);
    }
  };
  const handleReplayAudio = () => playFromBeginning(steps[stepIndex].voice_prompt);

  // ── VISUAL TIMER ──────────────────────────────────────────────────────────
  const startAltTimer = useCallback((ms) => {
    if (altTimerRef.current) clearTimeout(altTimerRef.current);
    visualTimerStartRef.current = Date.now();
    visualRemainingRef.current  = ms;

    // Countdown display
    const interval = setInterval(() => {
      const elapsed = Date.now() - visualTimerStartRef.current;
      const rem = Math.max(0, ms - elapsed);
      setVisualCountdown(rem / 1000);
      if (rem <= 0) clearInterval(interval);
    }, 250);

    altTimerRef.current = setTimeout(() => {
      clearInterval(interval);
      setShowAltView(true);
      setVisualState('completed');
      setVisualCountdown(0);
    }, ms);
  }, []);

  const handleStopVisual = () => {
    if (altTimerRef.current) clearTimeout(altTimerRef.current);
    const elapsed   = Date.now() - (visualTimerStartRef.current || Date.now());
    const remaining = Math.max(0, visualRemainingRef.current - elapsed);
    visualRemainingRef.current = remaining;
    setVisualState('paused');
    setVisualCountdown(remaining / 1000);
  };
  const handleContinueVisual = () => {
    setVisualState('playing');
    if (visualRemainingRef.current <= 0) {
      setShowAltView(false);
      visualRemainingRef.current = 2500;
      startAltTimer(2500);
    } else {
      startAltTimer(visualRemainingRef.current);
    }
  };
  const handleReplayVisual = () => {
    setShowAltView(false);
    visualRemainingRef.current = 2500;
    setVisualState('playing');
    startAltTimer(2500);
  };

  // ── ON STEP CHANGE ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!data) return;
    const toStep = data.steps[stepIndex];

    // Animate skeleton
    startInterpolation(fromCoordsRef.current || toStep, toStep);

    // Reset audio
    setAudioState('playing');
    playFromBeginning(steps[stepIndex].voice_prompt);

    // Reset visual
    setShowAltView(false);
    setVisualState('playing');
    visualRemainingRef.current = 2500;
    startAltTimer(2500);

    return () => {
      window.speechSynthesis?.cancel();
      if (altTimerRef.current) clearTimeout(altTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  // ── NAVIGATION ────────────────────────────────────────────────────────────
  const goNext = () => { if (stepIndex < steps.length - 1) setStepIndex(p => p + 1); };
  const goPrev = () => { if (stepIndex > 0)                setStepIndex(p => p - 1); };

  const currentStep = steps[stepIndex];

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background text-foreground select-none">
      <Header cameraActive={false}/>

      <main className="flex-1 flex overflow-hidden">

        {/* ── LEFT: Canvas ── */}
        <div className="flex-1 p-5 flex flex-col relative bg-background">
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-panel border border-border-dark
                          flex items-center justify-center shadow-2xl">

            {/* SVG */}
            <div className="absolute inset-0 z-0 flex items-center justify-center p-6">
              <YogaSVG asanaId={asana.id} coords={animCoords} showAltView={showAltView}/>
            </div>

            {/* Vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10 pointer-events-none"/>

            {/* Badge */}
            <div className="absolute top-4 left-4 z-20 bg-flow-green/20 text-flow-green text-xs
                            font-bold uppercase tracking-widest px-3 py-1 rounded border border-flow-green/30">
              ● Watch &amp; Learn Mode
            </div>

            {/* Exit */}
            <Link href={`/pose/${asana.id}`}
              className="absolute top-4 right-4 z-20 bg-card-bg/80 hover:bg-card-bg border border-border-dark
                         text-xs text-gray-300 font-semibold px-3 py-1.5 rounded transition flex items-center space-x-1.5">
              <ArrowLeft className="w-3.5 h-3.5"/><span>Exit Preview</span>
            </Link>

            {/* Progress HUD */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 w-2/3 text-center">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-semibold">
                Step {currentStep.step_number} of {steps.length}
              </p>
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden border border-gray-700">
                <div className="bg-gradient-to-r from-flow-green to-emerald-400 h-full rounded-full
                                shadow-[0_0_10px_#2ea44f] transition-all duration-500"
                  style={{ width:`${((stepIndex+1)/steps.length)*100}%` }}/>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Sidebar ── */}
        <div className="w-[26rem] bg-panel border-l border-border-dark flex flex-col shadow-xl flex-shrink-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 space-y-4">

            {/* Pose title */}
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">{asana.name}</h2>
              <p className="text-xs font-semibold text-flow-green uppercase tracking-wider mt-0.5">{asana.english}</p>
            </div>

            {/* Step instruction */}
            <div className="p-4 bg-card-bg rounded-lg border border-border-dark">
              <p className="text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-wider">
                Step {currentStep.step_number} — What to Do
              </p>
              <p className="text-sm text-gray-100 leading-relaxed font-medium">
                {currentStep.instruction}
              </p>
            </div>

            {/* Voice guide */}
            <div className="p-4 bg-[#0d1117] rounded-lg border border-border-dark">
              <div className="flex items-center space-x-2 mb-2">
                <Volume2 className={`w-3.5 h-3.5 flex-shrink-0 ${audioState==='playing' ? 'text-flow-green animate-pulse' : 'text-gray-500'}`}/>
                <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                  {audioState==='playing' ? 'Voice Guide Speaking…' : 'Voice Guide Text'}
                </p>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{currentStep.voice_prompt}</p>
            </div>

            {/* Audio controls */}
            <div className="p-3 bg-card-bg/50 rounded-lg border border-border-dark">
              <p className="text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-wider">Audio Controls</p>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button onClick={handleStopAudio} disabled={audioState!=='playing'}
                    className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold bg-red-950/40 hover:bg-red-900/50
                               text-red-300 border border-red-800/40 disabled:opacity-20 disabled:pointer-events-none
                               transition flex items-center justify-center gap-1.5">
                    <Square className="w-3.5 h-3.5"/><span>Stop Audio</span>
                  </button>
                  <button onClick={handleContinueAudio} disabled={audioState==='playing'}
                    className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold bg-flow-green/20 hover:bg-flow-green/30
                               text-flow-green border border-flow-green/30 disabled:opacity-20 disabled:pointer-events-none
                               transition flex items-center justify-center gap-1.5">
                    <Play className="w-3.5 h-3.5"/><span>Continue Audio</span>
                  </button>
                </div>
                <button onClick={handleReplayAudio}
                  className="w-full px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-violet-950/40 hover:bg-violet-900/60
                             text-violet-300 border border-violet-800/30 transition flex items-center justify-center gap-1.5">
                  <RotateCcw className="w-3 h-3"/><span>Replay From Beginning</span>
                </button>
              </div>
            </div>

            {/* Visual controls */}
            <div className="p-3 bg-card-bg/50 rounded-lg border border-border-dark">
              <p className="text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-wider">Visual (Alt View)</p>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button onClick={handleStopVisual} disabled={visualState!=='playing'}
                    className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold bg-red-950/40 hover:bg-red-900/50
                               text-red-300 border border-red-800/40 disabled:opacity-20 disabled:pointer-events-none
                               transition flex items-center justify-center gap-1.5">
                    <Square className="w-3.5 h-3.5"/><span>Stop Visual</span>
                  </button>
                  <button onClick={handleContinueVisual} disabled={visualState==='playing'}
                    className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold bg-flow-green/20 hover:bg-flow-green/30
                               text-flow-green border border-flow-green/30 disabled:opacity-20 disabled:pointer-events-none
                               transition flex items-center justify-center gap-1.5">
                    <Play className="w-3.5 h-3.5"/><span>Continue Visual</span>
                  </button>
                </div>
                <button onClick={handleReplayVisual}
                  className="w-full px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-indigo-950/40 hover:bg-indigo-900/60
                             text-indigo-300 border border-indigo-800/30 transition flex items-center justify-center gap-1.5">
                  <RotateCcw className="w-3 h-3"/><span>Replay Visual</span>
                </button>
              </div>
              <p className="text-[10px] text-gray-500 mt-1.5 text-center">
                {visualState==='playing'
                  ? `Camera shifts in ${visualCountdown.toFixed(1)}s…`
                  : visualState==='completed' ? 'Alt view angle active.' : 'Visual paused.'}
              </p>
            </div>

            {/* Joint legend */}
            <div className="p-3 bg-card-bg/40 rounded-lg border border-border-dark/60">
              <h4 className="text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-wider">Joint Numbering</h4>
              <div className="space-y-1.5 text-[10px] text-gray-400">
                {[{n:'1',a:'Wrist',l:'Hip'},{n:'2',a:'Elbow',l:'Knee'},{n:'3',a:'Shoulder',l:'Ankle'}].map(({n,a,l}) => (
                  <div key={n} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-700 text-white text-[8px] font-bold
                                     flex items-center justify-center flex-shrink-0">{n}</span>
                    <span>Arm → {a} &nbsp;|&nbsp; Leg → {l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Segment tracker */}
            <div>
              <h4 className="text-[10px] font-bold uppercase text-gray-500 mb-3 tracking-wider">Segment Tracker</h4>
              <div className="flex items-center space-x-1">
                {steps.map((_, idx) => (
                  <React.Fragment key={idx}>
                    <button onClick={() => setStepIndex(idx)}
                      className="flex flex-col items-center flex-1 focus:outline-none group">
                      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        idx === stepIndex
                          ? 'bg-flow-green ring-4 ring-flow-green/20 shadow-[0_0_8px_#2ea44f]'
                          : idx < stepIndex ? 'bg-flow-green/55' : 'bg-gray-700 group-hover:bg-gray-500'
                      }`}/>
                      <span className={`text-[9px] font-medium mt-1 ${idx===stepIndex?'text-white':'text-gray-600'}`}>
                        {idx+1}
                      </span>
                    </button>
                    {idx < steps.length - 1 && (
                      <div className={`h-0.5 flex-1 -mt-3.5 transition-colors ${idx<stepIndex?'bg-flow-green/45':'bg-gray-700'}`}/>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

          </div>{/* end scrollable */}

          {/* Footer nav */}
          <div className="border-t border-border-dark px-5 py-4 flex-shrink-0
                          flex items-center justify-between bg-panel">
            <div className="text-xs text-gray-500">
              Step <span className="text-white font-semibold">{stepIndex+1}</span> / {steps.length}
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={goPrev} disabled={stepIndex===0}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[#21262d] hover:bg-[#30363d]
                           text-gray-300 border border-[#30363d] disabled:opacity-30 disabled:pointer-events-none
                           transition flex items-center space-x-1">
                <ChevronLeft className="w-4 h-4"/><span>BACK</span>
              </button>
              <button onClick={goNext} disabled={stepIndex===steps.length-1}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-flow-green hover:bg-flow-green-hover
                           text-white disabled:opacity-30 disabled:pointer-events-none transition flex items-center space-x-1.5">
                <span>NEXT</span><ChevronRight className="w-4 h-4"/>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Chatbot asanaContext={{
        name: asana.name, sanskrit: asana.sanskrit,
        currentStep: stepIndex+1, totalSteps: steps.length,
        instruction: currentStep.instruction,
      }}/>
    </div>
  );
}
