import { useEffect, useMemo, useState } from 'react'
import { useTodayTasks } from '@/hooks/useTasks'
import { usePhase } from '@/hooks/usePhase'
import { getKolkataDateKey, getKolkataDateParts, getFirstPassDayNum, getPhaseForDateKey } from '@/services/calendarEngine'
import { ROADMAP_44 } from '@/data/roadmap44'
import { PHASES as CONFIG_PHASES } from '@/data/config'
import { getPercentylDailyTarget } from '@/data/percentylPlan2'

const DAYS = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY']
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

const OMIA: Record<string,string> = {
  MONDAY:'Mock analysis + Error Log + Repair',
  TUESDAY:'VARC Sectional + deepest verified VARC weakness',
  WEDNESDAY:'DILR Sectional + link building from topics',
  THURSDAY:'QA Sectional + verify core rules + solve 1 unsolved set',
  FRIDAY:'Full Mock Test + deep analysis by question',
  SATURDAY:'Error Log review + repair 5 high-frequency errors',
  SUNDAY:'Percentile & mock review + forecast next week',
}

const schedule = [
  ['05:30–06:00','Yoga'],
  ['06:00–06:30','Breathing + Throat warm up'],
  ['06:30–07:00','Shower + Light breakfast'],
  ['07:00–09:00','Morning blocks (QA/DILR/VARC)'],
  ['09:00–09:15','Break + hydration'],
  ['09:15–09:45','Test/Analysis (unburden)'],
  ['09:45–10:00','Revision — recap → revise → connect → preview'],
  ['10:00','Sleep'],
]

function todayIndia() {
  const now = new Date()
  const p = getKolkataDateParts(now)
  return {
    now,
    key: getKolkataDateKey(now),
    day: DAYS[p.dayOfWeek],
    date: p.date,
    month: MONTHS[p.month - 1],
    year: p.year,
  }
}

export function DailyControlCard() {
  // Live daily engine: date/weekday is derived from Asia/Kolkata and refreshed while the app is open.
  const phase = usePhase()
  const { tasks, loading, done, pct } = useTodayTasks()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const refresh = () => setTick(v => v + 1)
    const id = window.setInterval(refresh, 30000)
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      window.clearInterval(id)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

  const today = useMemo(() => todayIndia(), [tick])
  const phaseId = getPhaseForDateKey(today.key)
  const phaseInfo = CONFIG_PHASES.find(p => p.id === phaseId) ?? phase
  const dayNum = getFirstPassDayNum(today.key)
  const roadmap = ROADMAP_44.find(x => x.dayNum === dayNum) ?? ROADMAP_44[0]
  const dayAction = OMIA[today.day] ?? 'Execute the next verified CAT task.'
  const dailyTarget = getPercentylDailyTarget(today.key)
  const completed = tasks.filter(t => t.status === 'DONE').length
  const current = tasks.find(t => t.status !== 'DONE') ?? null
  const currentTaskLine = current ? `${current.blockId} — ${current.title}` : 'All 8 CAT blocks complete'
  const remaining = Math.max(0, tasks.length - completed - (current ? 1 : 0))
  const progressWidth = typeof pct === 'number' && Number.isFinite(pct) ? Math.max(0, Math.min(100, pct)) : 0

  if (loading) return null

  return (
    <section style={{
      margin: 'clamp(12px, 4vw, 18px) 0',
      border: '1px solid rgba(245,166,35,.55)',
      borderRadius: 'clamp(14px, 3vw, 16px)',
      overflow: 'hidden',
      background: 'linear-gradient(180deg,#111827,#0B1220)',
      boxShadow: '0 12px 30px rgba(15,23,42,.55)',
    }}>
      {/* HEADER */}
      <div style={{
        padding: 'clamp(12px, 3vw, 16px) clamp(14px, 4vw, 18px)',
        background: 'linear-gradient(90deg,rgba(245,166,35,.14),rgba(37,99,235,.08))',
        borderBottom: '1px solid rgba(255,255,255,.08)',
      }}>
        <div style={{
          fontSize: 'clamp(10px, 2.5vw, 11px)',
          letterSpacing: 1.4,
          fontWeight: 900,
          color: '#F5A623',
        }}>BEST VERSION — DAILY CONTROL CARD</div>
        <div style={{
          marginTop: 'clamp(3px, 1.5vw, 5px)',
          fontSize: 'clamp(18px, 5vw, 20px)',
          fontWeight: 950,
          color: '#FFF',
        }}>{today.date} {today.month} {today.year} — {today.day}</div>
        <div style={{
          display: 'flex',
          gap: 'clamp(6px, 2vw, 10px)',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          marginTop: 'clamp(6px, 2vw, 10px)',
        }}>
          <span style={{
            padding: 'clamp(4px, 1.5vw, 5px) clamp(6px, 2vw, 8px)',
            borderRadius: 8,
            background: 'rgba(34,197,94,.12)',
            border: '1px solid rgba(34,197,94,.24)',
            color: '#86EFAC',
            fontSize: 'clamp(8px, 2vw, 9px)',
            fontWeight: 900,
            whiteSpace: 'nowrap',
          }}>AUTO INDIA DATE</span>
          <span style={{
            padding: 'clamp(4px, 1.5vw, 5px) clamp(6px, 2vw, 8px)',
            borderRadius: 8,
            background: 'rgba(245,166,35,.12)',
            border: '1px solid rgba(245,166,35,.24)',
            color: '#FCD34D',
            fontSize: 'clamp(8px, 2vw, 9px)',
            fontWeight: 900,
            whiteSpace: 'nowrap',
          }}>{phaseId}</span>
          <span style={{
            padding: 'clamp(4px, 1.5vw, 5px) clamp(6px, 2vw, 8px)',
            borderRadius: 8,
            background: 'rgba(124,58,237,.12)',
            border: '1px solid rgba(124,58,237,.24)',
            color: '#C4B5FD',
            fontSize: 'clamp(8px, 2vw, 9px)',
            fontWeight: 900,
            whiteSpace: 'nowrap',
          }}>DAY {dayNum}/44</span>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div style={{
        padding: 'clamp(12px, 3vw, 14px) clamp(14px, 4vw, 18px)',
        borderBottom: '1px solid rgba(255,255,255,.05)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'center',
          gap: 'clamp(8px, 2vw, 10px)',
        }}>
          <div style={{
            height: '7px',
            background: 'rgba(255,255,255,.08)',
            borderRadius: 99,
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${progressWidth}%`,
              height: '100%',
              background: 'linear-gradient(90deg,#2563EB,#60A5FA,#F5A623)',
              borderRadius: 99,
              transition: 'width .3s ease',
            }} />
          </div>
          <div style={{
            color: '#FFF',
            fontSize: 'clamp(10px, 2.5vw, 11px)',
            fontWeight: 900,
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
          }}>{done}/8 • {progressWidth.toFixed(0)}%</div>
        </div>
        <div style={{
          marginTop: 'clamp(6px, 2vw, 6px)',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 'clamp(6px, 2vw, 8px)',
          fontSize: 'clamp(8px, 2vw, 9px)',
          color: '#94A3B8',
          flexWrap: 'wrap',
        }}>
          <span>All existing daily blocks stay intact.</span>
          <span style={{ color: '#86EFAC', fontWeight: 800 }}>TODAY → EXECUTE</span>
        </div>
      </div>

      {/* STATS GRID */}
      <div style={{
        padding: 'clamp(12px, 3vw, 14px) clamp(14px, 4vw, 18px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(clamp(140px, 30vw, 190px),1fr))',
        gap: 'clamp(8px, 2vw, 10px)',
        borderBottom: '1px solid rgba(255,255,255,.05)',
      }}>
        <div style={{
          textAlign: 'center',
          padding: 'clamp(8px, 2vw, 9px)',
          borderRadius: 9,
          background: 'rgba(34,197,94,.08)',
          border: '1px solid rgba(34,197,94,.2)',
        }}>
          <div style={{
            fontSize: 'clamp(8px, 2vw, 9px)',
            color: '#86EFAC',
            fontWeight: 900,
          }}>🟢 COMPLETED</div>
          <div style={{
            marginTop: 'clamp(4px, 1.5vw, 6px)',
            color: '#FFF',
            fontWeight: 900,
            fontSize: 'clamp(16px, 4vw, 18px)',
          }}>{completed}</div>
        </div>
        <div style={{
          textAlign: 'center',
          padding: 'clamp(8px, 2vw, 9px)',
          borderRadius: 9,
          background: 'rgba(245,166,35,.08)',
          border: '1px solid rgba(245,166,35,.2)',
        }}>
          <div style={{
            fontSize: 'clamp(8px, 2vw, 9px)',
            color: '#FCD34D',
            fontWeight: 900,
          }}>🟨 CURRENT</div>
          <div style={{
            marginTop: 'clamp(4px, 1.5vw, 6px)',
            color: '#FFF',
            fontWeight: 900,
            fontSize: 'clamp(16px, 4vw, 18px)',
          }}>{current ? 1 : 0}</div>
        </div>
        <div style={{
          textAlign: 'center',
          padding: 'clamp(8px, 2vw, 9px)',
          borderRadius: 9,
          background: 'rgba(148,163,184,.06)',
          border: '1px solid rgba(148,163,184,.2)',
        }}>
          <div style={{
            fontSize: 'clamp(8px, 2vw, 9px)',
            color: '#CBD5E1',
            fontWeight: 900,
          }}>⬜ REMAINING</div>
          <div style={{
            marginTop: 'clamp(4px, 1.5vw, 6px)',
            color: '#FFF',
            fontWeight: 900,
            fontSize: 'clamp(16px, 4vw, 18px)',
          }}>{remaining}</div>
        </div>
      </div>

      {/* BLOCKS */}
      <div style={{
        padding: 'clamp(12px, 3vw, 14px) clamp(14px, 4vw, 18px)',
        display: 'grid',
        gap: 'clamp(12px, 3vw, 12px)',
      }}>
        {/* PHASE & ACTION */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(clamp(140px, 30vw, 200px),1fr))',
          gap: 'clamp(8px, 2vw, 10px)',
        }}>
          <div style={{
            padding: 'clamp(10px, 2.5vw, 12px)',
            borderRadius: 10,
            background: 'rgba(34,197,94,.08)',
            border: '1px solid rgba(34,197,94,.2)',
          }}>
            <div style={{
              fontSize: 'clamp(9px, 2vw, 10px)',
              color: '#86EFAC',
              fontWeight: 900,
            }}>PRIMARY</div>
            <div style={{
              marginTop: 'clamp(3px, 1.5vw, 4px)',
              color: '#FFF',
              fontWeight: 800,
              fontSize: 'clamp(11px, 2.5vw, 12px)',
            }}>CAT 2026 • {phaseId}</div>
            <div style={{
              marginTop: 'clamp(2px, 1vw, 3px)',
              color: '#94A3B8',
              fontSize: 'clamp(9px, 2vw, 11px)',
            }}>{phaseInfo?.purpose || phaseInfo?.name}</div>
          </div>
          <div style={{
            padding: 'clamp(10px, 2.5vw, 12px)',
            borderRadius: 10,
            background: 'rgba(59,130,246,.08)',
            border: '1px solid rgba(59,130,246,.2)',
          }}>
            <div style={{
              fontSize: 'clamp(9px, 2vw, 10px)',
              color: '#93C5FD',
              fontWeight: 900,
            }}>TODAY'S O.M.I.A.</div>
            <div style={{
              marginTop: 'clamp(3px, 1.5vw, 4px)',
              color: '#FFF',
              fontWeight: 800,
              fontSize: 'clamp(11px, 2.5vw, 12px)',
            }}>{dayAction}</div>
            {roadmap && <div style={{
              marginTop: 'clamp(2px, 1vw, 3px)',
              color: '#94A3B8',
              fontSize: 'clamp(9px, 2vw, 11px)',
            }}>Day {dayNum}/44 • {roadmap.chapter}</div>}
          </div>
        </div>

        {/* TARGETS */}
        <div style={{
          padding: 'clamp(10px, 2.5vw, 12px)',
          borderRadius: 10,
          background: '#0F172A',
          border: '1px solid rgba(255,255,255,.07)',
        }}>
          <div style={{
            fontSize: 'clamp(9px, 2vw, 10px)',
            color: '#F5A623',
            fontWeight: 900,
            letterSpacing: 0.8,
            marginBottom: 'clamp(6px, 2vw, 7px)',
          }}>CAT EXECUTION — QA → DILR → VARC → TEST → ANALYSIS → REVISION → REPAIR → RETEST</div>
          <div style={{
            display: 'grid',
            gap: 'clamp(6px, 2vw, 7px)',
          }}>
            <div style={{
              fontSize: 'clamp(9px, 2vw, 10px)',
              color: '#CBD5E1',
              lineHeight: 1.4,
            }}>
              <strong style={{ color: '#86EFAC' }}>QA:</strong> {dailyTarget.quantDetail} ({dailyTarget.quantTargetQs} Qs)
            </div>
            <div style={{
              fontSize: 'clamp(9px, 2vw, 10px)',
              color: '#CBD5E1',
              lineHeight: 1.4,
            }}>
              <strong style={{ color: '#93C5FD' }}>DILR:</strong> {dailyTarget.dilrDetail} ({dailyTarget.dilrTargetSets} sets)
            </div>
            <div style={{
              fontSize: 'clamp(9px, 2vw, 10px)',
              color: '#DDD6FE',
              lineHeight: 1.4,
            }}>
              <strong style={{ color: '#C4B5FD' }}>VARC:</strong> {dailyTarget.varcDetail} ({dailyTarget.varcTargetPsg} passages)
            </div>
            <div style={{
              marginTop: 'clamp(4px, 1.5vw, 5px)',
              color: '#CBD5E1',
              fontSize: 'clamp(8px, 2vw, 9px)',
              lineHeight: 1.4,
            }}>Today: {dailyTarget.quantTopic} • {dailyTarget.dilrTopic} • {dailyTarget.varcTopic}</div>
          </div>
        </div>

        {/* BLOCK TAGS */}
        <div>
          <div style={{
            fontSize: 'clamp(9px, 2vw, 10px)',
            color: '#F5A623',
            fontWeight: 900,
            letterSpacing: 0.8,
            marginBottom: 'clamp(6px, 2vw, 7px)',
          }}>8-BLOCK SEQUENCE</div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'clamp(6px, 2vw, 7px)',
          }}>
            {['QA', 'DILR', 'VARC', 'TEST', 'ANALYSIS', 'REVISION', 'REPAIR', 'RETEST'].map(x => {
              const isDone = tasks.find(t => t.blockId === x)?.status === 'DONE'
              return (
                <span
                  key={x}
                  style={{
                    padding: 'clamp(5px, 1.5vw, 6px) clamp(7px, 2vw, 9px)',
                    borderRadius: 8,
                    fontSize: 'clamp(8px, 2vw, 10px)',
                    fontWeight: 900,
                    background: isDone ? 'rgba(34,197,94,.14)' : 'rgba(148,163,184,.08)',
                    border: isDone ? '1px solid rgba(34,197,94,.3)' : '1px solid rgba(255,255,255,.08)',
                    color: isDone ? '#86EFAC' : '#CBD5E1',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {x}
                </span>
              )
            })}
          </div>
        </div>

        {/* MORNING GATE */}
        <div style={{
          padding: 'clamp(10px, 2.5vw, 12px)',
          borderRadius: 10,
          background: '#0F172A',
          border: '1px solid rgba(255,255,255,.07)',
        }}>
          <div style={{
            fontSize: 'clamp(9px, 2vw, 10px)',
            color: '#F5A623',
            fontWeight: 900,
            letterSpacing: 0.8,
          }}>MORNING GATE — START CLEAN</div>
          <div style={{
            marginTop: 'clamp(4px, 1.5vw, 5px)',
            color: '#E5E7EB',
            fontSize: 'clamp(11px, 2.5vw, 12px)',
            lineHeight: 1.65,
          }}>Wake/reset → water → gentle humming → gentle jaw mobility → gentle voice warm-up → comfortable neck tension release.</div>
          <div style={{
            marginTop: 'clamp(4px, 1.5vw, 5px)',
            color: '#86EFAC',
            fontSize: 'clamp(10px, 2.5vw, 11px)',
            fontWeight: 800,
          }}>Today is a new execution day.</div>
        </div>

        {/* CURRENT TASK */}
        <div style={{
          padding: 'clamp(10px, 2.5vw, 12px)',
          borderRadius: 10,
          border: '1px solid rgba(245,166,35,.2)',
          background: 'rgba(245,166,35,.05)',
        }}>
          <div style={{
            fontSize: 'clamp(9px, 2vw, 10px)',
            color: '#F5A623',
            fontWeight: 900,
          }}>ACTUAL TODAY TASK</div>
          <div style={{
            marginTop: 'clamp(4px, 1.5vw, 5px)',
            color: '#FFF',
            fontSize: 'clamp(10px, 2.5vw, 11px)',
            fontWeight: 800,
            lineHeight: 1.5,
          }}>{currentTaskLine}</div>
        </div>

        {/* CHARACTER STATE */}
        <div style={{
          padding: 'clamp(10px, 2.5vw, 12px)',
          borderRadius: 10,
          border: '1px solid rgba(168,85,247,.2)',
          background: 'rgba(168,85,247,.06)',
        }}>
          <div style={{
            fontSize: 'clamp(9px, 2vw, 10px)',
            color: '#C4B5FD',
            fontWeight: 900,
          }}>INNER STATE + CHARACTER</div>
          <div style={{
            marginTop: 'clamp(4px, 1.5vw, 5px)',
            color: '#DDD6FE',
            fontSize: 'clamp(10px, 2.5vw, 11px)',
            lineHeight: 1.6,
          }}>You are a unified thinker who masters precision, logical networks, and written language. You solve deeply verified errors with focused repair. You read to connect → question → choose → link. You own every result.</div>
        </div>

        {/* CLOCK BLOCKS */}
        <div>
          <div style={{
            fontSize: 'clamp(9px, 2vw, 10px)',
            color: '#60A5FA',
            fontWeight: 900,
            marginBottom: 'clamp(6px, 2vw, 7px)',
          }}>LOCKED CLOCK BLOCKS</div>
          <div style={{
            display: 'grid',
            gap: 'clamp(4px, 1.5vw, 5px)',
          }}>
            {schedule.map(([time, label]) => (
              <div
                key={time}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'clamp(70px, 20vw, 90px) 1fr',
                  gap: 'clamp(6px, 2vw, 8px)',
                  fontSize: 'clamp(8px, 2vw, 10px)',
                }}
              >
                <span style={{ color: '#F5A623', fontWeight: 800 }}>{time}</span>
                <span style={{ color: '#CBD5E1' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div style={{
          padding: 'clamp(10px, 2vw, 12px)',
          borderRadius: 10,
          background: 'rgba(255,255,255,.02)',
          border: '1px solid rgba(255,255,255,.05)',
        }}>
          <div style={{
            fontSize: 'clamp(9px, 2vw, 10px)',
            color: '#60A5FA',
            fontWeight: 900,
            marginBottom: 'clamp(5px, 1.5vw, 6px)',
          }}>DAILY EXECUTION RULES</div>
          <div style={{
            color: '#E5E7EB',
            fontSize: 'clamp(9px, 2vw, 10px)',
            lineHeight: 1.6,
          }}>
            <strong style={{ color: '#FFF' }}>Rule:</strong> Basic → Advanced → Practice → Review → Connection → Next. If weak: repair → retest. Revision = 30-sec recap → 2-min revision → 1-min connection.
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 14px)',
        borderTop: '1px solid rgba(255,255,255,.05)',
        fontSize: 'clamp(8px, 2vw, 10px)',
        gap: 'clamp(8px, 2vw, 12px)',
        flexWrap: 'wrap',
      }}>
        <span style={{ color: '#94A3B8' }}>Today: {done}/8 CAT blocks • {progressWidth.toFixed(0)}% complete</span>
        <span style={{ color: '#86EFAC', fontWeight: 900 }}>CHECK → RESET → NEXT ACTION</span>
      </div>
    </section>
  )
}
