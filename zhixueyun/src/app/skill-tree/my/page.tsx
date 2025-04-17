"use client";

import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { HierarchyNode, HierarchyPointNode } from 'd3';

// 用户技能数据
const skillTreeData = {
  totalSkillPoints: 2580,
  level: 15,
  nextLevelPoints: 3000,
  skillCategories: [
    {
      name: "前端开发",
      progress: 78,
      skills: [
        { name: "React", level: 4, maxLevel: 5, progress: 85 },
        { name: "TypeScript", level: 3, maxLevel: 5, progress: 65 },
        { name: "Vue", level: 3, maxLevel: 5, progress: 70 },
        { name: "前端工程化", level: 3, maxLevel: 5, progress: 60 },
      ],
      achievements: [
        { name: "React专家", completed: true, date: "2024-02-15" },
        { name: "TypeScript进阶", completed: true, date: "2024-01-20" },
        { name: "组件库贡献者", completed: false, progress: 75 },
      ],
    },
    {
      name: "后端开发",
      progress: 65,
      skills: [
        { name: "Node.js", level: 3, maxLevel: 5, progress: 75 },
        { name: "数据库设计", level: 3, maxLevel: 5, progress: 60 },
        { name: "系统架构", level: 2, maxLevel: 5, progress: 45 },
        { name: "API设计", level: 3, maxLevel: 5, progress: 70 },
      ],
      achievements: [
        { name: "Node.js实践者", completed: true, date: "2024-03-01" },
        { name: "数据库优化师", completed: false, progress: 80 },
        { name: "架构设计师", completed: false, progress: 40 },
      ],
    },
    {
      name: "云计算",
      progress: 45,
      skills: [
        { name: "Docker", level: 2, maxLevel: 5, progress: 55 },
        { name: "Kubernetes", level: 2, maxLevel: 5, progress: 40 },
        { name: "云原生", level: 2, maxLevel: 5, progress: 35 },
        { name: "DevOps", level: 2, maxLevel: 5, progress: 45 },
      ],
      achievements: [
        { name: "容器技术专家", completed: false, progress: 60 },
        { name: "云原生实践者", completed: false, progress: 45 },
        { name: "DevOps工程师", completed: false, progress: 50 },
      ],
    },
  ],
  recentActivities: [
    {
      type: "achievement",
      title: "获得成就：React专家",
      date: "2024-02-15",
      points: 500,
    },
    {
      type: "level_up",
      title: "技能升级：TypeScript Lv.3",
      date: "2024-02-10",
      points: 300,
    },
    {
      type: "course",
      title: "完成课程：React高级组件设计",
      date: "2024-02-01",
      points: 200,
    },
    {
      type: "practice",
      title: "完成实战项目：电商平台开发",
      date: "2024-01-25",
      points: 400,
    },
  ],
  recommendedPaths: [
    {
      title: "全栈工程师成长路线",
      description: "系统掌握前后端技术栈，构建完整的应用开发能力",
      progress: 65,
      remainingCourses: 3,
      estimatedHours: 45,
    },
    {
      title: "云原生架构师路线",
      description: "深入学习云原生技术，掌握现代化架构设计方法",
      progress: 40,
      remainingCourses: 5,
      estimatedHours: 75,
    },
  ],
};

interface SkillNode {
  name: string;
  level?: number;
  progress?: number;
  children?: SkillNode[];
}

const treeData: SkillNode = {
  name: "技能树",
  children: [
    {
      name: "前端开发",
      level: 4,
      progress: 78,
      children: [
        {
          name: "React",
          level: 4,
          progress: 85,
          children: [
            { name: "组件设计", level: 4, progress: 90 },
            { name: "状态管理", level: 4, progress: 85 },
            { name: "性能优化", level: 3, progress: 75 },
          ],
        },
        {
          name: "TypeScript",
          level: 3,
          progress: 65,
          children: [
            { name: "类型系统", level: 3, progress: 70 },
            { name: "泛型编程", level: 3, progress: 65 },
          ],
        },
        {
          name: "工程化",
          level: 3,
          progress: 60,
          children: [
            { name: "构建工具", level: 3, progress: 65 },
            { name: "自动化测试", level: 2, progress: 45 },
          ],
        },
      ],
    },
    {
      name: "后端开发",
      level: 3,
      progress: 65,
      children: [
        {
          name: "Node.js",
          level: 3,
          progress: 75,
          children: [
            { name: "Express", level: 3, progress: 80 },
            { name: "中间件", level: 3, progress: 70 },
          ],
        },
        {
          name: "数据库",
          level: 3,
          progress: 60,
          children: [
            { name: "SQL", level: 3, progress: 65 },
            { name: "NoSQL", level: 2, progress: 55 },
          ],
        },
      ],
    },
    {
      name: "云计算",
      level: 2,
      progress: 45,
      children: [
        {
          name: "容器化",
          level: 2,
          progress: 55,
          children: [
            { name: "Docker", level: 2, progress: 60 },
            { name: "K8s", level: 2, progress: 40 },
          ],
        },
        {
          name: "DevOps",
          level: 2,
          progress: 45,
          children: [
            { name: "CI/CD", level: 2, progress: 50 },
            { name: "监控", level: 2, progress: 40 },
          ],
        },
      ],
    },
  ],
};

interface SkillTreeVisualizationProps {
  data: SkillNode;
}

const SkillTreeVisualization: React.FC<SkillTreeVisualizationProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 1000;
    const height = 800;
    const margin = { top: 40, right: 120, bottom: 40, left: 120 };

    // Clear existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Create SVG container with zoom support
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .call(d3.zoom<SVGSVGElement, unknown>().on("zoom", (event) => {
        g.attr("transform", event.transform);
      }));

    // Add gradient definitions
    const defs = svg.append("defs");
    
    // Gradient for links
    const linkGradient = defs.append("linearGradient")
      .attr("id", "linkGradient")
      .attr("gradientUnits", "userSpaceOnUse");
    
    linkGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#4CAF50");
    
    linkGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#2196F3");

    // Create main group for transformations
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add background grid
    const grid = g.append("g")
      .attr("class", "grid");

    const gridSize = 40;
    const numHorizontalLines = Math.ceil(height / gridSize);
    const numVerticalLines = Math.ceil(width / gridSize);

    for (let i = 0; i < numHorizontalLines; i++) {
      grid.append("line")
        .attr("x1", 0)
        .attr("y1", i * gridSize)
        .attr("x2", width)
        .attr("y2", i * gridSize)
        .attr("stroke", "#f0f0f0")
        .attr("stroke-width", 1);
    }

    for (let i = 0; i < numVerticalLines; i++) {
      grid.append("line")
        .attr("x1", i * gridSize)
        .attr("y1", 0)
        .attr("x2", i * gridSize)
        .attr("y2", height)
        .attr("stroke", "#f0f0f0")
        .attr("stroke-width", 1);
    }

    const treeLayout = d3.tree<SkillNode>()
      .size([height - margin.top - margin.bottom, width - margin.left - margin.right])
      .nodeSize([60, 120]); // Adjust node spacing

    const root = d3.hierarchy(data) as HierarchyNode<SkillNode>;
    const treeData = treeLayout(root);

    // Add links with animation and gradient
    const links = g.selectAll('.link')
      .data(treeData.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal<any, any>()
        .x((d: any) => d.y)
        .y((d: any) => d.x))
      .style('fill', 'none')
      .style('stroke', 'url(#linkGradient)')
      .style('stroke-width', 2)
      .style('opacity', 0)
      .transition()
      .duration(800)
      .style('opacity', 0.6);

    // Create node groups with animation
    const nodeGroups = g.selectAll('.node')
      .data(treeData.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: HierarchyPointNode<SkillNode>) => `translate(${d.y},${d.x})`);

    // Animate node groups
    nodeGroups.style('opacity', 0)
      .transition()
      .duration(800)
      .delay((_, i) => i * 50)
      .style('opacity', 1);

    // Add node circles with dynamic size and gradient
    nodeGroups.append('circle')
      .attr('r', (d: HierarchyPointNode<SkillNode>) => {
        const level = d.data.level || 1;
        return Math.max(level * 6, 8);
      })
      .style('fill', (d: HierarchyPointNode<SkillNode>) => {
        const progress = d.data.progress || 0;
        if (progress >= 80) return "#22c55e";
        if (progress >= 60) return "#3b82f6";
        if (progress >= 40) return "#eab308";
        return "#94a3b8";
      })
      .style('stroke', '#fff')
      .style('stroke-width', 2)
      .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))');

    // Add skill level badges
    nodeGroups.filter((d: HierarchyPointNode<SkillNode>) => Boolean(d.data.level))
      .append('text')
      .attr('dy', '-1.2em')
      .attr('x', 0)
      .style('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#6b7280')
      .text((d: HierarchyPointNode<SkillNode>) => `Lv.${d.data.level}`);

    // Add skill names with progress
    nodeGroups.append('text')
      .attr('dy', '2em')
      .attr('x', (d: HierarchyPointNode<SkillNode>) => d.children ? -15 : 15)
      .style('text-anchor', (d: HierarchyPointNode<SkillNode>) => d.children ? 'end' : 'start')
      .style('font-size', '12px')
      .style('fill', '#374151')
      .text((d: HierarchyPointNode<SkillNode>) => {
        const progress = d.data.progress;
        return `${d.data.name}${progress ? ` (${progress}%)` : ''}`;
      });

    // Add hover effects with highlight
    nodeGroups.on('mouseover', function(this: SVGGElement, event: MouseEvent, d: HierarchyPointNode<SkillNode>) {
      const node = d3.select(this);
      
      // Scale up the circle
      node.select('circle')
        .transition()
        .duration(200)
        .attr('r', function(d: any) {
          const level = d.data.level || 1;
          return Math.max(level * 6, 8) * 1.2;
        })
        .style('filter', 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))');

      // Make text slightly larger and add glow effect
      node.selectAll('text')
        .transition()
        .duration(200)
        .style('font-size', '13px')
        .style('font-weight', '600')
        .style('text-shadow', '0 0 3px rgba(255,255,255,0.5)');
    })
    .on('mouseout', function(this: SVGGElement, event: MouseEvent, d: HierarchyPointNode<SkillNode>) {
      const node = d3.select(this);
      
      // Reset circle size
      node.select('circle')
        .transition()
        .duration(200)
        .attr('r', function(d: any) {
          const level = d.data.level || 1;
          return Math.max(level * 6, 8);
        })
        .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))');

      // Reset text style
      node.selectAll('text')
        .transition()
        .duration(200)
        .style('font-size', '12px')
        .style('font-weight', 'normal')
        .style('text-shadow', 'none');
    });

  }, [data]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">技能树可视化</h2>
      <div className="min-h-[600px] relative">
        <svg 
          ref={svgRef} 
          className="w-full h-full min-w-[1000px]"
          style={{
            background: 'linear-gradient(to right bottom, rgba(240,249,255,0.1), rgba(219,234,254,0.1))'
          }}
        />
        <div className="absolute bottom-4 right-4 text-sm text-gray-500">
          提示：可以使用鼠标滚轮进行缩放，拖动查看完整技能树
        </div>
      </div>
    </div>
  );
};

export default function MySkillTreePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-10">
        <div className="container mx-auto px-4">
          {/* 用户技能概览 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">我的技能树</h1>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    Lv.{skillTreeData.level}
                  </Badge>
                  <span className="text-gray-600 dark:text-gray-400">
                    技能点: {skillTreeData.totalSkillPoints}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => router.push("/skill-tree/paths")}>
                  学习路线
                </Button>
                <Button variant="outline" onClick={() => router.push("/skill-tree/achievements")}>
                  我的成就
                </Button>
                <Button 
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  onClick={() => router.push("/courses")}
                >
                  继续学习
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>距离下一级还需 {skillTreeData.nextLevelPoints - skillTreeData.totalSkillPoints} 技能点</span>
                <span>{skillTreeData.totalSkillPoints}/{skillTreeData.nextLevelPoints}</span>
              </div>
              <Progress value={(skillTreeData.totalSkillPoints / skillTreeData.nextLevelPoints) * 100} />
            </div>
          </div>

          {/* 技能树可视化 */}
          <div className="mb-8">
            <SkillTreeVisualization data={treeData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="skills" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="skills" className="flex-1">技能详情</TabsTrigger>
                  <TabsTrigger value="achievements" className="flex-1">成就系统</TabsTrigger>
                  <TabsTrigger value="activities" className="flex-1">最近动态</TabsTrigger>
                </TabsList>

                {/* 技能详情标签页 */}
                <TabsContent value="skills">
                  <div className="space-y-6">
                    {skillTreeData.skillCategories.map((category) => (
                      <Card key={category.name}>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle>{category.name}</CardTitle>
                            <Badge variant="secondary">
                              熟练度 {category.progress}%
                            </Badge>
                          </div>
                          <Progress value={category.progress} className="mt-2" />
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {category.skills.map((skill) => (
                              <div key={skill.name} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium">{skill.name}</span>
                                  <Badge>
                                    Lv.{skill.level}/{skill.maxLevel}
                                  </Badge>
                                </div>
                                <Progress value={skill.progress} />
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* 成就系统标签页 */}
                <TabsContent value="achievements">
                  <div className="space-y-6">
                    {skillTreeData.skillCategories.map((category) => (
                      <Card key={category.name}>
                        <CardHeader>
                          <CardTitle>{category.name}成就</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {category.achievements.map((achievement) => (
                              <div
                                key={achievement.name}
                                className={`bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 ${
                                  achievement.completed ? "border-2 border-green-500" : ""
                                }`}
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium">{achievement.name}</span>
                                  {achievement.completed ? (
                                    <Badge className="bg-green-500">已获得</Badge>
                                  ) : (
                                    <Badge variant="outline">{achievement.progress}%</Badge>
                                  )}
                                </div>
                                {!achievement.completed && (
                                  <Progress value={achievement.progress} />
                                )}
                                {achievement.completed && (
                                  <div className="text-sm text-gray-500">
                                    获得时间：{achievement.date}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* 最近动态标签页 */}
                <TabsContent value="activities">
                  <Card>
                    <CardHeader>
                      <CardTitle>学习历程</CardTitle>
                      <CardDescription>记录你的技能成长之路</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {skillTreeData.recentActivities.map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="font-medium">{activity.title}</div>
                              <div className="text-sm text-gray-500">{activity.date}</div>
                            </div>
                            <Badge variant="secondary">+{activity.points} 技能点</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* 右侧推荐路线 */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>推荐学习路线</CardTitle>
                  <CardDescription>基于你的技能树定制的学习建议</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {skillTreeData.recommendedPaths.map((path, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                      >
                        <div className="font-medium mb-2">{path.title}</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {path.description}
                        </p>
                        <div className="flex justify-between text-sm mb-2">
                          <span>完成进度</span>
                          <span>{path.progress}%</span>
                        </div>
                        <Progress value={path.progress} className="mb-3" />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>剩余 {path.remainingCourses} 门课程</span>
                          <span>预计 {path.estimatedHours} 小时</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 技能统计卡片 */}
              <Card>
                <CardHeader>
                  <CardTitle>技能统计</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>已掌握技能</span>
                      <span className="font-bold">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>进行中技能</span>
                      <span className="font-bold">5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>获得成就</span>
                      <span className="font-bold">8</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>完成课程</span>
                      <span className="font-bold">15</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 