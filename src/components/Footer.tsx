import { siteConfig } from '../config/site';

export default function Footer() {
  const { contact } = siteConfig;
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="container-page flex flex-col gap-2 py-8 text-xs text-neutral-500 sm:flex-row sm:justify-between">
        <div>
          <p className="font-semibold text-neutral-700">
            {siteConfig.name} · {siteConfig.affiliation}
          </p>
          <p className="mt-1">{contact.address}</p>
        </div>
        <div className="sm:text-right">
          <p>
            <a href={`mailto:${contact.email}`} className="hover:text-neutral-800">
              {contact.email}
            </a>
          </p>
          <p className="mt-1">{contact.phone}</p>
        </div>
      </div>
    </footer>
  );
}
