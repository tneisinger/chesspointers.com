export function getViewportHeight(): number {
  return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}

export function getViewportWidth(): number {
  return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
}

export function getViewportMin(): number {
  return Math.min(getViewportHeight(), getViewportWidth());
}

export function getViewportMax(): number {
  return Math.max(getViewportWidth(), getViewportHeight());
}

export type BoardSizeUnits = 'vh' | 'vw' | 'vmin' | 'vmax' | 'px';

export function calcChessBoardSize(value: number, units: BoardSizeUnits): number {
  let pixels = 0;
  switch (units) {
    case 'vh':
      pixels = (getViewportHeight() * value) / 100;
      break;
    case 'vw':
      pixels = (getViewportWidth() * value) / 100;
      break;
    case 'vmin':
      pixels = (getViewportMin() * value) / 100;
      break;
    case 'vmax':
      pixels = (getViewportMax() * value) / 100;
      break;
    case 'px':
      pixels = value;
      break;
  }
  // The final board size of a Chessground chessboard needs to be some multiple of eight
  // pixels. See here: https://github.com/ornicar/chessground/issues/51
  const roundValue = 8;
  const roundedPixels = Math.floor(pixels / roundValue) * roundValue;
  return roundedPixels;
}
