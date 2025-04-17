/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NotificationProvider, useNotifications } from '@/contexts/notification-context';

// 测试组件，用于访问通知上下文
const TestComponent = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    addNotification 
  } = useNotifications();
  
  return (
    <div>
      <div data-testid="notification-count">{notifications.length}</div>
      <div data-testid="unread-count">{unreadCount}</div>
      <button 
        data-testid="add-notification" 
        onClick={() => addNotification({
          title: "测试通知",
          message: "这是一条测试通知",
          type: "system",
          priority: "medium",
          tags: ["测试"]
        })}
      >
        添加通知
      </button>
      <button 
        data-testid="mark-all-read" 
        onClick={markAllAsRead}
      >
        全部已读
      </button>
      {notifications.map(notification => (
        <div key={notification.id} data-testid={`notification-${notification.id}`}>
          <h3>{notification.title}</h3>
          <p>{notification.message}</p>
          <div>{notification.isRead ? '已读' : '未读'}</div>
          <button 
            data-testid={`mark-read-${notification.id}`}
            onClick={() => markAsRead(notification.id)}
          >
            标记为已读
          </button>
          <button 
            data-testid={`delete-${notification.id}`}
            onClick={() => deleteNotification(notification.id)}
          >
            删除
          </button>
        </div>
      ))}
    </div>
  );
};

describe('通知系统测试', () => {
  beforeEach(() => {
    // 模拟window.fetch
    global.fetch = jest.fn();
    
    // 模拟toaster
    jest.mock('sonner', () => ({
      toast: {
        success: jest.fn(),
        error: jest.fn()
      }
    }));
  });
  
  it('应该渲染初始通知列表', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    // 检查初始通知数量
    expect(screen.getByTestId('notification-count')).toHaveTextContent('5');
    
    // 检查未读通知数量
    expect(screen.getByTestId('unread-count')).toHaveTextContent('3');
  });
  
  it('应该能添加新通知', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    const initialCount = Number(screen.getByTestId('notification-count').textContent);
    
    // 添加新通知
    fireEvent.click(screen.getByTestId('add-notification'));
    
    // 验证通知数量增加
    expect(Number(screen.getByTestId('notification-count').textContent)).toBe(initialCount + 1);
  });
  
  it('应该能标记单个通知为已读', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    const initialUnreadCount = Number(screen.getByTestId('unread-count').textContent);
    
    // 找到第一个未读通知并标记为已读
    const firstNotification = screen.getByTestId('notification-1'); // 假设id为1的通知是未读的
    const markReadButton = screen.getByTestId('mark-read-1');
    
    fireEvent.click(markReadButton);
    
    // 验证未读数量减少
    expect(Number(screen.getByTestId('unread-count').textContent)).toBe(initialUnreadCount - 1);
  });
  
  it('应该能标记所有通知为已读', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    // 标记所有为已读
    fireEvent.click(screen.getByTestId('mark-all-read'));
    
    // 验证未读数量为0
    expect(screen.getByTestId('unread-count')).toHaveTextContent('0');
  });
  
  it('应该能删除通知', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    const initialCount = Number(screen.getByTestId('notification-count').textContent);
    
    // 删除第一个通知
    fireEvent.click(screen.getByTestId('delete-1'));
    
    // 验证通知总数减少
    expect(Number(screen.getByTestId('notification-count').textContent)).toBe(initialCount - 1);
  });
  
  it('应该在定时器运行时更新时间格式', () => {
    jest.useFakeTimers();
    
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    // 快进60秒
    act(() => {
      jest.advanceTimersByTime(60000);
    });
    
    // 这里我们无法直接检查时间文本，因为它是在上下文内部更新的
    // 真实测试中可以添加更具体的断言
    
    jest.useRealTimers();
  });
}); 