import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Notifications from '../Notifications';
import useNotifications from '../../../hooks/useNotifications';

jest.mock('../../../hooks/useNotifications');

describe('Notifications', () => {
  it('renders correctly', () => {
    (useNotifications as jest.Mock).mockReturnValue({
      notifications: [
        { message: 'Some stuff went well!', variant: 'success', key: '123' },
        { message: 'Some other stuff did not.', variant: 'danger', key: '456' },
        { message: 'And this happened.', variant: 'info', key: '789' }
      ]
    });
    render(<Notifications />);
    expect(document.body).toMatchSnapshot();
  });

  it('calls the remove notifications method on click of the X', () => {
    const mockRemoveNotification = jest.fn();
    (useNotifications as jest.Mock).mockReturnValue({
      notifications: [{ message: 'Some stuff went well!', variant: 'success', key: '123' }],
      removeNotification: mockRemoveNotification
    });
    const { getByTestId } = render(<Notifications />);
    fireEvent.click(getByTestId('notification-close-btn-0'));
    expect(mockRemoveNotification).toHaveBeenCalledTimes(1);
  });

  it('revokes object URL if downloadHref is passed across and user clicks X', () => {
    const mockRemoveNotification = jest.fn();
    window.URL.revokeObjectURL = jest.fn();

    (useNotifications as jest.Mock).mockReturnValue({
      notifications: [
        {
          message: 'Some stuff went well!',
          variant: 'success',
          key: '123',
          downloadHref: 'foo.com'
        }
      ],
      removeNotification: mockRemoveNotification
    });
    const { getByTestId } = render(<Notifications />);
    fireEvent.click(getByTestId('notification-close-btn-0'));
    expect(window.URL.revokeObjectURL).toHaveBeenCalledTimes(1);
  });
});
