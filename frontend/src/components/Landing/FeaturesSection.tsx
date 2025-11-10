import FeatureCard from './FeatureCard';
import { features } from '../../lib/fatures';

export default function FeaturesSection() {
  return (
    <section className="bg-gray-50 py-24 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-14">
          What makes FlowBoard different
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, text }) => (
            <FeatureCard key={title} Icon={Icon} title={title} text={text} />
          ))}
        </div>
      </div>
    </section>
  );
}
