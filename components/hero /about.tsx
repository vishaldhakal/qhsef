import Image from "next/image";

const About = () => {
  return (
    <section
      id="about"
      className="py-24  bg-gradient-to-b from-white to-gray-50"
    >
      <div className="container max-w-6xl mx-auto mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-800 relative inline-block">
            About
            <div className="relative mt-4">
              <Image
                src="/Rectangle.svg"
                alt="decorative underline"
                width={300}
                height={8}
                className="absolute left-1/2 -translate-x-1/2 transform scale-110"
              />
            </div>
          </h2>
        </div>

        {/* Content Section */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Image Section */}
          <div className="md:w-1/2">
            <div className=" w-full h-full">
              <Image
                src="/image.png" // Add a relevant campaign image
                alt="Mero Desh Merai Utpadan Campaign"
                width={500}
                height={500}
                className="  w-full h-full rounded-3xl  transition-transform duration-300 ease-in-out transform hover:scale-105"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="md:w-1/2">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-gray-700 text-justify">
                The Industry Organization Morang has launched the Q-HSEF
                (Quality, Health, Safety, Environment & Food) quality system,
                designed to ensure local industries adhere to national and
                international standards in quality, health, safety, environment,
                and food security.
              </p>

              <p className="text-lg leading-relaxed text-gray-700 text-justify">
                <span className="font-semibold text-blue-600">
                  Quality, Health, Safety, Environment & Food: The Foundation of
                  Prosperity in Biratnagar.
                </span>{" "}
                The system was inaugurated by the Chief Minister of Koshi
                Province, Hikmat Karki, during the 51st Annual General Meeting
                of the organization. To implement the system technically, the
                organization has partnered with National Certification and
                Management Pvt. Ltd.
              </p>

              <div className="mt-8">
                <div className="inline-block bg-blue-50 px-6 py-3 rounded-lg border border-blue-100">
                  <p className="text-blue-800 font-medium">
                    A number of impactful programs will be conducted jointly
                    under this campaign.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
