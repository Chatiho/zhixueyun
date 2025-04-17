"use client";

import { useState, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  Video,
  FileImage,
  ExternalLink,
  Upload,
  X,
  Link,
  Tag,
  Plus,
  Info,
  ChevronLeft,
} from "lucide-react";

// 课程内容类型
type ContentType = "video" | "image" | "cloud-drive";

// 验证URL
const isValidUrl = (urlString: string): boolean => {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
};

export default function CreateCoursePage() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 表单状态
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState<ContentType>("video");
  const [videoUrl, setVideoUrl] = useState("");
  const [cloudDriveUrl, setCloudDriveUrl] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    contentUrl?: string;
    thumbnailFile?: string;
    imageFiles?: string;
    tags?: string;
  }>({});
  
  // 处理缩略图上传
  const handleThumbnailUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, thumbnailFile: "请上传图片文件" });
      return;
    }
    
    // 验证文件大小（最大5MB）
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, thumbnailFile: "图片大小不能超过5MB" });
      return;
    }
    
    // 创建预览
    const reader = new FileReader();
    reader.onload = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setThumbnailFile(file);
    setErrors({ ...errors, thumbnailFile: undefined });
  };
  
  // 处理图片课程内容上传
  const handleImagesUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // 验证文件类型和大小
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    const fileArray = Array.from(files);
    
    let hasError = false;
    fileArray.forEach(file => {
      if (!file.type.startsWith("image/")) {
        hasError = true;
        setErrors({ ...errors, imageFiles: "请只上传图片文件" });
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        hasError = true;
        setErrors({ ...errors, imageFiles: "每张图片大小不能超过10MB" });
        return;
      }
      
      // 创建预览
      const reader = new FileReader();
      reader.onload = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === fileArray.length) {
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
      
      newFiles.push(file);
    });
    
    if (!hasError) {
      setImageFiles([...imageFiles, ...newFiles]);
      setErrors({ ...errors, imageFiles: undefined });
    }
  };
  
  // 移除图片
  const removeImage = (index: number) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };
  
  // 添加标签
  const addTag = () => {
    // 如果输入为空，不添加
    if (!tagInput.trim()) return;
    
    // 如果标签已存在，不添加
    if (tags.includes(tagInput.trim())) {
      toast({
        title: "标签已存在",
        description: "请添加不同的标签",
        variant: "destructive",
      });
      return;
    }
    
    // 如果标签数量超过5个，不添加
    if (tags.length >= 5) {
      toast({
        title: "标签数量已达上限",
        description: "最多可添加5个标签",
        variant: "destructive",
      });
      return;
    }
    
    // 添加标签
    setTags([...tags, tagInput.trim()]);
    setTagInput("");
    setErrors({ ...errors, tags: undefined });
  };
  
  // 处理回车添加标签
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };
  
  // 移除标签
  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };
  
  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: {
      title?: string;
      description?: string;
      contentUrl?: string;
      thumbnailFile?: string;
      imageFiles?: string;
      tags?: string;
    } = {};
    
    // 验证标题
    if (!title.trim()) {
      newErrors.title = "标题不能为空";
    } else if (title.length > 50) {
      newErrors.title = "标题不能超过50个字符";
    }
    
    // 验证描述
    if (!description.trim()) {
      newErrors.description = "描述不能为空";
    } else if (description.length > 500) {
      newErrors.description = "描述不能超过500个字符";
    }
    
    // 验证内容
    if (contentType === "video" && !videoUrl.trim()) {
      newErrors.contentUrl = "请输入视频链接";
    } else if (contentType === "video" && !isValidUrl(videoUrl)) {
      newErrors.contentUrl = "请输入有效的视频链接";
    } else if (contentType === "cloud-drive" && !cloudDriveUrl.trim()) {
      newErrors.contentUrl = "请输入网盘链接";
    } else if (contentType === "cloud-drive" && !isValidUrl(cloudDriveUrl)) {
      newErrors.contentUrl = "请输入有效的网盘链接";
    } else if (contentType === "image" && imageFiles.length === 0) {
      newErrors.imageFiles = "请上传至少一张图片";
    }
    
    // 验证缩略图
    if (!thumbnailFile) {
      newErrors.thumbnailFile = "请上传课程缩略图";
    }
    
    // 验证标签
    if (tags.length === 0) {
      newErrors.tags = "请至少添加一个标签";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!validateForm()) {
      toast({
        title: "表单验证失败",
        description: "请修正表单中的错误",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 在实际应用中，这里会上传文件到服务器并调用API创建课程
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 成功消息
      toast({
        title: "创建成功",
        description: "您的课程已成功创建",
      });
      
      // 重定向到课程列表页
      router.push("/share-courses");
    } catch (error) {
      console.error("Error creating course:", error);
      toast({
        title: "创建失败",
        description: "创建课程时发生错误，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 渲染内容类型图标
  const renderContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5 text-blue-500" />;
      case "image":
        return <FileImage className="h-5 w-5 text-green-500" />;
      case "cloud-drive":
        return <ExternalLink className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6 flex items-center">
            <Button
              variant="ghost"
              className="mr-2"
              onClick={() => router.back()}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              返回
            </Button>
            <h1 className="text-2xl font-bold">创建分享课程</h1>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 左侧表单 */}
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>基本信息</CardTitle>
                    <CardDescription>
                      设置课程的基本信息，让用户了解您的课程内容
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">
                        课程标题 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        placeholder="输入课程标题（最多50个字符）"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={errors.title ? "border-red-500" : ""}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm">{errors.title}</p>
                      )}
                      <p className="text-xs text-gray-500 flex justify-end">
                        {title.length}/50
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">
                        课程描述 <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="详细描述您的课程内容，帮助用户了解这门课程（最多500个字符）"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={`min-h-[100px] ${errors.description ? "border-red-500" : ""}`}
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm">{errors.description}</p>
                      )}
                      <p className="text-xs text-gray-500 flex justify-end">
                        {description.length}/500
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>
                        课程标签 <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(最多5个)</span>
                      </Label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            placeholder="添加标签，如：前端、React、设计..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            className="pl-10"
                          />
                        </div>
                        <Button 
                          type="button" 
                          onClick={addTag}
                          disabled={!tagInput.trim() || tags.length >= 5}
                        >
                          添加
                        </Button>
                      </div>
                      
                      {errors.tags && (
                        <p className="text-red-500 text-sm">{errors.tags}</p>
                      )}
                      
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {tags.map((tag, index) => (
                            <Badge key={index} className="py-1 px-2 flex items-center gap-1">
                              {tag}
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => removeTag(index)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>课程内容</CardTitle>
                    <CardDescription>
                      根据课程类型上传或添加相应的内容
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Tabs
                      defaultValue="video"
                      value={contentType}
                      onValueChange={(value) => setContentType(value as ContentType)}
                      className="w-full"
                    >
                      <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="video" className="flex items-center gap-2">
                          <Video className="h-4 w-4" /> 视频
                        </TabsTrigger>
                        <TabsTrigger value="image" className="flex items-center gap-2">
                          <FileImage className="h-4 w-4" /> 图片
                        </TabsTrigger>
                        <TabsTrigger value="cloud-drive" className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4" /> 网盘
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="video">
                        <div className="space-y-2">
                          <Label htmlFor="videoUrl">
                            视频链接 <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                              id="videoUrl"
                              placeholder="输入视频链接，如哔哩哔哩、腾讯视频等"
                              value={videoUrl}
                              onChange={(e) => setVideoUrl(e.target.value)}
                              className={`pl-10 ${errors.contentUrl ? "border-red-500" : ""}`}
                            />
                          </div>
                          {errors.contentUrl && (
                            <p className="text-red-500 text-sm">{errors.contentUrl}</p>
                          )}
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md flex items-start text-sm">
                            <Info className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                            <p className="text-blue-700 dark:text-blue-300">
                              视频链接应该是可直接访问的URL。如果您的视频需要嵌入代码，
                              请提取其中的视频URL。
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="image">
                        <div className="space-y-4">
                          <div>
                            <Label className="block mb-2">
                              上传图片 <span className="text-red-500">*</span>
                              <span className="text-xs text-gray-500 ml-2">(支持多张图片，每张最大10MB)</span>
                            </Label>
                            <div 
                              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors
                                ${errors.imageFiles ? "border-red-500" : "border-gray-300 dark:border-gray-700"}
                              `}
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                点击或拖拽图片至此处上传
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                支持PNG、JPG、JPEG、WebP格式
                              </p>
                              <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleImagesUpload}
                              />
                            </div>
                            {errors.imageFiles && (
                              <p className="text-red-500 text-sm mt-2">{errors.imageFiles}</p>
                            )}
                          </div>
                          
                          {imagePreviews.length > 0 && (
                            <div className="space-y-2">
                              <Label>已上传图片预览</Label>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {imagePreviews.map((preview, index) => (
                                  <div key={index} className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                    <img 
                                      src={preview} 
                                      alt={`Preview ${index}`} 
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeImage(index);
                                        }}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="cloud-drive">
                        <div className="space-y-2">
                          <Label htmlFor="cloudDriveUrl">
                            网盘链接 <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                              id="cloudDriveUrl"
                              placeholder="输入网盘链接，如百度网盘、阿里云盘等"
                              value={cloudDriveUrl}
                              onChange={(e) => setCloudDriveUrl(e.target.value)}
                              className={`pl-10 ${errors.contentUrl ? "border-red-500" : ""}`}
                            />
                          </div>
                          {errors.contentUrl && (
                            <p className="text-red-500 text-sm">{errors.contentUrl}</p>
                          )}
                          
                          <Separator className="my-4" />
                          
                          <div className="space-y-2">
                            <Label htmlFor="extractionCode">提取码 (选填)</Label>
                            <Input
                              id="extractionCode"
                              placeholder="输入网盘提取码"
                            />
                          </div>
                          
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md flex items-start text-sm">
                            <Info className="h-4 w-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" />
                            <p className="text-purple-700 dark:text-purple-300">
                              请确保网盘链接有效且无病毒。为方便用户访问，建议设置较长的有效期。
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
              
              {/* 右侧缩略图和预览 */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>课程缩略图</CardTitle>
                    <CardDescription>
                      上传一张能代表课程内容的图片作为缩略图
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="block mb-2">
                        缩略图 <span className="text-red-500">*</span>
                        <span className="text-xs text-gray-500 ml-2">(最大5MB)</span>
                      </Label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors
                          ${errors.thumbnailFile ? "border-red-500" : "border-gray-300 dark:border-gray-700"}
                        `}
                        onClick={() => document.getElementById("thumbnailUpload")?.click()}
                      >
                        {thumbnailPreview ? (
                          <div className="relative group">
                            <img
                              src={thumbnailPreview}
                              alt="缩略图预览"
                              className="mx-auto rounded-md aspect-video object-cover max-h-[180px] w-full"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                              <span className="text-white text-sm">点击更换</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              点击上传缩略图
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              建议尺寸：16:9，支持PNG、JPG等格式
                            </p>
                          </>
                        )}
                        <input
                          type="file"
                          id="thumbnailUpload"
                          className="hidden"
                          accept="image/*"
                          onChange={handleThumbnailUpload}
                        />
                      </div>
                      {errors.thumbnailFile && (
                        <p className="text-red-500 text-sm mt-2">{errors.thumbnailFile}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>课程预览</CardTitle>
                    <CardDescription>
                      查看课程在列表中的显示效果
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <div 
                        className="relative h-48 bg-cover bg-center"
                        style={{ 
                          backgroundImage: thumbnailPreview 
                            ? `url(${thumbnailPreview})` 
                            : 'linear-gradient(to right, #6366f1, #8b5cf6)' 
                        }}
                      >
                        <div className="absolute top-3 left-3">
                          <Badge 
                            className={`
                              ${contentType === 'video' ? 'bg-blue-500 hover:bg-blue-600' : 
                               contentType === 'image' ? 'bg-green-500 hover:bg-green-600' : 
                               'bg-purple-500 hover:bg-purple-600'}
                            `}
                          >
                            <div className="flex items-center">
                              {renderContentTypeIcon(contentType)}
                              <span className="ml-1">
                                {contentType === 'video' ? '视频' : 
                                 contentType === 'image' ? '图片' : '网盘'}
                              </span>
                            </div>
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-3">
                        <h3 className="font-medium line-clamp-1">
                          {title || "课程标题"}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {description || "课程描述将在此处显示..."}
                        </p>
                        
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* 提交按钮 */}
            <div className="flex justify-end mt-8 space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                取消
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? "正在提交..." : "创建课程"}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
} 