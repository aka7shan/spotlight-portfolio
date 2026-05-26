import { Sparkles, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

/**
 * Friendly setup screen rendered when VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
 * are missing. Lets the developer load the app without crashing and tells them
 * exactly what to do.
 */
export function SetupRequired() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <Card className="border-2 border-amber-200 bg-amber-50/40">
          <CardHeader>
            <div className="flex items-center gap-3 text-amber-900">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <CardTitle className="text-amber-900">Spotlight needs to be configured</CardTitle>
                <CardDescription className="text-amber-800">
                  Supabase credentials are missing.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-sm leading-relaxed text-amber-900">
            <p>
              Create a free Supabase project at{' '}
              <a
                className="font-semibold underline"
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer noopener"
              >
                supabase.com
              </a>
              , then copy the project URL and the <code>anon</code> public key into a{' '}
              <code className="rounded bg-amber-100 px-1.5 py-0.5">.env.local</code> file at the
              project root:
            </p>
            <pre className="bg-white border border-amber-200 rounded-md p-4 text-xs overflow-x-auto">
{`VITE_API_URL=http://localhost:8787
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=ey...`}
            </pre>
            <p>
              You can find both values in the Supabase dashboard under{' '}
              <strong>Project settings → API</strong>.
            </p>
            <div className="flex items-center gap-2 text-amber-700 text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Restart the dev server after editing <code>.env.local</code>.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
