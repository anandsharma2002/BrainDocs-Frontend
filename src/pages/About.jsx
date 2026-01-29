import React from 'react';
import { BookOpen, Users, Target, Heart } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-4xl mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-600/30">
                            <BookOpen className="w-12 h-12" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">About BrainDocs</h1>
                    <p className="text-xl text-slate-600">Your personal knowledge management system</p>
                </div>

                {/* Content Cards */}
                <div className="space-y-6">
                    {/* Mission */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Target className="text-blue-600" size={28} />
                            <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            BrainDocs is designed to help you organize, manage, and share your knowledge effectively.
                            Whether you're a student, professional, or lifelong learner, our platform provides the tools
                            you need to create structured documentation and collaborate with others.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Heart className="text-blue-600" size={28} />
                            <h2 className="text-2xl font-bold text-slate-900">What We Offer</h2>
                        </div>
                        <ul className="space-y-3 text-slate-600">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Create and organize topics with hierarchical structure</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Private and public content management</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Rich text editing with code snippets and media support</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>User profiles and collaboration features</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Real-time updates and seamless synchronization</span>
                            </li>
                        </ul>
                    </div>

                    {/* Community */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="text-blue-600" size={28} />
                            <h2 className="text-2xl font-bold text-slate-900">Join Our Community</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            BrainDocs is more than just a documentation tool—it's a community of learners and knowledge
                            sharers. Create an account today and start building your personal knowledge base!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
