import Link from 'next/link';
import { homePage } from '@/lib/data';
import { SectionView } from '@/components/Sections';
import { PageShell } from '@/components/PageShell';
import { HeaderBar } from '@/components/HeaderBar';
import { site } from '@/lib/data';

export const metadata = {
  title: 'صفحه پیدا نشد - MedisDesign',
};

export default function NotFound() {
  return (
    <>
    <HeaderBar menus={site.nav.menus} logo={site.nav.logo} />
    <PageShell footer={homePage.footer.length ? <SectionView section={homePage.footer[0]} /> : null}>
      <main className="main">
        <section className="section">
          <div className="section-inner" style={{ textAlign: 'center', padding: '120px 0' }}>
            <h1
              style={{
                fontFamily: 'var(--font-fa-bold)',
                fontSize: '40px',
                marginBottom: '1rem',
              }}
            >
              ۴۰۴
            </h1>
            <p style={{ marginBottom: '1.5rem' }}>صفحه‌ای که به دنبال آن هستید یافت نشد.</p>
            <Link className="btn btn-solid" href="/">
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </section>
      </main>
    </PageShell>
    </>
  );
}
