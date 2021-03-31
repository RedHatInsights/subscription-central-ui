import { createContext } from 'react';

const UserContext = createContext({
  user: {
    isOrgAdmin: null,
    status: 'loading'
  },
  setUser: () => {
    console.log('dummy');
  }
});

export default UserContext;
