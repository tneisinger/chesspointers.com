import { makeStyles, CardHeader } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import React, { useState, useEffect } from 'react';
import Chessboard from "chessboardjsx";
import { ChessInstance, ShortMove } from "chess.js";
const Chess = require('chess.js');

const legalTrap = [
  'e4',
  'e5',
  'Nf3',
  'Nc6',
  'Bc4',
  'd6',
  'Nc3',
  'Bg4',
  'h3',
  'Bh5',
  'Nxe5',
  'Bxd1',
  'Bxf7',
  'Ke7',
  'Nd5',
];

const COMPUTER_THINK_TIME = 500;

const SHOW_NEXT_MOVE_DELAY = 1500;

const useStyles = makeStyles(() => ({
  msg: {
    marginTop: '20px',
  },
  cardContent: {
    margin: 'auto',
  },
  cardHeader: {
    textAlign: 'center',
    paddingBottom: '4px',
  }
}));

const HomePage: React.FunctionComponent = () => {
  const classes = useStyles({});

  const [userColor] = useState<'w' | 'b'>('w');

  // The index of the next moved to be played
  const [moveIdx, setMoveIdx] = useState<number>(0);

  const isUsersTurn = (): boolean => {
    return (moveIdx % 2 === 0) === (userColor === 'w');
  }

  // The state of the game as it is on the board
  const [game, setGame] = useState<ChessInstance>(new Chess());

  // Determines the layout of the pieces on the board
  const [fen, setFen] = useState(game.fen());

  // The state of the game one move ahead. This is used to highlight the user's next
  // correct move, and/or to validate that the user's next move is the correct one.
  const [gameNextMove, setGameNextMove] = useState<ChessInstance>(new Chess());

  // Advance the gameNextMove state by one move
  gameNextMove.move(legalTrap[moveIdx]);

  const getNextUserMove = (): (ShortMove | null) => {
    if (isUsersTurn()) {
      return gameNextMove.history({ verbose: true})[moveIdx]
    }
    return null;
  }

  const [isShowingMove, setIsShowingMove] = useState<boolean>(false);

  const showMove = () => {
    const nextUserMove = getNextUserMove();
    if (isShowingMove && nextUserMove) {
      const { from, to } = nextUserMove
      const highlight = {
        boxShadow: 'inset 0 0 2px 4px orange',
        // border: '1px solid rgb(181, 136, 99)'
      };
      return {
        [from]: highlight,
        [to]: highlight,
      };
    }
    return {};
  }

  const sameMoves = (move1: ShortMove, move2: ShortMove): boolean => (
    move1.from === move2.from && move1.to === move2.to
  );

  const handleMove = (move: ShortMove) => {
    const nextUserMove = getNextUserMove();
    if (nextUserMove && sameMoves(move, nextUserMove)) {
      doNextMove();
    }
  };

  const incrementMoveIdx = () => { setMoveIdx(moveIdx + 1); }

  const doNextMove = () => {
    if (game.move(legalTrap[moveIdx])) {
      gameNextMove.move(legalTrap[moveIdx + 1]);
      incrementMoveIdx();
      setFen(game.fen());
    }
  };

  const reset = () => {
    setMoveIdx(0);
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    const newGameNextMove = new Chess();

    newGameNextMove.move(legalTrap[0]);
    setGameNextMove(newGameNextMove);
    setIsShowingMove(false);
  };

  // When it becomes the computer's turn...
  useEffect(() => {
    if (isUsersTurn()) {
      setTimeout(() => {
        setIsShowingMove(true);
      }, (SHOW_NEXT_MOVE_DELAY));

    } else {
      // Do not highlight moves while it is the computer's turn
      setIsShowingMove(false);

      // The computer makes its move move after waiting a moment
      setTimeout(() => {
        doNextMove();
      }, COMPUTER_THINK_TIME);
    }
  }, [moveIdx, isUsersTurn]);

  return (
    <Grid item xs={12}>
      <Grid container direction='row' justify='center' spacing={2}>
        <Grid item xs={6}>
          <Card>
            <CardHeader className={classes.cardHeader} title='The Legal Trap' />
            <CardContent>
              <Chessboard
                width={650}
                position={fen}
                boardStyle={{margin: 'auto', marginBottom: '12px'}}
                squareStyles={showMove()}
                onDrop={(move) =>
                  handleMove({
                    from: move.sourceSquare,
                    to: move.targetSquare,
                    promotion: 'q',
                  })
                }
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography className={classes.msg}>
                {game.in_checkmate()
                  ? <>CHECKMATE! <Button onClick={reset}>Again?</Button></>
                  : 'Keep going...'
                }
              </Typography>
            </CardContent>
          </Card>

        </Grid>
      </Grid>
    </Grid>
  );
};

export default HomePage;
