import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationRequest {
  recipientIds: string[]
  title: string
  body: string
  data?: Record<string, any>
  type: 'new_message' | 'new_match' | 'match_revealed' | 'timer_warning' | 're_engagement'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { recipientIds, title, body, data, type }: NotificationRequest = await req.json()

    // Get push tokens for recipients
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('id, push_token, full_name')
      .in('id', recipientIds)
      .not('push_token', 'is', null)

    if (profilesError) {
      throw profilesError
    }

    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No valid push tokens found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send notifications to Expo Push API
    const notifications = profiles.map(profile => ({
      to: profile.push_token,
      sound: 'default',
      title,
      body,
      data: {
        ...data,
        type,
        recipient_id: profile.id,
        timestamp: new Date().toISOString(),
      },
      channelId: 'default',
    }))

    const pushResponse = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notifications),
    })

    const pushResult = await pushResponse.json()

    // Log notification attempts
    console.log('Notification sent:', {
      type,
      recipientCount: profiles.length,
      title,
      result: pushResult,
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: profiles.length,
        result: pushResult 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error sending notification:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})