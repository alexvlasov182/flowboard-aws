import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  Icon: LucideIcon;
  title: string;
  text: string;
}

export default function FeatureCard({ Icon, title, text }: FeatureCardProps) {
  return (
    <div className="group bg-white flex flex-col items-center text-center p-8 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer">
      <div className="flex items-center justify-center text-gray-400 w-16 h-16 rounded-2xl mb-5">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-3 max-w-xs">{text}</p>
      <span className="inline-flex items-center font-medium text-gray-900 group-hover:translate-x-1 transition-transform">
        Learn more →
      </span>
    </div>
  );
}
