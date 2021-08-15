import { useState } from 'react';

type Color = 'white' | 'black';

interface UserLesson {
  playAs: Color;
  pgnString: string;
};

type UserLessons = Record<string, UserLesson>

const LOCAL_STORAGE_KEY = 'user-lessons';

export interface Toolkit {
  userLessons: UserLessons;
  deleteUserLesson: (lessonName: string) => void;
  addUserLesson: (lessonName: string, playAs: Color, pgnString: string) => void;
}

export function useUserLessons(): Toolkit {
  const getLocalStorageLessons = (): UserLessons => {
    let lessons: UserLessons = {};
    const lessonsString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (lessonsString != null) lessons = JSON.parse(lessonsString);
    return lessons;
  }

  const [userLessons, setUserLessons] = useState(getLocalStorageLessons());

  const deleteUserLesson = (lessonName: string) => {
    const lessons = getLocalStorageLessons();
    delete lessons[lessonName];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lessons));
    setUserLessons(lessons);
  }

  const addUserLesson = (lessonName: string, color: Color, pgnString: string) => {
    const lessons = getLocalStorageLessons();
    const lesson = {
      playAs: color,
      pgnString
    };
    lessons[lessonName] = lesson;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lessons));
    setUserLessons(lessons);
  }

  return { userLessons, deleteUserLesson, addUserLesson };
}
