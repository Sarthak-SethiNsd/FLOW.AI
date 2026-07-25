import json
import os

files = {
    'tadasana': r'c:\Users\LENOVO\Desktop\Websites\Yoga-Project\public\asanas\tadasana\config.json',
    'balasana': r'c:\Users\LENOVO\Desktop\Websites\Yoga-Project\public\asanas\balasana\config.json',
    'vrikshasana': r'c:\Users\LENOVO\Desktop\Websites\Yoga-Project\public\asanas\vrikshasana\config.json',
    'bhujangasana': r'c:\Users\LENOVO\Desktop\Websites\Yoga-Project\public\asanas\bhujangasana\config.json'
}

prompts = {
    'tadasana': [
        "Let us begin Tadasana, or Mountain Pose. Stand up straight on your mat. Place both your feet together, touching each other side by side. Let your arms hang naturally by your sides, with your palms facing inward toward your thighs and your fingers pointing down to the floor. Look straight ahead at a fixed point in front of you to keep your balance.",
        "Press the base of your big toes, the base of your little toes, and the left and right sides of your heels firmly into the mat. Keep your toes pointing straight forward. Gently squeeze the muscles in the front of your thighs. As you do this, you will feel your kneecaps lift slightly upward. This action protects your knees and engages your legs.",
        "Tuck the bottom of your spine slightly downward and inward. Lift your chest upward and open it wide. Roll your shoulders backward and pull them down away from your ears. Keep your chin level with the floor, not tilting up or down. Keep your palms facing inward.",
        "Take a slow, deep breath in through your nose. Rise up onto the balls of your feet, lifting your heels off the mat. Lift the top of your head upward toward the ceiling to lengthen your spine. Keep your shoulders down and your chest open. Balance your weight evenly on the front of both feet.",
        "Hold this raised position and breathe steadily. Keep your heels lifted off the floor and your toes gripping the mat. Keep your leg muscles tight and your lower belly pulled in. Keep your eyes focused straight ahead to maintain your balance. Notice the effort it takes to stay perfectly still.",
        "Slowly breathe out and lower your heels back down flat onto the mat. Release the tension in your leg and belly muscles. Let your arms hang loosely and stand in a relaxed position. Well done. You have completed Tadasana."
    ],
    'balasana': [
        "Let us begin Balasana, or Child's Pose. Start by kneeling on your mat with your knees about fist-width apart. Lower your bottom down to sit directly on your heels. Place both hands flat on top of your thighs, with your palms facing down and fingers pointing toward your knees. Sit up straight and tall.",
        "Slowly breathe in through your nose. Raise both arms straight up overhead until your hands are above your head. Keep your arms shoulder-width apart with your palms facing each other and fingers pointing straight up. Keep your bottom resting on your heels.",
        "Breathe out slowly and bend your entire upper body forward from your hips. Keep your back straight as you lower your torso toward your thighs. Keep your arms extended straight in front of you. Ensure your bottom remains pressed against your heels.",
        "Walk your fingers forward along the floor until your arms are completely straight. Lower your chest down to rest on your thighs. Gently place your forehead flat on the mat. If your forehead does not reach, simply let your head hang down.",
        "Stay in this position and breathe naturally. Keep your arms extended, your forehead down, and your bottom on your heels. With each breath out, let your chest sink closer to your thighs. Relax the muscles in your neck and shoulders.",
        "When you are ready to finish, place both palms flat on the mat directly under your shoulders. Breathe in and push against the floor with your hands. Slowly raise your torso until you are sitting upright on your heels again. Well done."
    ],
    'vrikshasana': [
        "Let us begin Vrikshasana, or Tree Pose. Stand up straight with your feet together and your toes pointing forward. Let your arms hang at your sides with your palms facing your legs. Look straight ahead at a fixed spot on the wall to help you balance.",
        "Shift your body weight entirely onto your left foot. Press the bottom of your left foot firmly into the mat. Keep your left leg straight and strong, but do not lock your knee perfectly stiff. Keep your toes pointing forward.",
        "Bend your right knee outward to the right side. Lift your right foot and place the flat bottom of it against the inside of your left leg. Place it either on your lower left calf or upper left thigh. Do not place your foot directly on the side of your knee joint.",
        "Once your foot is secure, bring both hands in front of your chest. Press your palms flat together with your fingers pointing straight up. Point your elbows out to the sides. Press your right foot into your left leg, and push your left leg back against your foot to stay steady.",
        "Hold this position and keep your eyes focused on your spot. Keep your right knee pointing out to the side. Keep your palms pressed together at chest level. Breathe slowly and steadily while maintaining your balance on one leg.",
        "Slowly lower your right foot back down to the mat next to your left foot. Lower your arms back down to your sides. Take a breath standing on both feet. Well done. You can repeat this on the other side."
    ],
    'bhujangasana': [
        "Let us begin Bhujangasana, or Cobra Pose. Lie completely flat on your stomach on the mat. Extend both legs straight back with your feet together. Point your toes backward so the tops of your feet touch the floor. Rest your forehead directly on the mat.",
        "Bring both hands up and place your palms flat on the mat directly under your shoulders. Point your fingers straight forward. Bend your elbows and pull them in tight against the sides of your body. Press the tops of your feet firmly down into the mat.",
        "Breathe in slowly and begin to lift your head off the mat. Lift your forehead, then your nose, then your chin. Use the muscles in your back to lift your chest off the floor. Keep your arms bent and your elbows hugged against your ribs.",
        "Press your palms into the mat to lift your chest a bit higher. Keep your hips and the front of your pelvis pressed firmly against the floor. Pull your shoulders back and down away from your ears. Look straight ahead with your neck long.",
        "Hold this position and breathe steadily. Keep your elbows bent and close to your sides. Keep your shoulders pulled down and your chest pushed forward. Ensure your legs are straight and the tops of your feet remain on the floor.",
        "Breathe out slowly and gently lower your body back down. Lower your chest, then your chin, and finally place your forehead back on the mat. Relax your arms down by your sides. Well done. You have completed Cobra Pose."
    ]
}

for name, filepath in files.items():
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    for i, step in enumerate(data['steps']):
        step['voice_prompt'] = prompts[name][i]
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")

print("Updated voice prompts.")
