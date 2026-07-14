/** 本地时区的今天日期 YYYY-MM-DD */
export function todayDateString(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** 展示用中文日期，如 7月14日 星期二 */
export function formatDisplayDate(date = new Date()): string {
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  return `${date.getMonth() + 1}月${date.getDate()}日 星期${weekdays[date.getDay()]}`;
}
