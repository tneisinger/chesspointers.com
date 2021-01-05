import React, { useState } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import { ShortMove } from 'chess.js';
import { ChessBoardMove } from '../../shared/chessTypes'

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
                control={<Radio />}
                label={move}
                key={move}
                checked={selectedMove !== null && move === selectedMove.label}
              />
            )
          }
        </RadioGroup>
        {selectedMove != null &&
          <Button
            variant="outlined"
            disabled={selectedMove == undefined}
            onClick={() => handleSubmit(toChessBoardMove(selectedMove.shortMove))}
          >
            Submit Move Choice
          </Button>
        }
      </FormControl>
    );
  } else if (moves.length === 1) {
    return (
      <Button
        variant="outlined"
        onClick={() => handleSubmit(toChessBoardMove(shortMoves[0]))}>
        Play Next Move
      </Button>
    );
  } else {
    return <p>No moves to play</p>
  }
}

export default ChessMoveSelector;
