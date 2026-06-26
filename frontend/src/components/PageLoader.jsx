// components/PageLoader.jsx
import React from "react";

const PageLoader = () => {

    console.log("pageloader");

    return (
        <div className="flex items-center justify-center min-h-[300px]">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
    );
};

export default PageLoader;