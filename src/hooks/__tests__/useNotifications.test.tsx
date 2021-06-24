import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import useNotifications from '../useNotifications';
import NotificationProvider from '../../contexts/NotificationProvider';

const wrapper = ({ children }: any) => {
  return <NotificationProvider>{children}</NotificationProvider>;
};

describe('useNotifications', () => {
  describe('addSuccessNotification', () => {
    it('adds a notification message', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });
      act(() => result.current.addSuccessNotification('We did it!'));
      expect(result.current.notifications[0].message).toBe('We did it!');
    });

    it('adds a success notification', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });
      act(() => result.current.addSuccessNotification('We did it!'));
      expect(result.current.notifications[0].variant).toBe('success');
    });
  });

  describe('addErrorNotification', () => {
    it('adds a message to notifications', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });
      act(() => result.current.addErrorNotification('Oh no!'));
      expect(result.current.notifications[0].message).toBe('Oh no!');
    });

    it('adds a danger notification', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });
      act(() => result.current.addErrorNotification('We did it!'));
      expect(result.current.notifications[0].variant).toBe('danger');
    });
  });

  describe('addInfoNotification', () => {
    it('adds a message to notifications', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });
      act(() => result.current.addInfoNotification('The sky is usually blue.'));
      expect(result.current.notifications[0].message).toBe('The sky is usually blue.');
    });

    it('adds an info notification', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });
      act(() => result.current.addInfoNotification('We did it!'));
      expect(result.current.notifications[0].variant).toBe('info');
    });
  });

  describe('removeNotification', () => {
    it('removes a notification', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });
      act(() => result.current.addInfoNotification('Random notification'));
      expect(result.current.notifications).toHaveLength(1);
      const key = result.current.notifications[0].key;
      act(() => result.current.removeNotification(key));
      expect(result.current.notifications).toHaveLength(0);
    });
  });
});
