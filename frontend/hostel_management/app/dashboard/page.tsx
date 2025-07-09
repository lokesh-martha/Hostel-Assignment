'use client';

import { useRouter } from 'next/navigation';
import styles from './sidebar.module.css'; 

export default function Sidebar() {
  const router = useRouter();

  return (
    <div className={styles.sidebar}>
      <button onClick={() => router.push('/dashboard')}>Dashboard</button>
      <button onClick={() => router.push('/home/students')}>Students</button>
      <button onClick={() => router.push('/home/complaints')}>Complaints</button>
    </div>
  );
}
