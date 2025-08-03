import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

Deno.serve(async (req) => {
  const { userId } = await req.json();

  // Set the current user to searching
  await supabase.from('profiles').update({ is_searching: true }).eq('id', userId);

  // Look for another user who is searching
  const { data: otherUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('is_searching', true)
    .not('id', 'eq', userId)
    .limit(1)
    .single();

  if (otherUser) {
    // If a match is found, create a new match
    const { data: newMatch, error } = await supabase
      .from('matches')
      .insert({ user1_id: userId, user2_id: otherUser.id, status: 'active' })
      .select('id')
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    // Set both users to not searching
    await supabase.from('profiles').update({ is_searching: false }).in('id', [userId, otherUser.id]);

    return new Response(JSON.stringify({ match_id: newMatch.id }), { status: 200 });
  } else {
    // If no match is found after a timeout, set the user back to not searching
    setTimeout(async () => {
      await supabase.from('profiles').update({ is_searching: false }).eq('id', userId);
    }, 30000);

    return new Response(JSON.stringify({ status: 'not_found' }), { status: 404 });
  }
});
