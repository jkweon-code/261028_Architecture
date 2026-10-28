import { Link } from 'react-router-dom';
import { navItems, siteConfig } from '../config/site';

export default function Footer() {
  const { contact } = siteConfig;
  return (
    <footer className="bg-neutral-950 text-neutral-400">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-lg font-bold text-white">{siteConfig.name}</p>
          <p className="mt-1 text-xs tracking-[0.14em] uppercase">{siteConfig.nameEn}</p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed">{siteConfig.tagline}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-neutral-500 uppercase">Menu</p>
          <ul className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-neutral-500 uppercase">Contact</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>{siteConfig.affiliation}</li>
            <li>{contact.address}</li>
            <li>
              <a href={`mailto:${contact.email}`} className="hover:text-white">
                {contact.email}
              </a>
            </li>
            <li>{contact.phone}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-800">
        <p className="container-page py-5 text-xs text-neutral-500">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
