import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchUserById, fetchUsers } from '../api/users.js';
import { useUsersUiStore } from '../stores/usersUiStore.js';

const UsersPage = () => {
  const search = useUsersUiStore((state) => state.search);
  const selectedUserId = useUsersUiStore((state) => state.selectedUserId);
  const setSearch = useUsersUiStore((state) => state.setSearch);
  const selectUser = useUsersUiStore((state) => state.selectUser);
  const clearSelection = useUsersUiStore((state) => state.clearSelection);

  // BEGIN (write your solution here)

  // END
};

export default UsersPage;
