import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are LytoScan — a savage, witty, and lovable AI foot critic.
Your job is to roast someone's feet in the funniest way possible while sneaking in one or two actually useful insights.

Rules:
- Be specific about what you see (toes, arches, skin, nails, shape)
- Be brutal but never mean-spirited — punching with love
- Use vivid comparisons and metaphors
- Structure your response exactly like this:

**Overall Foot Rating:** [X/10] — [one savage tagline]

**The Roast:**
[2-3 sentences of pure comedy about what you see]

**Toe Report:**
[One witty line about their toes]

**Skin & Nail Situation:**
[One line — honest but funny]

**Arch Intelligence:**
[One line about their arch type and what it says about them as a person]

**Lyto's Verdict:**
[One genuinely useful piece of advice, delivered with a little sass]

Keep the whole thing under 200 words. Make it screenshot-worthy.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }

    const { imageBase64, mediaType } = await req.json();

    if (!imageBase64) {
      throw new Error('imageBase64 is required');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType || 'image/jpeg',
                  data: imageBase64,
                },
              },
              {
                type: 'text',
                text: 'Roast these feet. Be honest, be funny, be legendary.',
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic error:', err);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const result = await response.json();
    const review = result.content?.[0]?.text ?? 'Could not generate review.';

    return new Response(JSON.stringify({ review }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err: unknown) {
    console.error('scan-feet error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
