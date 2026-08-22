import React from "react";

const plans = [
  { name: "Starter", price: "$5", description: "For trying out model benchmarking." },
  { name: "Pro", price: "$15", description: "For teams running benchmarks regularly." },
];

const PlanPage = () => (
  <main className="page-container min-h-[70vh]">
    <div className="mb-8 border-b-2 border-black pb-5">
      <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#ea580c]">Account / Plan</p>
      <h1 className="mt-3 text-3xl font-bold text-black">Choose your plan</h1>
      <p className="mt-2 max-w-xl text-sm text-zinc-600">Select the access level that fits your benchmarking workflow.</p>
    </div>
    <div className="grid max-w-3xl gap-5 sm:grid-cols-2">
      {plans.map((plan) => (
        <section key={plan.name} className="border-2 border-black bg-white p-6 shadow-[5px_5px_0_#1a1a1a]">
          <h2 className="font-mono text-lg font-bold text-black">{plan.name}</h2>
          <p className="mt-4 text-3xl font-bold text-[#ea580c]">{plan.price}<span className="text-sm text-zinc-500"> / access</span></p>
          <p className="mt-4 text-sm leading-6 text-zinc-600">{plan.description}</p>
          <button type="button" className="mt-6 border-2 border-black bg-[#ea580c] px-4 py-2 font-mono text-xs font-bold text-white shadow-[3px_3px_0_#111]">
            Select {plan.name}
          </button>
        </section>
      ))}
    </div>
  </main>
);

export default PlanPage;
