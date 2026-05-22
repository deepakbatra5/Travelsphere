import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      console.error('Cloudinary config missing:', { cloudName: !!cloudName, uploadPreset: !!uploadPreset })
      return NextResponse.json(
        { error: 'Upload service not configured. Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env.local' },
        { status: 500 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    const maxSizeInBytes = 5 * 1024 * 1024
    if (file.size > maxSizeInBytes) {
      return NextResponse.json({ error: 'Image exceeds 5MB limit' }, { status: 400 })
    }

    // Prepare FormData for unsigned Cloudinary upload
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('upload_preset', uploadPreset)
    uploadFormData.append('folder', 'travel-sphere-packages')

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

    console.log(`[Upload] Sending to Cloudinary: ${cloudinaryUrl}`)

    const uploadResponse = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: uploadFormData,
    })

    const result = await uploadResponse.json()

    if (!uploadResponse.ok) {
      console.error('[Upload] Cloudinary error:', result)
      const errorMsg = result.error?.message || result.error || 'Unknown error'
      return NextResponse.json(
        { error: `Cloudinary error: ${errorMsg}` },
        { status: uploadResponse.status }
      )
    }

    if (!result.secure_url) {
      console.error('[Upload] No secure_url in response:', result)
      return NextResponse.json(
        { error: 'Upload succeeded but no URL returned' },
        { status: 500 }
      )
    }

    console.log(`[Upload] Success: ${result.secure_url}`)
    return NextResponse.json({ url: result.secure_url })
  } catch (error) {
    console.error('[Upload] Error:', error)
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Upload failed: ${errorMsg}` },
      { status: 500 }
    )
  }
}
