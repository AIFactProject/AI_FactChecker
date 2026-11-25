export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <button className="logo" onClick={onClick} aria-label="Mingence home">
      <span className="logo-mark">
        <span>明</span>
      </span>
      <span className="logo-word">MINGENCE</span>
    </button>
  );
}
