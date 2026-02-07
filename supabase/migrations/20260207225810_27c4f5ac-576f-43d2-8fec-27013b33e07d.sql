-- Enable RLS on all unrestricted tables and add user-based policies

-- api_keys table
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own api_keys" ON public.api_keys FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own api_keys" ON public.api_keys FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update their own api_keys" ON public.api_keys FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete their own api_keys" ON public.api_keys FOR DELETE USING (auth.uid()::text = user_id);

-- chart_snapshots table
ALTER TABLE public.chart_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own chart_snapshots" ON public.chart_snapshots FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own chart_snapshots" ON public.chart_snapshots FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update their own chart_snapshots" ON public.chart_snapshots FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete their own chart_snapshots" ON public.chart_snapshots FOR DELETE USING (auth.uid()::text = user_id);

-- conversation_events table
ALTER TABLE public.conversation_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own conversation_events" ON public.conversation_events FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own conversation_events" ON public.conversation_events FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update their own conversation_events" ON public.conversation_events FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete their own conversation_events" ON public.conversation_events FOR DELETE USING (auth.uid()::text = user_id);

-- google_tokens table
ALTER TABLE public.google_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own google_tokens" ON public.google_tokens FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own google_tokens" ON public.google_tokens FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update their own google_tokens" ON public.google_tokens FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete their own google_tokens" ON public.google_tokens FOR DELETE USING (auth.uid()::text = user_id);

-- page_snapshots table
ALTER TABLE public.page_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own page_snapshots" ON public.page_snapshots FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own page_snapshots" ON public.page_snapshots FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update their own page_snapshots" ON public.page_snapshots FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete their own page_snapshots" ON public.page_snapshots FOR DELETE USING (auth.uid()::text = user_id);

-- projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own projects" ON public.projects FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update their own projects" ON public.projects FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete their own projects" ON public.projects FOR DELETE USING (auth.uid()::text = user_id);

-- project_conversations table (uses project_id, need to join through projects)
ALTER TABLE public.project_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own project_conversations" ON public.project_conversations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_conversations.project_id AND projects.user_id = auth.uid()::text)
);
CREATE POLICY "Users can insert their own project_conversations" ON public.project_conversations FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_conversations.project_id AND projects.user_id = auth.uid()::text)
);
CREATE POLICY "Users can update their own project_conversations" ON public.project_conversations FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_conversations.project_id AND projects.user_id = auth.uid()::text)
);
CREATE POLICY "Users can delete their own project_conversations" ON public.project_conversations FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_conversations.project_id AND projects.user_id = auth.uid()::text)
);

-- project_memory table (uses project_id, need to join through projects)
ALTER TABLE public.project_memory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own project_memory" ON public.project_memory FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_memory.project_id AND projects.user_id = auth.uid()::text)
);
CREATE POLICY "Users can insert their own project_memory" ON public.project_memory FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_memory.project_id AND projects.user_id = auth.uid()::text)
);
CREATE POLICY "Users can update their own project_memory" ON public.project_memory FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_memory.project_id AND projects.user_id = auth.uid()::text)
);
CREATE POLICY "Users can delete their own project_memory" ON public.project_memory FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_memory.project_id AND projects.user_id = auth.uid()::text)
);

-- research_sessions table
ALTER TABLE public.research_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own research_sessions" ON public.research_sessions FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own research_sessions" ON public.research_sessions FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update their own research_sessions" ON public.research_sessions FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete their own research_sessions" ON public.research_sessions FOR DELETE USING (auth.uid()::text = user_id);

-- research_steps table (uses session_id, need to join through research_sessions)
ALTER TABLE public.research_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own research_steps" ON public.research_steps FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.research_sessions WHERE research_sessions.id = research_steps.session_id AND research_sessions.user_id = auth.uid()::text)
);
CREATE POLICY "Users can insert their own research_steps" ON public.research_steps FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.research_sessions WHERE research_sessions.id = research_steps.session_id AND research_sessions.user_id = auth.uid()::text)
);
CREATE POLICY "Users can update their own research_steps" ON public.research_steps FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.research_sessions WHERE research_sessions.id = research_steps.session_id AND research_sessions.user_id = auth.uid()::text)
);
CREATE POLICY "Users can delete their own research_steps" ON public.research_steps FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.research_sessions WHERE research_sessions.id = research_steps.session_id AND research_sessions.user_id = auth.uid()::text)
);

-- selected_elements table
ALTER TABLE public.selected_elements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own selected_elements" ON public.selected_elements FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own selected_elements" ON public.selected_elements FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update their own selected_elements" ON public.selected_elements FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete their own selected_elements" ON public.selected_elements FOR DELETE USING (auth.uid()::text = user_id);

-- standalone_conversations table
ALTER TABLE public.standalone_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own standalone_conversations" ON public.standalone_conversations FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own standalone_conversations" ON public.standalone_conversations FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update their own standalone_conversations" ON public.standalone_conversations FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete their own standalone_conversations" ON public.standalone_conversations FOR DELETE USING (auth.uid()::text = user_id);

-- user_memory table
ALTER TABLE public.user_memory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own user_memory" ON public.user_memory FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own user_memory" ON public.user_memory FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update their own user_memory" ON public.user_memory FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete their own user_memory" ON public.user_memory FOR DELETE USING (auth.uid()::text = user_id);

-- user_settings table
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own user_settings" ON public.user_settings FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own user_settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update their own user_settings" ON public.user_settings FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete their own user_settings" ON public.user_settings FOR DELETE USING (auth.uid()::text = user_id);

-- users table (id is the user identifier)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own user record" ON public.users FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users can insert their own user record" ON public.users FOR INSERT WITH CHECK (auth.uid()::text = id);
CREATE POLICY "Users can update their own user record" ON public.users FOR UPDATE USING (auth.uid()::text = id);
CREATE POLICY "Users can delete their own user record" ON public.users FOR DELETE USING (auth.uid()::text = id);

-- messages table (no direct user_id, but has conversation_id - need to check both conversation types)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own messages" ON public.messages FOR SELECT USING (
  (conversation_type = 'standalone' AND EXISTS (
    SELECT 1 FROM public.standalone_conversations WHERE standalone_conversations.id = messages.conversation_id AND standalone_conversations.user_id = auth.uid()::text
  ))
  OR
  (conversation_type = 'project' AND EXISTS (
    SELECT 1 FROM public.project_conversations pc 
    JOIN public.projects p ON p.id = pc.project_id 
    WHERE pc.id = messages.conversation_id AND p.user_id = auth.uid()::text
  ))
);
CREATE POLICY "Users can insert their own messages" ON public.messages FOR INSERT WITH CHECK (
  (conversation_type = 'standalone' AND EXISTS (
    SELECT 1 FROM public.standalone_conversations WHERE standalone_conversations.id = messages.conversation_id AND standalone_conversations.user_id = auth.uid()::text
  ))
  OR
  (conversation_type = 'project' AND EXISTS (
    SELECT 1 FROM public.project_conversations pc 
    JOIN public.projects p ON p.id = pc.project_id 
    WHERE pc.id = messages.conversation_id AND p.user_id = auth.uid()::text
  ))
);
CREATE POLICY "Users can update their own messages" ON public.messages FOR UPDATE USING (
  (conversation_type = 'standalone' AND EXISTS (
    SELECT 1 FROM public.standalone_conversations WHERE standalone_conversations.id = messages.conversation_id AND standalone_conversations.user_id = auth.uid()::text
  ))
  OR
  (conversation_type = 'project' AND EXISTS (
    SELECT 1 FROM public.project_conversations pc 
    JOIN public.projects p ON p.id = pc.project_id 
    WHERE pc.id = messages.conversation_id AND p.user_id = auth.uid()::text
  ))
);
CREATE POLICY "Users can delete their own messages" ON public.messages FOR DELETE USING (
  (conversation_type = 'standalone' AND EXISTS (
    SELECT 1 FROM public.standalone_conversations WHERE standalone_conversations.id = messages.conversation_id AND standalone_conversations.user_id = auth.uid()::text
  ))
  OR
  (conversation_type = 'project' AND EXISTS (
    SELECT 1 FROM public.project_conversations pc 
    JOIN public.projects p ON p.id = pc.project_id 
    WHERE pc.id = messages.conversation_id AND p.user_id = auth.uid()::text
  ))
);