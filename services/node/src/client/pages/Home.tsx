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

const COMPUTER_THINK_TIME = 500;

const SHOW_NEXT_MOVE_DELAY = 1500;

const SHOW_NEW_COMMENT_DELAY = 500;

const INITIAL_MESSAGE = "Welcome!";

type Move = {
  move: string,
  comment?: string
}

type Trap = {
  endsInCheckmate: boolean,
  isPlayedByWhite: boolean,
  moves: Move[],
  finalComment: string
}

const legalTrap: Trap = {
  endsInCheckmate: true,
  isPlayedByWhite: true,
  finalComment: 'That\'s checkmate!',
  moves: [
    {
      move: 'e4',
      comment: 'The legal trap begins with white moving the King\'s pawn to e4.',
    },
    {
      move: 'e5',
    },
    {
      move: 'Nf3',
      comment: 'White continues to develop an Italian Game.',
    },
    {
      move: 'Nc6',
    },
    {
      move: 'Bc4',
    },
    {
      move: 'd6',
    },
    {
      move: 'Nc3',
    },
    {
      move: 'Bg4',
    },
    {
      move: 'h3',
    },
    {
      move: 'Bh5',
    },
    {
      move: 'Nxe5',
      comment: 'Next is white\'s key move! It looks looks like a blunder, but it\'s not.'
    },
    {
      move: 'Bxd1',
      comment: 'If black takes the queen here, then it is mate in two for white!'
    },
    {
      move: 'Bxf7',
    },
    {
      move: 'Ke7',
    },
    {
      move: 'Nd5',
      comment: 'Deliver checkmate!',
    },
  ]
};

const useStyles = makeStyles(() => ({
  mainCard: {
    padding: '0 40px',
  },
  msg: {
    textAlign: 'center',
    paddingBottom: '12px',
  },
  cardContent: {
    margin: 'auto',
  },
  cardHeader: {
    textAlign: 'center',
    paddingBottom: '0',
    marginBottom: '0',
  },
  belowChessBoard: {
    marginTop: '12px',
  }
}));

const HomePage: React.FunctionComponent = () => {
  const classes = useStyles({});

  const [comment, setComment] = useState<string>(INITIAL_MESSAGE);

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
  useEffect(() => {
    gameNextMove.move(legalTrap.moves[moveIdx].move);
  }, []);

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
    const nextMove = legalTrap.moves[moveIdx];
    if (nextMove != undefined) {
      if (game.move(nextMove.move)) {
        advanceGameNextMove();
        incrementMoveIdx();
        setFen(game.fen());
      }
    }
  };

  const advanceGameNextMove = () => {
    const nextMove = legalTrap.moves[moveIdx + 1];
    if (nextMove != undefined) {
      gameNextMove.move(nextMove.move);
    }
  };

  const reset = () => {
    setMoveIdx(0);
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    const newGameNextMove = new Chess();

    newGameNextMove.move(legalTrap.moves[0].move);
    setGameNextMove(newGameNextMove);
    setIsShowingMove(false);
    setComment(INITIAL_MESSAGE);
  };

  const scheduleCommentUpdate = (msg: string) => {
    setTimeout(() => {
      setComment(msg);
    }, SHOW_NEW_COMMENT_DELAY);
  }

  const updateComment = (msg?: string) => {
    if (msg != undefined) {
      scheduleCommentUpdate(msg)
      return;
    }

    const nextMove = legalTrap.moves[moveIdx];
    if (nextMove == undefined) {
      return;
    }

    if (nextMove.comment) {
      scheduleCommentUpdate(nextMove.comment);
    }
  }

  // Whenever the moveIdx changes
  useEffect(() => {
    if (isUsersTurn()) {
      setTimeout(() => {
        setIsShowingMove(true);
        updateComment();
      }, SHOW_NEXT_MOVE_DELAY);

    } else {
      // Do not highlight moves while it is the computer's turn
      setIsShowingMove(false);

      // The computer makes its move move after waiting a moment
      setTimeout(() => {
        doNextMove();
        updateComment();
      }, COMPUTER_THINK_TIME);
    }

    if (moveIdx >= legalTrap.moves.length) {
      updateComment(legalTrap.finalComment);
    }
  }, [moveIdx]);

  return (
    <Grid item xs={12}>
      <Grid container direction='row' justify='center' spacing={2}>
        <Grid item>
          <Card className={classes.mainCard}>
            <CardHeader className={classes.cardHeader} title='The Legal Trap' />
            <CardContent>
              <Typography className={classes.msg}>
                {comment}
              </Typography>
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
              <Grid
                className={classes.belowChessBoard}
                container
                direction='row'
                justify='center'
                spacing={2} >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={reset}
                  disabled={moveIdx === 0}
                >
                  Restart
                </Button>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HomePage;
