import React from 'react';
import { render } from '@testing-library/react';
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
});
