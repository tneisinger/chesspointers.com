import { CardHeader } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import ChessTrapsList from '../components/ChessTrapsList';

const ChessTrapsPage: React.FunctionComponent = () => {
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title='Chess Traps' />
        <CardContent>
          <ChessTrapsList />
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ChessTrapsPage;
