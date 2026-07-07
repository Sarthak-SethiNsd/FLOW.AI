import os
import json

BASE_DIR = r"c:\Users\LENOVO\Desktop\Websites\Yoga-Project\public\asanas"

# Load tadasana config first to preserve and map its validation objects
tadasana_path = os.path.join(BASE_DIR, "tadasana", "config.json")
with open(tadasana_path, "r", encoding="utf-8") as f:
    tadasana_orig = json.load(f)

# Extract original validations from tadasana steps
v_step1 = tadasana_orig["steps"][0].get("validation", [])
v_step2 = tadasana_orig["steps"][1].get("validation", [])
v_step3 = tadasana_orig["steps"][2].get("validation", [])
v_step4 = tadasana_orig["steps"][3].get("validation", [])
v_step5 = tadasana_orig["steps"][4].get("validation", [])

pose_configs = {
    "cat-cow-flow": {
        "name": "Cat-Cow Flow",
        "sanskrit": "मार्जरीआसन",
        "english": "Cat-Cow Stretch",
        "difficulty": "Beginner",
        "duration_seconds": 14.51,
        "description": "A gentle flow between arching and rounding the back that warms up the spine, stretches the torso, and coordinates breath with movement.",
        "benefits": ["Stretches the spine and neck", "Massages the abdominal organs", "Relieves stress and calms the mind"],
        "steps": [
            {
                "step_number": 1,
                "type": "hold",
                "instruction": "Start on hands and knees with a flat, neutral tabletop spine.",
                "duration": 3,
                "voice_prompt": "Start on your hands and knees with your spine flat, hands under shoulders, and knees under hips.",
                "video_start": 0.0,
                "video_end": 2.90
            },
            {
                "step_number": 2,
                "type": "hold",
                "instruction": "Cat Pose: Exhale and round your spine up toward the ceiling.",
                "duration": 3,
                "voice_prompt": "Exhale, pull your belly in, round your spine up towards the ceiling, and tuck your chin.",
                "video_start": 2.90,
                "video_end": 5.80
            },
            {
                "step_number": 3,
                "type": "hold",
                "instruction": "Hold Cat Pose, breathing into your shoulders.",
                "duration": 3,
                "voice_prompt": "Hold the cat stretch. Feel the space opening up between your shoulder blades.",
                "video_start": 5.80,
                "video_end": 8.70
            },
            {
                "step_number": 4,
                "type": "hold",
                "instruction": "Cow Pose: Inhale, drop your belly down, and lift your chest.",
                "duration": 3,
                "voice_prompt": "Inhale, drop your navel toward the floor, lift your chest, and look up gently.",
                "video_start": 8.70,
                "video_end": 11.60
            },
            {
                "step_number": 5,
                "type": "hold",
                "instruction": "Return to a flat, neutral tabletop position.",
                "duration": 3,
                "voice_prompt": "Slowly release and return your spine to a flat tabletop position.",
                "video_start": 11.60,
                "video_end": 14.51
            }
        ]
    },
    "vrikshasana": {
        "name": "Vrikshasana",
        "sanskrit": "वृक्षासन",
        "english": "Tree Pose",
        "difficulty": "Beginner",
        "duration_seconds": 41.32,
        "description": "A classic standing balance pose. Vrikshasana improves focus, concentration, and balance while strengthening the legs.",
        "benefits": [
            "Improves balance and posture",
            "Strengthens thighs, calves, and ankles",
            "Opens the chest and shoulders"
        ],
        "steps": [
            {
                "step_number": 1,
                "type": "hold",
                "instruction": "Stand tall with feet together, arms relaxed by your sides.",
                "duration": 8,
                "voice_prompt": "Stand tall with your feet together, arms relaxed at your sides, and gaze forward.",
                "video_start": 0.0,
                "video_end": 8.26
            },
            {
                "step_number": 2,
                "type": "hold",
                "instruction": "Shift your weight onto your left leg, finding stability.",
                "duration": 8,
                "voice_prompt": "Shift your weight slowly onto your left leg, keeping it strong and grounded.",
                "video_start": 8.26,
                "video_end": 16.52
            },
            {
                "step_number": 3,
                "type": "hold",
                "instruction": "Lift your right foot and place it against your inner left thigh.",
                "duration": 8,
                "voice_prompt": "Lift your right foot and place it on your inner left thigh. Avoid placing it on the knee joint.",
                "video_start": 16.52,
                "video_end": 24.78
            },
            {
                "step_number": 4,
                "type": "hold",
                "instruction": "Bring your hands together in prayer position in front of your chest.",
                "duration": 8,
                "voice_prompt": "Join your palms in front of your chest in prayer pose, finding your balance.",
                "video_start": 24.78,
                "video_end": 33.04
            },
            {
                "step_number": 5,
                "type": "hold",
                "instruction": "Inhale, raise your arms overhead, and hold your balance.",
                "duration": 8,
                "voice_prompt": "Inhale, stretch your arms straight overhead, open your chest, and hold your balance.",
                "video_start": 33.04,
                "video_end": 41.32
            }
        ]
    },
    "adho-mukha-svanasana": {
        "name": "Adho Mukha Svanasana",
        "sanskrit": "अधोमुखश्वानासन",
        "english": "Downward-Facing Dog",
        "difficulty": "Beginner",
        "duration_seconds": 43.80,
        "description": "One of the most widely recognized yoga poses. It stretches the entire body, energizes the nervous system, and builds upper body strength.",
        "benefits": ["Stretches shoulders, hamstrings, and calves", "Strengthens arms and legs", "Relieves back pain and fatigue"],
        "steps": [
            {
                "step_number": 1,
                "type": "hold",
                "instruction": "Start on hands and knees with hands underneath your shoulders.",
                "duration": 9,
                "voice_prompt": "Begin on your hands and knees in tabletop stance, wrists directly under shoulders.",
                "video_start": 0.0,
                "video_end": 8.76
            },
            {
                "step_number": 2,
                "type": "hold",
                "instruction": "Tuck your toes under and spread your fingers wide on the mat.",
                "duration": 9,
                "voice_prompt": "Tuck your toes, press down with your hands, and spread your fingers wide.",
                "video_start": 8.76,
                "video_end": 17.52
            },
            {
                "step_number": 3,
                "type": "hold",
                "instruction": "Press hands down and lift your knees off the floor.",
                "duration": 9,
                "voice_prompt": "Press your palms down and lift your knees off the floor, raising your hips.",
                "video_start": 17.52,
                "video_end": 26.28
            },
            {
                "step_number": 4,
                "type": "hold",
                "instruction": "Push your hips high and back, and press your heels down.",
                "duration": 9,
                "voice_prompt": "Push your hips high and back, reaching a triangle shape, and press your heels down.",
                "video_start": 26.28,
                "video_end": 35.04
            },
            {
                "step_number": 5,
                "type": "hold",
                "instruction": "Gently bend knees if needed to lengthen spine, holding the pose.",
                "duration": 9,
                "voice_prompt": "Gently bend your knees to lengthen your spine, and breathe deeply in the pose.",
                "video_start": 35.04,
                "video_end": 43.80
            }
        ]
    },
    "trikonasana": {
        "name": "Trikonasana",
        "sanskrit": "त्रिकोणासन",
        "english": "Triangle Pose",
        "difficulty": "Beginner",
        "duration_seconds": 49.84,
        "description": "Stretches and strengthens the thighs, knees, and ankles while expanding the chest and shoulders for open, deep breathing.",
        "benefits": ["Strengthens thighs and knees", "Improves balance and digestion", "Relieves backache and leg strain"],
        "steps": [
            {
                "step_number": 1,
                "type": "hold",
                "instruction": "Spread your feet three feet apart, raise arms sideways to shoulder level.",
                "duration": 10,
                "voice_prompt": "Stand with your feet about three feet apart, raise both arms parallel to the floor, palms facing down.",
                "video_start": 0.0,
                "video_end": 9.97
            },
            {
                "step_number": 2,
                "type": "hold",
                "instruction": "Turn your right foot out ninety degrees, keeping hips square.",
                "duration": 10,
                "voice_prompt": "Turn your right foot outward ninety degrees, keeping your torso facing forward.",
                "video_start": 9.97,
                "video_end": 19.94
            },
            {
                "step_number": 3,
                "type": "hold",
                "instruction": "Reach your torso to the right, hinging sideways at your hip.",
                "duration": 10,
                "voice_prompt": "Exhale, reach your torso to the right, and hinge sideways at your hip joint.",
                "video_start": 19.94,
                "video_end": 29.91
            },
            {
                "step_number": 4,
                "type": "hold",
                "instruction": "Lower right hand to shin, reach left arm straight up, and gaze up.",
                "duration": 10,
                "voice_prompt": "Lower your right hand to your shin, extend your left arm up, and look at your left thumb.",
                "video_start": 29.91,
                "video_end": 39.88
            },
            {
                "step_number": 5,
                "type": "hold",
                "instruction": "Inhale, rise back up to center, and release your arms.",
                "duration": 10,
                "voice_prompt": "Inhale, pull yourself up, turn your foot forward, and lower your arms.",
                "video_start": 39.88,
                "video_end": 49.84
            }
        ]
    },
    "utkatasana": {
        "name": "Utkatasana",
        "sanskrit": "उत्कटासन",
        "english": "Chair Pose",
        "difficulty": "Beginner",
        "duration_seconds": 51.99,
        "description": "A powerful standing posture that tones the legs, builds core stability, and improves kinesthetic sense and balance.",
        "benefits": ["Strengthens thighs, calves, and spine", "Tones the abdominals and buttocks", "Improves posture and concentration"],
        "steps": [
            {
                "step_number": 1,
                "type": "hold",
                "instruction": "Stand tall with feet together, arms relaxed by your side.",
                "duration": 10,
                "voice_prompt": "Stand tall with your feet together, body relaxed and upright.",
                "video_start": 0.0,
                "video_end": 10.40
            },
            {
                "step_number": 2,
                "type": "hold",
                "instruction": "Inhale, raise your heels and raise your arms to shoulder level.",
                "duration": 10,
                "voice_prompt": "Inhale, raise your heels up off the floor and raise your arms up to shoulder level.",
                "video_start": 10.40,
                "video_end": 20.80
            },
            {
                "step_number": 3,
                "type": "hold",
                "instruction": "Turn your palms down, exhale, and slowly squat down halfway.",
                "duration": 10,
                "voice_prompt": "Turn your palms down. Exhale, and slowly squat down halfway as if sitting on a chair.",
                "video_start": 20.80,
                "video_end": 31.20
            },
            {
                "step_number": 4,
                "type": "hold",
                "instruction": "Keep spine in line, stretch arms forward, and breathe.",
                "duration": 10,
                "voice_prompt": "Keep your back straight, arms extended forward, and hold the pose while breathing.",
                "video_start": 31.20,
                "video_end": 41.60
            },
            {
                "step_number": 5,
                "type": "hold",
                "instruction": "Inhale, come up slowly, lower heels, and release arms.",
                "duration": 10,
                "voice_prompt": "Inhale, slowly stand back up, lower your heels, and relax your arms down.",
                "video_start": 41.60,
                "video_end": 51.99
            }
        ]
    },
    "bhujangasana": {
        "name": "Bhujangasana",
        "sanskrit": "भुजङ्गासन",
        "english": "Cobra Pose",
        "difficulty": "Beginner",
        "duration_seconds": 68.03,
        "description": "A classic backbend. Cobra pose strengthens the spine, stretches the chest and abdomen, and relieves stress.",
        "benefits": ["Strengthens the spine", "Stretches chest, lungs, and shoulders", "Relieves stress and fatigue"],
        "steps": [
            {
                "step_number": 1,
                "type": "hold",
                "instruction": "Lie flat on your stomach with forehead on the mat, hands by your chest.",
                "duration": 11,
                "voice_prompt": "Lie flat on your stomach. Place your palms flat on the floor beside your chest.",
                "video_start": 0.0,
                "video_end": 11.34
            },
            {
                "step_number": 2,
                "type": "hold",
                "instruction": "Place hips flat, tuck pubic bone down, and suck navel in.",
                "duration": 11,
                "voice_prompt": "Press your hip and legs down, tucking your pubic bone in and drawing your belly to your spine.",
                "video_start": 11.34,
                "video_end": 22.68
            },
            {
                "step_number": 3,
                "type": "hold",
                "instruction": "Inhale, press palms down, and roll shoulders back to lift chest.",
                "duration": 11,
                "voice_prompt": "Inhale, bring your shoulders up and roll them back, lifting your chest off the floor.",
                "video_start": 22.68,
                "video_end": 34.02
            },
            {
                "step_number": 4,
                "type": "hold",
                "instruction": "Straighten arms to 80 percent, elbows slightly bent.",
                "duration": 11,
                "voice_prompt": "Straighten your arms to eighty percent, keeping your elbows bent and close to your body.",
                "video_start": 34.02,
                "video_end": 45.36
            },
            {
                "step_number": 5,
                "type": "hold",
                "instruction": "Pull mat backward with hands, push chest forward and lift chin.",
                "duration": 11,
                "voice_prompt": "Pull your mat backward with your palms to push your chest forward and lift your chin.",
                "video_start": 45.36,
                "video_end": 56.70
            },
            {
                "step_number": 6,
                "type": "hold",
                "instruction": "Exhale slowly, lower chest down, and relax.",
                "duration": 11,
                "voice_prompt": "Exhale slowly, lower your torso back down to the floor, and relax completely.",
                "video_start": 56.70,
                "video_end": 68.03
            }
        ]
    },
    "virabhadrasana-ii": {
        "name": "Virabhadrasana II",
        "sanskrit": "वीरभद्रासन II",
        "english": "Warrior II",
        "difficulty": "Beginner",
        "duration_seconds": 109.34,
        "description": "A powerful standing posture that strengthens the legs and core, opens hips and chest, and develops focus and stamina.",
        "benefits": ["Strengthens legs and ankles", "Stretches groin, chest, and shoulders", "Improves balance and core strength"],
        "steps": [
            {
                "step_number": 1,
                "type": "hold",
                "instruction": "Stand tall in the center of your mat, focusing your breath.",
                "duration": 13,
                "voice_prompt": "Stand tall, centering your weight and connecting with your breath.",
                "video_start": 0.0,
                "video_end": 13.67
            },
            {
                "step_number": 2,
                "type": "hold",
                "instruction": "Step your feet wide apart, about four feet, hands on hips.",
                "duration": 13,
                "voice_prompt": "Step your feet wide apart, wider than your hips, and rest hands on your waist.",
                "video_start": 13.67,
                "video_end": 27.34
            },
            {
                "step_number": 3,
                "type": "hold",
                "instruction": "Turn your left toes in and your right toes out forward.",
                "duration": 13,
                "voice_prompt": "Turn your left toes slightly inward, and turn your right toes out ninety degrees.",
                "video_start": 27.34,
                "video_end": 41.01
            },
            {
                "step_number": 4,
                "type": "hold",
                "instruction": "Draw your navel in, tuck tailbone, and lengthen up through the spine.",
                "duration": 13,
                "voice_prompt": "Draw your navel in, tuck your tailbone slightly, and lengthen your spine upward.",
                "video_start": 41.01,
                "video_end": 54.68
            },
            {
                "step_number": 5,
                "type": "hold",
                "instruction": "Inhale, reach right fingertips forward and left fingertips backward.",
                "duration": 13,
                "voice_prompt": "Inhale, stretch your arms out to the sides, reaching front and back fingertips wide.",
                "video_start": 54.68,
                "video_end": 68.35
            },
            {
                "step_number": 6,
                "type": "hold",
                "instruction": "Exhale and bend your front knee, keeping the knee aligned over ankle.",
                "duration": 13,
                "voice_prompt": "Exhale, bend your front knee, keeping your shin perpendicular to the floor.",
                "video_start": 68.35,
                "video_end": 82.02
            },
            {
                "step_number": 7,
                "type": "hold",
                "instruction": "Gaze over your right hand, breathing deeply into your chest.",
                "duration": 13,
                "voice_prompt": "Look over your right hand and hold the pose. Feel strong and stable.",
                "video_start": 82.02,
                "video_end": 95.69
            },
            {
                "step_number": 8,
                "type": "hold",
                "instruction": "Inhale, straighten your leg, release hands, and return to center.",
                "duration": 14,
                "voice_prompt": "Inhale, straighten your front leg, lower your arms, and step your feet back together.",
                "video_start": 95.69,
                "video_end": 109.34
            }
        ]
    },
    "surya-namaskar": {
        "name": "Surya Namaskar",
        "sanskrit": "सूर्यनमस्कार",
        "english": "Sun Salutation",
        "difficulty": "Intermediate",
        "duration_seconds": 153.88,
        "description": "A dynamic sequence of 12 postures coordinated with deep breathing that energizes, stretches, and strengthens the entire body.",
        "benefits": ["Improves blood circulation", "Stretches and tones all major muscles", "Boosts energy and lung capacity"],
        "steps": [
            {
                "step_number": 1,
                "type": "hold",
                "instruction": "Stand tall and bring your palms together in prayer position.",
                "duration": 15,
                "voice_prompt": "Stand with feet together at the front of your mat, hands joined in prayer position.",
                "video_start": 0.0,
                "video_end": 15.39
            },
            {
                "step_number": 2,
                "type": "hold",
                "instruction": "Inhale, reach arms up and arch back gently.",
                "duration": 15,
                "voice_prompt": "Inhale deeply, raise your arms overhead, and gently arch back from the spine.",
                "video_start": 15.39,
                "video_end": 30.78
            },
            {
                "step_number": 3,
                "type": "hold",
                "instruction": "Exhale, reach forward and fold down, placing palms on the mat.",
                "duration": 15,
                "voice_prompt": "Exhale, reach forward and fold down, placing palms or fingers beside your feet.",
                "video_start": 30.78,
                "video_end": 46.17
            },
            {
                "step_number": 4,
                "type": "hold",
                "instruction": "Inhale, step your right leg back, rest knee on floor, and look up.",
                "duration": 15,
                "voice_prompt": "Inhale, step your right leg back, place right knee down, and lift your chest looking up.",
                "video_start": 46.17,
                "video_end": 61.56
            },
            {
                "step_number": 5,
                "type": "hold",
                "instruction": "Slide your left leg back, bringing your body into a straight plank.",
                "duration": 15,
                "voice_prompt": "Exhale, step your left leg back, aligning your hips and spine in a straight plank.",
                "video_start": 61.56,
                "video_end": 76.95
            },
            {
                "step_number": 6,
                "type": "hold",
                "instruction": "Lower knees, chest, and chin down to the floor, hips slightly raised.",
                "duration": 15,
                "voice_prompt": "Lower your knees, chest, and chin to the mat, keeping your elbows close to your torso.",
                "video_start": 76.95,
                "video_end": 92.34
            },
            {
                "step_number": 7,
                "type": "hold",
                "instruction": "Inhale, slide forward, press palms down, and lift chest up.",
                "duration": 15,
                "voice_prompt": "Inhale, slide forward, and lift your chest into a gentle cobra stretch.",
                "video_start": 92.34,
                "video_end": 107.73
            },
            {
                "step_number": 8,
                "type": "hold",
                "instruction": "Exhale, lift hips up and back into Downward-Facing Dog.",
                "duration": 15,
                "voice_prompt": "Exhale, lift your hips high and back, pressing your heels toward the mat.",
                "video_start": 107.73,
                "video_end": 123.12
            },
            {
                "step_number": 9,
                "type": "hold",
                "instruction": "Inhale, step right foot forward between hands, left knee down, look up.",
                "duration": 15,
                "voice_prompt": "Inhale, step your right foot forward between your hands, lower left knee, and look up.",
                "video_start": 123.12,
                "video_end": 138.51
            },
            {
                "step_number": 10,
                "type": "hold",
                "instruction": "Step left foot forward to fold, then inhale, reach up and arch back.",
                "duration": 15,
                "voice_prompt": "Step left foot forward, fold down, then inhale, stand up, reach overhead and arch back.",
                "video_start": 138.51,
                "video_end": 153.88
            }
        ]
    },
    "balasana": {
        "name": "Balasana",
        "sanskrit": "बालासन",
        "english": "Child's Pose",
        "difficulty": "Beginner",
        "duration_seconds": 164.26,
        "description": "A deeply restorative resting posture. Balasana stretches the lower back and hips while calming the mind and nervous system.",
        "benefits": ["Gently stretches hips, thighs, and ankles", "Calms the brain and helps relieve stress", "Relieves back and neck pain"],
        "steps": [
            {
                "step_number": 1,
                "type": "hold",
                "instruction": "Sit comfortably back on your heels with an upright spine.",
                "duration": 16,
                "voice_prompt": "Sit comfortably back on your heels, lengthening your spine upward.",
                "video_start": 0.0,
                "video_end": 16.43
            },
            {
                "step_number": 2,
                "type": "hold",
                "instruction": "Move forward slowly into a tabletop position.",
                "duration": 16,
                "voice_prompt": "Inhale and move forward slowly, bringing your body into a tabletop position.",
                "video_start": 16.43,
                "video_end": 32.86
            },
            {
                "step_number": 3,
                "type": "hold",
                "instruction": "Exhale and slowly lower your hips back onto your heels.",
                "duration": 16,
                "voice_prompt": "Exhale and lower your hips back toward your heels slowly.",
                "video_start": 32.86,
                "video_end": 49.29
            },
            {
                "step_number": 4,
                "type": "hold",
                "instruction": "Keep knees together, or spread them slightly apart for comfort.",
                "duration": 16,
                "voice_prompt": "Bring your knees together, or spread them slightly apart to find comfort.",
                "video_start": 49.29,
                "video_end": 65.72
            },
            {
                "step_number": 5,
                "type": "hold",
                "instruction": "Extend your arms overhead with palms flat on the floor.",
                "duration": 16,
                "voice_prompt": "Extend your arms straight out in front of you, placing your palms on the floor.",
                "video_start": 65.72,
                "video_end": 82.15
            },
            {
                "step_number": 6,
                "type": "hold",
                "instruction": "Lower your chest down and rest your forehead on the mat.",
                "duration": 16,
                "voice_prompt": "Lay your chest down between your thighs, resting your forehead flat on the mat.",
                "video_start": 82.15,
                "video_end": 98.58
            },
            {
                "step_number": 7,
                "type": "hold",
                "instruction": "Relax your shoulders and take slow, steady breaths.",
                "duration": 16,
                "voice_prompt": "Relax your shoulders, elbows, and back, breathing deeply.",
                "video_start": 98.58,
                "video_end": 115.01
            },
            {
                "step_number": 8,
                "type": "hold",
                "instruction": "Exhale, letting your belly sink and relax against your thighs.",
                "duration": 16,
                "voice_prompt": "Exhale slowly, letting your belly sink and release tension against your thighs.",
                "video_start": 115.01,
                "video_end": 131.44
            },
            {
                "step_number": 9,
                "type": "hold",
                "instruction": "Rest in this restorative position, taking slow breaths.",
                "duration": 16,
                "voice_prompt": "Rest here. Focus on the gentle expansion of your back on every inhale.",
                "video_start": 131.44,
                "video_end": 147.87
            },
            {
                "step_number": 10,
                "type": "hold",
                "instruction": "Place palms under shoulders, inhale, and slowly lift back to sitting.",
                "duration": 16,
                "voice_prompt": "To release, place your hands under shoulders, inhale, and slowly roll up to seated.",
                "video_start": 147.87,
                "video_end": 164.26
            }
        ]
    },
    "tadasana": {
        "name": "Tadasana",
        "sanskrit": "ताड़ासन",
        "english": "Mountain Pose",
        "difficulty": "Beginner",
        "duration_seconds": 101.00,
        "description": "The foundational standing posture. Tadasana establishes alignment, balance, and centered focus for all other standing poses.",
        "benefits": [
            "Improves posture and body alignment",
            "Strengthens thighs, knees, and ankles",
            "Firms abdomen and buttocks"
        ],
        "steps": [
            {
                "step_number": 1,
                "type": "hold",
                "instruction": "Stand erect with your feet close together, arms relaxed alongside body.",
                "duration": 12,
                "voice_prompt": "Start by standing erect with your feet together and your arms relaxed alongside your body.",
                "video_start": 0.0,
                "video_end": 12.63
            },
            {
                "step_number": 2,
                "type": "hold",
                "instruction": "Distribute your weight evenly across the soles of both feet.",
                "duration": 12,
                "voice_prompt": "Distribute your weight evenly across the soles of both your feet and press your toes down.",
                "video_start": 12.63,
                "video_end": 25.26,
                "validation": v_step1 # Map original validations safely
            },
            {
                "step_number": 3,
                "type": "hold",
                "instruction": "Inhale deeply, raise your arms, and interlock your fingers.",
                "duration": 12,
                "voice_prompt": "Inhale deeply, raise your arms, and interlock your fingers.",
                "video_start": 25.26,
                "video_end": 37.89,
                "validation": v_step2
            },
            {
                "step_number": 4,
                "type": "hold",
                "instruction": "Turn palms out and reach your hands high toward the ceiling.",
                "duration": 12,
                "voice_prompt": "Turn your palms outward and reach high towards the ceiling.",
                "video_start": 37.89,
                "video_end": 50.52
            },
            {
                "step_number": 5,
                "type": "hold",
                "instruction": "Get onto the tips of your toes with your heels together.",
                "duration": 12,
                "voice_prompt": "Get onto the tips of your toes with your heels together.",
                "video_start": 50.52,
                "video_end": 63.15,
                "validation": v_step3
            },
            {
                "step_number": 6,
                "type": "hold",
                "instruction": "Tighten knees, pull up hamstrings, and contract hips.",
                "duration": 12,
                "voice_prompt": "Tighten your knees, pull up your hamstrings, and contract your hips.",
                "video_start": 63.15,
                "video_end": 75.78,
                "validation": v_step4
            },
            {
                "step_number": 7,
                "type": "hold",
                "instruction": "Pull in your abdomen, expand your chest, and hold your breath.",
                "duration": 12,
                "voice_prompt": "Pull in your abdomen and expand your chest. Hold your breath and look at a point straight ahead.",
                "video_start": 75.78,
                "video_end": 88.41
            },
            {
                "step_number": 8,
                "type": "hold",
                "instruction": "Breathe out, lower your heels, and relax your arms down.",
                "duration": 13,
                "voice_prompt": "Relax and breathe out, lowering your heels and bringing your arms beside your thighs.",
                "video_start": 88.41,
                "video_end": 101.00,
                "validation": v_step5
            }
        ]
    }
}

for folder_name, details in pose_configs.items():
    config_path = os.path.join(BASE_DIR, folder_name, "config.json")
    if os.path.isfile(config_path):
        # Load existing config to preserve meta details like id, sanksrit, etc. if needed
        with open(config_path, "r", encoding="utf-8") as f:
            orig = json.load(f)
            
        # Overwrite fields with precise steps
        orig["steps"] = details["steps"]
        orig["duration_seconds"] = details["duration_seconds"]
        
        # Write back config
        with open(config_path, "w", encoding="utf-8") as f:
            json.dump(orig, f, indent=2, ensure_ascii=False)
        print(f"Updated steps for {folder_name}")

print("\nAll config steps successfully updated!")
