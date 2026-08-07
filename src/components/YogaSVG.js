'use client';

import React from 'react';

export const JOINT_KEYS = [
  'head','shoulder_L','shoulder_R','elbow_L','elbow_R',
  'wrist_L','wrist_R','hip_L','hip_R','knee_L','knee_R',
  'ankle_L','ankle_R','mid_spine',
];

export const ASANA_GUIDE_DATA = {
  tadasana: {
    label: 'ताड़ासन · TADASANA · Mountain Pose',
    viewBox: '0 0 400 560',
    matY: 510,
    viewType: 'front',
    steps: [
      { head:{x:200,y:74}, shoulder_L:{x:152,y:140}, shoulder_R:{x:248,y:140}, elbow_L:{x:150,y:202}, elbow_R:{x:250,y:202}, wrist_L:{x:148,y:266}, wrist_R:{x:252,y:266}, hip_L:{x:170,y:292}, hip_R:{x:230,y:292}, knee_L:{x:168,y:394}, knee_R:{x:232,y:394}, ankle_L:{x:166,y:502}, ankle_R:{x:234,y:502}, mid_spine:{x:200,y:218}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.06} },
      { head:{x:200,y:70}, shoulder_L:{x:150,y:136}, shoulder_R:{x:250,y:136}, elbow_L:{x:148,y:198}, elbow_R:{x:252,y:198}, wrist_L:{x:146,y:262}, wrist_R:{x:254,y:262}, hip_L:{x:170,y:288}, hip_R:{x:230,y:288}, knee_L:{x:168,y:388}, knee_R:{x:232,y:388}, ankle_L:{x:168,y:502}, ankle_R:{x:232,y:502}, mid_spine:{x:200,y:214}, isHoldStep:false, altShift:{tx:0,ty:6,scale:1.07} },
      { head:{x:200,y:64}, shoulder_L:{x:140,y:128}, shoulder_R:{x:260,y:128}, elbow_L:{x:144,y:190}, elbow_R:{x:256,y:190}, wrist_L:{x:148,y:254}, wrist_R:{x:252,y:254}, hip_L:{x:170,y:284}, hip_R:{x:230,y:284}, knee_L:{x:168,y:384}, knee_R:{x:232,y:384}, ankle_L:{x:168,y:502}, ankle_R:{x:232,y:502}, mid_spine:{x:200,y:206}, isHoldStep:false, altShift:{tx:-10,ty:0,scale:1.08} },
      { head:{x:200,y:46}, shoulder_L:{x:138,y:116}, shoulder_R:{x:262,y:116}, elbow_L:{x:142,y:178}, elbow_R:{x:258,y:178}, wrist_L:{x:146,y:242}, wrist_R:{x:254,y:242}, hip_L:{x:170,y:276}, hip_R:{x:230,y:276}, knee_L:{x:168,y:376}, knee_R:{x:232,y:376}, ankle_L:{x:168,y:502}, ankle_R:{x:232,y:502}, mid_spine:{x:200,y:196}, isHoldStep:true, altShift:{tx:-14,ty:0,scale:1.1} },
      { head:{x:200,y:46}, shoulder_L:{x:138,y:116}, shoulder_R:{x:262,y:116}, elbow_L:{x:142,y:178}, elbow_R:{x:258,y:178}, wrist_L:{x:146,y:242}, wrist_R:{x:254,y:242}, hip_L:{x:170,y:276}, hip_R:{x:230,y:276}, knee_L:{x:168,y:376}, knee_R:{x:232,y:376}, ankle_L:{x:168,y:502}, ankle_R:{x:232,y:502}, mid_spine:{x:200,y:196}, isHoldStep:true, altShift:{tx:22,ty:-10,scale:1.12} },
      { head:{x:200,y:74}, shoulder_L:{x:152,y:140}, shoulder_R:{x:248,y:140}, elbow_L:{x:150,y:202}, elbow_R:{x:250,y:202}, wrist_L:{x:148,y:266}, wrist_R:{x:252,y:266}, hip_L:{x:170,y:292}, hip_R:{x:230,y:292}, knee_L:{x:168,y:394}, knee_R:{x:232,y:394}, ankle_L:{x:166,y:502}, ankle_R:{x:234,y:502}, mid_spine:{x:200,y:218}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.06} },
    ]
  },
  balasana: {
    label: "बालासन · BALASANA · Child's Pose",
    viewBox: '0 0 560 380',
    matY: 355,
    viewType: 'side',
    steps: [
      { head:{x:168,y:92}, shoulder_L:{x:178,y:150}, shoulder_R:{x:194,y:156}, elbow_L:{x:182,y:212}, elbow_R:{x:198,y:218}, wrist_L:{x:184,y:272}, wrist_R:{x:200,y:278}, hip_L:{x:232,y:302}, hip_R:{x:248,y:308}, knee_L:{x:182,y:355}, knee_R:{x:198,y:355}, ankle_L:{x:288,y:355}, ankle_R:{x:304,y:355}, mid_spine:{x:206,y:228}, isHoldStep:false, altShift:{tx:20,ty:0,scale:1.06} },
      { head:{x:168,y:92}, shoulder_L:{x:178,y:150}, shoulder_R:{x:194,y:156}, elbow_L:{x:168,y:86}, elbow_R:{x:184,y:92}, wrist_L:{x:166,y:48}, wrist_R:{x:182,y:54}, hip_L:{x:232,y:302}, hip_R:{x:248,y:308}, knee_L:{x:182,y:355}, knee_R:{x:198,y:355}, ankle_L:{x:288,y:355}, ankle_R:{x:304,y:355}, mid_spine:{x:206,y:228}, isHoldStep:false, altShift:{tx:0,ty:-10,scale:1.06} },
      { head:{x:250,y:220}, shoulder_L:{x:280,y:245}, shoulder_R:{x:295,y:250}, elbow_L:{x:230,y:180}, elbow_R:{x:245,y:185}, wrist_L:{x:190,y:120}, wrist_R:{x:205,y:125}, hip_L:{x:350,y:302}, hip_R:{x:365,y:308}, knee_L:{x:310,y:355}, knee_R:{x:325,y:355}, ankle_L:{x:410,y:355}, ankle_R:{x:425,y:355}, mid_spine:{x:315,y:272}, isHoldStep:false, altShift:{tx:-15,ty:10,scale:1.08} },
      { head:{x:390,y:340}, shoulder_L:{x:340,y:310}, shoulder_R:{x:355,y:315}, elbow_L:{x:260,y:348}, elbow_R:{x:275,y:350}, wrist_L:{x:165,y:355}, wrist_R:{x:180,y:355}, hip_L:{x:380,y:302}, hip_R:{x:395,y:308}, knee_L:{x:330,y:355}, knee_R:{x:345,y:355}, ankle_L:{x:440,y:355}, ankle_R:{x:455,y:355}, mid_spine:{x:360,y:306}, isHoldStep:true, altShift:{tx:-20,ty:10,scale:1.1} },
      { head:{x:390,y:340}, shoulder_L:{x:340,y:310}, shoulder_R:{x:355,y:315}, elbow_L:{x:260,y:348}, elbow_R:{x:275,y:350}, wrist_L:{x:165,y:355}, wrist_R:{x:180,y:355}, hip_L:{x:380,y:302}, hip_R:{x:395,y:308}, knee_L:{x:330,y:355}, knee_R:{x:345,y:355}, ankle_L:{x:440,y:355}, ankle_R:{x:455,y:355}, mid_spine:{x:360,y:306}, isHoldStep:true, altShift:{tx:20,ty:0,scale:1.12} },
    ]
  },
  vrikshasana: {
    label: 'वृक्षासन · VRIKSHASANA · Tree Pose',
    viewBox: '0 0 400 560',
    matY: 510,
    viewType: 'front',
    steps: [
      { head:{x:200,y:74}, shoulder_L:{x:152,y:140}, shoulder_R:{x:248,y:140}, elbow_L:{x:150,y:202}, elbow_R:{x:250,y:202}, wrist_L:{x:148,y:266}, wrist_R:{x:252,y:266}, hip_L:{x:170,y:292}, hip_R:{x:230,y:292}, knee_L:{x:168,y:394}, knee_R:{x:232,y:394}, ankle_L:{x:166,y:502}, ankle_R:{x:234,y:502}, mid_spine:{x:200,y:218}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.06} },
      { head:{x:200,y:74}, shoulder_L:{x:152,y:140}, shoulder_R:{x:248,y:140}, elbow_L:{x:150,y:202}, elbow_R:{x:250,y:202}, wrist_L:{x:148,y:266}, wrist_R:{x:252,y:266}, hip_L:{x:170,y:292}, hip_R:{x:230,y:292}, knee_L:{x:168,y:394}, knee_R:{x:280,y:370}, ankle_L:{x:166,y:502}, ankle_R:{x:225,y:430}, mid_spine:{x:200,y:218}, isHoldStep:false, altShift:{tx:12,ty:0,scale:1.07} },
      { head:{x:200,y:74}, shoulder_L:{x:152,y:140}, shoulder_R:{x:248,y:140}, elbow_L:{x:150,y:202}, elbow_R:{x:250,y:202}, wrist_L:{x:148,y:266}, wrist_R:{x:252,y:266}, hip_L:{x:170,y:292}, hip_R:{x:230,y:292}, knee_L:{x:168,y:394}, knee_R:{x:310,y:360}, ankle_L:{x:166,y:502}, ankle_R:{x:190,y:325}, mid_spine:{x:200,y:218}, isHoldStep:false, altShift:{tx:18,ty:0,scale:1.08} },
      { head:{x:200,y:74}, shoulder_L:{x:152,y:140}, shoulder_R:{x:248,y:140}, elbow_L:{x:130,y:190}, elbow_R:{x:270,y:190}, wrist_L:{x:200,y:220}, wrist_R:{x:200,y:220}, hip_L:{x:170,y:292}, hip_R:{x:230,y:292}, knee_L:{x:168,y:394}, knee_R:{x:310,y:360}, ankle_L:{x:166,y:502}, ankle_R:{x:190,y:325}, mid_spine:{x:200,y:218}, isHoldStep:false, altShift:{tx:0,ty:-10,scale:1.09} },
      { head:{x:200,y:60}, shoulder_L:{x:152,y:130}, shoulder_R:{x:248,y:130}, elbow_L:{x:120,y:80}, elbow_R:{x:280,y:80}, wrist_L:{x:200,y:20}, wrist_R:{x:200,y:20}, hip_L:{x:170,y:282}, hip_R:{x:230,y:282}, knee_L:{x:168,y:390}, knee_R:{x:310,y:350}, ankle_L:{x:166,y:502}, ankle_R:{x:190,y:315}, mid_spine:{x:200,y:208}, isHoldStep:true, altShift:{tx:-15,ty:-10,scale:1.1} },
      { head:{x:200,y:60}, shoulder_L:{x:152,y:130}, shoulder_R:{x:248,y:130}, elbow_L:{x:120,y:80}, elbow_R:{x:280,y:80}, wrist_L:{x:200,y:20}, wrist_R:{x:200,y:20}, hip_L:{x:170,y:282}, hip_R:{x:230,y:282}, knee_L:{x:168,y:390}, knee_R:{x:310,y:350}, ankle_L:{x:166,y:502}, ankle_R:{x:190,y:315}, mid_spine:{x:200,y:208}, isHoldStep:true, altShift:{tx:20,ty:0,scale:1.12} },
    ]
  },
  bhujangasana: {
    label: 'भुजंगासन · BHUJANGASANA · Cobra Pose',
    viewBox: '0 0 560 380',
    matY: 355,
    viewType: 'prone',
    steps: [
      { head:{x:435,y:340}, shoulder_L:{x:380,y:335}, shoulder_R:{x:390,y:335}, elbow_L:{x:370,y:350}, elbow_R:{x:380,y:350}, wrist_L:{x:360,y:355}, wrist_R:{x:370,y:355}, hip_L:{x:280,y:340}, hip_R:{x:290,y:340}, knee_L:{x:190,y:345}, knee_R:{x:200,y:345}, ankle_L:{x:100,y:350}, ankle_R:{x:110,y:350}, mid_spine:{x:330,y:338}, isHoldStep:false, altShift:{tx:-15,ty:10,scale:1.06} },
      { head:{x:430,y:330}, shoulder_L:{x:375,y:325}, shoulder_R:{x:385,y:325}, elbow_L:{x:355,y:345}, elbow_R:{x:365,y:345}, wrist_L:{x:355,y:355}, wrist_R:{x:365,y:355}, hip_L:{x:280,y:340}, hip_R:{x:290,y:340}, knee_L:{x:190,y:345}, knee_R:{x:200,y:345}, ankle_L:{x:100,y:350}, ankle_R:{x:110,y:350}, mid_spine:{x:328,y:332}, isHoldStep:false, altShift:{tx:-10,ty:10,scale:1.06} },
      { head:{x:415,y:250}, shoulder_L:{x:360,y:270}, shoulder_R:{x:370,y:272}, elbow_L:{x:350,y:330}, elbow_R:{x:360,y:332}, wrist_L:{x:355,y:355}, wrist_R:{x:365,y:355}, hip_L:{x:275,y:340}, hip_R:{x:285,y:340}, knee_L:{x:190,y:345}, knee_R:{x:200,y:345}, ankle_L:{x:100,y:350}, ankle_R:{x:110,y:350}, mid_spine:{x:318,y:305}, isHoldStep:false, altShift:{tx:-20,ty:5,scale:1.08} },
      { head:{x:390,y:170}, shoulder_L:{x:340,y:210}, shoulder_R:{x:350,y:212}, elbow_L:{x:345,y:290}, elbow_R:{x:355,y:292}, wrist_L:{x:350,y:355}, wrist_R:{x:360,y:355}, hip_L:{x:270,y:340}, hip_R:{x:280,y:340}, knee_L:{x:190,y:345}, knee_R:{x:200,y:345}, ankle_L:{x:100,y:350}, ankle_R:{x:110,y:350}, mid_spine:{x:305,y:275}, isHoldStep:true, altShift:{tx:-25,ty:0,scale:1.1} },
      { head:{x:390,y:170}, shoulder_L:{x:340,y:210}, shoulder_R:{x:350,y:212}, elbow_L:{x:345,y:290}, elbow_R:{x:355,y:292}, wrist_L:{x:350,y:355}, wrist_R:{x:360,y:355}, hip_L:{x:270,y:340}, hip_R:{x:280,y:340}, knee_L:{x:190,y:345}, knee_R:{x:200,y:345}, ankle_L:{x:100,y:350}, ankle_R:{x:110,y:350}, mid_spine:{x:305,y:275}, isHoldStep:true, altShift:{tx:20,ty:0,scale:1.12} },
      { head:{x:435,y:340}, shoulder_L:{x:380,y:335}, shoulder_R:{x:390,y:335}, elbow_L:{x:370,y:350}, elbow_R:{x:380,y:350}, wrist_L:{x:360,y:355}, wrist_R:{x:370,y:355}, hip_L:{x:280,y:340}, hip_R:{x:290,y:340}, knee_L:{x:190,y:345}, knee_R:{x:200,y:345}, ankle_L:{x:100,y:350}, ankle_R:{x:110,y:350}, mid_spine:{x:330,y:338}, isHoldStep:false, altShift:{tx:0,ty:10,scale:1.06} },
    ]
  },
  utkatasana: {
    label: 'उत्कटासन · UTKATASANA · Chair Pose',
    viewBox: '0 0 400 560',
    matY: 510,
    viewType: 'front',
    steps: [
      { head:{x:200,y:74}, shoulder_L:{x:152,y:140}, shoulder_R:{x:248,y:140}, elbow_L:{x:150,y:202}, elbow_R:{x:250,y:202}, wrist_L:{x:148,y:266}, wrist_R:{x:252,y:266}, hip_L:{x:170,y:292}, hip_R:{x:230,y:292}, knee_L:{x:168,y:394}, knee_R:{x:232,y:394}, ankle_L:{x:166,y:502}, ankle_R:{x:234,y:502}, mid_spine:{x:200,y:218}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.06} },
      { head:{x:200,y:60}, shoulder_L:{x:152,y:130}, shoulder_R:{x:248,y:130}, elbow_L:{x:130,y:75}, elbow_R:{x:270,y:75}, wrist_L:{x:140,y:20}, wrist_R:{x:260,y:20}, hip_L:{x:170,y:292}, hip_R:{x:230,y:292}, knee_L:{x:168,y:394}, knee_R:{x:232,y:394}, ankle_L:{x:166,y:502}, ankle_R:{x:234,y:502}, mid_spine:{x:200,y:210}, isHoldStep:false, altShift:{tx:0,ty:-10,scale:1.07} },
      { head:{x:200,y:130}, shoulder_L:{x:152,y:190}, shoulder_R:{x:248,y:190}, elbow_L:{x:130,y:135}, elbow_R:{x:270,y:135}, wrist_L:{x:140,y:80}, wrist_R:{x:260,y:80}, hip_L:{x:170,y:350}, hip_R:{x:230,y:350}, knee_L:{x:150,y:425}, knee_R:{x:250,y:425}, ankle_L:{x:166,y:502}, ankle_R:{x:234,y:502}, mid_spine:{x:200,y:270}, isHoldStep:false, altShift:{tx:0,ty:15,scale:1.08} },
      { head:{x:200,y:130}, shoulder_L:{x:152,y:190}, shoulder_R:{x:248,y:190}, elbow_L:{x:130,y:135}, elbow_R:{x:270,y:135}, wrist_L:{x:140,y:80}, wrist_R:{x:260,y:80}, hip_L:{x:170,y:350}, hip_R:{x:230,y:350}, knee_L:{x:150,y:425}, knee_R:{x:250,y:425}, ankle_L:{x:166,y:502}, ankle_R:{x:234,y:502}, mid_spine:{x:200,y:270}, isHoldStep:true, altShift:{tx:-15,ty:10,scale:1.1} },
      { head:{x:200,y:74}, shoulder_L:{x:152,y:140}, shoulder_R:{x:248,y:140}, elbow_L:{x:150,y:202}, elbow_R:{x:250,y:202}, wrist_L:{x:148,y:266}, wrist_R:{x:252,y:266}, hip_L:{x:170,y:292}, hip_R:{x:230,y:292}, knee_L:{x:168,y:394}, knee_R:{x:232,y:394}, ankle_L:{x:166,y:502}, ankle_R:{x:234,y:502}, mid_spine:{x:200,y:218}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.06} },
    ]
  },
  'adho-mukha-svanasana': {
    label: 'अधोमुख श्वानासन · DOWNWARD DOG',
    viewBox: '0 0 560 420',
    matY: 395,
    viewType: 'side',
    steps: [
      { head:{x:260,y:200}, shoulder_L:{x:230,y:220}, shoulder_R:{x:240,y:222}, elbow_L:{x:230,y:295}, elbow_R:{x:240,y:297}, wrist_L:{x:230,y:370}, wrist_R:{x:240,y:372}, hip_L:{x:380,y:220}, hip_R:{x:390,y:222}, knee_L:{x:380,y:295}, knee_R:{x:390,y:297}, ankle_L:{x:380,y:370}, ankle_R:{x:390,y:372}, mid_spine:{x:305,y:220}, isHoldStep:false, altShift:{tx:0,ty:10,scale:1.06} },
      { head:{x:260,y:200}, shoulder_L:{x:230,y:220}, shoulder_R:{x:240,y:222}, elbow_L:{x:230,y:295}, elbow_R:{x:240,y:297}, wrist_L:{x:230,y:370}, wrist_R:{x:240,y:372}, hip_L:{x:380,y:220}, hip_R:{x:390,y:222}, knee_L:{x:380,y:295}, knee_R:{x:390,y:297}, ankle_L:{x:410,y:370}, ankle_R:{x:420,y:372}, mid_spine:{x:305,y:220}, isHoldStep:false, altShift:{tx:10,ty:10,scale:1.06} },
      { head:{x:220,y:240}, shoulder_L:{x:200,y:210}, shoulder_R:{x:210,y:212}, elbow_L:{x:215,y:290}, elbow_R:{x:225,y:292}, wrist_L:{x:230,y:370}, wrist_R:{x:240,y:372}, hip_L:{x:340,y:120}, hip_R:{x:350,y:122}, knee_L:{x:360,y:240}, knee_R:{x:370,y:242}, ankle_L:{x:380,y:360}, ankle_R:{x:390,y:362}, mid_spine:{x:270,y:165}, isHoldStep:false, altShift:{tx:-15,ty:-10,scale:1.08} },
      { head:{x:200,y:270}, shoulder_L:{x:180,y:230}, shoulder_R:{x:190,y:232}, elbow_L:{x:205,y:300}, elbow_R:{x:215,y:302}, wrist_L:{x:230,y:370}, wrist_R:{x:240,y:372}, hip_L:{x:340,y:100}, hip_R:{x:350,y:102}, knee_L:{x:380,y:235}, knee_R:{x:390,y:237}, ankle_L:{x:420,y:370}, ankle_R:{x:430,y:372}, mid_spine:{x:260,y:165}, isHoldStep:true, altShift:{tx:-20,ty:-15,scale:1.1} },
      { head:{x:200,y:270}, shoulder_L:{x:180,y:230}, shoulder_R:{x:190,y:232}, elbow_L:{x:205,y:300}, elbow_R:{x:215,y:302}, wrist_L:{x:230,y:370}, wrist_R:{x:240,y:372}, hip_L:{x:340,y:100}, hip_R:{x:350,y:102}, knee_L:{x:380,y:235}, knee_R:{x:390,y:237}, ankle_L:{x:420,y:370}, ankle_R:{x:430,y:372}, mid_spine:{x:260,y:165}, isHoldStep:true, altShift:{tx:20,ty:0,scale:1.12} },
    ]
  },
  'cat-cow-flow': {
    label: 'मार्जर्यासन-बिटिलासन · CAT-COW FLOW',
    viewBox: '0 0 560 420',
    matY: 395,
    viewType: 'side',
    steps: [
      { head:{x:260,y:200}, shoulder_L:{x:230,y:220}, shoulder_R:{x:240,y:222}, elbow_L:{x:230,y:295}, elbow_R:{x:240,y:297}, wrist_L:{x:230,y:370}, wrist_R:{x:240,y:372}, hip_L:{x:380,y:220}, hip_R:{x:390,y:222}, knee_L:{x:380,y:295}, knee_R:{x:390,y:297}, ankle_L:{x:430,y:370}, ankle_R:{x:440,y:372}, mid_spine:{x:305,y:220}, isHoldStep:false, altShift:{tx:0,ty:10,scale:1.06} },
      { head:{x:250,y:140}, shoulder_L:{x:230,y:210}, shoulder_R:{x:240,y:212}, elbow_L:{x:230,y:290}, elbow_R:{x:240,y:292}, wrist_L:{x:230,y:370}, wrist_R:{x:240,y:372}, hip_L:{x:380,y:210}, hip_R:{x:390,y:212}, knee_L:{x:380,y:295}, knee_R:{x:390,y:297}, ankle_L:{x:430,y:370}, ankle_R:{x:440,y:372}, mid_spine:{x:305,y:260}, isHoldStep:false, altShift:{tx:-10,ty:0,scale:1.07} },
      { head:{x:270,y:260}, shoulder_L:{x:230,y:220}, shoulder_R:{x:240,y:222}, elbow_L:{x:230,y:295}, elbow_R:{x:240,y:297}, wrist_L:{x:230,y:370}, wrist_R:{x:240,y:372}, hip_L:{x:380,y:230}, hip_R:{x:390,y:232}, knee_L:{x:380,y:295}, knee_R:{x:390,y:297}, ankle_L:{x:430,y:370}, ankle_R:{x:440,y:372}, mid_spine:{x:305,y:170}, isHoldStep:false, altShift:{tx:10,ty:-10,scale:1.08} },
      { head:{x:260,y:200}, shoulder_L:{x:230,y:220}, shoulder_R:{x:240,y:222}, elbow_L:{x:230,y:295}, elbow_R:{x:240,y:297}, wrist_L:{x:230,y:370}, wrist_R:{x:240,y:372}, hip_L:{x:380,y:220}, hip_R:{x:390,y:222}, knee_L:{x:380,y:295}, knee_R:{x:390,y:297}, ankle_L:{x:430,y:370}, ankle_R:{x:440,y:372}, mid_spine:{x:305,y:220}, isHoldStep:true, altShift:{tx:0,ty:10,scale:1.06} },
    ]
  },
  'surya-namaskar': {
    label: 'सूर्य नमस्कार · SURYA NAMASKAR · Sun Salutation',
    viewBox: '0 0 560 560',
    matY: 510,
    viewType: 'side',
    steps: [
      { head:{x:280,y:74}, shoulder_L:{x:260,y:140}, shoulder_R:{x:270,y:140}, elbow_L:{x:245,y:190}, elbow_R:{x:285,y:190}, wrist_L:{x:265,y:210}, wrist_R:{x:265,y:210}, hip_L:{x:270,y:292}, hip_R:{x:280,y:292}, knee_L:{x:270,y:394}, knee_R:{x:280,y:394}, ankle_L:{x:270,y:502}, ankle_R:{x:280,y:502}, mid_spine:{x:270,y:218}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.06} },
      { head:{x:230,y:80}, shoulder_L:{x:245,y:145}, shoulder_R:{x:255,y:145}, elbow_L:{x:205,y:95}, elbow_R:{x:215,y:95}, wrist_L:{x:170,y:50}, wrist_R:{x:180,y:50}, hip_L:{x:270,y:292}, hip_R:{x:280,y:292}, knee_L:{x:270,y:394}, knee_R:{x:280,y:394}, ankle_L:{x:270,y:502}, ankle_R:{x:280,y:502}, mid_spine:{x:255,y:218}, isHoldStep:false, altShift:{tx:-15,ty:-10,scale:1.07} },
      { head:{x:350,y:430}, shoulder_L:{x:310,y:360}, shoulder_R:{x:320,y:360}, elbow_L:{x:300,y:420}, elbow_R:{x:310,y:420}, wrist_L:{x:290,y:490}, wrist_R:{x:300,y:490}, hip_L:{x:270,y:292}, hip_R:{x:280,y:292}, knee_L:{x:270,y:394}, knee_R:{x:280,y:394}, ankle_L:{x:270,y:502}, ankle_R:{x:280,y:502}, mid_spine:{x:290,y:325}, isHoldStep:false, altShift:{tx:15,ty:10,scale:1.08} },
      { head:{x:300,y:300}, shoulder_L:{x:280,y:330}, shoulder_R:{x:290,y:330}, elbow_L:{x:260,y:390}, elbow_R:{x:270,y:390}, wrist_L:{x:240,y:450}, wrist_R:{x:250,y:450}, hip_L:{x:280,y:380}, hip_R:{x:290,y:380}, knee_L:{x:220,y:440}, knee_R:{x:380,y:460}, ankle_L:{x:220,y:502}, ankle_R:{x:460,y:502}, mid_spine:{x:280,y:355}, isHoldStep:false, altShift:{tx:0,ty:10,scale:1.06} },
      { head:{x:200,y:370}, shoulder_L:{x:180,y:330}, shoulder_R:{x:190,y:332}, elbow_L:{x:205,y:400}, elbow_R:{x:215,y:402}, wrist_L:{x:230,y:470}, wrist_R:{x:240,y:472}, hip_L:{x:340,y:200}, hip_R:{x:350,y:202}, knee_L:{x:380,y:335}, knee_R:{x:390,y:337}, ankle_L:{x:420,y:470}, ankle_R:{x:430,y:472}, mid_spine:{x:260,y:265}, isHoldStep:false, altShift:{tx:-20,ty:-15,scale:1.1} },
      { head:{x:260,y:470}, shoulder_L:{x:240,y:460}, shoulder_R:{x:250,y:460}, elbow_L:{x:230,y:480}, elbow_R:{x:240,y:480}, wrist_L:{x:220,y:490}, wrist_R:{x:230,y:490}, hip_L:{x:330,y:440}, hip_R:{x:340,y:440}, knee_L:{x:380,y:490}, knee_R:{x:390,y:490}, ankle_L:{x:450,y:495}, ankle_R:{x:460,y:495}, mid_spine:{x:285,y:450}, isHoldStep:false, altShift:{tx:0,ty:10,scale:1.06} },
      { head:{x:220,y:330}, shoulder_L:{x:240,y:370}, shoulder_R:{x:250,y:372}, elbow_L:{x:245,y:440}, elbow_R:{x:255,y:442}, wrist_L:{x:250,y:502}, wrist_R:{x:260,y:502}, hip_L:{x:330,y:440}, hip_R:{x:340,y:440}, knee_L:{x:390,y:465}, knee_R:{x:400,y:465}, ankle_L:{x:460,y:502}, ankle_R:{x:470,y:502}, mid_spine:{x:285,y:405}, isHoldStep:false, altShift:{tx:-25,ty:0,scale:1.1} },
      { head:{x:200,y:370}, shoulder_L:{x:180,y:330}, shoulder_R:{x:190,y:332}, elbow_L:{x:205,y:400}, elbow_R:{x:215,y:402}, wrist_L:{x:230,y:470}, wrist_R:{x:240,y:472}, hip_L:{x:340,y:200}, hip_R:{x:350,y:202}, knee_L:{x:380,y:335}, knee_R:{x:390,y:337}, ankle_L:{x:420,y:470}, ankle_R:{x:430,y:472}, mid_spine:{x:260,y:265}, isHoldStep:false, altShift:{tx:-20,ty:-15,scale:1.1} },
      { head:{x:300,y:300}, shoulder_L:{x:280,y:330}, shoulder_R:{x:290,y:330}, elbow_L:{x:260,y:390}, elbow_R:{x:270,y:390}, wrist_L:{x:240,y:450}, wrist_R:{x:250,y:450}, hip_L:{x:280,y:380}, hip_R:{x:290,y:380}, knee_L:{x:380,y:460}, knee_R:{x:220,y:440}, ankle_L:{x:460,y:502}, ankle_R:{x:220,y:502}, mid_spine:{x:280,y:355}, isHoldStep:false, altShift:{tx:0,ty:10,scale:1.06} },
      { head:{x:350,y:430}, shoulder_L:{x:310,y:360}, shoulder_R:{x:320,y:360}, elbow_L:{x:300,y:420}, elbow_R:{x:310,y:420}, wrist_L:{x:290,y:490}, wrist_R:{x:300,y:490}, hip_L:{x:270,y:292}, hip_R:{x:280,y:292}, knee_L:{x:270,y:394}, knee_R:{x:280,y:394}, ankle_L:{x:270,y:502}, ankle_R:{x:280,y:502}, mid_spine:{x:290,y:325}, isHoldStep:true, altShift:{tx:15,ty:10,scale:1.08} },
    ]
  },
  trikonasana: {
    label: 'त्रिकोणासन · TRIKONASANA · Triangle Pose',
    viewBox: '0 0 400 560',
    matY: 510,
    viewType: 'front',
    steps: [
      { head:{x:200,y:74}, shoulder_L:{x:152,y:140}, shoulder_R:{x:248,y:140}, elbow_L:{x:150,y:202}, elbow_R:{x:250,y:202}, wrist_L:{x:148,y:266}, wrist_R:{x:252,y:266}, hip_L:{x:170,y:292}, hip_R:{x:230,y:292}, knee_L:{x:168,y:394}, knee_R:{x:232,y:394}, ankle_L:{x:166,y:502}, ankle_R:{x:234,y:502}, mid_spine:{x:200,y:218}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.06} },
      { head:{x:200,y:74}, shoulder_L:{x:152,y:140}, shoulder_R:{x:248,y:140}, elbow_L:{x:150,y:202}, elbow_R:{x:250,y:202}, wrist_L:{x:148,y:266}, wrist_R:{x:252,y:266}, hip_L:{x:170,y:292}, hip_R:{x:230,y:292}, knee_L:{x:130,y:394}, knee_R:{x:270,y:394}, ankle_L:{x:100,y:502}, ankle_R:{x:300,y:502}, mid_spine:{x:200,y:218}, isHoldStep:false, altShift:{tx:10,ty:0,scale:1.06} },
      { head:{x:200,y:74}, shoulder_L:{x:152,y:140}, shoulder_R:{x:248,y:140}, elbow_L:{x:80,y:140}, elbow_R:{x:320,y:140}, wrist_L:{x:20,y:140}, wrist_R:{x:380,y:140}, hip_L:{x:170,y:292}, hip_R:{x:230,y:292}, knee_L:{x:130,y:394}, knee_R:{x:270,y:394}, ankle_L:{x:100,y:502}, ankle_R:{x:300,y:502}, mid_spine:{x:200,y:218}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.07} },
      { head:{x:140,y:160}, shoulder_L:{x:120,y:220}, shoulder_R:{x:170,y:160}, elbow_L:{x:110,y:330}, elbow_R:{x:220,y:110}, wrist_L:{x:105,y:440}, wrist_R:{x:270,y:60}, hip_L:{x:170,y:292}, hip_R:{x:230,y:292}, knee_L:{x:130,y:394}, knee_R:{x:270,y:394}, ankle_L:{x:100,y:502}, ankle_R:{x:300,y:502}, mid_spine:{x:145,y:250}, isHoldStep:false, altShift:{tx:-15,ty:10,scale:1.08} },
      { head:{x:140,y:160}, shoulder_L:{x:120,y:220}, shoulder_R:{x:170,y:160}, elbow_L:{x:110,y:330}, elbow_R:{x:220,y:110}, wrist_L:{x:105,y:440}, wrist_R:{x:270,y:60}, hip_L:{x:170,y:292}, hip_R:{x:230,y:292}, knee_L:{x:130,y:394}, knee_R:{x:270,y:394}, ankle_L:{x:100,y:502}, ankle_R:{x:300,y:502}, mid_spine:{x:145,y:250}, isHoldStep:true, altShift:{tx:-15,ty:10,scale:1.1} },
      { head:{x:200,y:74}, shoulder_L:{x:152,y:140}, shoulder_R:{x:248,y:140}, elbow_L:{x:150,y:202}, elbow_R:{x:250,y:202}, wrist_L:{x:148,y:266}, wrist_R:{x:252,y:266}, hip_L:{x:170,y:292}, hip_R:{x:230,y:292}, knee_L:{x:168,y:394}, knee_R:{x:232,y:394}, ankle_L:{x:166,y:502}, ankle_R:{x:234,y:502}, mid_spine:{x:200,y:218}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.06} },
    ]
  },
  'virabhadrasana-ii': {
    label: 'वीरभद्रासन II · WARRIOR II',
    viewBox: '0 0 400 560',
    matY: 510,
    viewType: 'front',
    steps: [
      { head:{x:200,y:74}, shoulder_L:{x:152,y:140}, shoulder_R:{x:248,y:140}, elbow_L:{x:150,y:202}, elbow_R:{x:250,y:202}, wrist_L:{x:148,y:266}, wrist_R:{x:252,y:266}, hip_L:{x:170,y:292}, hip_R:{x:230,y:292}, knee_L:{x:168,y:394}, knee_R:{x:232,y:394}, ankle_L:{x:166,y:502}, ankle_R:{x:234,y:502}, mid_spine:{x:200,y:218}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.06} },
      { head:{x:200,y:74}, shoulder_L:{x:152,y:140}, shoulder_R:{x:248,y:140}, elbow_L:{x:150,y:202}, elbow_R:{x:250,y:202}, wrist_L:{x:148,y:266}, wrist_R:{x:252,y:266}, hip_L:{x:170,y:292}, hip_R:{x:230,y:292}, knee_L:{x:130,y:394}, knee_R:{x:270,y:394}, ankle_L:{x:100,y:502}, ankle_R:{x:300,y:502}, mid_spine:{x:200,y:218}, isHoldStep:false, altShift:{tx:10,ty:0,scale:1.06} },
      { head:{x:200,y:74}, shoulder_L:{x:152,y:140}, shoulder_R:{x:248,y:140}, elbow_L:{x:150,y:202}, elbow_R:{x:250,y:202}, wrist_L:{x:148,y:266}, wrist_R:{x:252,y:266}, hip_L:{x:170,y:292}, hip_R:{x:230,y:292}, knee_L:{x:130,y:394}, knee_R:{x:270,y:394}, ankle_L:{x:100,y:502}, ankle_R:{x:300,y:502}, mid_spine:{x:200,y:218}, isHoldStep:false, altShift:{tx:10,ty:0,scale:1.06} },
      { head:{x:200,y:74}, shoulder_L:{x:152,y:140}, shoulder_R:{x:248,y:140}, elbow_L:{x:80,y:140}, elbow_R:{x:320,y:140}, wrist_L:{x:20,y:140}, wrist_R:{x:380,y:140}, hip_L:{x:170,y:292}, hip_R:{x:230,y:292}, knee_L:{x:130,y:394}, knee_R:{x:270,y:394}, ankle_L:{x:100,y:502}, ankle_R:{x:300,y:502}, mid_spine:{x:200,y:218}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.07} },
      { head:{x:200,y:104}, shoulder_L:{x:152,y:170}, shoulder_R:{x:248,y:170}, elbow_L:{x:80,y:170}, elbow_R:{x:320,y:170}, wrist_L:{x:20,y:170}, wrist_R:{x:380,y:170}, hip_L:{x:170,y:322}, hip_R:{x:230,y:322}, knee_L:{x:130,y:424}, knee_R:{x:300,y:400}, ankle_L:{x:100,y:502}, ankle_R:{x:300,y:502}, mid_spine:{x:200,y:248}, isHoldStep:false, altShift:{tx:15,ty:10,scale:1.08} },
      { head:{x:200,y:104}, shoulder_L:{x:152,y:170}, shoulder_R:{x:248,y:170}, elbow_L:{x:80,y:170}, elbow_R:{x:320,y:170}, wrist_L:{x:20,y:170}, wrist_R:{x:380,y:170}, hip_L:{x:170,y:322}, hip_R:{x:230,y:322}, knee_L:{x:130,y:424}, knee_R:{x:300,y:400}, ankle_L:{x:100,y:502}, ankle_R:{x:300,y:502}, mid_spine:{x:200,y:248}, isHoldStep:false, altShift:{tx:15,ty:10,scale:1.08} },
      { head:{x:200,y:104}, shoulder_L:{x:152,y:170}, shoulder_R:{x:248,y:170}, elbow_L:{x:80,y:170}, elbow_R:{x:320,y:170}, wrist_L:{x:20,y:170}, wrist_R:{x:380,y:170}, hip_L:{x:170,y:322}, hip_R:{x:230,y:322}, knee_L:{x:130,y:424}, knee_R:{x:300,y:400}, ankle_L:{x:100,y:502}, ankle_R:{x:300,y:502}, mid_spine:{x:200,y:248}, isHoldStep:true, altShift:{tx:15,ty:10,scale:1.1} },
      { head:{x:200,y:74}, shoulder_L:{x:152,y:140}, shoulder_R:{x:248,y:140}, elbow_L:{x:150,y:202}, elbow_R:{x:250,y:202}, wrist_L:{x:148,y:266}, wrist_R:{x:252,y:266}, hip_L:{x:170,y:292}, hip_R:{x:230,y:292}, knee_L:{x:168,y:394}, knee_R:{x:232,y:394}, ankle_L:{x:166,y:502}, ankle_R:{x:234,y:502}, mid_spine:{x:200,y:218}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.06} },
    ]
  },
  savasana: {
    label: 'शवासन · SAVASANA · Corpse Pose',
    viewBox: '0 0 560 380',
    matY: 355,
    viewType: 'supine',
    steps: [
      { head:{x:100,y:320}, shoulder_L:{x:150,y:330}, shoulder_R:{x:160,y:332}, elbow_L:{x:210,y:335}, elbow_R:{x:220,y:337}, wrist_L:{x:270,y:340}, wrist_R:{x:280,y:342}, hip_L:{x:280,y:335}, hip_R:{x:290,y:337}, knee_L:{x:380,y:340}, knee_R:{x:390,y:342}, ankle_L:{x:470,y:345}, ankle_R:{x:480,y:347}, mid_spine:{x:215,y:333}, isHoldStep:false, altShift:{tx:0,ty:10,scale:1.06} },
      { head:{x:100,y:320}, shoulder_L:{x:150,y:330}, shoulder_R:{x:160,y:332}, elbow_L:{x:210,y:335}, elbow_R:{x:220,y:337}, wrist_L:{x:270,y:340}, wrist_R:{x:280,y:342}, hip_L:{x:280,y:335}, hip_R:{x:290,y:337}, knee_L:{x:380,y:338}, knee_R:{x:390,y:344}, ankle_L:{x:470,y:340}, ankle_R:{x:480,y:350}, mid_spine:{x:215,y:333}, isHoldStep:false, altShift:{tx:10,ty:10,scale:1.06} },
      { head:{x:100,y:320}, shoulder_L:{x:150,y:330}, shoulder_R:{x:160,y:332}, elbow_L:{x:205,y:342}, elbow_R:{x:215,y:346}, wrist_L:{x:260,y:350}, wrist_R:{x:270,y:352}, hip_L:{x:280,y:335}, hip_R:{x:290,y:337}, knee_L:{x:380,y:338}, knee_R:{x:390,y:344}, ankle_L:{x:470,y:340}, ankle_R:{x:480,y:350}, mid_spine:{x:215,y:333}, isHoldStep:false, altShift:{tx:0,ty:5,scale:1.07} },
      { head:{x:95,y:322}, shoulder_L:{x:150,y:332}, shoulder_R:{x:160,y:334}, elbow_L:{x:205,y:344}, elbow_R:{x:215,y:348}, wrist_L:{x:260,y:352}, wrist_R:{x:270,y:354}, hip_L:{x:280,y:335}, hip_R:{x:290,y:337}, knee_L:{x:380,y:338}, knee_R:{x:390,y:344}, ankle_L:{x:470,y:340}, ankle_R:{x:480,y:350}, mid_spine:{x:215,y:334}, isHoldStep:false, altShift:{tx:-5,ty:5,scale:1.08} },
      { head:{x:95,y:322}, shoulder_L:{x:150,y:332}, shoulder_R:{x:160,y:334}, elbow_L:{x:205,y:344}, elbow_R:{x:215,y:348}, wrist_L:{x:260,y:352}, wrist_R:{x:270,y:354}, hip_L:{x:280,y:335}, hip_R:{x:290,y:337}, knee_L:{x:380,y:338}, knee_R:{x:390,y:344}, ankle_L:{x:470,y:340}, ankle_R:{x:480,y:350}, mid_spine:{x:215,y:334}, isHoldStep:true, altShift:{tx:-10,ty:0,scale:1.1} },
      { head:{x:105,y:300}, shoulder_L:{x:150,y:325}, shoulder_R:{x:160,y:327}, elbow_L:{x:195,y:335}, elbow_R:{x:205,y:337}, wrist_L:{x:240,y:345}, wrist_R:{x:250,y:347}, hip_L:{x:280,y:335}, hip_R:{x:290,y:337}, knee_L:{x:350,y:290}, knee_R:{x:360,y:292}, ankle_L:{x:380,y:345}, ankle_R:{x:390,y:347}, mid_spine:{x:215,y:330}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.06} },
    ]
  },
  virasana: {
    label: 'वीरासन · VIRASANA · Hero Pose',
    viewBox: '0 0 400 560',
    matY: 480,
    viewType: 'front',
    steps: [
      { head:{x:200,y:77}, shoulder_L:{x:148,y:168}, shoulder_R:{x:252,y:168}, elbow_L:{x:162,y:236}, elbow_R:{x:248,y:236}, wrist_L:{x:172,y:300}, wrist_R:{x:238,y:300}, hip_L:{x:165,y:340}, hip_R:{x:235,y:340}, knee_L:{x:155,y:456}, knee_R:{x:245,y:456}, ankle_L:{x:152,y:480}, ankle_R:{x:248,y:480}, mid_spine:{x:200,y:255}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.06} },
      { head:{x:200,y:77}, shoulder_L:{x:148,y:168}, shoulder_R:{x:252,y:168}, elbow_L:{x:162,y:236}, elbow_R:{x:248,y:236}, wrist_L:{x:172,y:300}, wrist_R:{x:238,y:300}, hip_L:{x:165,y:340}, hip_R:{x:235,y:340}, knee_L:{x:155,y:456}, knee_R:{x:245,y:456}, ankle_L:{x:135,y:480}, ankle_R:{x:265,y:480}, mid_spine:{x:200,y:255}, isHoldStep:false, altShift:{tx:5,ty:0,scale:1.06} },
      { head:{x:200,y:87}, shoulder_L:{x:148,y:178}, shoulder_R:{x:252,y:178}, elbow_L:{x:162,y:246}, elbow_R:{x:248,y:246}, wrist_L:{x:172,y:310}, wrist_R:{x:238,y:310}, hip_L:{x:165,y:360}, hip_R:{x:235,y:360}, knee_L:{x:155,y:456}, knee_R:{x:245,y:456}, ankle_L:{x:135,y:480}, ankle_R:{x:265,y:480}, mid_spine:{x:200,y:269}, isHoldStep:false, altShift:{tx:0,ty:5,scale:1.07} },
      { head:{x:200,y:77}, shoulder_L:{x:148,y:168}, shoulder_R:{x:252,y:168}, elbow_L:{x:162,y:236}, elbow_R:{x:248,y:236}, wrist_L:{x:172,y:300}, wrist_R:{x:238,y:300}, hip_L:{x:165,y:355}, hip_R:{x:235,y:355}, knee_L:{x:155,y:456}, knee_R:{x:245,y:456}, ankle_L:{x:135,y:480}, ankle_R:{x:265,y:480}, mid_spine:{x:200,y:261}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.08} },
      { head:{x:200,y:77}, shoulder_L:{x:148,y:168}, shoulder_R:{x:252,y:168}, elbow_L:{x:162,y:236}, elbow_R:{x:248,y:236}, wrist_L:{x:172,y:300}, wrist_R:{x:238,y:300}, hip_L:{x:165,y:355}, hip_R:{x:235,y:355}, knee_L:{x:155,y:456}, knee_R:{x:245,y:456}, ankle_L:{x:135,y:480}, ankle_R:{x:265,y:480}, mid_spine:{x:200,y:261}, isHoldStep:true, altShift:{tx:-10,ty:0,scale:1.1} },
      { head:{x:200,y:57}, shoulder_L:{x:148,y:148}, shoulder_R:{x:252,y:148}, elbow_L:{x:162,y:216}, elbow_R:{x:248,y:216}, wrist_L:{x:172,y:280}, wrist_R:{x:238,y:280}, hip_L:{x:165,y:320}, hip_R:{x:235,y:320}, knee_L:{x:155,y:420}, knee_R:{x:245,y:420}, ankle_L:{x:152,y:480}, ankle_R:{x:248,y:480}, mid_spine:{x:200,y:234}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.06} },
    ]
  },
  'baddha-konasana': {
    label: 'बद्धकोणासन · BADDHA KONASANA · Bound Angle Pose',
    viewBox: '0 0 400 560',
    matY: 480,
    viewType: 'front',
    steps: [
      { head:{x:200,y:77}, shoulder_L:{x:148,y:168}, shoulder_R:{x:252,y:168}, elbow_L:{x:145,y:268}, elbow_R:{x:255,y:268}, wrist_L:{x:142,y:360}, wrist_R:{x:258,y:360}, hip_L:{x:165,y:360}, hip_R:{x:235,y:360}, knee_L:{x:165,y:425}, knee_R:{x:235,y:425}, ankle_L:{x:165,y:480}, ankle_R:{x:235,y:480}, mid_spine:{x:200,y:264}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.06} },
      { head:{x:200,y:77}, shoulder_L:{x:148,y:168}, shoulder_R:{x:252,y:168}, elbow_L:{x:145,y:268}, elbow_R:{x:255,y:268}, wrist_L:{x:142,y:360}, wrist_R:{x:258,y:360}, hip_L:{x:165,y:360}, hip_R:{x:235,y:360}, knee_L:{x:90,y:440}, knee_R:{x:310,y:440}, ankle_L:{x:195,y:470}, ankle_R:{x:205,y:470}, mid_spine:{x:200,y:264}, isHoldStep:false, altShift:{tx:5,ty:0,scale:1.06} },
      { head:{x:200,y:87}, shoulder_L:{x:148,y:178}, shoulder_R:{x:252,y:178}, elbow_L:{x:155,y:280}, elbow_R:{x:245,y:280}, wrist_L:{x:200,y:455}, wrist_R:{x:200,y:455}, hip_L:{x:165,y:360}, hip_R:{x:235,y:360}, knee_L:{x:90,y:440}, knee_R:{x:310,y:440}, ankle_L:{x:195,y:470}, ankle_R:{x:205,y:470}, mid_spine:{x:200,y:269}, isHoldStep:false, altShift:{tx:0,ty:5,scale:1.07} },
      { head:{x:200,y:77}, shoulder_L:{x:148,y:168}, shoulder_R:{x:252,y:168}, elbow_L:{x:155,y:280}, elbow_R:{x:245,y:280}, wrist_L:{x:200,y:455}, wrist_R:{x:200,y:455}, hip_L:{x:165,y:360}, hip_R:{x:235,y:360}, knee_L:{x:90,y:440}, knee_R:{x:310,y:440}, ankle_L:{x:195,y:470}, ankle_R:{x:205,y:470}, mid_spine:{x:200,y:264}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.08} },
      { head:{x:200,y:77}, shoulder_L:{x:148,y:168}, shoulder_R:{x:252,y:168}, elbow_L:{x:155,y:280}, elbow_R:{x:245,y:280}, wrist_L:{x:200,y:455}, wrist_R:{x:200,y:455}, hip_L:{x:165,y:360}, hip_R:{x:235,y:360}, knee_L:{x:90,y:440}, knee_R:{x:310,y:440}, ankle_L:{x:195,y:470}, ankle_R:{x:205,y:470}, mid_spine:{x:200,y:264}, isHoldStep:true, altShift:{tx:-10,ty:0,scale:1.1} },
      { head:{x:200,y:77}, shoulder_L:{x:148,y:168}, shoulder_R:{x:252,y:168}, elbow_L:{x:145,y:268}, elbow_R:{x:255,y:268}, wrist_L:{x:142,y:360}, wrist_R:{x:258,y:360}, hip_L:{x:165,y:360}, hip_R:{x:235,y:360}, knee_L:{x:165,y:425}, knee_R:{x:235,y:425}, ankle_L:{x:165,y:480}, ankle_R:{x:235,y:480}, mid_spine:{x:200,y:264}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.06} },
    ]
  },
  'setu-bandhasana': {
    label: 'सेतुबंधासन · SETU BANDHASANA · Bridge Pose',
    viewBox: '0 0 560 380',
    matY: 355,
    viewType: 'supine',
    steps: [
      { head:{x:100,y:320}, shoulder_L:{x:150,y:330}, shoulder_R:{x:160,y:332}, elbow_L:{x:210,y:335}, elbow_R:{x:220,y:337}, wrist_L:{x:270,y:340}, wrist_R:{x:280,y:342}, hip_L:{x:280,y:335}, hip_R:{x:290,y:337}, knee_L:{x:380,y:260}, knee_R:{x:390,y:262}, ankle_L:{x:400,y:355}, ankle_R:{x:410,y:355}, mid_spine:{x:215,y:333}, isHoldStep:false, altShift:{tx:0,ty:10,scale:1.06} },
      { head:{x:100,y:320}, shoulder_L:{x:150,y:330}, shoulder_R:{x:160,y:332}, elbow_L:{x:205,y:344}, elbow_R:{x:215,y:348}, wrist_L:{x:260,y:352}, wrist_R:{x:270,y:354}, hip_L:{x:280,y:335}, hip_R:{x:290,y:337}, knee_L:{x:380,y:240}, knee_R:{x:390,y:242}, ankle_L:{x:400,y:355}, ankle_R:{x:410,y:355}, mid_spine:{x:215,y:333}, isHoldStep:false, altShift:{tx:5,ty:10,scale:1.06} },
      { head:{x:100,y:320}, shoulder_L:{x:150,y:330}, shoulder_R:{x:160,y:332}, elbow_L:{x:205,y:344}, elbow_R:{x:215,y:348}, wrist_L:{x:260,y:352}, wrist_R:{x:270,y:354}, hip_L:{x:270,y:220}, hip_R:{x:280,y:225}, knee_L:{x:380,y:235}, knee_R:{x:390,y:240}, ankle_L:{x:400,y:355}, ankle_R:{x:410,y:355}, mid_spine:{x:210,y:275}, isHoldStep:false, altShift:{tx:0,ty:5,scale:1.07} },
      { head:{x:100,y:320}, shoulder_L:{x:150,y:330}, shoulder_R:{x:160,y:332}, elbow_L:{x:205,y:344}, elbow_R:{x:215,y:348}, wrist_L:{x:260,y:352}, wrist_R:{x:270,y:354}, hip_L:{x:270,y:175}, hip_R:{x:280,y:180}, knee_L:{x:380,y:235}, knee_R:{x:390,y:240}, ankle_L:{x:400,y:355}, ankle_R:{x:410,y:355}, mid_spine:{x:210,y:252}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.08} },
      { head:{x:100,y:320}, shoulder_L:{x:150,y:330}, shoulder_R:{x:160,y:332}, elbow_L:{x:205,y:344}, elbow_R:{x:215,y:348}, wrist_L:{x:260,y:352}, wrist_R:{x:270,y:354}, hip_L:{x:270,y:175}, hip_R:{x:280,y:180}, knee_L:{x:380,y:235}, knee_R:{x:390,y:240}, ankle_L:{x:400,y:355}, ankle_R:{x:410,y:355}, mid_spine:{x:210,y:252}, isHoldStep:true, altShift:{tx:-10,ty:0,scale:1.1} },
      { head:{x:100,y:320}, shoulder_L:{x:150,y:330}, shoulder_R:{x:160,y:332}, elbow_L:{x:210,y:335}, elbow_R:{x:220,y:337}, wrist_L:{x:270,y:340}, wrist_R:{x:280,y:342}, hip_L:{x:280,y:335}, hip_R:{x:290,y:337}, knee_L:{x:380,y:340}, knee_R:{x:390,y:342}, ankle_L:{x:470,y:345}, ankle_R:{x:480,y:347}, mid_spine:{x:215,y:333}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.06} },
    ]
  },
  paschimottanasana: {
    label: 'पश्चिमोत्तानासन · PASCHIMOTTANASANA · Seated Forward Bend',
    viewBox: '0 0 560 380',
    matY: 355,
    viewType: 'side',
    steps: [
      { head:{x:230,y:105}, shoulder_L:{x:248,y:170}, shoulder_R:{x:260,y:174}, elbow_L:{x:246,y:240}, elbow_R:{x:258,y:244}, wrist_L:{x:244,y:305}, wrist_R:{x:256,y:309}, hip_L:{x:260,y:300}, hip_R:{x:272,y:304}, knee_L:{x:390,y:320}, knee_R:{x:402,y:324}, ankle_L:{x:490,y:355}, ankle_R:{x:502,y:355}, mid_spine:{x:250,y:235}, isHoldStep:false, altShift:{tx:0,ty:10,scale:1.06} },
      { head:{x:225,y:55}, shoulder_L:{x:244,y:125}, shoulder_R:{x:256,y:129}, elbow_L:{x:226,y:70}, elbow_R:{x:238,y:74}, wrist_L:{x:220,y:20}, wrist_R:{x:232,y:24}, hip_L:{x:260,y:300}, hip_R:{x:272,y:304}, knee_L:{x:390,y:320}, knee_R:{x:402,y:324}, ankle_L:{x:490,y:355}, ankle_R:{x:502,y:355}, mid_spine:{x:253,y:213}, isHoldStep:false, altShift:{tx:-10,ty:0,scale:1.07} },
      { head:{x:280,y:140}, shoulder_L:{x:310,y:195}, shoulder_R:{x:322,y:199}, elbow_L:{x:360,y:235}, elbow_R:{x:372,y:239}, wrist_L:{x:420,y:260}, wrist_R:{x:432,y:264}, hip_L:{x:260,y:300}, hip_R:{x:272,y:304}, knee_L:{x:390,y:320}, knee_R:{x:402,y:324}, ankle_L:{x:490,y:355}, ankle_R:{x:502,y:355}, mid_spine:{x:285,y:248}, isHoldStep:false, altShift:{tx:10,ty:5,scale:1.07} },
      { head:{x:350,y:195}, shoulder_L:{x:370,y:240}, shoulder_R:{x:382,y:244}, elbow_L:{x:420,y:265}, elbow_R:{x:432,y:269}, wrist_L:{x:468,y:300}, wrist_R:{x:480,y:304}, hip_L:{x:260,y:300}, hip_R:{x:272,y:304}, knee_L:{x:390,y:320}, knee_R:{x:402,y:324}, ankle_L:{x:490,y:355}, ankle_R:{x:502,y:355}, mid_spine:{x:315,y:270}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.08} },
      { head:{x:390,y:238}, shoulder_L:{x:404,y:278}, shoulder_R:{x:416,y:282}, elbow_L:{x:448,y:296}, elbow_R:{x:460,y:300}, wrist_L:{x:484,y:332}, wrist_R:{x:496,y:336}, hip_L:{x:260,y:300}, hip_R:{x:272,y:304}, knee_L:{x:390,y:320}, knee_R:{x:402,y:324}, ankle_L:{x:490,y:355}, ankle_R:{x:502,y:355}, mid_spine:{x:332,y:289}, isHoldStep:true, altShift:{tx:-10,ty:0,scale:1.1} },
      { head:{x:230,y:105}, shoulder_L:{x:248,y:170}, shoulder_R:{x:260,y:174}, elbow_L:{x:246,y:240}, elbow_R:{x:258,y:244}, wrist_L:{x:244,y:305}, wrist_R:{x:256,y:309}, hip_L:{x:260,y:300}, hip_R:{x:272,y:304}, knee_L:{x:390,y:320}, knee_R:{x:402,y:324}, ankle_L:{x:490,y:355}, ankle_R:{x:502,y:355}, mid_spine:{x:250,y:235}, isHoldStep:false, altShift:{tx:0,ty:0,scale:1.06} },
    ]
  }
};

export default function YogaSVG({ asanaId, coords, showAltView = false }) {
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

  const neckX = isFront ? (coords.shoulder_L.x + coords.shoulder_R.x) / 2 : coords.shoulder_L.x;
  const neckY = coords.shoulder_L.y;
  const spBotX = isFront ? (coords.hip_L.x + coords.hip_R.x) / 2 : coords.hip_L.x;
  const spBotY = coords.hip_L.y;
  const spTopX = isFront ? (coords.shoulder_L.x + coords.shoulder_R.x) / 2 : coords.shoulder_L.x;
  const spTopY = coords.shoulder_L.y;

  return (
    <svg viewBox={data.viewBox}
      className="w-full h-full select-none"
      style={{ display:'block', transform: svgTransform, transition:'transform 0.85s cubic-bezier(0.4,0,0.2,1)', transformOrigin:'50% 50%' }}>
      <defs>
        <linearGradient id={`bg-${asanaId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d0821"/>
          <stop offset="100%" stopColor="#130d24"/>
        </linearGradient>
        <radialGradient id={`amb-${asanaId}`} cx="50%" cy="88%" r="55%">
          <stop offset="0%" stopColor="#5b21b6" stopOpacity="0.2"/>
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
      <rect x="40" y={data.matY} width={vbW - 80} height="14" rx="7" fill="#3b0764" stroke="#7c3aed" strokeWidth={0.8} opacity="0.9"/>

      {/* SKELETON */}
      <g strokeLinecap="round" strokeLinejoin="round" filter={`url(#glow-${asanaId})`}>
        <line x1={coords.hip_R.x} y1={coords.hip_R.y} x2={coords.knee_R.x} y2={coords.knee_R.y} stroke="#4c1d95" strokeWidth={5}/>
        <line x1={coords.knee_R.x} y1={coords.knee_R.y} x2={coords.ankle_R.x} y2={coords.ankle_R.y} stroke="#4c1d95" strokeWidth={5}/>
        <line x1={coords.shoulder_R.x} y1={coords.shoulder_R.y} x2={coords.elbow_R.x} y2={coords.elbow_R.y} stroke="#5b21b6" strokeWidth={3.5}/>
        <line x1={coords.elbow_R.x} y1={coords.elbow_R.y} x2={coords.wrist_R.x} y2={coords.wrist_R.y} stroke="#5b21b6" strokeWidth={3.5}/>

        <line x1={coords.hip_L.x} y1={coords.hip_L.y} x2={coords.knee_L.x} y2={coords.knee_L.y} stroke="#8b5cf6" strokeWidth={6}/>
        <line x1={coords.knee_L.x} y1={coords.knee_L.y} x2={coords.ankle_L.x} y2={coords.ankle_L.y} stroke="#7c3aed" strokeWidth={6}/>

        <line x1={coords.shoulder_L.x} y1={coords.shoulder_L.y} x2={coords.shoulder_R.x} y2={coords.shoulder_R.y} stroke="#9f7aea" strokeWidth={3.5}/>
        <line x1={coords.hip_L.x} y1={coords.hip_L.y} x2={coords.hip_R.x} y2={coords.hip_R.y} stroke="#7c3aed" strokeWidth={3.5}/>

        <path d={`M${spBotX} ${spBotY} Q${coords.mid_spine.x} ${coords.mid_spine.y} ${spTopX} ${spTopY}`} fill="none" stroke="#a78bfa" strokeWidth={5}/>
        <line x1={neckX} y1={neckY} x2={coords.head.x} y2={coords.head.y} stroke="#c4b5fd" strokeWidth={3.5}/>

        <line x1={coords.shoulder_L.x} y1={coords.shoulder_L.y} x2={coords.elbow_L.x} y2={coords.elbow_L.y} stroke="#c4b5fd" strokeWidth={4}/>
        <line x1={coords.elbow_L.x} y1={coords.elbow_L.y} x2={coords.wrist_L.x} y2={coords.wrist_L.y} stroke="#c4b5fd" strokeWidth={4}/>

        <circle cx={coords.head.x} cy={coords.head.y} r={isProne ? 18 : 23} fill="#0d0821" stroke="#c4b5fd" strokeWidth={3}/>

        {/* Joint nodes */}
        {['shoulder_L','elbow_L','wrist_L','hip_L','knee_L','ankle_L'].map(k => (
          <circle key={k} cx={coords[k].x} cy={coords[k].y} r={4.5} fill="#a78bfa"/>
        ))}
      </g>
    </svg>
  );
}
