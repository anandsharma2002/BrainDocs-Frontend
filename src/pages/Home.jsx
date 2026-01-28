import React from 'react';

const Home = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto">
            <div className="mb-8 p-6 bg-blue-50 rounded-3xl inline-block shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <span className="text-5xl">📚</span>
            </div>
            <h1 className="text-5xl font-extrabold mb-6 text-slate-900 tracking-tight leading-tight">
                Welcome to BrainDocs
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
                Your minimal, lightning-fast documentation hub.
                Select a topic from the sidebar to start reading or creating content.
            </p>
        </div>
    );
};

export default Home;
