import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="py-20 bg-white text-center">
      <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
        Bring structure to your ideas today
      </h2>
      <p className="text-gray-600 mb-8 max-w-lg mx-auto">
        Join FlowBoard and start managing your notes, projects, and thoughts — all in one simple
        workspace.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          to="/signup"
          className="px-8 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 shadow-lg transition"
        >
          Sign Up Free
        </Link>
        <Link
          to="/login"
          className="px-8 py-3 border border-brand-500 text-brand-500 rounded-lg hover:bg-brand-50 transition"
        >
          Log In
        </Link>
      </div>
    </section>
  );
}
