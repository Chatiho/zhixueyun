// 课程数据类型定义
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: {
    name: string;
    title: string;
    avatar: string;
  };
  category: string;
  subCategory: string;
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
  prerequisites: string[];
  chapters: {
    title: string;
    duration: string;
    lessons: {
      id: string;
      title: string;
      duration: string;
      free?: boolean;
      videoUrl?: string;
    }[];
  }[];
  updatedAt: string;
  coverImage: string;
}

// 课程数据库
export const coursesDatabase: Course[] = [
  {
    id: "course-001",
    title: "React高级组件设计",
    description: "本课程将深入讲解React组件设计的最佳实践，包括组件拆分、状态管理、性能优化等多个方面。",
    instructor: {
      name: "李明",
      title: "资深前端架构师",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
    },
    category: "编程开发",
    subCategory: "前端开发",
    skillPoints: 50,
    rating: 4.8,
    reviewCount: 246,
    studentCount: 1205,
    duration: "12小时",
    level: "中级",
    thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    featured: true,
    tags: ["React", "组件设计", "前端", "架构"],
    prerequisites: [
      "基本的HTML、CSS和JavaScript知识",
      "React基础知识",
      "ES6+语法基础"
    ],
    chapters: [
      {
        title: "组件设计基础",
        duration: "3小时",
        lessons: [
          { 
            id: "l1", 
            title: "组件设计原则", 
            duration: "45分钟", 
            free: true,
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          },
          { 
            id: "l2", 
            title: "组件通信模式", 
            duration: "45分钟",
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
          },
          { 
            id: "l3", 
            title: "状态管理策略", 
            duration: "45分钟",
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
          },
          { 
            id: "l4", 
            title: "生命周期优化", 
            duration: "45分钟",
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
          }
        ]
      },
      {
        title: "高级组件模式",
        duration: "4小时",
        lessons: [
          { id: "l5", title: "Compound Components", duration: "60分钟" },
          { id: "l6", title: "Render Props Pattern", duration: "60分钟" },
          { id: "l7", title: "Higher-Order Components", duration: "60分钟" },
          { id: "l8", title: "Custom Hooks Pattern", duration: "60分钟" }
        ]
      },
      {
        title: "性能优化实战",
        duration: "5小时",
        lessons: [
          { id: "l9", title: "性能分析工具", duration: "60分钟" },
          { id: "l10", title: "渲染优化策略", duration: "60分钟" },
          { id: "l11", title: "代码分割技术", duration: "60分钟" },
          { id: "l12", title: "缓存和记忆化", duration: "60分钟" },
          { id: "l13", title: "实战案例分析", duration: "60分钟" }
        ]
      }
    ],
    updatedAt: "2024-02-20",
    coverImage: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2"
  },
  {
    id: "course-002",
    title: "UI/UX设计原则与实践",
    description: "从用户体验和界面设计的基本原则出发，学习如何创建美观且易用的产品界面。课程涵盖设计理论、设计系统构建、交互设计等核心内容。",
    instructor: {
      name: "王芳",
      title: "设计总监",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia"
    },
    category: "设计创意",
    subCategory: "UI设计",
    skillPoints: 40,
    rating: 4.7,
    reviewCount: 189,
    studentCount: 892,
    duration: "10小时",
    level: "初级",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop",
    featured: true,
    tags: ["UI设计", "UX", "Figma", "设计系统"],
    prerequisites: [
      "基础的设计软件使用经验",
      "对设计有浓厚兴趣",
      "具备基本审美能力"
    ],
    chapters: [
      {
        title: "设计基础理论",
        duration: "3小时",
        lessons: [
          { id: "l1", title: "设计原则入门", duration: "45分钟", free: true },
          { id: "l2", title: "色彩理论与应用", duration: "45分钟" },
          { id: "l3", title: "排版与网格系统", duration: "45分钟" },
          { id: "l4", title: "视觉层次与对比", duration: "45分钟" }
        ]
      },
      {
        title: "用户体验设计",
        duration: "4小时",
        lessons: [
          { id: "l5", title: "用户研究方法", duration: "60分钟" },
          { id: "l6", title: "信息架构设计", duration: "60分钟" },
          { id: "l7", title: "交互设计模式", duration: "60分钟" },
          { id: "l8", title: "原型设计与测试", duration: "60分钟" }
        ]
      },
      {
        title: "设计系统构建",
        duration: "3小时",
        lessons: [
          { id: "l9", title: "组件库设计", duration: "60分钟" },
          { id: "l10", title: "设计规范制定", duration: "60分钟" },
          { id: "l11", title: "设计系统管理", duration: "60分钟" }
        ]
      }
    ],
    updatedAt: "2024-02-18",
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop"
  }
]; 