// Type definitions for pgn-parser 2.1.1
// Project: https://github.com/kevinludwig/pgn-parser
// Definitions by: Tyler Neisinger <https://github.com/tneisinger>
// Definitions: https://github.com/DefinitelyTyped/pgn-parser
declare module 'pgn-parser' {
  export function parse(pgnString: string): ParsedPGN[];

  export interface ParsedPGN {
    comments: Comment[] | null;
    comments_above_header: Comment[] | null;
    headers: Header[] | null;
    moves: Move[];
    result: string;
  }

  export interface Comment {
    text: string;
  }

  export interface Header {
    name: string;
    value: string;
  }

  export interface Move {
    move: string;
    comments: string[];
    move_number?: number;
    ravs?: Rav[];
  }

  export interface Rav {
    moves: Move[];
    result: string | null;
  }
}
