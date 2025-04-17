// 课程进度类型
export interface CourseProgress {
  currentChapter: number;
  currentLesson: number;
  lessonProgress: { [key: string]: number };
  lastPosition: number;
  progress: number;
  lastAccessTime: string;
}

// 课程章节类型
export interface Chapter {
  id: string;
  title: string;
  duration: string;
  lessons: Lesson[];
}

// 课时类型
export interface Lesson {
  id: string;
  title: string;
  duration: number;
  videoUrl?: string;
  free?: boolean;
}

// 讲师类型
export interface Instructor {
  id: string;
  name: string;
  title: string;
  avatar: string;
}

// 课程类型
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: Instructor;
  category: string;
  subCategory?: string;
  skillPoints: number;
  rating: number;
  reviewCount: number;
  studentCount: number;
  duration: string;
  level: string;
  thumbnail: string;
  videoUrl?: string;
  featured: boolean;
  tags: string[];
  prerequisites?: string[];
  chapters: Chapter[];
  updatedAt: string;
}

// 已报名课程类型
export interface EnrolledCourse extends Course {
  progress: number;
  lastAccessTime: string;
  nextLessonId: string;
  coverImage: string;
} 