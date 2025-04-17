import { Course, coursesDatabase } from "@/data/courses";

// 获取相关课程
export function getRelatedCourses(currentCourseId: string, currentCategory: string): Course[] {
  // 从数据库中筛选同类别的其他课程
  return coursesDatabase
    .filter(course => course.category === currentCategory && course.id !== currentCourseId)
    .slice(0, 4); // 最多返回4个相关课程
}

// 获取课程视频URL
export function getVideoUrlByCourseId(courseId: string): string {
  const videoUrls: Record<string, string> = {
    'course-1': 'https://example.com/videos/react-advanced.mp4',
    'course-2': 'https://example.com/videos/uiux-design.mp4',
  };
  
  return videoUrls[courseId] || 'https://example.com/videos/default.mp4';
} 