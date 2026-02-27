import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Create Supabase client with service role (bypasses RLS)
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-25845558/health", (c) => {
  return c.json({ status: "ok" });
});

// ============ SAVED DISCUSSIONS ENDPOINTS ============

// Save a discussion
app.post("/make-server-25845558/discussions/:discussionId/save", async (c) => {
  try {
    const discussionId = c.req.param('discussionId');
    const { userId } = await c.req.json();

    if (!userId || !discussionId) {
      return c.json({ error: 'Missing userId or discussionId' }, 400);
    }

    const key = `saved_discussion:${userId}:${discussionId}`;
    
    // Check if already saved
    const { data: existing } = await supabase
      .from('kv_store_25845558')
      .select('key')
      .eq('key', key)
      .single();

    if (existing) {
      return c.json({ success: true, alreadySaved: true });
    }

    // Save it
    const { error } = await supabase
      .from('kv_store_25845558')
      .insert({
        key: key,
        value: JSON.stringify({
          userId,
          discussionId,
          savedAt: new Date().toISOString()
        })
      });

    if (error) {
      console.error('Error saving discussion:', error);
      return c.json({ error: 'Failed to save discussion', details: error }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error in save discussion endpoint:', error);
    return c.json({ error: 'Internal server error', details: error.message }, 500);
  }
});

// Unsave a discussion
app.delete("/make-server-25845558/discussions/:discussionId/save", async (c) => {
  try {
    const discussionId = c.req.param('discussionId');
    const { userId } = await c.req.json();

    if (!userId || !discussionId) {
      return c.json({ error: 'Missing userId or discussionId' }, 400);
    }

    const key = `saved_discussion:${userId}:${discussionId}`;
    
    const { error } = await supabase
      .from('kv_store_25845558')
      .delete()
      .eq('key', key);

    if (error) {
      console.error('Error unsaving discussion:', error);
      return c.json({ error: 'Failed to unsave discussion', details: error }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error in unsave discussion endpoint:', error);
    return c.json({ error: 'Internal server error', details: error.message }, 500);
  }
});

// Check if discussion is saved
app.get("/make-server-25845558/discussions/:discussionId/saved/:userId", async (c) => {
  try {
    const discussionId = c.req.param('discussionId');
    const userId = c.req.param('userId');

    if (!userId || !discussionId) {
      return c.json({ error: 'Missing userId or discussionId' }, 400);
    }

    const key = `saved_discussion:${userId}:${discussionId}`;
    
    const { data, error } = await supabase
      .from('kv_store_25845558')
      .select('key')
      .eq('key', key)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking saved status:', error);
      return c.json({ error: 'Failed to check saved status', details: error }, 500);
    }

    return c.json({ isSaved: !!data });
  } catch (error) {
    console.error('Error in check saved endpoint:', error);
    return c.json({ error: 'Internal server error', details: error.message }, 500);
  }
});

// Get all saved discussions for a user
app.get("/make-server-25845558/discussions/saved/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');

    if (!userId) {
      return c.json({ error: 'Missing userId' }, 400);
    }

    // Fetch all saved discussion keys for this user
    const { data: kvData, error: kvError } = await supabase
      .from('kv_store_25845558')
      .select('key, value')
      .like('key', `saved_discussion:${userId}:%`);

    if (kvError) {
      console.error('Error fetching saved discussions from KV:', kvError);
      return c.json({ error: 'Failed to fetch saved discussions', details: kvError }, 500);
    }

    if (!kvData || kvData.length === 0) {
      return c.json({ discussions: [] });
    }

    // Extract discussion IDs
    const discussionIds = kvData
      .map(item => {
        try {
          const value = JSON.parse(item.value);
          return value.discussionId;
        } catch (e) {
          const parts = item.key.split(':');
          return parts[2];
        }
      })
      .filter(Boolean);

    if (discussionIds.length === 0) {
      return c.json({ discussions: [] });
    }

    // Fetch full discussion details
    const { data: discussions, error: discussionsError } = await supabase
      .from('discussions')
      .select(`
        *,
        user:profiles!discussions_author_id_fkey(name, username, avatar),
        book:books(title, cover)
      `)
      .in('id', discussionIds)
      .order('created_at', { ascending: false });

    if (discussionsError) {
      console.error('Error fetching discussion details:', discussionsError);
      return c.json({ error: 'Failed to fetch discussion details', details: discussionsError }, 500);
    }

    if (!discussions) {
      return c.json({ discussions: [] });
    }

    // Get reply counts for each discussion
    const discussionsWithCounts = await Promise.all(
      discussions.map(async (discussion) => {
        const { count } = await supabase
          .from('discussion_replies')
          .select('*', { count: 'exact', head: true })
          .eq('discussion_id', discussion.id);

        return {
          id: discussion.id,
          userId: discussion.author_id,
          userName: discussion.user?.name || 'Unknown User',
          userAvatar: discussion.user?.avatar,
          title: discussion.title,
          content: discussion.content,
          category: discussion.category,
          bookId: discussion.book_id || undefined,
          bookTitle: discussion.book?.title || undefined,
          bookCover: discussion.book?.cover || undefined,
          replyCount: count || 0,
          createdAt: discussion.created_at,
          updatedAt: discussion.updated_at,
        };
      })
    );

    return c.json({ discussions: discussionsWithCounts });
  } catch (error) {
    console.error('Error in get saved discussions endpoint:', error);
    return c.json({ error: 'Internal server error', details: error.message }, 500);
  }
});

Deno.serve(app.fetch);