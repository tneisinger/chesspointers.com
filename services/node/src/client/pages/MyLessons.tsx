import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { useUserLessons } from '../hooks/useUserLessons';

const useStyles = makeStyles(() => ({
  myLessonsRoot: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  heading: {
    marginBottom: '1.25rem',
  },
  bodyText: {
    fontSize: '1.1rem',
    marginBottom: '1.25rem',
  },
  table: {
    width: '90%',
    marginBottom: '1.5rem',
    '& td': {
      textAlign: 'center',
    }
  },
  button: {
    display: 'block',
    margin: '0 auto',
  }
}));

const MyLessonsPage: React.FC = () => {
  const classes = useStyles({});

  const history = useHistory();

  const { userLessons, deleteUserLesson } = useUserLessons();

  return (
    <div className={classes.myLessonsRoot}>
      <Typography
        className={classes.heading}
        variant='h4'
        component='h3'
        align='center'
      >
        My Lessons
      </Typography>
      <table className={classes.table}>
        <tbody>
          {Object.keys(userLessons).map((lessonName) =>
            <tr key={lessonName}>
              <td><Link to={`/my-lessons/${lessonName}`}>{lessonName}</Link></td>
              <td>
                <Button
                  onClick={() => deleteUserLesson(lessonName)}
                >
                  Delete
                </Button>
              </td>
              <td>
                <Button
                  onClick={() => history.push(`/add-lesson?lessonName=${lessonName}`)}
                >
                  Edit
                </Button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {Object.keys(userLessons).length < 1 && (
        <Typography>No lessons found</Typography>
      )}
      <Button
        className={classes.button}
        onClick={() => history.push('/add-lesson')}
        variant='contained'
        color='primary'
      >
        Add New Lesson
      </Button>
    </div>
  );
};

export default MyLessonsPage;
