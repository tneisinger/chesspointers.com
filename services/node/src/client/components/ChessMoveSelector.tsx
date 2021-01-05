import React, { useState } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { ChessInstance, ShortMove } from 'chess.js';
import { ChessBoardMove } from '../../shared/chessTypes'

// The data-testid prop value for the button that submits the selected next move
// Use this in tests to select the button.
export const SELECT_BTN_TEST_ID = 'moveSelectBtn';

// This is necessary to get around a typescript error caused by adding a data-testid
// attribute to a Radio mui component.
interface MyInputProps extends React.HTMLAttributes<HTMLInputElement> {
  "data-testid"?: string;
}

type Move = {
  label: string,
  shortMove: ShortMove,
}

function toChessBoardMove(shortMove: ShortMove): ChessBoardMove {
  return {
    sourceSquare: shortMove.from,
    targetSquare: shortMove.to,
    piece: 'q',
  };
}

interface Props {
  nextMoveGames: ChessInstance[];
  handleSubmit: (move: ChessBoardMove) => void;
}

const ChessMoveSelector: React.FunctionComponent<Props> = ({
  nextMoveGames,
  handleSubmit,
}) => {
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);

  // On each render, make the list of Moves based on the current value of
  // the nextMoveGames prop.
  const moves: Move[] = nextMoveGames.reduce((acc: Move[], game) => {
    const labelHistory = game.history();
    const shortMoveHistory = game.history({ verbose: true });
    if (labelHistory.length <= 0 && shortMoveHistory.length <= 0) {
      throw new Error("No moves in history");
    }
    const move = {
      label: labelHistory[labelHistory.length - 1],
      shortMove: shortMoveHistory[shortMoveHistory.length - 1],
    };
    return [...acc, move]
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const idx = moves.findIndex(move => move.label === event.target.value);
    setSelectedMove(moves[idx]);
  }

  if (moves.length > 1) {
    return (
      <FormControl component="fieldset">
        <FormLabel component="legend">Select Move</FormLabel>
        <RadioGroup
          aria-label="select move"
          name="select move"
          value={selectedMove}
          onChange={handleChange}
        >
          {
            moves.map(move =>
              <FormControlLabel
                value={move.label}
                control={
                  <Radio
                    inputProps={{ 'data-testid': move.label } as MyInputProps}
                  />
                }
                label={move.label}
                key={move.label}
                checked={selectedMove !== null && move.label === selectedMove.label}
              />
            )
          }
        </RadioGroup>
        {selectedMove != null &&
          <button
            data-testid={SELECT_BTN_TEST_ID}
            disabled={selectedMove == undefined}
            onClick={() => handleSubmit(toChessBoardMove(selectedMove.shortMove))}
          >
            Submit Move Choice
          </button>
        }
      </FormControl>
    );
  } else if (moves.length === 1) {
    return (
      <button
        onClick={() => handleSubmit(toChessBoardMove(moves[0].shortMove))}
        data-testid={SELECT_BTN_TEST_ID}
      >
        Play Next Move
      </button>
    );
  } else {
    return <p>No moves to play</p>
  }
}

export default ChessMoveSelector;
