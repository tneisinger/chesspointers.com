import React, { useState, useEffect } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { makeChessTreeFromPGNString } from '../../shared/pgnToChessTree';
import { useUserLessons } from '../hooks/useUserLessons';

interface Props {
  lessonName?: string;
};

const useStyles = makeStyles({
  addLessonForm: {
  },
  titleInput: {
    height: '2.5rem',
    width: '100%',
    fontSize: '1.25rem',
    caretColor: 'black',
  },
  pgnTextInput: {
    fontSize: '1.25rem',
    marginTop: '1rem',
    marginBottom: '1rem',
    width: '100%',
    minHeight: '500px',
    caretColor: 'black',
  },
  colorSelect: {
    marginBottom: '1rem',
  },
  errMsg: {
    color: 'red',
    marginBottom: '1rem',
  }
});

const AddLessonForm: React.FC<Props> = ({ lessonName }) => {
  const classes = useStyles();
  const history = useHistory();

  const [lessonTitle, setLessonTitle] = useState<string>('');
  const [pgnString, setPgnString] = useState<string>('');
  const [color, setColor] = useState<'white' | 'black'>('white');
  const [errMsg, setErrMsg] = useState<string>('');

  const { userLessons, addUserLesson, deleteUserLesson } = useUserLessons();

  useEffect(() => {
    if (lessonName != undefined && userLessons[lessonName] != undefined) {
      setLessonTitle(lessonName);
      setPgnString(userLessons[lessonName].pgnString);
      setColor(userLessons[lessonName].playAs);
    }
  }, []);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value as 'white' | 'black');
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;

    // Only allow letters, number, or dashes. Do not allow the first char to be a dash.
    // Limit the length of the lesson title to 30 chars.
    const re = /^[a-z0-9-]{0,30}$/i;
    if (newTitle.charAt(0) !== '-' && re.test(newTitle)) {
      setLessonTitle(newTitle)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      makeChessTreeFromPGNString(pgnString);
      if (lessonName != undefined && lessonName != lessonTitle) {
        deleteUserLesson(lessonName, { confirm: false });
      }
      addUserLesson(lessonTitle, color, pgnString);
      history.push('/my-lessons');
    } catch (err) {
      if (err.hasOwnProperty('location')) {
        setErrMsg(`Invalid pgn: ${err.message}`);
      }
      throw e;
    }
  }

  return (
    <form className={classes.addLessonForm} onSubmit={handleSubmit}>
      <input
        className={classes.titleInput}
        type='text'
        required
        name='title'
        id='title'
        placeholder='Lesson Title'
        value={lessonTitle}
        onChange={handleTitleChange}
      />
      <textarea
        className={classes.pgnTextInput}
        required
        aria-label='paste pgn text here'
        placeholder='paste pgn text here'
        value={pgnString}
        onChange={(e) => setPgnString(e.target.value)}
      />
      <div className={classes.colorSelect}>
        <label>Play As:</label>
        <input
          checked={color === 'white'}
          onChange={handleColorChange}
          type='radio'
          value='white'
          name='color'
        /> White
        <input
          onChange={handleColorChange}
          checked={color === 'black'}
          type='radio'
          value='black'
          name='color' /> Black
      </div>
      {errMsg.length > 0 && (
        <Typography className={classes.errMsg}>
          {errMsg}
        </Typography>
      )}
      <Button
        type='submit'
        variant='contained'
        color='primary'
      >
        Save
      </Button>
    </form>
  );
};

export default AddLessonForm;
