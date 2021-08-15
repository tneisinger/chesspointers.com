import React from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import AddLessonForm from '../components/AddLessonForm';
import queryString from 'query-string';

const useStyles = makeStyles(() => ({
  addLessonRoot: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  heading: {
    marginBottom: '1.25rem',
  },
  bodyText: {
    fontSize: '1.1rem',
    marginBottom: '1.25rem',
  }
}));

const AddLessonPage: React.FC = () => {
  const classes = useStyles({});

  const params = queryString.parse(location.search);

  let lessonName: string | undefined = undefined;
  if (params.lessonName && !Array.isArray(params.lessonName)) {
    lessonName = params.lessonName;
  }

  return (
    <div className={classes.addLessonRoot}>
      <Typography
        className={classes.heading}
        variant='h4'
        component='h3'
        align='center'
      >
        Add Lesson
      </Typography>
      <AddLessonForm lessonName={lessonName} />
    </div>
  );
};

export default AddLessonPage;
