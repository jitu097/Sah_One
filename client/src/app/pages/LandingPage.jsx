import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { RestaurantMenu } from '@mui/icons-material';

/**
 * Landing Page Component
 * This is the first page users see when they visit the app
 * It shows a beautiful animation and automatically redirects to login after 3 seconds
 */
const LandingPage = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Show animation after component mounts
        setShow(true);

        // Automatically redirect to login page after 3 seconds
        const timer = setTimeout(() => {
            navigate('/login');
        }, 3000);

        // Clean up timer when component unmounts
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                overflow: 'hidden',
            }}
        >
            {/* Main content with fade-in animation */}
            <Box
                sx={{
                    textAlign: 'center',
                    opacity: show ? 1 : 0,
                    transform: show ? 'scale(1)' : 'scale(0.8)',
                    transition: 'all 1s ease-out',
                }}
            >
                {/* Restaurant icon with floating animation */}
                <Box sx={{ mb: 4, animation: 'float 3s ease-in-out infinite' }}>
                    <RestaurantMenu 
                        sx={{ 
                            fontSize: '8rem', 
                            color: 'white', 
                            filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))' 
                        }} 
                    />
                </Box>

                {/* App name */}
                <Typography
                    variant="h2"
                    sx={{
                        color: 'white',
                        fontWeight: 700,
                        mb: 2,
                        textShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
                        fontSize: { xs: '2.5rem', md: '4rem' },
                    }}
                >
                    Sah One
                </Typography>

                {/* Tagline */}
                <Typography
                    variant="h6"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 300,
                        mb: 6,
                    }}
                >
                    Your Favorite Food, Delivered Fresh
                </Typography>

                {/* Loading dots animation */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    {[1, 2, 3].map((i) => (
                        <Box
                            key={i}
                            sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: 'white',
                                animation: 'bounce 1.4s infinite ease-in-out',
                                animationDelay: `${i * 0.16}s`,
                            }}
                        />
                    ))}
                </Box>
            </Box>

            {/* CSS animations for floating icon and bouncing dots */}
            <style>
                {`
                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-20px); }
                    }
                    @keyframes bounce {
                        0%, 80%, 100% { 
                            transform: scale(0); 
                            opacity: 0.5; 
                        }
                        40% { 
                            transform: scale(1); 
                            opacity: 1; 
                        }
                    }
                `}
            </style>
        </Box>
    );
};

export default LandingPage;
