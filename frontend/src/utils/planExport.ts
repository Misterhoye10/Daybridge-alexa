import type { Plan, Task } from '../types/daybridge';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** UTC stamp YYYYMMDDTHHMMSSZ */
function icsStamp(d = new Date()): string {
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

function escapeIcs(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function taskMinutes(task: Task): number {
  return task.minutes ?? task.estimatedMinutes ?? 30;
}

/**
 * Build RFC 5545 .ics for the plan. Tasks become timed VEVENTs starting
 * from the next local evening (19:00), one day apart by day label order.
 */
export function planToIcs(plan: Plan): string {
  const stamp = icsStamp();
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Daybridge//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcs(plan.title)}`
  ];

  const dayOrder = Array.from(
    new Set(plan.tasks.map((t) => t.day || 'Day').filter(Boolean))
  );
  const base = new Date();
  base.setHours(19, 0, 0, 0);
  if (base.getTime() < Date.now()) base.setDate(base.getDate() + 1);

  plan.tasks.forEach((task, index) => {
    const dayIdx = Math.max(0, dayOrder.indexOf(task.day || 'Day'));
    const start = new Date(base);
    start.setDate(base.getDate() + dayIdx);
    const end = new Date(start.getTime() + taskMinutes(task) * 60_000);
    const uid = `${task.id || index}@daybridge.local`;
    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${icsStamp(start)}`,
      `DTEND:${icsStamp(end)}`,
      `SUMMARY:${escapeIcs(task.title)}`,
      `DESCRIPTION:${escapeIcs(task.description || plan.objective || '')}`,
      'END:VEVENT'
    );
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadPlanIcs(plan: Plan): void {
  const blob = new Blob([planToIcs(plan)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${plan.title.replace(/[^\w\-]+/g, '_').slice(0, 48) || 'daybridge-plan'}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export function planToMarkdown(plan: Plan): string {
  const lines = [
    `# ${plan.title}`,
    '',
    plan.objective ? `> ${plan.objective}` : '',
    '',
    '| Day | Task | Minutes | Done |',
    '| --- | --- | ---: | --- |'
  ];
  for (const t of plan.tasks) {
    const done = t.done || t.isCompleted ? 'yes' : '';
    lines.push(
      `| ${t.day || '—'} | ${t.title.replace(/\|/g, '/')} | ${taskMinutes(t)} | ${done} |`
    );
  }
  lines.push('', `_Exported from Daybridge_`);
  return lines.filter((l, i) => !(l === '' && lines[i - 1] === '')).join('\n');
}

export async function copyPlanMarkdown(plan: Plan): Promise<void> {
  const md = planToMarkdown(plan);
  await navigator.clipboard.writeText(md);
}
