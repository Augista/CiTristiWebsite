"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, AlertCircle, CheckCircle2 } from "lucide-react"

const sqlScript = `-- Create users table (extension of Supabase auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id BIGSERIAL PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  district TEXT,
  property_type TEXT NOT NULL,
  price BIGINT NOT NULL,
  size_sqm INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  featured_image_url TEXT,
  gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
  amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
  contact_phone TEXT,
  contact_email TEXT,
  listing_status TEXT DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for properties table
CREATE POLICY "Anyone can read properties" ON public.properties
  FOR SELECT USING (TRUE);

CREATE POLICY "Admin can create properties" ON public.properties
  FOR INSERT WITH CHECK (auth.uid() = admin_id AND EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "Admin can update own properties" ON public.properties
  FOR UPDATE USING (auth.uid() = admin_id AND EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "Admin can delete own properties" ON public.properties
  FOR DELETE USING (auth.uid() = admin_id AND EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE
  ));`

export default function SetupDBPage() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Database Setup Required</h1>
          <p className="text-lg text-muted-foreground">Follow these steps to initialize your Supabase database</p>
        </div>

        <Alert className="mb-8 border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            The properties table doesn't exist yet. You need to run the SQL migration in your Supabase dashboard.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6">
          {/* Step 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Go to Supabase Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Open your Supabase project dashboard and navigate to the SQL Editor.
              </p>
              <a
                href="https://app.supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Open Supabase →
              </a>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Open SQL Editor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                In your Supabase dashboard, click on <strong>"SQL Editor"</strong> in the left sidebar, then click{" "}
                <strong>"New Query"</strong>.
              </p>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                Copy and Run SQL Script
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Copy the SQL script below and paste it into Supabase SQL Editor, then click "Run".
              </p>

              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg mb-4 overflow-x-auto font-mono text-sm relative">
                <pre className="whitespace-pre-wrap">{sqlScript}</pre>
              </div>

              <Button onClick={copyToClipboard} className="gap-2">
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy SQL Script
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </span>
                Create Storage Bucket
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You need to create a public storage bucket for property images:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">
                <li>
                  In Supabase dashboard, click <strong>"Storage"</strong> in the left sidebar
                </li>
                <li>
                  Click <strong>"Create a new bucket"</strong>
                </li>
                <li>
                  Name it <strong>"properties"</strong> (exactly)
                </li>
                <li>
                  Toggle <strong>"Public bucket"</strong> to ON
                </li>
                <li>
                  Click <strong>"Create bucket"</strong>
                </li>
              </ol>

              {/* Storage Bucket RLS Configuration */}
              <div className="bg-blue-50 border border-blue-200 rounded p-4 my-4">
                <p className="font-semibold text-blue-900 mb-2">Storage Bucket RLS Configuration:</p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                  <li>
                    Click on the <strong>"properties"</strong> bucket you created
                  </li>
                  <li>
                    Click on <strong>"Policies"</strong> tab
                  </li>
                  <li>
                    Click <strong>"New policy"</strong>
                  </li>
                  <li>
                    Select <strong>"For queries with or without filters"</strong>
                  </li>
                  <li>
                    Set Target role to <strong>"Public"</strong> (or leave as default)
                  </li>
                  <li>
                    Set Allowed operations: <strong>SELECT, INSERT</strong>
                  </li>
                  <li>Leave the USING and WITH CHECK expressions empty (or set to TRUE)</li>
                  <li>
                    Click <strong>"Review"</strong> then <strong>"Save policy"</strong>
                  </li>
                </ol>
              </div>

              <a
                href="https://app.supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Go to Supabase Storage →
              </a>
            </CardContent>
          </Card>

          {/* Step 5 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  5
                </span>
                Done!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                After running the SQL script and creating the storage bucket, your database is ready!
              </p>
              <a
                href="/admin/dashboard"
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Go to Admin Dashboard →
              </a>
            </CardContent>
          </Card>
        </div>

        <Alert className="mt-8 border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            After running the SQL and setting up the storage bucket, you'll be able to create admin accounts and upload
            properties with images.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
