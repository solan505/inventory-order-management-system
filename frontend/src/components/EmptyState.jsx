import { PackageOpen } from 'lucide-react';

export default function EmptyState({ title, text }) {
  return (
    <div className="empty-state">
      <PackageOpen size={30} aria-hidden="true" />
      <h3>{title}</h3>
      {text && <p>{text}</p>}
    </div>
  );
}
