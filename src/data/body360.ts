export type BodyPlan = {
  dayKey: 'MON'|'TUE'|'WED'|'THU'|'FRI'|'SAT'|'SUN'
  title: string
  focus: string
  duration: string
  exercises: string[]
  warmup: string[]
  progression: string
  recovery: string
}

export const BODY360_WEEK: BodyPlan[] = [
  { dayKey:'MON', title:'Upper A — Chest + Back', focus:'Chest strength + back width/thickness + posture', duration:'50–60 min',
    exercises:['Bench / machine chest press — 3×6–10','Lat pulldown — 3×8–12','Incline dumbbell press — 2×8–12','Seated cable row — 2×8–12','Cable / pec-deck fly — 2×10–15','Face pull — 2×12–15'],
    warmup:['5 min brisk walk/cycle','Shoulder circles + scapular movement','2–3 lighter ramp-up sets before first press/pull'],
    progression:'Keep about 2–3 reps in reserve on most sets. When you reach the top of the rep range with clean form, add a small amount of load and rebuild the reps.',
    recovery:'5 min easy cool-down + gentle chest/lat/shoulder mobility' },
  { dayKey:'TUE', title:'Lower A — Legs + Core', focus:'Quads + hamstrings + glutes + calves + trunk', duration:'50–60 min',
    exercises:['Squat / goblet squat — 3×6–10','Leg press — 2×8–12','Romanian deadlift — 2×8–12','Leg curl — 2×10–15','Calf raise — 3×10–15','Dead bug — 2×8–12/side','Plank — 2×20–45 sec'],
    warmup:['5 min walk/cycle','Hip + ankle mobility','2–3 progressive warm-up sets for the first compound'],
    progression:'Prioritize stable technique and range of motion. Increase load only when the current load is controlled.',
    recovery:'Easy walking + gentle lower-body mobility; no forced stretching into pain' },
  { dayKey:'WED', title:'Shoulders + Arms + Posture', focus:'Delts + biceps + triceps + upper-back balance', duration:'45–55 min',
    exercises:['Shoulder press — 3×6–10','Lateral raise — 3×10–15','Rear-delt fly — 2×12–15','Cable curl — 2×8–12','Rope triceps pushdown — 2×8–12','Hammer curl — 2×10–15','Face pull — 2×12–15'],
    warmup:['5 min easy cardio','Shoulder/scapular mobility','1–2 light rehearsal sets'],
    progression:'Use controlled reps and stop before technique breaks down. Isolation work can approach fatigue more closely than heavy compounds.',
    recovery:'Gentle shoulder/neck mobility + relaxed breathing' },
  { dayKey:'THU', title:'Recovery + Mobility + Cardio', focus:'Recover while maintaining aerobic fitness and movement quality', duration:'25–40 min',
    exercises:['Brisk walk / cycle — 20–30 min','Thoracic mobility — 3–5 min','Hip mobility — 3–5 min','Gentle neck mobility — 2–3 min','Slow nasal breathing — 2–3 min'],
    warmup:['Start easy for 5 min; build gradually'],
    progression:'Recovery is not a competition. Keep this day easy enough that Friday training feels better.',
    recovery:'Hydration, food, sleep and low-stress movement' },
  { dayKey:'FRI', title:'Upper B — Chest + Back', focus:'Upper-chest emphasis + rowing + balanced pulling', duration:'50–60 min',
    exercises:['Incline press — 3×6–10','Chest-supported row — 3×8–12','Machine chest press — 2×8–12','Lat pulldown / assisted pull-up — 2×8–12','Cable fly — 2×10–15','Rear-delt fly — 2×12–15'],
    warmup:['5 min brisk walk/cycle','Scapular control drills','2–3 lighter ramp-up sets'],
    progression:'Aim for small, repeatable improvements in reps, load or control—not all three at once.',
    recovery:'5 min cool-down + gentle upper-body mobility' },
  { dayKey:'SAT', title:'Lower B + Arms + Cardio', focus:'Posterior chain + legs + arms + conditioning', duration:'50–60 min',
    exercises:['Romanian deadlift / hip hinge — 3×6–10','Split squat / leg press — 2×8–12','Leg curl — 2×10–15','Calf raise — 2×10–15','Biceps curl — 2×10–15','Triceps extension — 2×10–15','Easy cardio — 10–15 min'],
    warmup:['5 min easy cardio','Hip/ankle movement','Progressive warm-up sets for the first lift'],
    progression:'Saturday is controlled volume, not a max-out day. Leave enough recovery for next week.',
    recovery:'Longer cool-down; prioritize sleep and food' },
  { dayKey:'SUN', title:'Complete Rest + Reset', focus:'Recovery, light walking and weekly review', duration:'0–30 min',
    exercises:['Optional easy walk — 20–30 min','Gentle mobility if needed','Weekly progress review'],
    warmup:['None required unless walking'],
    progression:'Review the week: attendance, form, reps, loads, energy and recovery.',
    recovery:'Full recovery; prepare the next week' },
]

export const BODY360_SEQUENCE = [
  'CONNECT','REVISION','RECAP','MISSION','THEORY','VISUALIZATION',
  'PRACTICAL','MIND–MUSCLE','MISTAKES','SCIENCE','QUIZ','HOMEWORK','SUMMARY'
] as const

export function getBodyPlan(dayOfWeek: number) {
  const idx = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  return BODY360_WEEK[idx]
}
