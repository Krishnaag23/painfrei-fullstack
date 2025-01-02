import { Feature } from "@/types/feature";

const SingleFeature = ({ feature }: { feature: Feature }) => {
  const { icon, title, paragraph } = feature;

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary bg-opacity-10 text-primary">
        {icon}
      </div>
      <h3 className="mb-4 text-center text-xl font-semibold text-gray-800 dark:text-white">
        {title}
      </h3>
      <p className="text-center text-gray-600 dark:text-gray-300">
        {paragraph}
      </p>
    </div>
  );
};

export default SingleFeature;
