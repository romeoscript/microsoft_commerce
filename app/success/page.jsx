"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BsBagCheckFill } from 'react-icons/bs';
import { FaEnvelope, FaWhatsapp, FaHome } from 'react-icons/fa';
import axios from 'axios';
import { runFireworks } from '@/utils/lib/utils';
import { motion } from 'framer-motion';

const Success = () => {
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState(null);

    const urlSearchParams = new URLSearchParams(window.location.search);
    const trxref = urlSearchParams.get("trxref");

    useEffect(() => {
        if (paymentStatus === 200) {
            runFireworks();
        }
    }, [paymentStatus]);

    useEffect(() => {
        if (trxref) {
            const fetchVerificationResult = async () => {
                try {
                    const response = await axios.get(`/api/verify?trxref=${trxref}`);
                    setPaymentStatus(response?.data?.status);
                } catch (error) {
                    console.error("Error verifying payment:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchVerificationResult();
        } else {
            setLoading(false);
        }
    }, [trxref]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 animate-spin text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V4a10 10 0 00-10 10h2z"></path>
                    </svg>
                    <p className="mt-4 text-lg text-gray-700">Verifying your payment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 150, damping: 10 }}
                    className="flex justify-center mb-6"
                >
                    <div className="bg-green-100 text-green-600 rounded-full p-4">
                        <BsBagCheckFill className="text-4xl" />
                    </div>
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Thank you for your order!</h2>
                <p className="text-gray-600 mb-4 flex items-center justify-center">
                    <FaEnvelope className="mr-2" /> Check your email inbox for the receipt.
                </p>
                <p className="text-gray-600 mb-6 flex items-center justify-center">
                    <FaWhatsapp className="mr-2" /> Track your order on WhatsApp{' '}
                </p>
                <div className="flex flex-col gap-4">
                    <Link href="https://wa.link/91mtgr">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors duration-300 flex items-center justify-center"
                        >
                            <FaWhatsapp className="mr-2" /> Track your Order Here
                        </motion.button>
                    </Link>
                    <Link href="/">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
                        >
                            <FaHome className="mr-2" /> Back to Homepage
                        </motion.button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Success;
