import Image from 'next/image';
import { motion } from 'framer-motion';
import mealImage from "@/public/meal.jpg";

const quality = [
    {
        title: "Convenient and Reliable",
        description: "Whether you dine in, take out, or order delivery, our service is convenient, fast, and reliable, making mealtime hassle-free.",
        icon: "/Frame 35.png"
    },
    {
        title: "Healthy and Whole Foods",
        description: "Tasty and organic meals made without MSG or preservatives.",
        icon: "/Frame 37.png"
    },
    {
        title: "Variety of Options",
        description: "From hearty meals to light snacks, we offer a wide range of options to suit every taste and craving.",
        icon: "/Frame 36.png"
    },
    {
        title: "Fresh Ingredients",
        description: "We use only the freshest ingredients, sourced locally whenever possible.",
        icon: "/Frame 37.png"
    }
];

const Qualities = () => {
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.3, duration: 0.6 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="py-8 flex flex-col lg:flex-row bg-white">
            <div className="flex-1 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                    <Image src={mealImage} alt="mealImage" className='rounded-lg' layout="responsive" />
                </motion.div>
            </div>
            <div className="flex-1 px-4 lg:px-8">
                <motion.h2
                    className="text-3xl lg:text-4xl text-center font-bold text-gray-900 mb-8 lg:mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Why People Choose Us?
                </motion.h2>
                <motion.div
                    className="space-y-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {quality.map((item, index) => (
                        <motion.div
                            key={index}
                            className="p-6 rounded-lg shadow-lg flex items-center space-x-4 bg-white border border-gray-200"
                            variants={itemVariants}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex-shrink-0">
                                <Image src={item.icon} alt={item.title} width={64} height={64} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Qualities;
