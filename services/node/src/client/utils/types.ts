export type GuideMode = 'learn' | 'practice';

// Opponent moves played by...
export enum OpMovesPlayedBy {
  computer = 'the computer (chosen at random)',
  userIfMultipleChoices = 'me if there are multiple choices',
}

export interface ChessGuideSettings {
  prac_opMovesPlayedBy: OpMovesPlayedBy;
}
