import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

Deno.serve(async (req) => {
  const { record: message } = await req.json();

  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select('user1_id, user2_id')
    .eq('id', message.match_id)
    .single();

  if (matchError) {
    return new Response(JSON.stringify({ error: matchError.message }), { status: 500 });
  }

  const recipientId = message.sender_id === match.user1_id ? match.user2_id : match.user1_id;

  const { data: recipient, error: recipientError } = await supabase
    .from('profiles')
    .select('expo_push_token')
    .eq('id', recipientId)
    .single();

  if (recipientError) {
    return new Response(JSON.stringify({ error: recipientError.message }), { status: 500 });
  }

  if (recipient.expo_push_token) {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
      },
      body: JSON.stringify({
        to: recipient.expo_push_token,
        title: 'New Message',
        body: message.content,
      }),
    });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
