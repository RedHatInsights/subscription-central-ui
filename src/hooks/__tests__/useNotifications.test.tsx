import React from 'react';
import { renderHook, act } from '@testing-library/react';
import useNotifications from '../useNotifications';
import NotificationProvider from '../../contexts/NotificationProvider';

interface WrapperProps {
  children: React.ReactNode;
}

const wrapper = ({ children }: WrapperProps) => {
  return <NotificationProvider>{children}</NotificationProvider>;
};

describe('useNotifications', () => {
  describe('addSuccessNotification', () => {
    it('adds a notification message', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });
      act(() => {
        result.current.addSuccessNotification('We did it!');
      });
      expect(result.current.notifications[0].message).toBe('We did it!');
    });

    it('adds a success notification', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });
      act(() => {
        result.current.addSuccessNotification('We did it!');
      });
      expect(result.current.notifications[0].variant).toBe('success');
    });

    it('adds a success notification with a link', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });
      act(() => {
        result.current.addSuccessNotification('We did it!', {
          alertLinkHref: 'redhat.com',
          alertLinkText: 'Click Here'
        });
      });
      expect(result.current.notifications[0].actionLinks).toBeDefined();
    });

    it('replaces a previous notification when keyOfAlertToReplace is provided', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });
      let keyOfAlertToReplace = '';
      act(() => {
        keyOfAlertToReplace = result.current.addSuccessNotification('We did it!');
      });
      expect(result.current.notifications).toHaveLength(1);

      act(() => {
        result.current.addSuccessNotification('We did it again!', { keyOfAlertToReplace });
      });
      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0].message).toBe('We did it again!');
    });

    it('sets the downloadHref properly when the link is set as a download link', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      act(() => {
        result.current.addSuccessNotification('Download link here', {
          alertLinkText: 'Download',
          alertLinkHref: 'foo.com',
          alertLinkIsDownload: true
        });
      });
      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0].downloadHref).toBe('foo.com');
    });
  });

  describe('addErrorNotification', () => {
    it('adds a message to notifications', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });
      act(() => {
        result.current.addErrorNotification('Oh no!');
      });
      expect(result.current.notifications[0].message).toBe('Oh no!');
    });

    it('adds a danger notification', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });
      act(() => {
        result.current.addErrorNotification('We did it!');
      });
      expect(result.current.notifications[0].variant).toBe('danger');
    });
  });

  describe('addInfoNotification', () => {
    it('adds a message to notifications', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });
      act(() => {
        result.current.addInfoNotification('The sky is usually blue.');
      });
      expect(result.current.notifications[0].message).toBe('The sky is usually blue.');
    });

    it('adds an info notification', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });
      act(() => {
        result.current.addInfoNotification('We did it!');
      });
      expect(result.current.notifications[0].variant).toBe('info');
    });
  });

  describe('removeNotification', () => {
    it('removes a notification', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });
      act(() => {
        result.current.addInfoNotification('Random notification');
      });
      expect(result.current.notifications).toHaveLength(1);
      const key = result.current.notifications[0].key;
      act(() => {
        result.current.removeNotification(key);
      });
      expect(result.current.notifications).toHaveLength(0);
    });
  });
});
