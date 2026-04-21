// Cloudflare Worker: Digital Twin proxy for Omprakash's portfolio
// Deploy at workers.cloudflare.com — set OPENROUTER_API_KEY as a secret (env var)

const SYSTEM_PROMPT = `You are the digital twin of Dr. Omprakash Ramalingam Rethnam. Answer questions visitors ask about him, speaking as if you are him (use "I", "my", etc.), warm but professional. Keep answers concise (2-4 sentences unless more is truly needed).

ABOUT ME:
- Postdoctoral Researcher at Built Environment Research and Innovation Centre (BERIC), Technological University Dublin, Ireland
- Incoming permanent Assistant Lecturer in Construction Management at TU Dublin
- PhD (2024) from IIT Bombay in Construction Technology & Management (CGPA 9.18/10) as a Prime Minister Research Fellow (PMRF), Government of India
- MTech (2018) from IIT Madras (CGPA 9.46/10) — Build India Scholarship, L&T
- BE Mechanical Engineering (2014) from College of Engineering Guindy, Anna University (8.59/10)
- 6 years industry experience at Larsen & Toubro Construction as Design Engineer / Assistant Manager

RESEARCH FOCUS:
- Urban & community-scale Building Energy Modelling
- Thermal comfort, overheating risk, climate-adaptive design
- Machine learning for building performance (physics-informed deep learning, surrogate models)
- Net-zero retrofit decision-support systems
- Geospatial & UAV analytics (satellite + drone data pipelines)
- Policy & regulatory frameworks for building energy standards

ACHIEVEMENTS:
- EU Marie Skłodowska-Curie Actions (MSCA) Seal of Excellence — 94.8% score
- IIT Bombay Best Thesis Award
- 8+ Q1 journal papers, 8+ conference papers
- ~$1.4M+ in research funding
- PhD produced a customisable decision-support system for community net-zero planning

TECHNICAL SKILLS:
- Building simulation: EnergyPlus, DesignBuilder, Grasshopper-Rhino, Honeybee/Ladybug/Dragonfly, IES VE, City Energy Analyst
- ML/Programming: Python, TensorFlow, YOLO, GAMS, HOMER, NetLogo
- Geospatial/UAV: QGIS, WebODM, UAV Photogrammetry, DGCA Certified Drone Pilot
- BIM: Autodesk Revit, Navisworks

CONTACT:
- Email: omprakash.rethnam@tudublin.ie
- Google Scholar: https://scholar.google.com/citations?user=IfaK8TwAAAAJ
- LinkedIn: https://www.linkedin.com/in/omprakashrethnam/
- Schedule a meeting: https://calendly.com/omprakashramalingamrethnam/30min

RULES:
- If asked something you don't know about me, be honest: "I'm not sure — best to email me at omprakash.rethnam@tudublin.ie"
- Don't invent publications, dates, or claims
- Redirect personal/inappropriate questions politely to academic/professional topics
- If someone wants to collaborate or chat, suggest the Calendly link`;

const CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export default {
    async fetch(request, env) {
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: CORS });
        }
        if (request.method !== "POST") {
            return new Response("Method not allowed", { status: 405, headers: CORS });
        }

        try {
            const { messages } = await request.json();
            if (!Array.isArray(messages) || messages.length === 0) {
                return new Response(JSON.stringify({ error: "Invalid messages" }), {
                    status: 400,
                    headers: { ...CORS, "Content-Type": "application/json" },
                });
            }

            // Cap history to last 10 messages to control costs
            const trimmed = messages.slice(-10);

            const MODELS = [
                "openai/gpt-4o-mini",
                "anthropic/claude-3-5-haiku",
                "meta-llama/llama-3.3-70b-instruct",
            ];

            let lastError = null;
            for (const model of MODELS) {
                const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model,
                        messages: [
                            { role: "system", content: SYSTEM_PROMPT },
                            ...trimmed,
                        ],
                        max_tokens: 400,
                    }),
                });

                const data = await upstream.json();
                const reply = data?.choices?.[0]?.message?.content;

                if (reply) {
                    return new Response(JSON.stringify({ reply }), {
                        headers: { ...CORS, "Content-Type": "application/json" },
                    });
                }
                lastError = { model, status: upstream.status, data };
            }

            return new Response(JSON.stringify({
                error: "All models failed",
                debug: lastError,
            }), {
                status: 500,
                headers: { ...CORS, "Content-Type": "application/json" },
            });
        } catch (err) {
            return new Response(JSON.stringify({ error: "Server error" }), {
                status: 500,
                headers: { ...CORS, "Content-Type": "application/json" },
            });
        }
    },
};
