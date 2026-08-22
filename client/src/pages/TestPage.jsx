import React from "react";
import CreatorModelSubmitForm from "../components/bench/CreatorModelSubmitForm";
import TestedModelsRankings from "../components/bench/TestedModelsRankings";

const TestPage = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-[#ea580c] selection:text-white py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Creator Model Submission & Automated Benchmark Form */}
        <CreatorModelSubmitForm />

        {/* Tested Models & Global Rank Leaderboard Component */}
        <TestedModelsRankings />
      </div>
    </div>
  );
};

export default TestPage;
