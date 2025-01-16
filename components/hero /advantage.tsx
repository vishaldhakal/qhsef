import {
  CheckCircle,
  TrendingUp,
  Globe2,
  Award,
  BadgeCheck,
  Brain,
} from "lucide-react";
import Image from "next/image";

const advantages = [
  {
    title: "Enhanced Industry Standards",
    description:
      "Ensures local industries adopt internationally recognized standards for quality, health, safety, environment, and food security, improving overall industry performance.",
    icon: TrendingUp,
    color: "text-emerald-600",
    gradient: "from-emerald-50 to-emerald-100",
  },
  {
    title: "Improved Business Reputation",
    description:
      "Businesses certified under Q-HSEF gain recognition for their commitment to high standards, which can increase customer trust and attract new clients.",
    icon: Globe2,
    color: "text-blue-600",
    gradient: "from-blue-50 to-blue-100",
  },
  {
    title: "Compliance with Regulatory Requirements",
    description:
      "Helps industries stay compliant with national and international regulations, reducing the risk of penalties or legal issues.",
    icon: Award,
    color: "text-purple-600",
    gradient: "from-purple-50 to-purple-100",
  },
  {
    title: "Increased Operational Efficiency",
    description:
      "By following structured processes and best practices, industries can streamline operations, reduce waste, and improve productivity.",
    icon: BadgeCheck,
    color: "text-red-600",
    gradient: "from-red-50 to-red-100",
  },
  {
    title: "Better Worker Welfare",
    description:
      "Ensures that industries focus on worker safety and health, leading to better working conditions and reduced risk of workplace accidents.",
    icon: Brain,
    color: "text-amber-600",
    gradient: "from-amber-50 to-amber-100",
  },
];

export const Advantage = () => {
  return (
    <section
      id="advantages"
      className="py-24 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 relative inline-block">
              Key Advantages
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
              Discover the benefits of supporting domestic products and
              manufacturers
            </p>
          </div>

          {/* Advantages Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((advantage, index) => (
              <div key={index} className="group relative">
                <div
                  className={`h-full p-6 rounded-xl bg-gradient-to-br ${advantage.gradient} 
                  border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300
                  transform hover:-translate-y-1`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-lg ${advantage.gradient} ${advantage.color}`}
                    >
                      <advantage.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-gray-800">
                        {advantage.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {advantage.description}
                      </p>
                    </div>
                  </div>

                  {/* Hover Effect Line */}
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
