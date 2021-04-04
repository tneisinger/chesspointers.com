import bodyParser from 'body-parser';
import { Repository } from 'typeorm';
import { Router } from 'express';
import { Lesson, LessonType } from '../../shared/entity/lesson';

export function makeLessonsApiRouter(lessonRepository: Repository<Lesson>): Router {
  const router = Router();
  router.use(bodyParser.json());

  router.get('/api/traps', async (_req, res) => {
    const traps = await lessonRepository.find({
      where: {
        lessonType: LessonType.TRAP,
      },
      order: {
        shortName: 'ASC',
      },
      relations: ['attribution'],
    });
    res.json(traps);
  });

  router.get('/api/openings', async (_req, res) => {
    const openings = await lessonRepository.find({
      where: {
        lessonType: LessonType.OPENING,
      },
      order: {
        shortName: 'ASC',
      },
      relations: ['attribution'],
    });
    res.json(openings);
  });

  router.get('/api/lessons', async (_req, res) => {
    const lessons = await lessonRepository.find({
      order: {
        shortName: 'ASC',
      },
      relations: ['attribution'],
    });
    res.json(lessons);
  });

  router.get('/api/lessons/lessonId', async (req, res) => {
    const lessonId = parseInt(req.params.lessonId);
    const lesson: Lesson = await lessonRepository.findOne(lessonId, {
      relations: ['attribution'],
    });
    res.json(lesson);
  });

  return router;
}
