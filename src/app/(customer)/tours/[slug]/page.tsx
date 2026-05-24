import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { MapPinIcon, StarIcon } from '@heroicons/react/24/outline'
import TourDetailTabs from '@/components/packages/TourDetailTabs'
import TourBookingSidebar from '@/components/packages/TourBookingSidebar'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

// ─── Custom Icons for PACKAGE INCLUDES ──────────────────────────────────────────

const HotelIcon = (props: React.ComponentProps<'svg'>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
  </svg>
)

const TransportIcon = (props: React.ComponentProps<'svg'>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.75a1.125 1.125 0 0 1-1.125-1.125V15h9.75M8.25 18.75h6m3 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.5a1.125 1.125 0 0 0 1.125-1.125v-9.25A2.25 2.25 0 0 0 15.75 6h-2.25m3.75 12.75v-3H8.25v-3.75M13.5 6h-7.5A2.25 2.25 0 0 0 3.75 8.25v3.75m0 0h9.75V6" />
  </svg>
)

const MealsIcon = (props: React.ComponentProps<'svg'>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 3v7a6 6 0 0 0 4 5.65V21M17 3v18M20 8a3 3 0 0 0-3-3h0a3 3 0 0 0-3 3" />
  </svg>
)

const SightseeingIcon = (props: React.ComponentProps<'svg'>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
  </svg>
)

// ─── Description Generator Helper ──────────────────────────────────────────────

function getDetailedTourDescription(
  slug: string,
  title: string,
  destination: string,
  category: string,
  originalDescription: string
): string[] {
  const normalizedSlug = slug.toLowerCase()

  if (normalizedSlug.includes('char-dham') || normalizedSlug.includes('dham')) {
    return [
      "Begin a sacred Himalayan pilgrimage with our Char Dham Yatra Group Tour Package From Delhi, specially planned for devotees seeking spiritual peace, divine blessings, and a comfortable travel experience through the holy land of Uttarakhand. Covering the four revered shrines of Yamunotri Temple, Gangotri Temple, Kedarnath Temple, and Badrinath Temple, this yatra holds immense spiritual importance for Hindu devotees across the country.",
      "The journey takes travelers through beautiful Himalayan valleys, riverside towns, mountain roads, and spiritually significant destinations including Haridwar, Rishikesh, Uttarkashi, Guptkashi, and Joshimath. Devotees can witness the sacred confluences of rivers, attend evening Ganga Aartis, visit ancient temples, and experience the peaceful atmosphere of the Himalayas throughout the yatra. Highlights such as Mana Village, Tapt Kund, Bhim Pul, and the spiritual surroundings of Kedarnath and Badrinath make the journey even more memorable.",
      "This Delhi to Char Dham Yatra Group Tour is ideal for families, senior citizens, pilgrims, and spiritual travelers looking for a well-managed and meaningful pilgrimage experience. With comfortable stays, guided assistance, transportation, and thoughtfully planned travel arrangements, these char dham yatra tour packages from Delhi offer a peaceful and memorable Spiritual Trip to Char Dham filled with devotion, blessings, and unforgettable Himalayan experiences."
    ]
  }

  if (normalizedSlug.includes('golden-triangle')) {
    return [
      `Begin a majestic journey through India's rich history with our Golden Triangle Tour, specially planned for travellers seeking cultural heritage, royal fortresses, and vibrant local markets. Covering the three historic cities of Delhi, Agra, and Jaipur, this classic tour holds immense historical importance and showcases the architectural marvels of the Mughal and Rajput eras.`,
      `The journey takes travellers through bustling old bazaars, magnificent heritage palaces, and iconic landmarks including the Taj Mahal, Amber Fort, and the Red Fort. Travellers can witness the white-marble beauty of the Taj Mahal at sunrise, attend royal palace walks, explore local handicrafts, and enjoy authentic North Indian cuisine throughout the trip. Highlights such as Hawa Mahal, Qutub Minar, and Fatehpur Sikri make this historical trip truly unforgettable.`,
      `This Delhi to Agra and Jaipur Golden Triangle Tour is ideal for families, history buffs, and first-time visitors looking for a well-managed and meaningful cultural experience. With premium stays, guided historical walks, private air-conditioned transport, and thoughtfully planned sightseeing, this tour offers a comfortable and memorable journey filled with royalty, history, and vibrant Indian hospitality.`
    ]
  }

  if (normalizedSlug.includes('kashmir')) {
    return [
      `Escape to the paradise on earth with our Kashmir Tour Package, specially planned for solo travellers and peace seekers wanting beautiful snow-capped landscapes, shikara rides, and cozy houseboat stays. Covering the beautiful destinations of Srinagar, Gulmarg, and Pahalgam, this trip holds immense appeal for nature lovers looking to find peace and adventure.`,
      `The journey takes travellers through spectacular alpine valleys, blooming Mughal gardens, rushing mountain rivers, and snow-filled meadows. Travellers can experience a traditional Shikara boat ride on Dal Lake, ride the famous Gulmarg Gondola cable car, and walk along the scenic Lidder River in Pahalgam. Highlights such as Betaab Valley, Shalimar Bagh, and local saffron shopping make the journey even more memorable.`,
      `This Kashmir Solo Retreat is ideal for independent explorers, photography enthusiasts, and budget-conscious travellers seeking a safe, well-guided, and serene mountain holiday. With cozy houseboat accommodations, comfortable transport, and local guides who know the mountains, this tour offers an unforgettable Himalayan getaway filled with snow, beauty, and warm Kashmiri hospitality.`
    ]
  }

  if (normalizedSlug.includes('goa')) {
    return [
      `Bask in the warm sunshine and vibrant vibes of India's favorite coastal destination with our Goa Beach Holiday Group Package. Specially curated for friends, families, and beach lovers, this tour is designed to deliver a refreshing combination of pristine sandy beaches, rich Portuguese history, and energetic local nightlife.`,
      `The journey takes travelers through the lively beaches of North Goa, the historic streets of Old Goa, and the serene coastal stretches of South Goa. Travelers can engage in thrilling water sports such as parasailing, jet skiing, and banana boat rides, explore the ancient walls of Fort Aguada, and enjoy fresh seafood at beachside shacks. Highlights like the Basilica of Bom Jesus, Dudhsagar Falls, and cruises on the Mandovi River make this beach holiday incredibly dynamic.`,
      `This Goa Group Tour is ideal for young professionals, couples, and leisure travelers seeking a lively yet relaxing beach escape. With comfortable beach resorts, coordinated sightseeing transport, and pre-arranged water activities, this package offers a seamless, fun-filled getaway filled with coastal charm, sunshine, and memorable beach adventures.`
    ]
  }

  if (normalizedSlug.includes('kerala')) {
    return [
      `Discover the tranquil charm of "God's Own Country" with our Kerala Solo Retreat, designed specifically for solo travelers wanting an immersive experience in tropical landscapes, peaceful backwaters, and lush spice plantations. Covering Kochi, Munnar, Alleppey, and Kovalam, this itinerary provides the perfect blend of colonial history, misty hills, and coastal relaxation.`,
      `The journey takes travelers through the historic lanes of Fort Kochi with its Chinese fishing nets, the tea-clad slopes of Munnar, and the pristine, palm-fringed backwaters of Alleppey. Travelers can stay on a traditional private houseboat, go on a boat safari in Periyar Wildlife Sanctuary, and relax on the crescent-shaped beaches of Kovalam. Highlights like the Munnar Tea Museum, Kathakali dance performances, and traditional Ayurvedic massage sessions make this retreat deeply rejuvenating.`,
      `This Kerala Solo Tour is ideal for writers, wellness seekers, and independent travelers wanting a safe, culturally rich, and peaceful holiday. With boutique stays, private backwater cruising, coordinated transfers, and helpful local guidance, this retreat ensures a comfortable and deeply satisfying journey into Kerala's natural wonders.`
    ]
  }

  if (normalizedSlug.includes('ladakh')) {
    return [
      `Set out on a high-altitude expedition of a lifetime with our Ladakh Adventure Tour, specially designed for adventure enthusiasts, bikers, and photographers seeking the raw beauty of the trans-Himalayan region. Crossing some of the highest motorable passes in the world, this tour leads to the stunning valleys, ancient monasteries, and deep blue lakes of Leh-Ladakh.`,
      `The journey takes travelers through the rugged terrain of Leh, the scenic Nubra Valley, and the famous high-altitude Pangong Lake. Travelers can ride double-humped Bactrian camels in the sand dunes of Hunder, witness the spiritual grandeur of Thiksey and Hemis monasteries, and camp under a starlit sky right beside the azure waters of Pangong Tso. Highlights like driving over Khardung La, exploring Leh Palace, and witnessing the confluence of Indus and Zanskar rivers make this trip an unforgettable thrill.`,
      `This Ladakh Tour is ideal for thrill-seekers, group adventurers, and road-trip lovers looking for an expertly managed mountain tour. With safe high-altitude camping, robust SUV transfers, inner-line permit assistance, and experienced adventure guides, this tour offers a safe, thrilling, and jaw-dropping adventure across the roof of the world.`
    ]
  }

  // Fallback dynamic generator using the package fields
  const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
  return [
    `Embark on an unforgettable vacation with our premium ${title} package, specially designed to offer you a comfortable and immersive travel experience in ${destination}. Curated for travellers seeking a perfect blend of exploration, local sightseeing, and relaxation, this tour showcases the best attractions and hidden treasures of the region.`,
    `The journey takes you through iconic landmarks, scenic viewpoints, and local hotspots. Travellers can experience the rich culture, taste authentic local cuisine, and participate in immersive activities unique to ${destination}. Highlights of this package include guided city walks, beautiful nature trails, and specially selected excursions designed to make every day of your trip memorable.`,
    `This ${capitalizedCategory} tour is ideal for families, groups, or solo explorers looking for a well-managed and hassle-free holiday. With premium accommodations, comfortable transfers, and professional local assistance, this package provides a seamless and memorable travel experience from start to finish. ${originalDescription}`
  ]
}

// ─── Detailed Itinerary Helper ──────────────────────────────────────────────

function getDetailedItinerary(slug: string, originalItinerary: { day: number; title: string; description: string }[]): { day: number; title: string; description: string }[] {
  const normalizedSlug = slug.toLowerCase()

  if (normalizedSlug.includes('char-dham') || normalizedSlug.includes('dham')) {
    const data = [
      { day: 1, title: 'Delhi - Haridwar', description: 'Pick up from Delhi and transfer to Haridwar\nIn the evening, we will take you to Har-Ki-Pauri for Worship of Holy Ganges.\nCheck-in to hotel\nDinner\nOvernight stay at hotel.' },
      { day: 2, title: 'Haridwar - Barkot', description: 'Early morning after breakfast check out and proceed to Barkot.\nReach Barkot via Mussoorie and Kempty Falls\nCheck-in to hotel/camp and rest in leisure\nDinner and overnight stay at Barkot.' },
      { day: 3, title: 'Yamunotri Darshan', description: 'Barkot - Yamunotri - Barkot (42 Kms drive & 5 Kms Trek each side)\nEarly morning (4:00 AM) drive to Jankichatti (42 Kms approx), start 5 Kms trek from Janki Chatti to Yamunotri either by walk, doli or by horse at own cost.\nOn arrival at Yamunotri, take bath in hot Jamunabai Kund then go for Temple darshan.\nLater trek down to Jankichatti and then drive back to Barkot.\nOvernight stay at Barkot hotel.' },
      { day: 4, title: 'Barkot - Uttarkashi', description: 'Barkot - Uttarkashi (95 Kms, 4 hours approx)\nMorning after breakfast check out from the hotel and drive to Uttarkashi.\nEnroute visit Prakateshwar Mahadev cave temple.\nVisit famous Kashi Vishwanath Temple in Uttarkashi.\nCheck-in to hotel and rest in leisure.\nDinner and overnight stay at Uttarkashi.' },
      { day: 5, title: 'Gangotri Darshan', description: 'Uttarkashi - Gangotri - Uttarkashi (100 Kms approx each side)\nEarly morning (4:00 AM to 5:00 AM) drive to Gangotri via Harsil valley.\nAt Gangotri take a holy dip in the river Ganga (also called Bhagirathi at its origin).\nGo for temple darshan and offer prayers.\nLater drive back to Uttarkashi and overnight stay at Uttarkashi hotel.' },
      { day: 6, title: 'Uttarkashi - Guptkashi', description: 'Uttarkashi - Guptkashi (223 Kms, 9 - 10 Hours Approx)\nMorning (7:00 AM) after breakfast check out from the hotel and drive to Guptkashi.\nEnroute visit Dhari Devi Temple (if time permits).\nOn arrival at Guptkashi check-in to the hotel.\nDinner and overnight stay at Guptkashi hotel.' },
      { day: 7, title: 'Guptkashi - Kedarnath', description: 'Guptkashi - Sonprayag - Kedarnath (30 Kms drive & 16 Kms trek)\nEarly morning checkout from the hotel and drive to Sonprayag/Gaurikund.\nStart the 16 Kms trek to Kedarnath temple either by walk, doli or pony.\nIn the evening visit Kedarnath Temple for Aarti and visit Shankaracharya Samadhi.\nOvernight stay at Kedarnath (in camps/guest houses).' },
      { day: 8, title: 'Kedarnath - Guptkashi', description: 'Kedarnath - Gaurikund - Guptkashi (16 Kms trek & 30 Kms drive)\nEarly morning go for temple darshan, and then trek down to Gaurikund/Sonprayag.\nReach cab parking and proceed back to Guptkashi hotel.\nCheck-in to the hotel, rest, and relax.\nDinner and overnight stay at Guptkashi.' },
      { day: 9, title: 'Guptkashi - Pipalkoti / Joshimath', description: 'Morning after breakfast drive to Pipalkoti/Joshimath.\nEn-route visit Rudraprayag (Sangam of Alaknanda & Mandakini River) and Karnaprayag (Sangam of Alaknanda & Pindar River).\nOn arrival check-in to the hotel.\nDinner and overnight stay at Joshimath/Pipalkoti.' },
      { day: 10, title: 'Badrinath Darshan', description: 'Joshimath - Badrinath (45 Kms, 2 hours approx)\nMorning proceed to Badrinath via Vishnuprayag.\nTake a holy bath in Tapt Kund hot springs, then go for Badrinath Temple darshan.\nAfter darshan, visit Mana Village (the last village before Tibet border) including Vyas Gufa, Ganesh Gufa and Bhim Pul.\nEvening return to Hotel, dinner and overnight stay.' },
      { day: 11, title: 'Joshimath - Rishikesh / Haridwar', description: 'Joshimath/Pipalkoti to Rishikesh/Haridwar (250 Kms approx)\nMorning after breakfast drive to Rishikesh.\nEnroute visit Devprayag (Sangam of Alaknanda & Bhagirathi Rivers forming Ganga).\nReach Rishikesh, visit Laxman Jhula, Ram Jhula and attend evening Ganga Aarti at Triveni Ghat.\nTransfer to Haridwar hotel for overnight stay.' },
      { day: 12, title: 'Haridwar/Rishikesh - Delhi', description: 'Haridwar/Rishikesh to Delhi (250 Kms approx)\nMorning after breakfast checkout from hotel and depart for Delhi.\nDrop at Delhi airport or railway station.\nYatra ends with wonderful blessings & everlasting memories.' }
    ]
    return mergeItineraries(originalItinerary, data)
  }

  if (normalizedSlug.includes('golden-triangle')) {
    const data = [
      { day: 1, title: 'Arrival in Delhi', description: 'Arrive at Indira Gandhi International Airport, Delhi.\nWarm welcome by our representative and transfer to hotel.\nCheck-in and relax at leisure.\nEvening visit to India Gate and Connaught Place bazaar.\nDinner and overnight stay at Delhi hotel.' },
      { day: 2, title: 'Delhi Sightseeing', description: 'Morning breakfast at hotel.\nFull day guided tour of Old and New Delhi.\nVisit Red Fort, Jama Masjid, and enjoy a rickshaw ride in Chandni Chowk.\nAfternoon visit Qutub Minar, Humayun\'s Tomb, and Lotus Temple.\nDrive past President House and Parliament.\nDinner and overnight stay at Delhi.' },
      { day: 3, title: 'Delhi to Agra & Taj Mahal', description: 'Breakfast checkout, drive to Agra via Yamuna Expressway.\nCheck-in to Agra hotel.\nVisit the magnificent Taj Mahal at sunset.\nDiscover the local marble inlay art shops.\nDinner and overnight stay at Agra.' },
      { day: 4, title: 'Agra to Jaipur via Fatehpur Sikri', description: 'Morning breakfast checkout.\nVisit the historic Agra Fort.\nDrive to Jaipur, enroute visit Fatehpur Sikri (the ghost city of Akbar).\nArrive in Jaipur (Pink City) and check-in.\nEvening visit to Chokhi Dhani for traditional Rajasthani dinner.\nOvernight stay at Jaipur.' },
      { day: 5, title: 'Jaipur Sightseeing', description: 'Breakfast at hotel.\nMorning excursion to Amber Fort with an elephant ride or jeep ride.\nVisit Jal Mahal (Water Palace) and Hawa Mahal (Palace of Winds).\nExplore City Palace and Jantar Mantar observatory.\nEvening shopping for gems and textiles.\nDinner and overnight stay at Jaipur.' },
      { day: 6, title: 'Jaipur to Delhi Departure', description: 'Breakfast checkout.\nMorning free for last-minute shopping.\nDrive back to Delhi airport or railway station.\nReturn home with beautiful heritage memories.' }
    ]
    return mergeItineraries(originalItinerary, data)
  }

  if (normalizedSlug.includes('kashmir')) {
    const data = [
      { day: 1, title: 'Arrival in Srinagar & Shikara Ride', description: 'Arrive at Srinagar airport.\nTransfer to deluxe Houseboat on Dal Lake.\nAfternoon Shikara ride on the lake, visiting floating gardens.\nExperience the unique floating markets.\nDinner and overnight stay on Houseboat.' },
      { day: 2, title: 'Srinagar Mughal Gardens Sightseeing', description: 'Breakfast on houseboat, check-out and check-in to Srinagar hotel.\nVisit famous Mughal Gardens: Nishat Bagh and Shalimar Bagh.\nExplore Chashme Shahi and Pari Mahal.\nEvening visit to Shankaracharya Temple.\nDinner and overnight stay at Srinagar.' },
      { day: 3, title: 'Srinagar to Gulmarg Day Trip', description: 'Breakfast at hotel.\nExcursion to Gulmarg (Meadow of Flowers).\nEnjoy Gondola Cable Car Ride (at own cost) to Apharwat Peak.\nWalk in the lush green/snowy meadows of Gulmarg.\nReturn to Srinagar for dinner and overnight stay.' },
      { day: 4, title: 'Srinagar to Pahalgam', description: 'Breakfast checkout, drive to Pahalgam (Valley of Shepherds).\nEnroute visit saffron fields of Pampore and ruins of Avantipur.\nArrive in Pahalgam and check-in to hotel.\nDinner and overnight stay at Pahalgam.' },
      { day: 5, title: 'Pahalgam Exploration', description: 'Breakfast at hotel.\nVisit Betaab Valley, Aru Valley, and Chandanwari by local taxi.\nEnjoy pony rides and riverside walks along the Lidder River.\nRelax in the pine forests.\nDinner and overnight stay at Pahalgam.' },
      { day: 6, title: 'Pahalgam to Srinagar Return', description: 'Breakfast checkout.\nDrive back to Srinagar.\nCheck-in to hotel.\nAfternoon free for shopping of Pashmina shawls, dry fruits, and handicrafts.\nDinner and overnight stay at Srinagar.' },
      { day: 7, title: 'Departure from Srinagar', description: 'Breakfast checkout.\nTransfer to Srinagar airport.\nTour ends with sweet memories of Kashmir.' }
    ]
    return mergeItineraries(originalItinerary, data)
  }

  if (normalizedSlug.includes('goa')) {
    const data = [
      { day: 1, title: 'Arrival in Goa', description: 'Arrive at Goa Airport/Railway Station.\nTransfer to beach resort in North Goa.\nCheck-in and spend day at leisure.\nEvening stroll at Calangute Beach.\nDinner and overnight stay at Goa hotel.' },
      { day: 2, title: 'North Goa Beaches & Forts', description: 'Breakfast at resort.\nVisit Fort Aguada and Chapora Fort.\nExplore Anjuna Beach, Baga Beach, and Vagator Beach.\nEnjoy a beach party and local Goan cuisine.\nDinner and overnight stay at resort.' },
      { day: 3, title: 'Water Sports Adventure', description: 'Breakfast at resort.\nFull day water sports package at Baga beach.\nExperience parasailing, banana boat ride, jet-ski, and bumper ride.\nEvening shopping at local flea markets.\nDinner and overnight stay at Goa.' },
      { day: 4, title: 'South Goa Heritage & Waterfalls', description: 'Breakfast at resort.\nVisit Old Goa Churches: Basilica of Bom Jesus.\nExplore Mangueshi Temple and local spice plantation.\nVisit Miramar Beach and enjoy a sunset cruise on Mandovi River.\nDinner and overnight stay at resort.' },
      { day: 5, title: 'Departure from Goa', description: 'Breakfast checkout.\nFree morning for souvenir shopping.\nTransfer to airport/station for departure.\nTour ends with memorable beach vibes.' }
    ]
    return mergeItineraries(originalItinerary, data)
  }

  if (normalizedSlug.includes('kerala')) {
    const data = [
      { day: 1, title: 'Arrival in Kochi', description: 'Arrive at Cochin International Airport.\nTransfer to hotel.\nAfternoon visit Fort Kochi, St. Francis Church, and Chinese Fishing Nets.\nAttend a traditional Kathakali dance show.\nDinner and overnight stay at Kochi.' },
      { day: 2, title: 'Kochi to Munnar', description: 'Breakfast checkout.\nDrive to Munnar, enjoying scenic views of Valara and Cheeyappara waterfalls.\nCheck-in to Munnar resort.\nOvernight stay at Munnar.' },
      { day: 3, title: 'Munnar Tea Gardens Sightseeing', description: 'Breakfast at resort.\nVisit Tea Museum and Eravikulam National Park (home to Nilgiri Tahr).\nVisit Mattupetty Dam, Echo Point, and Kundala Lake.\nDinner and overnight stay at Munnar.' },
      { day: 4, title: 'Munnar to Thekkady', description: 'Breakfast checkout.\nDrive to Thekkady (Periyar Tiger Reserve).\nGo on a boat safari in Periyar Lake.\nExplore the local spice plantations.\nDinner and overnight stay at Thekkady.' },
      { day: 5, title: 'Thekkady to Alleppey Houseboat', description: 'Breakfast checkout, drive to Alleppey.\nBoard deluxe Houseboat for backwater cruise.\nWatch local village life from the houseboat.\nDinner and overnight stay on Houseboat.' },
      { day: 6, title: 'Houseboat to Kovalam Beach', description: 'Breakfast checkout from houseboat.\nDrive to Kovalam.\nCheck-in to beach resort.\nEvening relax on Kovalam Beach.\nDinner and overnight stay at Kovalam.' },
      { day: 7, title: 'Kovalam & Kanyakumari Excursion', description: 'Breakfast at resort.\nDay trip to Kanyakumari to visit Vivekananda Rock Memorial.\nWitness the sunset at the confluence of three oceans.\nReturn to Kovalam for dinner and overnight stay.' },
      { day: 8, title: 'Departure from Trivandrum', description: 'Breakfast checkout.\nTransfer to Trivandrum Airport.\nTour ends with relaxing Kerala memories.' }
    ]
    return mergeItineraries(originalItinerary, data)
  }

  if (normalizedSlug.includes('ladakh')) {
    const data = [
      { day: 1, title: 'Arrival in Leh', description: 'Arrive at Kushok Bakula Rimpochee Airport, Leh.\nTransfer to hotel and check-in.\nFull day of complete rest for acclimatization to high altitude (3500m).\nEvening walk around the local Leh market and Main Bazaar.\nDinner and overnight stay at Leh hotel.' },
      { day: 2, title: 'Leh Sightseeing & Acclimatization', description: 'Morning breakfast at hotel.\nVisit the famous Shanti Stupa for panoramic views of Leh town.\nExplore the historic Leh Palace built in the 17th century.\nVisit Hall of Fame war museum.\nDinner and overnight stay at Leh hotel.' },
      { day: 3, title: 'Monasteries Tour', description: 'Breakfast at hotel.\nFull day sightseeing of Indus Valley Monasteries.\nVisit Hemis Monastery, the wealthiest and largest monastery in Ladakh.\nVisit Thiksey Monastery, famous for its similarity to Potala Palace.\nExplore Shey Palace and its gold-covered copper statue of Buddha.\nDinner and overnight stay at Leh.' },
      { day: 4, title: 'Leh to Nubra Valley via Khardung La', description: 'Early morning breakfast at hotel.\nDrive to Nubra Valley via Khardung La (5602 meters), the highest motorable road in the world.\nEnroute stop for scenic photos at the pass.\nCheck-in to luxury camps at Hunder.\nOvernight stay in Hunder camps.' },
      { day: 5, title: 'Nubra Valley Exploration', description: 'Morning breakfast at camps.\nVisit Diskit Monastery and see the giant 32-meter Maitreya Buddha statue.\nEnjoy double-humped Bactrian camel safari in Hunder sand dunes.\nExplore Sumur village and local hot springs.\nDinner and overnight stay in Hunder camps.' },
      { day: 6, title: 'Nubra Valley to Pangong Lake', description: 'Breakfast checkout.\nDrive to Pangong Lake via Shyok route.\nWitness the mesmerizing blue waters of Pangong Tso Lake (4350m).\nCheck-in to lakeside camps.\nDinner and bonfire overnight stay at Pangong camps.' },
      { day: 7, title: 'Sunrise at Pangong Lake', description: 'Early morning walk by the lake to witness the beautiful sunrise.\nFull day at leisure to explore the lake surroundings.\nPerfect opportunity for landscape photography.\nRelax and enjoy the serene blue lake views.\nOvernight stay at Pangong camps.' },
      { day: 8, title: 'Pangong Lake to Leh via Chang La', description: 'Breakfast checkout.\nDrive back to Leh via Chang La pass (5360m).\nStop at Karu for lunch and shopping.\nArrive in Leh, check-in to hotel.\nEvening free for souvenir shopping in Leh.\nFarewell dinner and overnight stay at Leh hotel.' },
      { day: 9, title: 'Departure from Leh', description: 'Early breakfast checkout.\nTransfer to Leh airport for departure flight.\nTour ends with thrilling memories of Ladakh.' }
    ]
    return mergeItineraries(originalItinerary, data)
  }

  return originalItinerary
}

function mergeItineraries(
  original: { day: number; title: string; description: string }[],
  mocked: { day: number; title: string; description: string }[]
): { day: number; title: string; description: string }[] {
  return original.map(item => {
    const match = mocked.find(m => m.day === item.day)
    return match ? { ...item, title: match.title, description: match.description } : item
  })
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params
  const session = await getServerSession(authOptions)

  if (!slug) return notFound()

  const pkg = await prisma.package.findUnique({
    where: { slug },
    include: {
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' }
      },
      tripDates: {
        where: { startDate: { gte: new Date() } },
        orderBy: { startDate: 'asc' }
      }
    }
  })

  if (!pkg || !pkg.isActive) return notFound()

  const itinerary = getDetailedItinerary(
    pkg.slug,
    pkg.itinerary as Array<{
      day: number
      title: string
      description: string
    }>
  )

  const avgRating = pkg.reviews.length
    ? (pkg.reviews.reduce((sum, r) => sum + r.rating, 0) / pkg.reviews.length).toFixed(1)
    : null
  
  const category = pkg.category === 'HONEYMOON' ? 'SOLO' : pkg.category

  // Map package data for tabs to consume safely
  const packageDataForTabs = {
    id: pkg.id,
    title: pkg.title,
    price: pkg.price,
    duration: pkg.duration,
    itinerary: itinerary,
    inclusions: pkg.inclusions,
    exclusions: pkg.exclusions,
    tripDates: pkg.tripDates.map((td) => ({
      id: td.id,
      startDate: td.startDate.toISOString(),
      totalSeats: td.totalSeats,
      availableSeats: td.availableSeats,
    })),
    reviews: pkg.reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
      user: { name: r.user.name },
    })),
    category: category,
  }

  const descriptionParagraphs = getDetailedTourDescription(pkg.slug, pkg.title, pkg.destination, pkg.category, pkg.description)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Breadcrumbs */}
      <div className="mb-5 text-sm font-semibold text-slate-600 dark:text-slate-400">
        <Link href="/" className="hover:text-orange-600 transition">Home</Link>
        {' / '}
        <Link href="/tours" className="hover:text-orange-600 transition">All Packages</Link>
        {' / '}
        <span className="text-slate-900 dark:text-white">{pkg.title}</span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content Area (Left/Center) */}
        <div className="space-y-7 lg:col-span-2">
          {/* Tour Image Gallery */}
          <div className="surface-card grid grid-cols-2 gap-2 overflow-hidden rounded-3xl p-2">
            {pkg.images.slice(0, 4).map((img, i) => (
              <div key={i} className={`relative overflow-hidden rounded-2xl ${i === 0 ? 'col-span-2 h-64 md:h-96' : 'h-40 md:h-52'}`}>
                <Image
                  src={img}
                  alt={`${pkg.title} photo ${i + 1}`}
                  fill
                  sizes={i === 0 ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 1024px) 50vw, 25vw'}
                  className="object-cover transition duration-500 hover:scale-102"
                />
              </div>
            ))}
            {pkg.images.length === 0 && (
              <div className="col-span-2 flex h-64 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-neutral-900">
                No images available
              </div>
            )}
          </div>

          {/* Header Summary Section */}
          <section className="surface-card rounded-3xl p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700 dark:bg-orange-950/40 dark:text-orange-400">
                  {category}
                </span>
                <h1 className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{pkg.title}</h1>
                <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  <MapPinIcon className="h-4 w-4 text-orange-500" />
                  {pkg.destination}
                </p>
              </div>
              {avgRating && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-center dark:border-amber-900/30 dark:bg-amber-950/20">
                  <div className="inline-flex items-center gap-1 text-lg font-black text-amber-600 dark:text-amber-400">
                    <StarIcon className="h-5 w-5" />
                    {avgRating}
                  </div>
                  <div className="text-xs font-bold text-amber-700 dark:text-amber-500">{pkg.reviews.length} reviews</div>
                </div>
              )}
            </div>
            
            <div className="mt-6 border-t border-slate-100 pt-5 dark:border-neutral-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">About this tour</h3>
              <div className="mt-3 space-y-4">
                {descriptionParagraphs.map((para, idx) => (
                  <p key={idx} className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Package Includes Section */}
            <div className="mt-8 border-t border-slate-100 pt-6 dark:border-neutral-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                PACKAGE INCLUDES
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: 'Hotel', Icon: HotelIcon },
                  { label: 'Transport', Icon: TransportIcon },
                  { label: 'Meals', Icon: MealsIcon },
                  { label: 'Sightseeing', Icon: SightseeingIcon },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center rounded-2xl bg-slate-50/70 p-4 text-center dark:bg-neutral-900/20 border border-slate-100/60 dark:border-neutral-800/20 transition hover:bg-slate-100/50 dark:hover:bg-neutral-900/40"
                  >
                    <item.Icon className="h-6 w-6 text-orange-500" />
                    <span className="mt-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Tabbed Interactive Information Container */}
          <TourDetailTabs pkg={packageDataForTabs} sessionUserId={session?.user?.id} />
        </div>

        {/* Sidebar Area (Right) */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <TourBookingSidebar
              packageId={pkg.id}
              title={pkg.title}
              price={pkg.price}
              duration={pkg.duration}
              category={pkg.category}
              destination={pkg.destination}
              tripDates={pkg.tripDates.map((td) => ({
                id: td.id,
                startDate: td.startDate.toISOString(),
                totalSeats: td.totalSeats,
                availableSeats: td.availableSeats,
              }))}
            />
          </div>
        </aside>
      </div>
    </div>
  )
}
