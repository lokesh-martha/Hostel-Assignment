export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white text-sm text-center py-4 mt-auto">
      <p>© {new Date().getFullYear()} Hostel Management System. All rights reserved.</p>
      <div className="mt-2 flex justify-center gap-4">
        <a href="/footer/privacy" className="hover:underline">Privacy Policy</a>
        <a href="/footer/terms" className="hover:underline">Terms of Service</a>
        <a href="/footer/contact" className="hover:underline">Contact Us</a>
      </div>
    </footer>
  );
}
