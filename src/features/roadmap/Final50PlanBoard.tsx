import { FINAL_50_WEEK_PLANS, getFinal50DayPlan } from '@/data/final50Plan'
import { getKolkataDateKey } from '@/services/calendarEngine'

const cardStyle = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  padding: 14,
  minWidth: 0
} as const

export function Final50PlanBoard() {
  const todayKey = getKolkataDateKey()
  const todayPlan = getFinal50DayPlan(todayKey)

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <section style={{ ...cardStyle, borderColor: 'var(--gold)' }}>
        <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--gold)' }}>THE FINAL 50 DAYS — PDF-LOCKED PLAN</div>
        <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 5 }}>
          Day 0: 10 Oct · Seven Sunday-to-Saturday study weeks: 11 Oct–28 Nov · CAT exam: 29 Nov 2026
        </div>
        {todayPlan && (
          <div style={{ marginTop: 10, padding: 10, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface)' }}>
            <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--gold)' }}>TODAY’S LOCKED ACTION</div>
            <div style={{ fontSize: 13, fontWeight: 900, marginTop: 4, color: 'var(--text)' }}>{todayPlan.testTitle}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, lineHeight: 1.5 }}>{todayPlan.testNotes}</div>
          </div>
        )}
      </section>

      <section style={cardStyle}>
        <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--text)', marginBottom: 8 }}>LOCKED EXAM RULES</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 8 }}>
          <div style={{ padding: 10, borderRadius: 8, background: 'var(--surface)', fontSize: 11, lineHeight: 1.5 }}>
            <strong>Section order</strong><br />VARC 24 Q · 40 min → DILR 22 Q · 40 min → QA 22 Q · 40 min. No switching or returning after time expires.
          </div>
          <div style={{ padding: 10, borderRadius: 8, background: 'var(--surface)', fontSize: 11, lineHeight: 1.5 }}>
            <strong>Marking rule</strong><br />MCQ: +3 / −1. TITA: no negative marking; the PDF says never leave a TITA blank.
          </div>
          <div style={{ padding: 10, borderRadius: 8, background: 'var(--surface)', fontSize: 11, lineHeight: 1.5 }}>
            <strong>After every mock</strong><br />Fill attempts, correct, wrong and score by section; identify the weakest section; classify C1–C5; write three repair topics.
          </div>
          <div style={{ padding: 10, borderRadius: 8, background: 'var(--surface)', fontSize: 11, lineHeight: 1.5 }}>
            <strong>Attempt / leave rule</strong><br />MCQ expected value is positive when your honest chance of being correct is above 25%. TITA has no negative marking: the PDF says never leave one blank.
          </div>
          <div style={{ padding: 10, borderRadius: 8, background: 'var(--surface)', fontSize: 11, lineHeight: 1.5 }}>
            <strong>Use each 40-minute section wisely</strong><br />Rough average: ~100 seconds per VARC question and ~109 seconds per DILR / QA question. Easy questions should take less; decide when to leave inside the section. No switching or returning after time ends.
          </div>
          <div style={{ padding: 10, borderRadius: 8, background: 'var(--surface)', fontSize: 11, lineHeight: 1.5 }}>
            <strong>Fix process before adding volume</strong><br />QA: SOLVE · DILR: SCOPE · RC: OCTAVES. For repeated errors, fix the method before adding more questions or new resources.
          </div>
          <div style={{ padding: 10, borderRadius: 8, background: 'var(--surface)', fontSize: 11, lineHeight: 1.5 }}>
            <strong>Protect the person</strong><br />Keep sleep and gym steady, avoid comparing and new resources, and taper on purpose. Last full mock: Sun 22 Nov. No test on Fri 27 or Sat 28 Nov.
          </div>
        </div>
        <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 8 }}>
          These exam rules are transcribed from the uploaded plan. Re-check official instructions and the admit card when released.
        </div>
      </section>

      {FINAL_50_WEEK_PLANS.map(week => {
        const current = todayPlan?.number === week.number && !todayPlan?.isDayZero && !todayPlan?.isExamDay
        return (
          <section key={week.number} style={{ ...cardStyle, borderColor: current ? 'var(--gold)' : 'var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, color: current ? 'var(--gold)' : 'var(--text)' }}>WEEK {week.number} · {week.title}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>{week.dates} 2026 · {week.phaseNote}</div>
              </div>
              {current && <span style={{ fontSize: 9, fontWeight: 900, padding: '4px 8px', border: '1px solid var(--gold)', borderRadius: 20, color: 'var(--gold)' }}>CURRENT WEEK</span>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 8 }}>
              <div style={{ padding: 10, borderRadius: 8, background: 'rgba(22,163,74,.08)', border: '1px solid rgba(22,163,74,.22)' }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: '#16A34A', marginBottom: 5 }}>QA</div>
                <div style={{ fontSize: 11, color: 'var(--text)', lineHeight: 1.5 }}>{week.qaFocus}</div>
              </div>
              <div style={{ padding: 10, borderRadius: 8, background: 'rgba(37,99,235,.08)', border: '1px solid rgba(37,99,235,.22)' }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: '#3B82F6', marginBottom: 5 }}>DILR</div>
                <div style={{ fontSize: 11, color: 'var(--text)', lineHeight: 1.5 }}>{week.dilrFocus}</div>
              </div>
              <div style={{ padding: 10, borderRadius: 8, background: 'rgba(124,58,237,.08)', border: '1px solid rgba(124,58,237,.22)' }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: '#8B5CF6', marginBottom: 5 }}>VARC</div>
                <div style={{ fontSize: 11, color: 'var(--text)', lineHeight: 1.5 }}>{week.varcFocus}</div>
              </div>
            </div>
            <div style={{ marginTop: 9, padding: 10, borderRadius: 8, background: 'var(--surface)' }}>
              <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--gold)' }}>WEEKLY PRIORITY</div>
              <div style={{ fontSize: 11, color: 'var(--text)', marginTop: 4, lineHeight: 1.5 }}>{week.weeklyPriority}</div>
              <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text)', marginTop: 8 }}>GATE</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3, lineHeight: 1.5 }}>{week.gate}</div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
