import React, { Suspense } from "react";
import { CourseDetail } from "@/components/course-detail";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";

interface CoursePageProps {
  params: {
    id: string;
  };
}

export default function CoursePage({ params }: CoursePageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">加载课程信息...</p>
          </div>
        </div>
      }>
        <CourseDetail courseId={params.id} />
      </Suspense>
      <Footer />
    </div>
  );
} 