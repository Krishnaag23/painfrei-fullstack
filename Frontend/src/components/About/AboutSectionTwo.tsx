import Image from "next/image";

const AboutSectionTwo = () => {
  return (
    <section className="bg-gradient-to-b from-white to-main py-16 dark:from-gray-900 dark:to-gray-dark md:py-20 lg:py-28">
      <div className="container">
        <div className="flex flex-wrap items-center">
          <div className="w-full px-4 lg:w-1/2">
            <div className="relative mx-auto mb-12 aspect-[25/24] max-w-[500px] text-center lg:m-0">
              <Image
                src="/images/about/try-light.png"
                alt="about image"
                fill
                className="rounded-lg object-cover object-center shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 dark:hidden dark:drop-shadow-none"
              />
              <Image
                src="/images/about/try-dark.jpeg"
                alt="about image"
                fill
                className="hidden rounded-lg object-cover object-center shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 dark:block dark:drop-shadow-none"
              />
            </div>
          </div>

          <div className="w-full px-4 lg:w-1/2">
            <div className="max-w-[470px]">
              <div className="mb-9">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Innovative Technology
                </h3>
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                  Utilizing low TENS technology and Ayurvedic gel patches,
                  Painfreí provides targeted pain relief while promoting natural
                  healing.
                </p>
              </div>

              <div className="mb-9">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Comprehensive Pain Management
                </h3>
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                  Our device not only focuses on physical relief but also
                  targets the underlying causes of pain for long-term benefits.
                </p>
              </div>

              <div className="mb-1">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  User-Centric Design
                </h3>
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                  Designed with user feedback, our interfaces are simple and
                  intuitive, ensuring a stress-free experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionTwo;
