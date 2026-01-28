import React from 'react';
import tuteroBotMagic1 from '../assets/tutero-bot-magic-1.png';
import tuteroBotMagic2 from '../assets/tutero-bot-magic-2.png';
import './GeneratingLoader.css';

export function GeneratingLoader({ topic }) {
    return (
        <div className="generating-loader-overlay">
            <div className="loader-content">
                <div className="bot-animation-container">
                    {/* Magic Bot Animation Frames */}
                    <img src={tuteroBotMagic1} alt="Tutero Bot Magic 1" className="bot-magic-img frame-1" />
                    <img src={tuteroBotMagic2} alt="Tutero Bot Magic 2" className="bot-magic-img frame-2" />

                    {/* Supplemental sparkles */}
                    <div className="sparkles-overlay">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="css-sparkle"></div>
                        ))}
                    </div>
                </div>

                <h3 className="loader-text">
                    Creating {topic ? `"${topic}"` : 'Lesson'} Ideas...
                </h3>

                <div className="loader-progress-container">
                    <div className="loader-progress-bar"></div>
                </div>
            </div>
        </div>
    );
}
