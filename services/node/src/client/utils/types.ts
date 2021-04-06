export type GuideMode = 'learn' | 'practice';

// Opponent moves played by...
export enum OpMovesPlayedBy {
  userIfMultipleChoices = 'me if there are multiple choices',
  computer = 'the computer (chosen at random)',
}

export interface ChessGuideSettings {
  prac_opMovesPlayedBy: OpMovesPlayedBy;
}
