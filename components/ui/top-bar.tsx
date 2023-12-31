import React from 'react';

const TopBar = () => {
    return (
        <nav className="bg-gray-800 w-full">
            <div className="flex justify-center items-center h-12">
                {/* Navigation Links */}
                <div className="flex space-x-4">
                    {/* Add your navigation links here */}
                    <a href="#" className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Home</a>
                    <a href="#" className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Portfolio</a>
                    <a href="#" className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Contact</a>
                </div>
            </div>
        </nav>
    );
};

export default TopBar;
