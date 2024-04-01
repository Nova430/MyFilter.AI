

import Replicate from 'replicate';
// Initialize Replicate client
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY!
});

export async function transformImageWithReplicate({imageUrl, style, prompt} : ReplicateImage) {
    const input = {
        image: imageUrl,
        style: style,
        prompt: prompt,
        instant_id_strength: 0.8
    };

    try {
        const output = await replicate.run("fofr/face-to-many:35cea9c3164d9fb7fbd48b51503eabdb39c9d04fdaef9a68f368bed8087ec5f9", { input });
        console.log(output);
        return output;
    } catch (error) {
        console.error('Error transforming image with Replicate:', error);
        throw error;  // Rethrow or handle as needed
    }
}