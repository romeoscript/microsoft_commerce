"use client"
import { motion } from 'framer-motion';
import { Shield, Zap, Award, Clock, Download, Headphones } from 'lucide-react';

const features = [
    {
        title: "Instant Delivery",
        description: "Get your software license keys delivered instantly to your email after purchase.",
        icon: Download,
        color: "bg-blue-50 text-blue-600"
    },
    {
        title: "Lifetime License",
        description: "One-time payment for perpetual software licenses with no recurring fees.",
        icon: Shield,
        color: "bg-purple-50 text-purple-600"
    },
    {
        title: "Genuine Software",
        description: "100% authentic licenses directly from official software providers.",
        icon: Award,
        color: "bg-green-50 text-green-600"
    },
    {
        title: "24/7 Support",
        description: "Round-the-clock technical support for seamless software activation and usage.",
        icon: Headphones,
        color: "bg-orange-50 text-orange-600"
    },
    {
        title: "Fast Activation",
        description: "Quick and easy software activation process with step-by-step guidance.",
        icon: Zap,
        color: "bg-pink-50 text-pink-600"
    },
    {
        title: "Volume Licensing",
        description: "Special pricing and support for business bulk license purchases.",
        icon: Clock,
        color: "bg-indigo-50 text-indigo-600"
    }
];

const Features = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                duration: 0.8
            }
        }
    };

    return (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Why Choose Our Platform?
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We provide premium software solutions with unmatched benefits and support to ensure your complete satisfaction.
                    </p>
                </motion.div>

                <motion.div
                    className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="relative group"
                        >
                            <div className="h-full p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-6`}>
                                    <feature.icon size={24} />
                                </div>
                                
                                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                                    {feature.title}
                                </h3>
                                
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>

                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-100 rounded-xl transition-colors duration-300" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Features;