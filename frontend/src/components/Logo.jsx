/**
 * Logo FastCare
 * Le PNG source est 500x500 avec le logo centré (≈30% de marge verticale, ≈16% horizontal).
 * On recadre via overflow:hidden + marges négatives pour n'afficher que le contenu réel.
 */
const Logo = ({ visibleWidth = 150 }) => {
  // Le logo occupe ~68% de la largeur et ~38% de la hauteur du PNG
  const imgSize   = Math.round(visibleWidth / 0.68);   // taille affichée du PNG carré
  const cropTop   = Math.round(imgSize * 0.30);         // rognage haut
  const cropLeft  = Math.round(imgSize * 0.14);         // rognage gauche
  const visibleH  = Math.round(imgSize * 0.38);         // hauteur visible réelle

  return (
    <div style={{
      width:    visibleWidth,
      height:   visibleH,
      overflow: 'hidden',
      flexShrink: 0,
      cursor:   'pointer',
      userSelect: 'none',
    }}>
      <img
        src="/logo.png"
        alt="FastCare"
        style={{
          width:    imgSize,
          height:   imgSize,
          maxWidth: 'none',
          display:  'block',
          marginTop:  -cropTop,
          marginLeft: -cropLeft,
        }}
      />
    </div>
  );
};

export default Logo;
