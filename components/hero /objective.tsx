import Image from "next/image";

const objectives = [
  {
    title: "Promote Best Practices",
    description:
      "Encourage local industries to adopt and maintain best practices in quality, health, safety, environment, and food security in line with national and international standards.",
    icon: "/obj1.svg",
    color: "from-blue-50 to-blue-100",
    iconBg: "bg-blue-100",
  },
  {
    title: "Establish a Benchmark for Quality",
    description:
      "Create a local benchmark for high-quality production that aligns with industry standards, enhancing the competitiveness of local businesses.",
    icon: "/obj2.svg",
    color: "from-purple-50 to-purple-100",
    iconBg: "bg-purple-100",
  },
  {
    title: "Ensure Certification and Recognition",
    description:
      "Provide a voluntary, independent certification system that recognizes businesses for their commitment to quality, health, safety, and environmental sustainability.",
    icon: "/obj3.svg",
    color: "from-emerald-50 to-emerald-100",
    iconBg: "bg-emerald-100",
  },
];

export const Objective = () => {
  return (
    <section
      id="objectives"
      className="py-24 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 relative inline-block">
              Our Objectives
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
            <p className="mt-8 text-gray-600 text-lg max-w-2xl mx-auto">
              We are committed to fostering growth and excellence in domestic
              production
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {objectives.map((obj, index) => (
              <div key={index} className="relative group">
                <div
                  className={`h-full p-8 rounded-2xl bg-gradient-to-br ${obj.color} 
                  border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300
                  transform hover:-translate-y-1`}
                >
                  <div className="mb-6">
                    <div
                      className={`w-16 h-16 ${obj.iconBg} rounded-xl p-3 mx-auto 
                      shadow-inner transform group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Image
                        src={obj.icon}
                        alt={obj.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">
                      {obj.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {obj.description}
                    </p>
                  </div>

                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/4 h-1 
                    bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300"
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
