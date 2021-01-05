import React, { useState } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { ShortMove } from 'chess.js';
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
  moves: string[];
  shortMoves: ShortMove[];
  handleSubmit: (move: ChessBoardMove) => void;
}

const ChessMoveSelector: React.FunctionComponent<Props> = ({
  moves,
  shortMoves,
  handleSubmit,
}) => {
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handling change');
    const idx = moves.findIndex(move => move === event.target.value);
    setSelectedMove({
      label: moves[idx],
      shortMove: shortMoves[idx],
    });
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
                value={move}
                control={<Radio inputProps={{ 'data-testid': move } as MyInputProps} />}
                label={move}
                key={move}
                checked={selectedMove !== null && move === selectedMove.label}
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
        onClick={() => handleSubmit(toChessBoardMove(shortMoves[0]))}
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
