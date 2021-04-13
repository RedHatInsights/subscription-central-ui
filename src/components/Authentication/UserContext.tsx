import { createContext } from 'react';

export interface User {
  isOrgAdmin: boolean | null;
  status: string;
}

export interface UserContextValue {
  user: User;
  setUser: () => void;
}

const UserContext = createContext<UserContextValue>({
  user: {
    isOrgAdmin: null,
    status: 'loading'
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUser: () => {}
});

export default UserContext;
