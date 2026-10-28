/** 사진 또는 이름 첫 글자 동그라미 */
export default function Avatar({ name, photo, className = 'h-9 w-9 text-sm' }: { name: string; photo?: string; className?: string }) {
  if (photo) return <img src={photo} alt={name} className={`${className} shrink-0 rounded-full object-cover`} />;
  return (
    <span className={`${className} inline-flex shrink-0 items-center justify-center rounded-full bg-accent/10 font-semibold text-accent`}>
      {name.slice(0, 1)}
    </span>
  );
}
