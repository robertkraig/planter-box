export function SparePlank({ plank, plankLength, scale }) {
  return (
    <div className="plank-row">
      <span className="plank-label">{plank.label}</span>
      <div className="plank">
        <div className="cut spare" style={{ width: `${plankLength * scale}px` }}>
          spare<br />
          <span>{plankLength}"</span>
        </div>
      </div>
    </div>
  );
}
