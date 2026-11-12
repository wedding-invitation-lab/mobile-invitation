"use client";

import { useEffect, useState } from "react";

export function Countdown({ target, names }: { target: string; names: [string, string] }) {
  const [now, setNow] = useState<number | null>(null); // null = SSR/첫 렌더 (hydration 불일치 방지)
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const left = now === null ? null : Math.max(0, new Date(target).getTime() - now);
  const s = left === null ? null : Math.floor(left / 1000);
  const parts: [string, number | null][] = [
    ["Days", s === null ? null : Math.floor(s / 86400)],
    ["Hours", s === null ? null : Math.floor(s / 3600) % 24],
    ["Minutes", s === null ? null : Math.floor(s / 60) % 60],
    ["Seconds", s === null ? null : s % 60],
  ];

  return (
    <>
      <div className="flex justify-center gap-3 bg-neutral-700 py-6 text-white">
        {parts.map(([label, v]) => (
          <div key={label} className="text-center">
            <div className="w-16 rounded-md bg-black/50 py-2 text-3xl tabular-nums">
              {v === null ? "--" : String(v).padStart(2, "0")}
            </div>
            <div className="mt-1 text-xs">{label}</div>
          </div>
        ))}
      </div>
      <p className="py-10 text-center text-sm">
        {names[0]} <span className="text-heart">♥</span> {names[1]} 님
        {left === 0 ? "이 행복한 결혼식을 마치셨습니다." : `의 결혼식이 ${parts[0][1] ?? "-"}일 남았습니다.`}
      </p>
    </>
  );
}

/** text가 없으면 현재 페이지 주소를 복사 */
export function CopyButton({ text, label, className }: { text?: string; label: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        await navigator.clipboard.writeText(text ?? location.href);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
    >
      {done ? "복사되었습니다" : label}
    </button>
  );
}

export function ShareButton({ title, className }: { title: string; className?: string }) {
  // ponytail: Web Share API만 사용. 카카오톡 전용 공유 카드는 KAKAO_JS_KEY 생기면 추가.
  return (
    <button
      type="button"
      className={className}
      onClick={() =>
        navigator.share ? navigator.share({ title, url: location.href }).catch(() => {}) : navigator.clipboard.writeText(location.href)
      }
    >
      공유하기
    </button>
  );
}

const field = "w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm";

export function RsvpForm() {
  const [done, setDone] = useState(false);
  if (done)
    return <p className="py-6 text-center text-sm text-sub">데모 페이지라 실제로 저장되지는 않았습니다.</p>;
  return (
    // ponytail: 제출해도 저장 안 됨. DB 생기면 /api/rsvp 서버 액션 + rate limit 연결.
    <form
      className="mx-auto flex w-[85%] flex-col gap-3 text-left text-sm"
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <div className="grid grid-cols-2 gap-2">
        {["참석", "불참"].map((v, i) => (
          <label key={v} className="border border-neutral-300 bg-white py-2.5 text-center has-checked:border-black has-checked:font-bold">
            <input type="radio" name="attending" value={v} defaultChecked={i === 0} className="sr-only" />
            {v}
          </label>
        ))}
        {["신랑측", "신부측"].map((v, i) => (
          <label key={v} className="border border-neutral-300 bg-white py-2.5 text-center has-checked:border-black has-checked:font-bold">
            <input type="radio" name="side" value={v} defaultChecked={i === 0} className="sr-only" />
            {v}
          </label>
        ))}
      </div>
      <input name="name" required maxLength={20} placeholder="성함" aria-label="성함" className={field} />
      <input name="headcount" type="number" min={1} max={10} defaultValue={1} aria-label="참석 인원" className={field} />
      <label className="flex items-center gap-2">
        <input type="checkbox" name="meal" defaultChecked /> 식사 예정
      </label>
      <textarea name="message" rows={3} maxLength={300} placeholder="전하실 말씀 (선택)" aria-label="전하실 말씀" className={field} />
      <button className="btn mt-2">전달하기</button>
    </form>
  );
}
