export type BodyPlan = {
  dayKey: 'MON'|'TUE'|'WED'|'THU'|'FRI'|'SAT'|'SUN'
  title: string
  focus: string
  duration: string
  exercises: string[]
  recovery: string
}

export const BODY360_WEEK: BodyPlan[] = [
  { dayKey:'MON', title:'Chest + Triceps', focus:'Chest strength + upper-body pushing', duration:'50–60 min', exercises:['Bench / machine chest press — 3 sets','Incline dumbbell press — 3 sets','Pec deck / cable fly — 2 sets','Rope triceps pushdown — 3 sets','Plank — 2 sets'], recovery:'5 min cool-down + gentle chest/shoulder mobility' },
  { dayKey:'TUE', title:'Back + Biceps', focus:'Back width + thickness + posture', duration:'50–60 min', exercises:['Lat pulldown — 3 sets','Seated cable row — 3 sets','One-arm dumbbell row — 2 sets','Dumbbell curl — 3 sets','Hammer curl — 2 sets','Face pull — 2 sets'], recovery:'5 min cool-down + upper-back mobility' },
  { dayKey:'WED', title:'Legs + Core', focus:'Lower-body strength + stable core', duration:'50–60 min', exercises:['Squat / goblet squat — 3 sets','Leg press — 3 sets','Leg curl — 2 sets','Calf raise — 3 sets','Dead bug — 2 sets','Plank — 2 sets'], recovery:'Easy walking + lower-body mobility' },
  { dayKey:'THU', title:'Recovery + Mobility', focus:'Recover while keeping the body moving', duration:'20–35 min', exercises:['Brisk walk — 15–20 min','Shoulder mobility — 5 min','Hip mobility — 5 min','Gentle breathing — 3–5 min'], recovery:'No hard lifting; protect sleep and recovery' },
  { dayKey:'FRI', title:'Shoulders + Upper Back', focus:'Delts + posture + shoulder balance', duration:'45–55 min', exercises:['Shoulder press — 3 sets','Lateral raise — 3 sets','Rear-delt fly — 2 sets','Face pull — 3 sets','Light row — 2 sets','Dead bug — 2 sets'], recovery:'5 min cool-down + gentle neck/shoulder mobility' },
  { dayKey:'SAT', title:'Chest + Back Light + Cardio', focus:'Practice quality movement without overload', duration:'45–60 min', exercises:['Light chest press — 2 sets','Incline press — 2 sets','Lat pulldown — 2 sets','Cable row — 2 sets','Push-ups — 2 sets','Brisk walk / cycle — 10–15 min'], recovery:'Longer cool-down; keep intensity moderate' },
  { dayKey:'SUN', title:'Complete Rest', focus:'Recovery, walking and preparation', duration:'0–30 min', exercises:['Optional easy walk — 20–30 min','Gentle mobility if needed'], recovery:'Full recovery; prepare for Monday' },
]

export const BODY360_SEQUENCE = [
  'CONNECT','REVISION','RECAP','MISSION','THEORY','VISUALIZATION',
  'PRACTICAL','MIND–MUSCLE','MISTAKES','SCIENCE','QUIZ','HOMEWORK','SUMMARY'
] as const

export function getBodyPlan(dayOfWeek: number) {
  const idx = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  return BODY360_WEEK[idx]
}
