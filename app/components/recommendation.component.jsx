"use client"
import React, { useState, useEffect } from 'react';

const QUERY = 'Give me 3 series I should watch this week-end';

export const Recommendation = () => {
  const [reco, setReco] = useState(null)
 
  useEffect(() => {
    async function fetchReco() {
      const res = await fetch('http://localhost:3000/pages/api/llamaindex', { method: "POST",
      body: JSON.stringify({ query: QUERY }) });

      const { message } = await res.json();

      setReco(message);
    }

    fetchReco();
  }, [])
 
  if (!reco) return <div>Loading...</div>

  return <div className="flex flex-col justify-center gap-5 overflow-hidden py-4 sm:gap-8">
    <h1>Recommendation</h1>
    <p>{reco}</p>
  </div>
}