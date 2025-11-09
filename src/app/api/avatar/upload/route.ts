
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseApiClient } from '@/utils/supabase/api';
import { createSupabaseAdminClient } from '@/utils/supabase/admin';

export async function POST(request: NextRequest) {
  // 1. Get Authenticated User using the standard API client
  const supabase = createSupabaseApiClient(request);
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('API Auth Error:', userError);
    return NextResponse.json({ success: false, error: 'User not authenticated.' }, { status: 401 });
  }

  // 2. Get the file from the form data.
  const formData = await request.formData();
  const file = formData.get('avatar') as File;
  if (!file) {
    return NextResponse.json({ success: false, error: 'No file provided.' }, { status: 400 });
  }

  // 3. Use the Admin Client for storage and database writes.
  const adminSupabase = createSupabaseAdminClient();
  
  const fileExtension = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExtension}`;
  const filePath = `${user.id}/${fileName}`;

  // 4. Upload the file to storage.
  const { error: uploadError } = await adminSupabase.storage
    .from('avatars')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Avatar upload error:', uploadError);
    return NextResponse.json({ success: false, error: `Storage upload failed: ${uploadError.message}` }, { status: 500 });
  }

  // 5. Get the public URL of the uploaded file.
  const { data: urlData } = adminSupabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  const publicUrl = urlData?.publicUrl;

  if (!publicUrl) {
    // Clean up orphaned file if URL retrieval fails.
    await adminSupabase.storage.from('avatars').remove([filePath]);
    console.error('Could not get public URL for uploaded file:', filePath);
    return NextResponse.json({ success: false, error: 'Could not retrieve public URL for the uploaded file.' }, { status: 500 });
  }
  
  // 6. Update the user's profile with the new avatar URL.
  const { error: dbError } = await adminSupabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('user_id', user.id);

  if (dbError) {
    // Clean up orphaned file if database update fails.
    await adminSupabase.storage.from('avatars').remove([filePath]);
    console.error('Database update error:', dbError);
    return NextResponse.json({ success: false, error: `Failed to save avatar URL to profile: ${dbError.message}` }, { status: 500 });
  }

  // 7. Success!
  return NextResponse.json({ success: true, url: publicUrl }, { status: 200 });
}
