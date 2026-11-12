/* eslint-disable @next/next/no-img-element --
   ponytail: 플레이스홀더라 <img>. Supabase Storage 붙이면 next/image로 교체. */
import { calendarCells } from "@/lib/calendar";
import type { InvitationData } from "@/lib/sample";
import { CopyButton, Countdown, RsvpForm, ShareButton } from "./client";

function Head({ en, ko }: { en: string; ko?: string }) {
  return (
    <header className="reveal mb-8 text-center">
      <p className="text-[11px] tracking-[3px] text-sub/70">{en}</p>
      {ko && <h2 className="mt-3 text-lg text-sub">{ko}</h2>}
    </header>
  );
}

function Lines({ lines, className = "" }: { lines: string[]; className?: string }) {
  return (
    <p className={className}>
      {lines.map((l) => (
        <span key={l} className="block">
          {l}
        </span>
      ))}
    </p>
  );
}

export function Invitation({ data }: { data: InvitationData }) {
  const { groom, bride, venue } = data;
  const [y, m, d] = data.date.slice(0, 10).split("-").map(Number);
  const dateText = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(data.date));
  const place = `${venue.name} ${venue.hall}`;

  return (
    <main className="mx-auto w-full max-w-[430px] overflow-x-clip bg-white">
      {/* Cover */}
      <section className="px-5 pt-4 text-center">
        <div className="flex justify-between border-b border-black pb-1 font-display text-sm">
          <span>save the date</span>
          <span>
            {String(m).padStart(2, "0")}.{String(d).padStart(2, "0")}
          </span>
        </div>
        <h1 className="relative z-10 -mb-5 mt-3 font-display text-[15vw] leading-none tracking-tight min-[430px]:text-[64px]">
          MARRIAGE
        </h1>
        <img src={data.cover} alt={`${groom.name}, ${bride.name}`} className="aspect-[3/4] w-full object-cover" />
        <p className="mt-10">{dateText}</p>
        <p className="mt-1">{place}</p>
      </section>

      {/* Quote */}
      <section className="px-5 py-20 text-center text-sm">
        <Lines lines={data.quote.lines} className="reveal space-y-4" />
        <p className="reveal mt-8">- {data.quote.source} -</p>
        <div className="reveal mx-auto mt-14 w-3/5 bg-white p-3 pb-10 shadow-md">
          <img src={data.quote.photo} alt="" className="aspect-square w-full object-cover" />
        </div>
      </section>

      {/* Greeting */}
      <section className="bg-panel pt-14 text-center">
        <Head en="INVITATION" />
        <div className="space-y-8 px-5 pb-14 text-sm">
          {data.greeting.paragraphs.map((p) => (
            <Lines key={p[0]} lines={p} className="reveal space-y-3" />
          ))}
        </div>
        <img src={data.greeting.photo} alt="" className="aspect-square w-full object-cover" />
        <div className="px-5 py-8">
          <div className="reveal space-y-2 border-y border-neutral-200 py-4 text-sm tracking-[2px]">
            {[groom, bride].map((p) => (
              <p key={p.name}>
                {[p.father, p.mother].filter(Boolean).join(" · ")}
                {(p.father || p.mother) && " 의 "}
                {p.order} <b>{p.name}</b>
              </p>
            ))}
          </div>
          <button type="button" popoverTarget="contact" className="btn mt-6">
            연락하기
          </button>
        </div>
        <div id="contact" popover="auto">
          <ul className="w-72 divide-y divide-neutral-200 bg-white px-6 py-3 text-sm">
            {[
              ["신랑", groom],
              ["신부", bride],
            ].map(([role, p]) => {
              const person = p as typeof groom;
              return (
                <li key={person.name} className="flex items-center justify-between py-3">
                  <span>
                    <span className="mr-2 text-sub">{role as string}</span>
                    {person.name}
                  </span>
                  <a href={`tel:${person.phone}`} className="border-b border-black font-bold">
                    전화하기
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Wedding day */}
      <section className="pt-16">
        <Head en="WEDDING DAY" ko={dateText} />
        <div className="reveal grid grid-cols-7 gap-y-4 px-8 pb-10 text-center text-sm">
          {["일", "월", "화", "수", "목", "금", "토"].map((w) => (
            <span key={w} className="pb-2 font-bold">
              {w}
            </span>
          ))}
          {calendarCells(y, m).map((day, i) => (
            <span key={i} className={`relative isolate leading-7 ${day === d ? "font-bold text-white" : ""}`}>
              {day === d && (
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="absolute left-1/2 top-1/2 -z-10 size-10 -translate-x-1/2 -translate-y-[46%] fill-black"
                >
                  <path d="M12 21.4C5.4 16.6 2 12.9 2 8.9 2 5.9 4.3 3.6 7.2 3.6c1.9 0 3.6 1 4.8 2.6 1.2-1.6 2.9-2.6 4.8-2.6 2.9 0 5.2 2.3 5.2 5.3 0 4-3.4 7.7-10 12.5z" />
                </svg>
              )}
              {day}
            </span>
          ))}
        </div>
        <Countdown target={data.date} names={[groom.name, bride.name]} />
      </section>

      {/* Gallery */}
      <section className="px-5 pb-20">
        <Head en="GALLERY" ko="우리가 함께 한 모든 순간" />
        <div className="reveal grid grid-cols-3 gap-2">
          {data.gallery.map((src, i) => (
            <button key={src} type="button" popoverTarget={`photo-${i}`} aria-label={`사진 ${i + 1} 크게 보기`}>
              <img src={src} alt="" loading="lazy" className="aspect-square w-full rounded-lg object-cover" />
            </button>
          ))}
        </div>
        {data.gallery.map((src, i) => (
          <div key={src} id={`photo-${i}`} popover="auto">
            <img src={src} alt={`사진 ${i + 1}`} loading="lazy" className="max-h-[85vh] w-full object-contain" />
          </div>
        ))}
      </section>

      {/* Location */}
      <section className="bg-panel px-5 py-16">
        <Head en="LOCATION" ko="오시는 길" />
        <div className="reveal text-center text-sm">
          <p className="text-base font-bold">{place}</p>
          <p className="mt-2">{venue.address}</p>
          <a href={`tel:${venue.tel}`} className="mt-1 inline-block text-sub">
            {venue.tel}
          </a>
        </div>
        {/* ponytail: 지도 임베드 없음(키 필요). 지도 앱 링크만. */}
        <div className="reveal mt-8 grid grid-cols-3 gap-2 text-sm">
          {venue.maps.map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" className="rounded-md bg-white py-3 text-center shadow-sm">
              {label}
            </a>
          ))}
        </div>
        <dl className="reveal mt-8 divide-y divide-dashed divide-neutral-300 border-y border-black text-sm">
          {venue.transit.map((t) => (
            <div key={t.title} className="px-2 py-5">
              <dt className="font-bold">{t.title}</dt>
              <dd>
                <Lines lines={t.lines} className="mt-3 space-y-1" />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* RSVP */}
      <section className="px-5 py-16 text-center">
        <Head en="R.S.V.P." ko="참석 여부" />
        <Lines
          lines={["참석해 주시는 모든 분들을", "귀하게 모실 수 있도록", "참석 여부 전달을 부탁드립니다."]}
          className="reveal mb-8 space-y-2 text-sm"
        />
        <RsvpForm />
      </section>

      {/* Accounts */}
      <section className="bg-panel px-5 py-16">
        <Head en="THANKS TO" ko="마음 전하는 곳" />
        <div className="reveal space-y-3 text-sm">
          {data.accounts.map((group) => (
            <details key={group.side} className="rounded-lg bg-white shadow-sm">
              <summary className="cursor-pointer px-4 py-4 font-bold">{group.side}</summary>
              <ul className="divide-y divide-neutral-200 border-t border-neutral-200 px-4">
                {group.items.map((a) => (
                  <li key={a.number} className="flex items-center justify-between gap-3 py-3">
                    <span>
                      <span className="block text-xs text-sub">
                        {a.role} {a.holder}
                      </span>
                      {a.bank} {a.number}
                    </span>
                    <CopyButton
                      text={`${a.bank} ${a.number}`}
                      label="복사"
                      className="shrink-0 border border-neutral-300 px-3 py-1.5 text-xs"
                    />
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>

      {/* Share */}
      <section>
        <div className="flex flex-col items-center gap-4 py-12 text-sm">
          <ShareButton title={`${groom.name} ♥ ${bride.name} 결혼합니다`} />
          <CopyButton label="링크 복사하기" />
        </div>
      </section>
    </main>
  );
}
