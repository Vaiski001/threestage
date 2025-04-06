import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Endpoints for authentication
// POST /api/auth/signin (email/password)
// POST /api/auth/signup (email/password)
// POST /api/auth/oauth (provider)
// POST /api/auth/signout

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const action = request.nextUrl.pathname.split('/').pop();
  const body = await request.json();

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Supabase configuration missing' }, { status: 500 });
  }

  // Initialize Supabase admin client
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // Create a Supabase client for the user
  const createUserClient = () => {
    const cookieStore = cookies();
    return createClient(
      supabaseUrl!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
          storageKey: 'threestage-auth',
        },
        global: {
          headers: {
            'X-Client-Info': 'threestage-next-js',
          },
        },
      }
    );
  };

  switch (action) {
    case 'signin': {
      const { email, password } = body;
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
      }

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 401 });
        }

        // Set auth cookie
        cookieStore.set('threestage-auth', JSON.stringify(data.session), {
          path: '/',
          maxAge: data.session?.expires_in,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        });

        return NextResponse.json({ 
          user: data.user,
          message: 'Successfully signed in' 
        });
      } catch (error) {
        console.error('Sign in error:', error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
      }
    }

    case 'signup': {
      const { email, password, role = 'customer' } = body;
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
      }

      try {
        // Create the user
        const { data: userData, error: userError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { role }
        });

        if (userError) {
          return NextResponse.json({ error: userError.message }, { status: 400 });
        }

        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: userData.user.id,
              email: userData.user.email,
              role,
              created_at: new Date().toISOString()
            }
          ]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
          // Don't fail the signup if profile creation has an issue
        }

        return NextResponse.json({ 
          message: 'User registered successfully',
          userId: userData.user.id
        });
      } catch (error) {
        console.error('Sign up error:', error);
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
      }
    }

    case 'oauth': {
      const { provider, redirectTo } = body;
      if (!provider) {
        return NextResponse.json({ error: 'Provider required' }, { status: 400 });
      }

      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: provider as any,
          options: {
            redirectTo: redirectTo || process.env.NEXT_PUBLIC_APP_URL
          }
        });

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ url: data.url });
      } catch (error) {
        console.error('OAuth error:', error);
        return NextResponse.json({ error: 'OAuth authentication failed' }, { status: 500 });
      }
    }

    case 'signout': {
      cookieStore.delete('threestage-auth');
      
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Sign out error:', error);
        }
      } catch (error) {
        console.error('Sign out error:', error);
      }

      return NextResponse.json({ message: 'Signed out successfully' });
    }

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const action = request.nextUrl.pathname.split('/').pop();

  if (action === 'session') {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('threestage-auth');
    
    if (!sessionCookie?.value) {
      return NextResponse.json({ user: null, session: null });
    }
    
    try {
      const session = JSON.parse(sessionCookie.value);
      return NextResponse.json({ session });
    } catch (error) {
      console.error('Session parse error:', error);
      return NextResponse.json({ user: null, session: null });
    }
  }

  return NextResponse.json({ error: 'Invalid endpoint' }, { status: 404 });
} 