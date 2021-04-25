export type GuideMode = 'learn' | 'practice';

// Opponent moves played by...
export enum OpMovesPlayedBy {
  computer = 'the computer (chosen at random)',
  userIfMultipleChoices = 'me if there are multiple choices',
}

export interface ChessGuideSettings {
  prac_opMovesPlayedBy: OpMovesPlayedBy;
  allowDeadEndModal: boolean;
}

// The drawable property of a chessground chess board
export interface DrawableProp {
  enabled: boolean;
  visible: boolean;
  eraseOnClick: boolean;
  defaultSnapToValidMove: boolean;
  autoShapes: ChessboardArrow[];
}

// A chessground arrow definition
export interface ChessboardArrow {
  orig: string;
  dest: string;
  brush: BrushColor;
}

// Color options that chessground allows arrows to be
export enum BrushColor {
  GREEN = 'green',
  RED = 'red',
  BLUE = 'blue',
  YELLOW = 'yellow',
}
