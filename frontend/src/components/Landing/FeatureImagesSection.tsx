import featureImage1 from '../../assets/page-2.png';
import featureImage2 from '../../assets/page-3.png';

export default function FeatureImagesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-5xl font-semibold text-gray-900">
            Boost your focus. Simplify your workflow.
          </h2>
          <p className="text-gray-600">
            Build your workspace the way you like — add pages, capture ideas, and keep everything
            structured in one place.
          </p>
        </div>
        <img
          src={featureImage1}
          alt="Workspace customization example"
          className="rounded-2xl shadow-lg w-full"
        />
        <img
          src={featureImage2}
          alt="Page organization example"
          className="rounded-2xl shadow-lg w-full"
        />
      </div>
    </section>
  );
}
