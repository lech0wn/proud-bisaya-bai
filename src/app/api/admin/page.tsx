import { redirect } from 'next/navigation';

export default function AdminRootPage() {
    // change logic soon if ever naka login na ang admin, redirect dretso to /admin/dashboard
    redirect('/admin/login');
}