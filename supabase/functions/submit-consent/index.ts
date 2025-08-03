import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

Deno.serve(async (req) => {
  const { matchId, userId } = await req.json();

  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select('user1_id, user2_id, user1_consent, user2_consent')
    .eq('id', matchId)
    .single();

  if (matchError) {
    return new Response(JSON.stringify({ error: matchError.message }), { status: 500 });
  }

  const isUser1 = match.user1_id === userId;
  const updatePayload = isUser1 ? { user1_consent: true } : { user2_consent: true };

  const { error: updateError } = await supabase
    .from('matches')
    .update(updatePayload)
    .eq('id', matchId);

  if (updateError) {
    return new Response(JSON.stringify({ error: updateError.message }), { status: 500 });
  }

  // Check if both users have consented
  const otherUserConsent = isUser1 ? match.user2_consent : match.user1_consent;
  if (otherUserConsent) {
    await supabase.from('matches').update({ status: 'revealed' }).eq('id', matchId);
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
