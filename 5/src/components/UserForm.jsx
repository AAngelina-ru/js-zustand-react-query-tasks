import React, { useState } from 'react';

const UserForm = ({ submitHandler }) => {
  const [name, setName] = useState('');

  const onSubmit = (event) => {
    submitHandler(event, name);
    setName('');
  };

  return (
    <form onSubmit={onSubmit} className="d-flex gap-2">
      <input
        type="text"
        className="form-control"
        data-testid="input"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Имя пользователя"
      />
      <input type="submit" data-testid="submit" className="btn btn-primary btn-sm" value="Add" />
    </form>
  );
};

export default UserForm;
