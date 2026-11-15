import { contact } from '@/content/site';

export function ContactSide() {
  return (
    <>
      <span className="latin" lang="en">
        telephone
      </span>
      {contact.phones.map((phone) => (
        <a className="prow" href={phone.href} key={phone.href}>
          <span className="plabel">{phone.label}</span>
          <span className="pnum">{phone.display}</span>
        </a>
      ))}

      <span className="latin block mt-[26px]" lang="en">
        digital
      </span>
      <a className="prow" href={`mailto:${contact.email}`}>
        <span className="plabel">ایمیل</span>
        <span className="pnum contact">{contact.email}</span>
      </a>
      <a className="prow" href={contact.instagram} target="_blank" rel="noopener noreferrer">
        <span className="plabel">اینستاگرام</span>
        <span className="pnum contact">{contact.instagramHandle}</span>
      </a>
      <a className="prow" href={contact.whatsapp} target="_blank" rel="noopener noreferrer">
        <span className="plabel">واتساپ</span>
        <span className="pnum contact">{contact.whatsappHandle}</span>
      </a>

      <a className="c-site" href={contact.site}>
        {contact.siteLabel}
      </a>
    </>
  );
}
