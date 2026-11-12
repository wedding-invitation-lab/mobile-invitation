// 실행: node lib/calendar.test.ts
import assert from "node:assert";
import { calendarCells } from "./calendar.ts";

const apr = calendarCells(2027, 4); // 2027-04-01은 목요일
assert.equal(apr.indexOf(1), 4);
assert.equal(apr.at(-1), 30);
assert.equal(apr.indexOf(17) % 7, 6); // 17일은 토요일

const feb = calendarCells(2028, 2); // 윤년
assert.equal(feb.at(-1), 29);

const aug = calendarCells(2026, 8); // 2026-08-01은 토요일
assert.equal(aug.indexOf(1), 6);
console.log("calendar ok");
