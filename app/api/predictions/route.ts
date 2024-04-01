// pages/api/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Replicate from 'replicate';

// Initialize the Replicate client with your API key
const API_KEY = process.env.REPLICATE_API_KEY; // It's better to use environment variables for API keys
console.log(API_KEY);
const replicate = new Replicate({
    auth: API_KEY || ""
});

export async function POST(
    req: Request,
) {
    if (req.method === 'POST') {
        const body = await req.json()
        console.log("Received body:", body);

        if ('imageUrl' in body) {
            const imageUrl = body.imageUrl;
            console.log("Image URL:", imageUrl);
            // Proceed with using imageUrl
            const input = {
                image: imageUrl,
                style: "Video game",
                prompt: "pixelated glitchart of close-up of {subject}, ps1 playstation psx gamecube game radioactive dreams screencapture, bryce 3d",
                instant_id_strength: 0.8
            };
    
            try {
                const output = await replicate.run("fofr/face-to-many:35cea9c3164d9fb7fbd48b51503eabdb39c9d04fdaef9a68f368bed8087ec5f9", { input });
                console.log(output);
                return new Response(JSON.stringify(output), { status: 200 });
            } catch (error) {
                console.error('Error transforming image with Replicate:', error);
                return new Response(JSON.stringify({error: 'Error transforming image with Replicate'}), { status: 500 })
            }
        }
    }
}