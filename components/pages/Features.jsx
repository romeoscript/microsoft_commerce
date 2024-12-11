// components/Features.js
import Image from 'next/image';
import { motion } from 'framer-motion';

const features = [
    {
        title: "Quality Food",
        description: "Quality food isn't just about taste; it's about using fresh ingredients and meticulous preparation.",
        icon: "/01.png"
    },
    {
        title: "Affordable Pricing",
        description: "Affordable pricing means offering true value, balancing quality and cost without compromising on either.",
        icon: "/image 25.png"
    },
    {
        title: "Speed Delivery",
        description: "Contrary to popular belief, speed delivery isn't just about being fast. it's about efficiency and reliability.",
        icon: "/02.png"
    },

    {
        title: "Quality Packaging",
        description: "Quality packaging isn't just about appearance. it's about protecting and preserving your products effectively.",
        icon: "/5.png"
    }
];

const Features = () => {
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div
            className="py-8 bg-white"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col items-center"
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="mb-4 flex items-center justify-center h-16 w-16">
                                <Image src={feature.icon} alt={feature.title} width={64} height={64} />
                            </div>
                            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-600 text-sm md:text-sm">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Features;
