const fs = require('fs');
const path = require('path');

const asanas = [
  {
    id: "surya-namaskar",
    name: "Surya Namaskar",
    sanskrit: "सूर्य नमस्कार",
    english: "Sun Salutation",
    difficulty: "Intermediate",
    duration_seconds: 60,
    description: "A dynamic sequence of 12 postures coordinated with deep breathing. Surya Namaskar builds full-body strength, flexibility, and cardiovascular endurance.",
    benefits: [
      "Warms up the entire body",
      "Improves blood circulation",
      "Stretches and strengthens muscles",
      "Calms the nervous system"
    ],
    steps: [
      { step_number: 1, type: "hold", instruction: "Pranamasana: Stand at the front of the mat, palms pressed together at your chest.", duration: 5, voice_prompt: "Pranamasana. Stand tall and join your palms at your chest in prayer position.", video_start: 0, video_end: 5 },
      { step_number: 2, type: "hold", instruction: "Hastauttanasana: Inhale, raise your arms up and arch your back slightly.", duration: 5, voice_prompt: "Hastauttanasana. Inhale, raise your arms up and bend backward slightly.", video_start: 6, video_end: 11 },
      { step_number: 3, type: "hold", instruction: "Uttanasana: Exhale, bend forward from the waist and touch the floor.", duration: 5, voice_prompt: "Uttanasana. Exhale, fold forward and touch your feet.", video_start: 12, video_end: 17 }
    ]
  },
  {
    id: "vrikshasana",
    name: "Vrikshasana",
    sanskrit: "वृक्षासन",
    english: "Tree Pose",
    difficulty: "Beginner",
    duration_seconds: 30,
    description: "A classic standing balance pose. Vrikshasana improves focus, concentration, and balance while strengthening the legs.",
    benefits: [
      "Improves balance and posture",
      "Strengthens thighs, calves, and ankles",
      "Opens the chest and shoulders",
      "Calms the mind"
    ],
    steps: [
      { step_number: 1, type: "hold", instruction: "Stand tall, shift your weight onto your left leg, and place your right foot on your inner left thigh.", duration: 5, voice_prompt: "Stand tall. Lift your right foot and place it on your inner left thigh, keeping your balance.", video_start: 0, video_end: 6 },
      { step_number: 2, type: "hold", instruction: "Join your palms in front of your chest, then raise them overhead.", duration: 5, voice_prompt: "Bring your hands together at your chest, then slowly stretch them up to the sky.", video_start: 7, video_end: 13 }
    ]
  },
  {
    id: "adho-mukha-svanasana",
    name: "Adho Mukha Svanasana",
    sanskrit: "अधोमुखश्वानासन",
    english: "Downward-Facing Dog",
    difficulty: "Beginner",
    duration_seconds: 30,
    description: "One of the most widely recognized yoga poses. It stretches the entire body, energizes the nervous system, and builds upper body strength.",
    benefits: [
      "Stretches shoulders, hamstrings, and calves",
      "Strengthens arms and legs",
      "Relieves back pain and fatigue",
      "Calms the brain"
    ],
    steps: [
      { step_number: 1, type: "hold", instruction: "Start on hands and knees, push your hips up and back to form an inverted V-shape.", duration: 5, voice_prompt: "Press your hands into the floor, lift your hips high, and press your heels down into Downward Facing Dog.", video_start: 0, video_end: 8 }
    ]
  },
  {
    id: "virabhadrasana-ii",
    name: "Virabhadrasana II",
    sanskrit: "वीरभद्रासन II",
    english: "Warrior II",
    difficulty: "Beginner",
    duration_seconds: 30,
    description: "A powerful standing pose that builds stamina, focus, and strength in the legs and core.",
    benefits: [
      "Strengthens legs and ankles",
      "Stretches groin, chest, and shoulders",
      "Increases stamina and concentration",
      "Stimulates abdominal organs"
    ],
    steps: [
      { step_number: 1, type: "hold", instruction: "Step your feet wide, bend your front knee to 90 degrees, and extend your arms parallel to the floor.", duration: 5, voice_prompt: "Step your feet wide apart, bend your right knee, and stretch your arms out wide.", video_start: 0, video_end: 8 }
    ]
  },
  {
    id: "balasana",
    name: "Balasana",
    sanskrit: "बालासन",
    english: "Child's Pose",
    difficulty: "Beginner",
    duration_seconds: 30,
    description: "A deeply restorative resting posture. Balasana stretches the lower back and hips while calming the mind and nervous system.",
    benefits: [
      "Gently stretches hips, thighs, and ankles",
      "Calms the brain and helps relieve stress",
      "Relieves back and neck pain"
    ],
    steps: [
      { step_number: 1, type: "hold", instruction: "Kneel on the floor, sit back on your heels, and fold forward, resting your forehead on the mat.", duration: 5, voice_prompt: "Kneel down, sit back on your heels, and lay your chest down, resting your forehead on the floor.", video_start: 0, video_end: 8 }
    ]
  },
  {
    id: "bhujangasana",
    name: "Bhujangasana",
    sanskrit: "भुजङ्गासन",
    english: "Cobra Pose",
    difficulty: "Beginner",
    duration_seconds: 30,
    description: "A prone backbend that opens the chest, strengthens the spine, and improves lung capacity.",
    benefits: [
      "Strengthens the spine",
      "Stretches chest, lungs, shoulders, and abdomen",
      "Firms the buttocks",
      "Helps relieve stress and fatigue"
    ],
    steps: [
      { step_number: 1, type: "hold", instruction: "Lie face down, place your hands under your shoulders, and gently lift your chest off the floor.", duration: 5, voice_prompt: "Lie on your belly, place hands under your shoulders, and slowly lift your chest, keeping your elbows bent.", video_start: 0, video_end: 8 }
    ]
  },
  {
    id: "trikonasana",
    name: "Trikonasana",
    sanskrit: "त्रिकोणासन",
    english: "Triangle Pose",
    difficulty: "Beginner",
    duration_seconds: 30,
    description: "A foundational standing pose that stretches the hamstrings, spine, and chest while improving core stability.",
    benefits: [
      "Stretches legs, knees, ankles, chest, and shoulders",
      "Improves digestion",
      "Helps relieve backache",
      "Strengthens core and legs"
    ],
    steps: [
      { step_number: 1, type: "hold", instruction: "Step your feet wide, turn your right foot out, and reach your right hand down to your shin while pointing your left hand to the sky.", duration: 5, voice_prompt: "Feet wide apart. Fold sideways over your right leg, reaching down with your right hand and pointing your left arm straight up.", video_start: 0, video_end: 8 }
    ]
  },
  {
    id: "utkatasana",
    name: "Utkatasana",
    sanskrit: "उत्कटासन",
    english: "Chair Pose",
    difficulty: "Beginner",
    duration_seconds: 30,
    description: "A powerful standing squat that generates heat, strengthens the legs, and engages the core.",
    benefits: [
      "Strengthens ankles, thighs, calves, and spine",
      "Stretches shoulders and chest",
      "Stimulates abdominal organs and heart",
      "Reduces flat feet"
    ],
    steps: [
      { step_number: 1, type: "hold", instruction: "Inhale, raise your arms overhead, bend your knees, and sit back as if in a chair.", duration: 5, voice_prompt: "Raise your arms overhead, bend your knees, and sit back as if you are sitting on an imaginary chair.", video_start: 0, video_end: 8 }
    ]
  },
  {
    id: "cat-cow-flow",
    name: "Cat-Cow Flow",
    sanskrit: "मार्जरीआसन / बितिलासन",
    english: "Spine Warmup",
    difficulty: "Beginner",
    duration_seconds: 30,
    description: "A gentle, repetitive flow coordinating spinal arching and rounding with inhalation and exhalation.",
    benefits: [
      "Warms up and mobilizes the entire spine",
      "Relieves back tension",
      "Coordinative breath and movement training"
    ],
    steps: [
      { step_number: 1, type: "hold", instruction: "On all fours, inhale, arch your back, and lift your gaze (Cow Pose). Exhale, round your spine, and tuck your chin (Cat Pose).", duration: 5, voice_prompt: "On hands and knees, inhale, drop your belly and look up. Exhale, round your back and tuck your chin.", video_start: 0, video_end: 8 }
    ]
  }
];

const baseDir = path.join(__dirname, '..', 'public', 'asanas');

asanas.forEach((asana) => {
  const asanaDir = path.join(baseDir, asana.id);
  if (!fs.existsSync(asanaDir)) {
    fs.mkdirSync(asanaDir, { recursive: true });
  }

  // Write config.json
  fs.writeFileSync(
    path.join(asanaDir, 'config.json'),
    JSON.stringify(asana, null, 2)
  );

  console.log(`Generated registry config for ${asana.name}`);
});
console.log('Asana registry folders updated successfully with video timestamps!');
