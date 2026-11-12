/** 달력 한 달치 셀. 1일 앞의 빈 칸은 null. month는 1~12. */
export function calendarCells(year: number, month: number): (number | null)[] {
  const lead = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return [...Array<null>(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
}
