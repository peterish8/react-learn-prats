import { describe, expect, it } from 'vitest';
import { courseEnd, courseStart, lessons } from './lessons';

describe('React Reset curriculum', () => {
  it('contains 45 consecutive lessons', () => {
    expect(lessons).toHaveLength(45);
    expect(courseStart).toBe('2026-07-18');
    expect(courseEnd).toBe('2026-08-31');
    expect(new Set(lessons.map(lesson => lesson.day)).size).toBe(45);
  });

  it('gives every lesson seven valid quiz questions', () => {
    lessons.forEach(lesson => {
      expect(lesson.quiz).toHaveLength(7);
      lesson.quiz.forEach(question => {
        expect(question.options.length).toBeGreaterThanOrEqual(2);
        expect(question.correct).toBeGreaterThanOrEqual(0);
        expect(question.correct).toBeLessThan(question.options.length);
        expect(question.explanation.length).toBeGreaterThan(20);
      });
    });
  });

  it('has direct video and reference URLs for every day', () => {
    lessons.forEach(lesson => {
      expect(lesson.video.url).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=/);
      expect(lesson.docs).toMatch(/^https:\/\//);
    });
  });
});
