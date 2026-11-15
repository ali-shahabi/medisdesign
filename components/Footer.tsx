import Link from 'next/link';
import { contact } from '@/content/site';
import { asset } from '@/lib/site';
import { Up } from './Icons';

export function Footer() {
  return (
    <footer className="foot" data-lazy>
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <img
              src={asset('/assets/brand/medis-mark-cream.png')}
              width={32}
              height={32}
              loading="lazy"
              decoding="async"
              alt="نشان گروه مهندسی مدیس"
            />
            <div>
              <b>گروه مهندسی مدیس</b>
              <p>طراحی آکوستیک، الکتروآکوستیک و معماری سالن‌های همایش، سینما و فضاهای فرهنگی.</p>
              <p className="foot-addr">کارخانه: {contact.factory}</p>
            </div>
          </div>

          <div>
            <h2 className="foot-h">صفحه‌ها</h2>
            <ul role="list">
              <li>
                <Link href="/projects/">پروژه‌ها</Link>
              </li>
              <li>
                <Link href="/products/">محصولات</Link>
              </li>
              <li>
                <Link href="/services/">خدمات ما</Link>
              </li>
              <li>
                <Link href="/magazine/">مدیس مگ</Link>
              </li>
              <li>
                <Link href="/catalog/">کاتالوگ‌ها</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="foot-h">دسترسی</h2>
            <ul role="list">
              <li>
                <Link href="/about/">درباره ما</Link>
              </li>
              <li>
                <Link href="/contact/">تماس با ما</Link>
              </li>
              <li>
                <Link href="/strategy/">سند راهبردی</Link>
              </li>
              <li>
                <Link href="/policy/">خط مشی</Link>
              </li>
              <li>
                <Link href="/privacy/">حریم خصوصی</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="foot-h">تماس</h2>
            <ul role="list">
              {contact.phones.map((phone) => (
                <li key={phone.href}>
                  <a href={phone.href}>{phone.display}</a>
                </li>
              ))}
              <li>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
              <li>
                <a href={contact.instagram} target="_blank" rel="noopener noreferrer">
                  اینستاگرام
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="foot-meta">
          <p>© گروه مهندسی مدیس — تمامی حقوق محفوظ است.</p>
          <a className="to-top" href="#top">
            بازگشت به بالا
            <Up />
          </a>
        </div>
      </div>
    </footer>
  );
}
