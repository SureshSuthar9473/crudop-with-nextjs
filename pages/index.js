// pages/index.js
import { useEffect, useState } from 'react';
import styles from '../styles/style.module.css';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [updateId, setUpdateId] = useState(null);
  const [updateName, setUpdateName] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
  };

  const addUser = async () => {
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    setName('');
    fetchUsers();
  };

  const updateUser = async (id) => {
    await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: updateName }),
    });
    setUpdateId(null);
    setUpdateName('');
    fetchUsers();
  };

  const deleteUser = async (id) => {
    await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id }),
    });
    fetchUsers();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>User Management</h1>
      <input
        className={styles.input}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Add User"
      />
      <button className={styles.button} onClick={addUser}>Add</button>

      <h2 className={styles.subtitle}>Users List</h2>
      {users.map((user) => (
        <div key={user._id} className={styles.userCard}>
          {updateId === user._id ? (
            <>
              <input
                className={styles.input}
                value={updateName}
                onChange={(e) => setUpdateName(e.target.value)}
              />
              <button className={styles.button} onClick={() => updateUser(user._id)}>Update</button>
              <button className={`${styles.button} ${styles.cancelButton}`} onClick={() => setUpdateId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <span className={styles.userName}>{user.name}</span>
              <button className={styles.button} onClick={() => { setUpdateId(user._id); setUpdateName(user.name); }}>Edit</button>
              <button className={styles.button} onClick={() => deleteUser(user._id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
