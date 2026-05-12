export default function RoadmapRenderer({ roadmap }) {
    if (!roadmap) return null;

    return (
        <div className="min-h-screen bg-[#f5f5f5] p-10">

            <h1 className="text-5xl font-bold mb-16 text-center">
                {roadmap.role} Roadmap
            </h1>

            <div className="flex flex-col items-center gap-16">

                {roadmap.stages.map((stage, stageIndex) => (
                    <div
                        key={stageIndex}
                        className="w-full max-w-5xl flex flex-col items-center"
                    >

                        {/* Stage */}
                        <div className="text-3xl font-bold mb-10">
                            {stage.title}
                        </div>

                        {/* Topics */}
                        <div className="flex flex-col items-center gap-12">

                            {stage.topics.map((topic, topicIndex) => (
                                <div
                                    key={topicIndex}
                                    className="flex flex-col items-center relative"
                                >

                                    {/* Main Topic Box */}
                                    <div className="bg-yellow-300 border-4 border-black rounded-lg px-8 py-4 text-2xl font-bold shadow-lg">
                                        {topic.name}
                                    </div>

                                    {/* Vertical Line */}
                                    <div className="w-1 h-10 bg-blue-500"></div>

                                    {/* Subtopics */}
                                    <div className="flex flex-wrap justify-center gap-4 max-w-4xl">

                                        {topic.subtopics.map((sub, subIndex) => (
                                            <div
                                                key={subIndex}
                                                className="bg-[#f0dca0] border-2 border-black rounded-lg px-5 py-3 text-lg shadow"
                                            >
                                                {sub}
                                            </div>
                                        ))}

                                    </div>

                                </div>
                            ))}

                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}