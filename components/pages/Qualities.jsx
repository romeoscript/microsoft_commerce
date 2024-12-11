"use client"
import { motion } from 'framer-motion';
import { Shield, Key, Clock, Cloud, Code, Lock } from 'lucide-react';

const qualities = [
    {
        title: "Secure Licensing",
        description: "Enterprise-grade security for all software licenses with encrypted delivery and verification.",
        icon: Shield,
        color: "text-blue-600"
    },
    {
        title: "Instant Activation",
        description: "Automated key delivery and instant activation process for immediate software access.",
        icon: Key,
        color: "text-purple-600"
    },
    {
        title: "24/7 Availability",
        description: "Round-the-clock access to licenses and support through our automated platform.",
        icon: Clock,
        color: "text-green-600"
    },
    {
        title: "Cloud Integration",
        description: "Seamless integration with cloud services and automatic backup solutions.",
        icon: Cloud,
        color: "text-orange-600"
    }
];

const Qualities = () => {
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
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                duration: 0.6
            }
        }
    };

    return (
        <section className="py-16 bg-gradient-to-r from-gray-50 to-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    {/* Left Side - Image/Illustration */}
                    <motion.div 
                        className="flex-1 relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="relative h-[500px] bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl overflow-hidden">
                            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="grid grid-cols-2 gap-4 p-8">
                                    <Code size={64} className="text-blue-500 opacity-20" />
                                    <Lock size={64} className="text-purple-500 opacity-20" />
                                    <Shield size={64} className="text-green-500 opacity-20" />
                                    <Cloud size={64} className="text-orange-500 opacity-20" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side - Content */}
                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-12"
                        >
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                Why Choose Our Software?
                            </h2>
                            <p className="text-gray-600">
                                Experience premium software solutions with enterprise-grade security and seamless activation process.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-6"
                        >
                            {qualities.map((item, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="group"
                                >
                                    <div className="p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                                        <div className="flex items-start space-x-4">
                                            <div className={`p-3 rounded-lg bg-gray-50 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                                                <item.icon size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                                    {item.title}
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Qualities;