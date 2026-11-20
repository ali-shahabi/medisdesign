import { partners, processSteps, stats } from '@/content/site';
import { Picture } from './Picture';
import { PlateSection } from './PlateSection';
import { Eyebrow, Field, Mark, SecHead } from './Section';

export function StatsBand({ n = '۰۲' }: { n?: string }) {
  return (
    <section className="band" aria-labelledby="band-h">
      <Field className="band-field" drift="0.03" turn="0.004" />
      <div className="wrap band-in">
        <div className="sec-head reveal">
          <Mark n={n} />
          <div className="sec-title">
            <Eyebrow en="in numbers" fa="ارقام" />
            <h2 id="band-h">تجربه و تخصص مهم است</h2>
          </div>
        </div>

        <div className="stats">
          {stats.map((s, i) => (
            <div className="stat reveal" key={s.label} style={{ '--d': `${i * 0.06}s` } as React.CSSProperties}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section className="sec" id="process" aria-labelledby="process-h">
      <div className="wrap">
        <SecHead
          n="۰۲"
          en="method"
          fa="فرآیند"
          id="process-h"
          title="از تحلیل تا اجرا"
          note="سه گام، یک پیوستار؛ هیچ بخشی از پروژه به پروژهٔ بعدی سپرده نمی‌شود."
        />

        <div className="proc-in grid grid-cols-12 gap-6 max-[900px]:block mt-0">
          <div className="proc-copy col-span-5 max-[1180px]:col-span-6">
            <p className="lead reveal">
              کار از اندازه‌گیری آغاز می‌شود، نه از ایده. هندسهٔ فضا، رفتار صدا و پوشش نهایی، در یک زبان مشترک تصمیم
              می‌گیرند.
            </p>
            <ol className="proc-steps reveal" role="list">
              {processSteps.map((step) => (
                <li className="proc-step" key={step.n}>
                  <b>{step.n}</b>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="proc-plates grid grid-cols-2 items-start gap-5 col-start-7 col-span-6 max-[1180px]:col-start-8 max-[1180px]:col-span-5 max-[900px]:mt-[38px]">
            <figure className="plate-sheet reveal">
              <span className="sheet-img">
                <Picture
                  webp={[
                    { src: '/assets/img/plate-model-320.webp', w: 320 },
                    { src: '/assets/img/plate-model-640.webp', w: 640 },
                  ]}
                  jpg="/assets/img/plate-model-640.jpg"
                  width={640}
                  height={480}
                  alt="مدل سه‌بعدی حجمی از یک فضای مذهبی با شبکهٔ آکوستیک"
                  sizes="(max-width: 900px) 42vw, 300px"
                />
              </span>
              <figcaption>
                <span className="latin" lang="en">
                  acoustic model
                </span>
                <span className="fa">مدل سه‌بعدی حجم</span>
              </figcaption>
            </figure>

            <figure className="plate-sheet reveal">
              <span className="sheet-img">
                <PlateSection />
              </span>
              <figcaption>
                <span className="latin" lang="en">
                  section
                </span>
                <span className="fa">مقطع سالن</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Partners() {
  return (
    <section className="sec alt" aria-labelledby="partners-h">
      <div className="wrap">
        <SecHead n="۰۳" en="with us" fa="همراهان" id="partners-h" title="همراهان همیشگی ما" />
        <ul className="logos reveal" role="list">
          {partners.map((p) => (
            <li key={p.file}>
              <Picture
                webp={[{ src: `/assets/brand/partners/${p.file}-160.webp` }]}
                jpg={`/assets/brand/partners/${p.file}.png`}
                width={768}
                height={768}
                alt={p.name}
              />
            </li>
          ))}
        </ul>
        <p className="partner-note reveal">همراهانی که در سال‌های گذشته با آن‌ها کار کرده‌ایم.</p>
      </div>
    </section>
  );
}