"use client";

import { useState, useRef, FormEvent } from "react";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ProtectedRoute } from "@/components/protected-route";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Upload, 
  Video, 
  FileImage, 
  ExternalLink, 
  Plus, 
  XCircle,
  AlertCircle,
  Info,
  FileUp,
  Check
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

// 课程内容类型定义
type ContentType = "video" | "image" | "cloud-drive";

interface FormData {
  title: string;
  description: string;
  contentType: ContentType;
  price: number;
  category: string;
  tags: string[];
  isFree: boolean;
  thumbnailFile: File | null;
  contentFiles: File[];
  cloudDriveLink: string;
  cloudDrivePassword: string;
}

export default function CourseUploadPage() {
  const router = useRouter();
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    contentType: "video",
    price: 0,
    category: "",
    tags: [],
    isFree: true,
    thumbnailFile: null,
    contentFiles: [],
    cloudDriveLink: "",
    cloudDrivePassword: "",
  });
  
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [currentTag, setCurrentTag] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // 添加标签
  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()]
      });
      setCurrentTag("");
    }
  };
  
  // 移除标签
  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  // 处理标签输入按键事件
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };
  
  // 处理缩略图上传
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        toast.error("请上传图片格式的缩略图");
        return;
      }
      
      // 验证文件大小 (最大2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("缩略图大小不能超过2MB");
        return;
      }
      
      setFormData({ ...formData, thumbnailFile: file });
      
      // 生成预览
      const reader = new FileReader();
      reader.onload = (event) => {
        setThumbnailPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 处理内容文件上传
  const handleContentFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // 根据内容类型验证文件
      if (formData.contentType === 'video') {
        const invalidFiles = newFiles.filter(file => !file.type.startsWith('video/'));
        if (invalidFiles.length > 0) {
          toast.error("请只上传视频格式的文件");
          return;
        }
      } else if (formData.contentType === 'image') {
        const invalidFiles = newFiles.filter(file => !file.type.startsWith('image/'));
        if (invalidFiles.length > 0) {
          toast.error("请只上传图片格式的文件");
          return;
        }
      }
      
      // 合并新文件到已有文件列表
      setFormData({
        ...formData,
        contentFiles: [...formData.contentFiles, ...newFiles]
      });
    }
  };
  
  // 移除内容文件
  const removeContentFile = (indexToRemove: number) => {
    setFormData({
      ...formData,
      contentFiles: formData.contentFiles.filter((_, index) => index !== indexToRemove)
    });
  };
  
  // 内容类型变更时重置相关字段
  const handleContentTypeChange = (value: ContentType) => {
    setFormData({
      ...formData,
      contentType: value,
      contentFiles: [],
      cloudDriveLink: "",
      cloudDrivePassword: ""
    });
  };
  
  // 提交表单
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // 验证表单
    if (!formData.title.trim()) {
      toast.error("请输入课程标题");
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error("请输入课程描述");
      return;
    }
    
    if (!formData.thumbnailFile) {
      toast.error("请上传课程缩略图");
      return;
    }
    
    if (formData.contentType === 'cloud-drive' && !formData.cloudDriveLink) {
      toast.error("请输入网盘分享链接");
      return;
    }
    
    if (formData.contentType !== 'cloud-drive' && formData.contentFiles.length === 0) {
      toast.error(`请上传课程${formData.contentType === 'video' ? '视频' : '图片'}`);
      return;
    }
    
    if (!formData.category) {
      toast.error("请选择课程分类");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 300);
      
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // 模拟成功响应
      toast.success("课程提交成功，等待审核");
      
      // 延迟导航，让用户看到100%的进度
      setTimeout(() => {
        router.push("/my-courses");
      }, 1000);
      
    } catch (error) {
      console.error("提交课程失败:", error);
      toast.error("提交失败，请重试");
      setUploadProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 触发文件选择器点击
  const triggerThumbnailInput = () => {
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.click();
    }
  };
  
  const triggerContentInput = () => {
    if (contentInputRef.current) {
      contentInputRef.current.click();
    }
  };
  
  // 获取内容上传区域提示文本
  const getContentUploadText = () => {
    switch (formData.contentType) {
      case 'video':
        return "上传视频文件 (支持MP4, WebM等格式)";
      case 'image':
        return "上传图片文件 (支持JPG, PNG, WebP等格式)";
      case 'cloud-drive':
        return "填写网盘分享链接和提取码";
      default:
        return "";
    }
  };
  
  // 内容类型图标
  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'image':
        return <FileImage className="h-5 w-5" />;
      case 'cloud-drive':
        return <ExternalLink className="h-5 w-5" />;
      default:
        return null;
    }
  };
  
  // 获取表单数据摘要，用于确认
  const getFormSummary = () => {
    return {
      title: formData.title,
      type: formData.contentType === 'video' ? '视频' : 
            formData.contentType === 'image' ? '图片' : '网盘分享',
      price: formData.isFree ? '免费' : `${formData.price} 技能点`,
      filesCount: formData.contentFiles.length,
      link: formData.cloudDriveLink ? '已提供' : '无'
    };
  };
  
  const summary = getFormSummary();

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <FixedHeader />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* 头部 */}
            <div className="flex items-center mb-6">
              <Button variant="ghost" className="mr-2" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                返回
              </Button>
              <h1 className="text-2xl font-bold">发布新课程</h1>
            </div>
            
            {/* 表单卡片 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <form onSubmit={handleSubmit}>
                <div className="p-6">
                  <Alert className="mb-6 bg-blue-50 dark:bg-blue-950 border-blue-100 dark:border-blue-900">
                    <Info className="h-4 w-4 text-blue-500" />
                    <AlertTitle>课程发布说明</AlertTitle>
                    <AlertDescription className="text-sm">
                      发布的课程将经过审核，一旦通过，其他用户可以通过技能点购买和学习您的课程。
                      您将获得课程售价相应的技能点奖励。高质量的课程内容将获得更多曝光和更高的技能点收益。
                    </AlertDescription>
                  </Alert>
                  
                  {/* 基本信息 */}
                  <div className="space-y-6 mb-8">
                    <h2 className="text-xl font-semibold">基本信息</h2>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="title">课程标题</Label>
                        <Input
                          id="title"
                          placeholder="输入一个吸引人的标题"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">课程分类</Label>
                        <Select 
                          value={formData.category} 
                          onValueChange={(value) => setFormData({...formData, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="选择课程分类" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="programming">编程开发</SelectItem>
                            <SelectItem value="design">设计创意</SelectItem>
                            <SelectItem value="business">商业营销</SelectItem>
                            <SelectItem value="finance">金融投资</SelectItem>
                            <SelectItem value="language">语言学习</SelectItem>
                            <SelectItem value="lifestyle">生活技能</SelectItem>
                            <SelectItem value="health">健康健身</SelectItem>
                            <SelectItem value="other">其他</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">课程描述</Label>
                      <Textarea
                        id="description"
                        placeholder="详细描述课程内容、适合人群和学习收获"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={4}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tags">课程标签</Label>
                      <div className="flex gap-2">
                        <Input
                          id="tags"
                          placeholder="添加标签，按回车确认"
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onKeyDown={handleTagKeyDown}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={addTag}
                          disabled={!currentTag.trim()}
                        >
                          添加
                        </Button>
                      </div>
                      
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {formData.tags.map(tag => (
                            <div 
                              key={tag} 
                              className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full flex items-center gap-1"
                            >
                              <span className="text-sm">{tag}</span>
                              <button 
                                type="button" 
                                onClick={() => removeTag(tag)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator className="my-8" />
                  
                  {/* 缩略图上传 */}
                  <div className="space-y-6 mb-8">
                    <h2 className="text-xl font-semibold">课程缩略图</h2>
                    
                    <div 
                      className={`
                        border-2 border-dashed rounded-lg p-6 text-center 
                        ${thumbnailPreview ? 'border-green-300 bg-green-50 dark:bg-green-950/20' : 'border-gray-300 dark:border-gray-700'}
                      `}
                      onClick={triggerThumbnailInput}
                    >
                      <input
                        ref={thumbnailInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                      />
                      
                      {thumbnailPreview ? (
                        <div className="relative mt-2">
                          <div className="relative w-48 h-32 mx-auto">
                            <Image
                              src={thumbnailPreview}
                              alt="缩略图预览"
                              fill
                              style={{ objectFit: 'cover' }}
                              className="rounded-md"
                            />
                          </div>
                          <p className="text-green-600 mt-4 flex items-center justify-center">
                            <Check className="h-4 w-4 mr-1" />
                            缩略图已上传，点击更换
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <Upload className="h-6 w-6 text-gray-500" />
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">点击上传课程缩略图</p>
                          <p className="text-xs text-gray-500">
                            建议尺寸: 1280x720px, 最大2MB, 支持JPG, PNG格式
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator className="my-8" />
                  
                  {/* 内容类型选择 */}
                  <div className="space-y-6 mb-8">
                    <h2 className="text-xl font-semibold">课程内容类型</h2>
                    
                    <RadioGroup 
                      value={formData.contentType} 
                      onValueChange={(value) => handleContentTypeChange(value as ContentType)}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <div className={`
                        border rounded-lg p-4 flex items-center space-x-3 
                        ${formData.contentType === 'video' ? 'border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/20' : ''}
                      `}>
                        <RadioGroupItem 
                          value="video" 
                          id="video"
                          className="text-blue-500"
                        />
                        <Label 
                          htmlFor="video" 
                          className="flex items-center cursor-pointer w-full"
                        >
                          <Video className="h-5 w-5 mr-2 text-blue-500" />
                          <div>
                            <p className="font-medium">视频课程</p>
                            <p className="text-xs text-gray-500">上传教学视频文件</p>
                          </div>
                        </Label>
                      </div>
                      
                      <div className={`
                        border rounded-lg p-4 flex items-center space-x-3 
                        ${formData.contentType === 'image' ? 'border-2 border-green-500 bg-green-50 dark:bg-green-950/20' : ''}
                      `}>
                        <RadioGroupItem 
                          value="image" 
                          id="image"
                          className="text-green-500"
                        />
                        <Label 
                          htmlFor="image" 
                          className="flex items-center cursor-pointer w-full"
                        >
                          <FileImage className="h-5 w-5 mr-2 text-green-500" />
                          <div>
                            <p className="font-medium">图片教程</p>
                            <p className="text-xs text-gray-500">上传图文教程资料</p>
                          </div>
                        </Label>
                      </div>
                      
                      <div className={`
                        border rounded-lg p-4 flex items-center space-x-3 
                        ${formData.contentType === 'cloud-drive' ? 'border-2 border-purple-500 bg-purple-50 dark:bg-purple-950/20' : ''}
                      `}>
                        <RadioGroupItem 
                          value="cloud-drive" 
                          id="cloud-drive"
                          className="text-purple-500"
                        />
                        <Label 
                          htmlFor="cloud-drive" 
                          className="flex items-center cursor-pointer w-full"
                        >
                          <ExternalLink className="h-5 w-5 mr-2 text-purple-500" />
                          <div>
                            <p className="font-medium">网盘分享</p>
                            <p className="text-xs text-gray-500">提供网盘分享链接</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {/* 课程内容上传 */}
                  <div className="space-y-6 mb-8">
                    <h2 className="text-xl font-semibold">课程内容</h2>
                    
                    {formData.contentType === 'cloud-drive' ? (
                      <div className="space-y-4 border rounded-lg p-6 bg-purple-50 dark:bg-purple-950/20">
                        <div className="space-y-2">
                          <Label htmlFor="cloudLink">网盘分享链接</Label>
                          <Input
                            id="cloudLink"
                            placeholder="例如: https://pan.baidu.com/s/xxx"
                            value={formData.cloudDriveLink}
                            onChange={(e) => setFormData({...formData, cloudDriveLink: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cloudPassword">提取码 (如有)</Label>
                          <Input
                            id="cloudPassword"
                            placeholder="网盘提取码"
                            value={formData.cloudDrivePassword}
                            onChange={(e) => setFormData({...formData, cloudDrivePassword: e.target.value})}
                          />
                        </div>
                        
                        <Alert className="bg-transparent border-purple-200 dark:border-purple-800">
                          <Info className="h-4 w-4 text-purple-500" />
                          <AlertDescription className="text-xs text-purple-700 dark:text-purple-300">
                            请确保分享链接长期有效，并在课程描述中说明内容格式和使用方法
                          </AlertDescription>
                        </Alert>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div 
                          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
                          onClick={triggerContentInput}
                        >
                          <input
                            ref={contentInputRef}
                            type="file"
                            accept={formData.contentType === 'video' ? 'video/*' : 'image/*'}
                            onChange={handleContentFilesChange}
                            multiple={true}
                            className="hidden"
                          />
                          
                          <div className="space-y-2">
                            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                              <FileUp className="h-6 w-6 text-gray-500" />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {getContentUploadText()}
                            </p>
                            <p className="text-xs text-gray-500">
                              点击或拖放文件到此处上传
                            </p>
                          </div>
                        </div>
                        
                        {formData.contentFiles.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-medium text-sm mb-3">已上传文件 ({formData.contentFiles.length})</h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {formData.contentFiles.map((file, index) => (
                                <div 
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
                                >
                                  <div className="flex items-center">
                                    {getContentTypeIcon(formData.contentType)}
                                    <span className="ml-2 text-sm truncate max-w-[250px]">{file.name}</span>
                                    <span className="ml-2 text-xs text-gray-500">
                                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                                    </span>
                                  </div>
                                  
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => removeContentFile(index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <Separator className="my-8" />
                  
                  {/* 定价设置 */}
                  <div className="space-y-6 mb-8">
                    <h2 className="text-xl font-semibold">课程定价</h2>
                    
                    <div className="flex items-center space-x-3 mb-4">
                      <Switch
                        id="free-course"
                        checked={formData.isFree}
                        onCheckedChange={(checked) => setFormData({...formData, isFree: checked})}
                      />
                      <Label htmlFor="free-course">免费分享</Label>
                    </div>
                    
                    {!formData.isFree && (
                      <div className="space-y-2">
                        <Label htmlFor="price">技能点价格</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="price"
                            type="number"
                            min={1}
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                            className="w-32"
                          />
                          <span>技能点</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          当其他用户购买您的课程时，您将获得相应技能点奖励
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 提交表单 */}
                <div className="bg-gray-50 dark:bg-gray-900 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  {/* 表单总结 */}
                  <div className="w-full md:w-auto text-sm">
                    <p className="font-medium mb-1">课程信息摘要</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-600 dark:text-gray-400">
                      <span>标题:</span>
                      <span className="font-medium">{summary.title || '未设置'}</span>
                      <span>类型:</span>
                      <span className="font-medium">{summary.type}</span>
                      <span>价格:</span>
                      <span className="font-medium">{summary.price}</span>
                    </div>
                  </div>
                  
                  {/* 提交按钮 */}
                  <div className="flex gap-4 w-full md:w-auto justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      disabled={isSubmitting}
                    >
                      取消
                    </Button>
                    
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 min-w-[120px]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <span className="inline-block mr-2">上传中 {uploadProgress}%</span>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : "提交课程"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
} 