type PackageImageSource = {
  slug?: string | null
  title?: string | null
  destination?: string | null
  category?: string | null
  images?: string[] | null
}

type ImageRule = {
  terms: string[]
  image: string
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1502920917128-1aa500764ce7?w=1600&auto=format&fit=crop&q=80'

const CATEGORY_IMAGES: Record<string, string> = {
  FAMILY: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80',
  SOLO: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1600&auto=format&fit=crop&q=80',
  GROUP: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=1600&auto=format&fit=crop&q=80',
  PILGRIMAGE: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=1600&auto=format&fit=crop&q=80',
  ADVENTURE: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&auto=format&fit=crop&q=80',
  COUPLE: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1600&auto=format&fit=crop&q=80',
  CORPORATE: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&auto=format&fit=crop&q=80',
}

const IMAGE_RULES: ImageRule[] = [
  {
    terms: ['golden triangle', 'agra', 'jaipur', 'delhi'],
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&auto=format&fit=crop&q=80',
  },
  {
    terms: ['kashmir', 'srinagar', 'gulmarg', 'pahalgam'],
    image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=1600&auto=format&fit=crop&q=80',
  },
  {
    terms: ['himachal', 'shimla', 'manali', 'dharamshala', 'dalhousie', 'spiti', 'ladakh', 'kullu'],
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&auto=format&fit=crop&q=80',
  },
  {
    terms: ['goa'],
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&auto=format&fit=crop&q=80',
  },
  {
    terms: ['kerala', 'munnar', 'alleppey', 'kovalam', 'thekkady', 'kochi', 'backwater'],
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1600&auto=format&fit=crop&q=80',
  },
  {
    terms: ['rajasthan', 'jaisalmer', 'jodhpur', 'udaipur', 'mount abu', 'jaipur', 'desert', 'rann'],
    image: 'https://images.unsplash.com/photo-1477587458883-471a5ed94245?w=1600&auto=format&fit=crop&q=80',
  },
  {
    terms: ['varanasi', 'kashi', 'sarnath', 'ayodhya'],
    image: 'https://images.unsplash.com/photo-1561361041-c96a49f80988?w=1600&auto=format&fit=crop&q=80',
  },
  {
    terms: ['char dham', 'char-dham', 'badrinath', 'kedarnath', 'gangotri', 'yamunotri', 'haridwar', 'rishikesh'],
    image: 'https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=1600&auto=format&fit=crop&q=80',
  },
  {
    terms: ['amritsar', 'golden temple'],
    image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=1600&auto=format&fit=crop&q=80',
  },
  {
    terms: ['nainital', 'mussoorie', 'lonavala', 'mahabaleshwar', 'ooty', 'kodaikanal', 'coorg', 'chikmagalur', 'wayanad'],
    image: 'https://images.unsplash.com/photo-1626509653199-03bb36ec7a3f?w=1600&auto=format&fit=crop&q=80',
  },
  {
    terms: ['darjeeling', 'gangtok', 'sikkim', 'tawang', 'meghalaya', 'ziro', 'araku'],
    image: 'https://images.unsplash.com/photo-1524492412937-4961f9d5f72d?w=1600&auto=format&fit=crop&q=80',
  },
  {
    terms: ['andaman', 'havelock', 'lakshadweep', 'daman', 'diu', 'alibaug', 'varkala', 'digha', 'pondicherry'],
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80',
  },
  {
    terms: ['corbett', 'gir', 'kaziranga', 'sundarbans', 'wildlife'],
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1600&auto=format&fit=crop&q=80',
  },
  {
    terms: ['hampi', 'ajanta', 'ellora', 'badami', 'pattadakal', 'heritage', 'temple'],
    image: 'https://images.unsplash.com/photo-1600100397608-f010e461cc80?w=1600&auto=format&fit=crop&q=80',
  },
]

function normalizeImages(images?: string[] | null): string[] {
  return Array.isArray(images) ? images.filter((image) => typeof image === 'string' && image.trim().length > 0) : []
}

export function getRelatedPackageImages(source: PackageImageSource): string[] {
  const existingImages = normalizeImages(source.images)
  if (existingImages.length > 0) return existingImages

  const haystack = [source.slug, source.title, source.destination, source.category]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  for (const rule of IMAGE_RULES) {
    if (rule.terms.some((term) => haystack.includes(term))) {
      return [rule.image]
    }
  }

  const category = (source.category || '').toUpperCase()
  return [CATEGORY_IMAGES[category] || DEFAULT_IMAGE]
}
