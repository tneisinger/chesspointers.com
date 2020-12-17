import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { User } from '../../shared/entity/user';
import { getUserFullName } from '../../shared/utils';

interface IProps {
  user: User;
}

export const UserComponent: React.FunctionComponent<IProps> = ({ user }) => {
  return (
    <Card>
      <CardHeader title={`User: ${getUserFullName(user)}`} />
      <CardContent>
        <Typography>Id: {user.id}</Typography>
        <Typography>Email: {user.email}</Typography>
        <Typography>Age: {user.age}</Typography>
      </CardContent>
    </Card>
  );
};
