import React from 'react';

import { useUsersUiStore } from '../stores/usersUiStore.js';

const users = [
  { id: '1', name: 'Ann' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Alice' },
];

const UsersPage = () => {
  const search = useUsersUiStore((state) => state.search);
  const selectedUserId = useUsersUiStore((state) => state.selectedUserId);
  const setSearch = useUsersUiStore((state) => state.setSearch);
  const selectUser = useUsersUiStore((state) => state.selectUser);
  const clearSelection = useUsersUiStore((state) => state.clearSelection);

  const visible = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );

  const selected = users.find((user) => user.id === selectedUserId);

  return (
    <div className="col-6">
      <input
        className="form-control mb-3"
        data-testid="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск пользователя"
      />
      <ul className="list-group mb-3" data-testid="users-list">
        {visible.map((user) => (
          <li key={user.id} className="list-group-item">
            <button
              type="button"
              className="btn btn-link p-0"
              data-testid={`user-${user.id}`}
              onClick={() => selectUser(user.id)}
            >
              {user.name}
            </button>
          </li>
        ))}
      </ul>
      <div data-testid="selection">
        {selected ? (
          <>
            <span>Выбран: {selected.name}</span>
            {' '}
            <button type="button" className="btn btn-sm btn-outline-secondary" data-testid="clear" onClick={clearSelection}>
              Сбросить
            </button>
          </>
        ) : (
          <span>Пользователь не выбран</span>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
