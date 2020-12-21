import React from 'react';
import { makeStyles, CardHeader } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { ChessSequence } from '../types/chess';
import ChessGuide from '../components/ChessGuide';

// TODO: Split 'comment' into 'positionComment' and 'moveComment'. Show 'moveComment'
// first, and 'positionComment' after the move.

const legalTrap: ChessSequence = {
  endsInCheckmate: true,
  isPlayedByWhite: true,
  finalComment: 'That\'s checkmate!',
  moves: [
    {
      move: 'e4',
      comment: 'The legal trap begins with pawn to e4.',
    },
    {
      move: 'e5',
    },
    {
      move: 'Nf3',
      comment: 'White continues to develop into the Italian Game.',
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
      comment: 'This move is important. If the trap works, this knight will deliver checkmate.'
    },
    {
      move: 'Bg4',
    },
    {
      move: 'h3',
      comment: 'This move will hopefully push black\'s bishop off of its original diagonal.'
    },
    {
      move: 'Bh5',
    },
    {
      move: 'Nxe5',
      comment: 'This is the key move for white. It looks like a blunder, but...'
    },
    {
      move: 'Bxd1',
      comment: 'If black takes the queen, then it is mate in two for white!'
    },
    {
      move: 'Bxf7',
      comment: 'Check the king with your bishop.'
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
  cardHeader: {
    textAlign: 'center',
    paddingBottom: '0',
    marginBottom: '0',
  },
}));

const HomePage: React.FunctionComponent = () => {
  const classes = useStyles({});

  return (
    <Grid item xs={12}>
      <Grid container direction='row' justify='center' spacing={2}>
        <Grid item>
          <Card className={classes.mainCard}>
            <CardHeader className={classes.cardHeader} title='The Legal Trap' />
            <CardContent>
              <ChessGuide chessSequence={legalTrap} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HomePage;
