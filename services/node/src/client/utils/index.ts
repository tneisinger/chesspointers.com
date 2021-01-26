export function viewportHeight(): number {
  return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}

export function viewportWidth(): number {
  return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
}

export function vmin(): number {
  return Math.min(viewportHeight(), viewportWidth());
}

export function vmax(): number {
  return Math.max(viewportWidth(), viewportHeight());
}

export type BoardSizeUnits = 'vh' | 'vw' | 'vmin' | 'vmax' | 'px';

export function calcChessBoardSize(value: number, units: BoardSizeUnits): number {
  let pixels = 0;
  switch (units) {
    case 'vh':
      pixels = (viewportHeight() * value) / 100;
      break;
    case 'vw':
      pixels = (viewportWidth() * value) / 100;
      break;
    case 'vmin':
      pixels = (vmin() * value) / 100;
      break;
    case 'vmax':
      pixels = (vmax() * value) / 100;
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
