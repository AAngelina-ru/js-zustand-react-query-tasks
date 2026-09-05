import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createUser, deleteUser, fetchUsers } from '../api/users.js';
import UserForm from './UserForm.jsx';

const UsersBox = () => {
  const queryClient = useQueryClient();

  const { data: users, isPending } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // BEGIN (write your solution here)

  // END

  const handleSubmit = (event, name) => {
    event.preventDefault();
    // BEGIN (write your solution here)

    // END
  };

  const handleDelete = (event, id) => {
    event.preventDefault();
    // BEGIN (write your solution here)

    // END
  };

  if (isPending) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <div className="mb-3">
        <UserForm submitHandler={handleSubmit} />
      </div>
      <ul data-testid="users-list">
        {users.map((user) => (
          <li key={user.id}>
            <a
              href=""
              className="user-item"
              data-testid={`user-${user.id}`}
              onClick={(event) => handleDelete(event, user.id)}
            >
              {user.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersBox;
