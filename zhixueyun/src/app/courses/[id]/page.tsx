import { Suspense } from "react";
import { Course } from "@/data/courses";
import CourseDetailClient from "./course-detail-client";

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <CourseDetailClient courseId={params.id} />
    </Suspense>
  );
} 