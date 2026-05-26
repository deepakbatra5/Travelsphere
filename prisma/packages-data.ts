export interface SeedPackage {
  title: string;
  slug: string;
  destination: string;
  description: string;
  price: number;
  duration: number;
  category: 'FAMILY' | 'HONEYMOON' | 'GROUP' | 'SOLO' | 'PILGRIMAGE' | 'ADVENTURE' | 'CORPORATE' | 'COUPLE';
  images: string[];
  itinerary: { day: number; title: string; description: string }[];
  inclusions: string[];
  exclusions: string[];
  isFeatured?: boolean;
}

export const packagesData: SeedPackage[] = [
  // --- NORTH INDIA (12 Packages) ---
  {
    title: "Golden Triangle Tour",
    slug: "golden-triangle-tour",
    destination: "Delhi - Agra - Jaipur",
    description: "Experience the ultimate introduction to India's historical riches. Visit the iconic Taj Mahal, majestic Amber Fort, and Delhi's vibrant markets.",
    price: 15999,
    duration: 6,
    category: "FAMILY",
    images: ["https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"],
    itinerary: [
      { day: 1, title: "Arrival in Delhi", description: "Arrive in Delhi. Check-in to hotel. Evening visit India Gate and Connaught Place." },
      { day: 2, title: "Delhi Sightseeing", description: "Full day tour of Old and New Delhi: Red Fort, Jama Masjid, Qutub Minar, and Humayun's Tomb." },
      { day: 3, title: "Delhi to Agra", description: "Drive to Agra. Check-in at hotel. Enjoy sunset view of the Taj Mahal from Mehtab Bagh." },
      { day: 4, title: "Agra to Jaipur", description: "Sunrise visit to the Taj Mahal. Visit Agra Fort, then drive to Jaipur via Fatehpur Sikri." },
      { day: 5, title: "Jaipur Sightseeing", description: "Visit Amber Fort with elephant/jeep ride, Hawa Mahal, City Palace, and Jantar Mantar." },
      { day: 6, title: "Jaipur to Delhi & Departure", description: "Drive back to Delhi and transfer to airport or railway station." }
    ],
    inclusions: ["3-Star Hotel Stay", "Breakfast Included", "AC Sedan for all transfers", "Local Tour Guides", "Taxes & Tolls"],
    exclusions: ["Flight/Train tickets", "Monument Entry fees", "Lunch & Dinner", "Tips & Personal expenses"],
    isFeatured: true
  },
  {
    title: "Kashmir Paradise Escape",
    slug: "kashmir-paradise-escape",
    destination: "Srinagar - Gulmarg - Pahalgam",
    description: "Immerse yourself in the breathtaking beauty of Kashmir. Stay in houseboats, ride Shikaras on Dal Lake, and see the snow-covered peaks of Gulmarg.",
    price: 24999,
    duration: 7,
    category: "HONEYMOON",
    images: ["https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800"],
    itinerary: [
      { day: 1, title: "Srinagar Arrival & Houseboat Stay", description: "Arrive at Srinagar airport. Transfer to a premium houseboat on Dal Lake. Evening Shikara ride." },
      { day: 2, title: "Srinagar Mughal Gardens Tour", description: "Explore the Shalimar Bagh, Nishat Bagh, and Chashme Shahi. Visit Shankaracharya Temple." },
      { day: 3, title: "Srinagar to Gulmarg Day Trip", description: "Excursion to Gulmarg. Enjoy the Gondola cable car ride to phase 1 and phase 2 peaks." },
      { day: 4, title: "Srinagar to Pahalgam Transfer", description: "Drive to Pahalgam. En route visit saffron fields at Pampore. Check-in to hotel." },
      { day: 5, title: "Exploring Pahalgam Valleys", description: "Visit Aru Valley, Betaab Valley, and Chandanwari by local taxi." },
      { day: 6, title: "Pahalgam to Srinagar & Shopping", description: "Return to Srinagar. Afternoon free for shopping of shawls, carpets, and dry fruits." },
      { day: 7, title: "Departure from Srinagar", description: "Transfer to Srinagar Airport for your onward journey." }
    ],
    inclusions: ["1 Night Houseboat, 5 Nights Hotel", "Breakfast & Dinner", "Shikara Ride on Dal Lake", "All airport transfers", "Toll, Parking & Fuel"],
    exclusions: ["Gondola tickets in Gulmarg", "Pony rides", "Betaab Valley local vehicle", "Airfare"],
    isFeatured: true
  },
  {
    title: "Scenic Shimla & Manali Tour",
    slug: "scenic-shimla-manali-tour",
    destination: "Shimla - Kufri - Manali - Solang Valley",
    description: "Explore the beautiful hill stations of Himachal. Experience colonial charm in Shimla and thrilling adventure sports in Manali.",
    price: 18500,
    duration: 6,
    category: "FAMILY",
    images: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800"],
    itinerary: [
      { day: 1, title: "Delhi to Shimla Drive", description: "Morning pickup from Delhi. Scenic 8-hour drive to Shimla. Check-in at hotel." },
      { day: 2, title: "Shimla & Kufri Sightseeing", description: "Visit Kufri for snow activities and horse riding. Evening stroll on Mall Road, Ridge, and Jakhoo Temple." },
      { day: 3, title: "Shimla to Manali via Kullu", description: "Drive to Manali. En route visit Pandoh Dam, Sundernagar Lake, and Kullu shawl factories. River rafting optional." },
      { day: 4, title: "Manali Local Sightseeing", description: "Visit Hadimba Temple, Vashisht Hot Springs, Tibetan Monastery, and Club House." },
      { day: 5, title: "Solang Valley Adventure Day", description: "Excursion to Solang Valley for paragliding, zorbing, and quad biking. Visit Atal Tunnel if open." },
      { day: 6, title: "Manali to Delhi Departure", description: "Check-out and drive back to Delhi. Drop at Airport/Railway Station." }
    ],
    inclusions: ["Deluxe Hotel Stay", "Breakfast & Dinner", "AC Cab for entire trip", "Shimla-Manali sightseeing", "State taxes & Tolls"],
    exclusions: ["Adventure sports fees", "Atal Tunnel local permission charges", "Lunch", "Personal expenses"]
  },
  {
    title: "Leh Ladakh Adventure Caravan",
    slug: "leh-ladakh-adventure-caravan",
    destination: "Leh - Nubra Valley - Pangong Lake",
    description: "The ultimate road trip. Ride over the Khardung La pass, experience sand dunes in Nubra, and camp next to the stunning blue Pangong Tso.",
    price: 31999,
    duration: 8,
    category: "ADVENTURE",
    images: ["https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800"],
    itinerary: [
      { day: 1, title: "Leh Airport Arrival & Acclimatization", description: "Arrive in Leh. Rest of the day free to acclimatize to high altitude. Overnight in Leh." },
      { day: 2, title: "Leh Local Monasteries & Hall of Fame", description: "Visit Leh Palace, Shanti Stupa, Hall of Fame, and Magnetic Hill." },
      { day: 3, title: "Leh to Nubra Valley via Khardung La", description: "Drive over Khardung La (5,359m), the world's highest motorable pass. Check-in to Nubra camp." },
      { day: 4, title: "Nubra Valley to Turtuk Village & Back", description: "Day trip to Turtuk, the last village on the Indo-Pak border. Back to Hunder for Bactrian camel rides." },
      { day: 5, title: "Nubra Valley to Pangong Lake", description: "Drive via Shyok river road to Pangong Tso. Check-in at lake-side camps. Sunset views." },
      { day: 6, title: "Pangong Lake to Leh via Chang La", description: "Morning photography by the lake. Drive back to Leh crossing Chang La pass." },
      { day: 7, title: "Leh Rafting & Market Shopping", description: "Optional white-water rafting at Sangam (Indus-Zanskar confluence). Afternoon shopping in Leh Bazaar." },
      { day: 8, title: "Leh Departure", description: "Morning transfer to Leh Airport for flight back." }
    ],
    inclusions: ["Standard Hotels/Camps", "All Meals (Breakfast, Lunch, Dinner)", "Inner Line Permits", "Oxygen cylinder in vehicle", "4x4 or SUV transport"],
    exclusions: ["Airfare", "Camel ride & Rafting fees", "Tips and laundry", "Any medical emergency expenses"]
  },
  {
    title: "Spiti Valley Road Trip",
    slug: "spiti-valley-road-trip",
    destination: "Shimla - Kalpa - Kaza - Manali",
    description: "Journey through the Middle Land. Explore Key Monastery, the world's highest post office at Hikkim, and the gorgeous Chandratal Lake.",
    price: 27999,
    duration: 9,
    category: "ADVENTURE",
    images: ["https://images.unsplash.com/photo-1616421946026-6140810ee393?w=800"],
    itinerary: [
      { day: 1, title: "Shimla to Sangla", description: "Drive from Shimla along Sutlej river to Sangla valley in Kinnaur." },
      { day: 2, title: "Sangla to Chitkul & Kalpa", description: "Visit Chitkul, the last Indian village. Drive to Kalpa for views of Kinner Kailash peak." },
      { day: 3, title: "Kalpa to Tabo via Nako", description: "Enter Spiti Valley. Stop at Nako Lake. Visit Tabo Monastery, the Ajanta of the Himalayas." },
      { day: 4, title: "Tabo to Kaza via Dhankar", description: "Explore Dhankar Fort. Drive to Kaza, the sub-divisional headquarters of Spiti." },
      { day: 5, title: "Kaza High Villages Tour", description: "Visit Key Monastery, Kibber Village, Chicham Bridge, and send a postcard from Hikkim (highest post office)." },
      { day: 6, title: "Kaza to Pin Valley & Langza", description: "Explore Pin Valley National Park and Langza village, famous for marine fossils." },
      { day: 7, title: "Kaza to Chandratal Lake", description: "Drive over Kunzum Pass to the beautiful crescent-shaped Chandratal Lake. Overnight camping." },
      { day: 8, title: "Chandratal to Manali", description: "Drive from Chandratal to Manali crossing Rohtang Pass or Atal Tunnel." },
      { day: 9, title: "Departure from Manali", description: "Board evening Volvo bus to Delhi/Chandigarh." }
    ],
    inclusions: ["Homestay/Guest House stays", "Breakfast & Dinner", "Experienced mountain driver", "Permits & Taxes"],
    exclusions: ["Lunch", "Adventure activity costs", "Porters or personal guides", "Travel Insurance"]
  },
  {
    title: "Rishikesh Spiritual & Adventure Camp",
    slug: "rishikesh-spiritual-adventure-camp",
    destination: "Rishikesh - Haridwar",
    description: "Combine spirituality and adrenaline. Experience Ganga Aarti at Haridwar, white-water rafting, and riverside camping in Rishikesh.",
    price: 7999,
    duration: 3,
    category: "GROUP",
    images: ["https://images.unsplash.com/photo-1598977123418-45f04b615e37?w=800"],
    itinerary: [
      { day: 1, title: "Haridwar Aarti & Rishikesh Camp Check-in", description: "Arrive in Haridwar. Attend Ganga Aarti at Har Ki Pauri. Drive to Rishikesh river-side camp. Bonfire night." },
      { day: 2, title: "Rafting & Cliff Jumping Day", description: "Morning yoga session. Proceed for 16km rafting from Shivpuri. Try cliff jumping. Explore local cafes." },
      { day: 3, title: "Neer Garh Waterfall & Departure", description: "Short trek to Neer Garh Waterfall. Visit Lakshman Jhula and Beatles Ashram before departing for Delhi." }
    ],
    inclusions: ["2 Nights Camping", "All Meals at Camp", "16km River Rafting", "Bonfire & Evening Snacks", "Transport from Delhi"],
    exclusions: ["Beatles Ashram entry fee", "Personal expenses", "Bungee jumping (optional)"]
  },
  {
    title: "Jim Corbett Wildlife Safari",
    slug: "jim-corbett-wildlife-safari",
    destination: "Ramnagar - Corbett National Park",
    description: "Seek the Royal Bengal Tiger. Enjoy Jeep Safaris in Dhikala/Bijrani zones and luxurious stays in forest resorts.",
    price: 11999,
    duration: 3,
    category: "FAMILY",
    images: ["https://images.unsplash.com/photo-1615959189197-48400efcf751?w=800"],
    itinerary: [
      { day: 1, title: "Arrival & Resort Check-in", description: "Arrive at Ramnagar. Check-in to jungle resort. Afternoon free, evening nature walk." },
      { day: 2, title: "Tiger Reserve Jeep Safari", description: "Early morning Jeep Safari in the jungle zone. Afternoon visit to Garjiya Devi Temple and Corbett Museum." },
      { day: 3, title: "Corbett Waterfall & Departure", description: "Visit Corbett Waterfall after breakfast. Depart for home with wild memories." }
    ],
    inclusions: ["Jungle Resort Stay", "All Meals", "1 Jungle Jeep Safari", "Resort activities", "Local pickup/drop"],
    exclusions: ["Camera charges", "Extra safari rides", "Tips & Laundry"]
  },
  {
    title: "Varanasi Heritage & Spiritual Tour",
    slug: "varanasi-heritage-spiritual-tour",
    destination: "Varanasi - Sarnath",
    description: "Witness the oldest living city. Boat ride on the Ganges, Ganga Aarti, and visit Sarnath where Buddha gave his first sermon.",
    price: 9999,
    duration: 4,
    category: "PILGRIMAGE",
    images: ["https://images.unsplash.com/photo-1561361041-c96a49f80988?w=800"],
    itinerary: [
      { day: 1, title: "Arrival in Varanasi & Ganga Aarti", description: "Arrive in Varanasi. Evening boat cruise on River Ganges to witness the spectacular Ganga Aarti at Dashashwamedh Ghat." },
      { day: 2, title: "Subah-e-Banaras & Kashi Vishwanath temple", description: "Early morning boat ride to see sunrise and ghat rituals. Walk through narrow lanes to visit Kashi Vishwanath Temple." },
      { day: 3, title: "Sarnath Excursion", description: "Day trip to Sarnath. Visit Dhamek Stupa, Mulagandha Kuti Vihar, and Sarnath Archaeological Museum." },
      { day: 4, title: "Local Temples & Departure", description: "Visit Banaras Hindu University, Sankat Mochan Temple. Transfer to airport or station." }
    ],
    inclusions: ["Heritage Hotel Stay", "Breakfast Included", "2 Boat Rides on Ganges", "AC Cab for transfers", "Sarnath trip"],
    exclusions: ["Temple special entry tickets", "Meals other than breakfast", "Flight/Train fare"]
  },
  {
    title: "Valley of Flowers Trekking expedition",
    slug: "valley-of-flowers-trekking-expedition",
    destination: "Haridwar - Govindghat - Ghangaria - Hemkund Sahib",
    description: "Trek through the UNESCO World Heritage Site in Uttarakhand. Walk through alpine meadows covered in thousands of high-altitude flowers.",
    price: 16999,
    duration: 6,
    category: "ADVENTURE",
    images: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"],
    itinerary: [
      { day: 1, title: "Haridwar to Govindghat Drive", description: "Pick up from Haridwar. 10-hour scenic drive along Alaknanda river to Govindghat." },
      { day: 2, title: "Govindghat to Ghangaria Trek", description: "Trek 14 km (or take a shared heli) to Ghangaria base camp along Pushpawati river." },
      { day: 3, title: "Trek to Valley of Flowers", description: "Trek 4 km into the Valley of Flowers. Witness rare Himalayan flowers and flora. Return to Ghangaria." },
      { day: 4, title: "Trek to Hemkund Sahib", description: "Steep 6 km trek to Hemkund Sahib Gurudwara beside a pristine high-altitude lake. Back to Ghangaria." },
      { day: 5, title: "Trek down to Govindghat", description: "Trek 14 km back to Govindghat. Evening free to relax." },
      { day: 6, title: "Govindghat to Haridwar Departure", description: "Drive back to Haridwar. Drop at railway station." }
    ],
    inclusions: ["Guesthouse accommodation", "All Veg Meals", "Forest entry permit", "Experienced trek leader & guides", "Haridwar transport"],
    exclusions: ["Helicopter/Pony charges", "Personal porters", "Lunch during travel"]
  },
  {
    title: "Nainital & Mussoorie Weekend Getaway",
    slug: "nainital-mussoorie-weekend-getaway",
    destination: "Nainital - Mussoorie - Corbett",
    description: "Escape the heat of the plains. Boat on Naini Lake, explore Mussoorie's Kempty Falls, and enjoy panoramic Himalayan views.",
    price: 13999,
    duration: 5,
    category: "COUPLE",
    images: ["https://images.unsplash.com/photo-1542856391-010fb87dcfed?w=800"],
    itinerary: [
      { day: 1, title: "Delhi to Nainital", description: "Drive to Nainital. Check-in. Evening boat ride on Naini Lake and walk on Mall road." },
      { day: 2, title: "Nainital Lake Tour", description: "Visit Bhimtal, Sattal, and Naukuchiatal. Take the aerial ropeway to Snow View Point." },
      { day: 3, title: "Nainital to Mussoorie via Dehradun", description: "Drive to Mussoorie. Stop at Dehradun's Robbers Cave. Check-in to Mussoorie hotel." },
      { day: 4, title: "Mussoorie Sightseeing", description: "Visit Kempty Falls, Gun Hill point, and Company Garden. Evening stroll on Mall Road." },
      { day: 5, title: "Mussoorie to Delhi Departure", description: "Visit Lal Tibba scenic point in Landour. Drive back to Delhi." }
    ],
    inclusions: ["3-Star Hotel Stay", "Daily Breakfast", "AC Cab for all travel", "Sightseeing"],
    exclusions: ["Ropeway/Boating tickets", "Lunch/Dinner", "Tips"]
  },
  {
    title: "Dharamshala & Dalhousie Hills",
    slug: "dharamshala-dalhousie-hills",
    destination: "Dharamshala - McLeod Ganj - Dalhousie - Khajjiar",
    description: "Explore the Little Lhasa of India and the mini-Switzerland of Himachal. Visit Dalai Lama Temple and pine forests of Khajjiar.",
    price: 16999,
    duration: 6,
    category: "FAMILY",
    images: ["https://images.unsplash.com/photo-1597242731268-6c63e8c51834?w=800"],
    itinerary: [
      { day: 1, title: "Arrival in Dharamshala", description: "Arrive in Dharamshala. Check-in. Evening explore McLeod Ganj markets." },
      { day: 2, title: "McLeod Ganj Exploration", description: "Visit Dalai Lama Temple, Bhagsu Waterfall, Saint John Wilderness Church, and Dharamshala Cricket Stadium." },
      { day: 3, title: "Dharamshala to Dalhousie Drive", description: "Scenic drive to Dalhousie. Rest of the day free to explore the quiet colonial town." },
      { day: 4, title: "Excursion to Khajjiar (Mini Switzerland)", description: "Visit Khajjiar meadow surrounded by dense pine and deodar forests. Enjoy horse riding and zorbing." },
      { day: 5, title: "Chamba Day Trip", description: "Day trip to Chamba town beside Ravi river. Visit ancient temples and Bhuri Singh Museum." },
      { day: 6, title: "Dalhousie Departure", description: "Drive back to Pathankot or Chandigarh for departure." }
    ],
    inclusions: ["Resort stay with views", "Breakfast & Dinner", "Sightseeing by private cab", "Driver allowance & parking"],
    exclusions: ["Adventure ride tickets", "Guide charges", "Lunch"]
  },
  {
    title: "Amritsar Golden Temple Heritage Tour",
    slug: "amritsar-golden-temple-heritage-tour",
    destination: "Amritsar",
    description: "Immerse in Punjabi culture. Pay respects at the Golden Temple, experience Jallianwala Bagh, and watch the Wagah Border ceremony.",
    price: 6999,
    duration: 3,
    category: "PILGRIMAGE",
    images: ["https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800"],
    itinerary: [
      { day: 1, title: "Arrival & Wagah Border Ceremony", description: "Arrive in Amritsar. Afternoon visit to Wagah Border for the Indo-Pak beating retreat ceremony." },
      { day: 2, title: "Golden Temple & Jallianwala Bagh", description: "Morning visit to Golden Temple (Harmandir Sahib). Visit Jallianwala Bagh and Partition Museum. Enjoy authentic Punjabi food." },
      { day: 3, title: "Amritsar Departure", description: "Visit Gobindgarh Fort. Transfer to airport or railway station." }
    ],
    inclusions: ["3-Star Hotel Stay", "Breakfast Included", "All sightseeing by AC sedan", "Wagah Border transport"],
    exclusions: ["Langer/meals other than breakfast", "Fort entry tickets", "Train/Airfare"]
  },

  // --- SOUTH INDIA (12 Packages) ---
  {
    title: "Kerala Backwater & Houseboat Honeymoon",
    slug: "kerala-backwater-houseboat-honeymoon",
    destination: "Kochi - Munnar - Alleppey - Kovalam",
    description: "Cruise down romantic backwaters, walk through misty tea gardens of Munnar, and watch the sunset over Kovalam Beach.",
    price: 25999,
    duration: 7,
    category: "HONEYMOON",
    images: ["https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800"],
    itinerary: [
      { day: 1, title: "Arrive Kochi & Drive to Munnar", description: "Pickup from Kochi. Beautiful drive to Munnar passing Cheeyappara Waterfalls. Check-in to resort." },
      { day: 2, title: "Munnar Tea Estates & Hills", description: "Visit Eravikulam National Park (Nilgiri Tahr), Tea Museum, Mattupetty Dam, and Echo Point." },
      { day: 3, title: "Munnar to Alleppey Houseboat", description: "Drive to Alleppey. Board a private traditional Kerala Kettuvallam (Houseboat). Cruise along backwaters with all meals on board." },
      { day: 4, title: "Alleppey to Kovalam Beach", description: "Disembark and drive to Kovalam. Check-in at beach resort. Spend evening at Hawa beach." },
      { day: 5, title: "Kovalam Beach & Kanyakumari Day Trip", description: "Day trip to Kanyakumari (Cape Comorin) to see Vivekananda Rock Memorial. Return to Kovalam." },
      { day: 6, title: "Kovalam to Kochi Departure", description: "Drive to Kochi. Visit Fort Kochi Chinese Fishing Nets if time permits. Transfer to airport." }
    ],
    inclusions: ["Houseboat + 4-Star Resort stays", "All meals in houseboat, breakfast in hotels", "Private AC Cab", "Honeymoon special cake & flower decoration"],
    exclusions: ["Entry tickets", "Boat rides in Kanyakumari", "Lunch & Dinner at hotel stays"]
  },
  {
    title: "Ooty & Kodaikanal Romantic Escapade",
    slug: "ooty-kodaikanal-romantic-escapade",
    destination: "Ooty - Coonoor - Kodaikanal",
    description: "Visit the Queen of Hill Stations. Ride the toy train in Coonoor, boat on Kodaikanal Lake, and admire pine forests.",
    price: 17999,
    duration: 6,
    category: "COUPLE",
    images: ["https://images.unsplash.com/photo-1626509653199-03bb36ec7a3f?w=800"],
    itinerary: [
      { day: 1, title: "Coimbatore to Ooty Drive", description: "Pickup from Coimbatore airport/station. Drive to Ooty. Evening botanical garden visit." },
      { day: 2, title: "Ooty Lake & Doddabetta Peak", description: "Visit Doddabetta, the highest peak in Nilgiris. Ride the Ooty Toy Train. Evening boat ride on Ooty Lake." },
      { day: 3, title: "Coonoor Day Excursion", description: "Drive to Coonoor. Visit Sim's Park, Lamb's Rock, and Dolphin's Nose. Return to Ooty." },
      { day: 4, title: "Ooty to Kodaikanal Drive", description: "Picturesque drive to Kodaikanal. Check-in to resort. Evening stroll in Coaker's Walk." },
      { day: 5, title: "Kodaikanal Lake & Forests", description: "Visit Pillar Rocks, Pine Forest, Green Valley view point, and boat on Kodai Lake." },
      { day: 6, title: "Kodaikanal to Coimbatore Departure", description: "Transfer back to Coimbatore for departure." }
    ],
    inclusions: ["Resort stay with breakfast", "Toy Train ticket (Coonoor-Ooty)", "AC Cab for transport", "Sightseeing"],
    exclusions: ["Boating fees", "Meals other than breakfast", "Tips"]
  },
  {
    title: "Wayanad Nature & Wildlife Retreat",
    slug: "wayanad-nature-wildlife-retreat",
    destination: "Wayanad - Kabini",
    description: "Stay in treehouses, trek to Chembra Heart Lake, explore ancient Edakkal Caves, and experience a wild safari in Kabini.",
    price: 19999,
    duration: 5,
    category: "ADVENTURE",
    images: ["https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=800"],
    itinerary: [
      { day: 1, title: "Calicut to Wayanad Drive", description: "Arrive in Calicut. Drive to Wayanad. Check-in at jungle resort." },
      { day: 2, title: "Edakkal Caves & Soochipara Falls", description: "Explore 5,000-year-old rock carvings at Edakkal Caves. Visit Soochipara waterfall." },
      { day: 3, title: "Chembra Peak & Banasura Sagar Dam", description: "Trek to the heart-shaped lake at Chembra Peak. Visit India's largest earth dam at Banasura Sagar." },
      { day: 4, title: "Wayanad to Kabini Jungle Safari", description: "Drive to Kabini forest reserve. Evening open jeep safari inside Nagarhole National Park." },
      { day: 5, title: "Kabini Departure", description: "Morning boat safari on Kabini river. Return drive to Calicut/Bangalore." }
    ],
    inclusions: ["Jungle lodge/treehouse stay", "Breakfast & Dinner", "Nagarhole Jeep Safari", "Sightseeing cab"],
    exclusions: ["Chembra Peak guide fee", "Forest camera fees", "Lunch"]
  },
  {
    title: "Coorg Coffee Plantation Tour",
    slug: "coorg-coffee-plantation-tour",
    destination: "Madikeri - Coorg",
    description: "Relax in the Scotland of India. Stay inside active coffee plantations, visit Abbey Falls, and feed elephants at Dubare Camp.",
    price: 11499,
    duration: 4,
    category: "FAMILY",
    images: ["https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800"],
    itinerary: [
      { day: 1, title: "Bangalore to Coorg & Abbey Falls", description: "Pickup from Bangalore. Drive to Coorg. Visit Abbey Falls in the afternoon." },
      { day: 2, title: "Dubare Elephant Camp & Golden Temple", description: "Interact with elephants at Dubare Camp. Visit Bylakuppe Namdroling Monastery (Tibetan Golden Temple) and Nisargadhama." },
      { day: 3, title: "Talakaveri & Raja's Seat", description: "Visit Talakaveri, the source of River Kaveri on Brahmagiri hills. Evening sunset at Raja's Seat." },
      { day: 4, title: "Coffee Estate Tour & Departure", description: "Guided walk through coffee plantation. Drive back to Bangalore." }
    ],
    inclusions: ["Plantation Homestay", "Breakfast & Dinner", "Coffee Estate Guided Walk", "Private AC transport"],
    exclusions: ["Dubare rafting/elephant bathing entry fee", "Lunch", "Personal expenses"]
  },
  {
    title: "Hampi & Badami Ruins Explorer",
    slug: "hampi-badami-ruins-explorer",
    destination: "Hampi - Badami - Pattadakal",
    description: "Step back in time to the Vijayanagara Empire. Marvel at the stone chariot, Virupaksha temple, and the red-sandstone cave temples of Badami.",
    price: 15499,
    duration: 5,
    category: "SOLO",
    images: ["https://images.unsplash.com/photo-1600100397608-f010e461cc80?w=800"],
    itinerary: [
      { day: 1, title: "Arrival in Hampi", description: "Arrive in Hospet/Hampi. Check-in to boutique guest house. Sunset at Hemakuta Hill." },
      { day: 2, title: "Hampi Sacred Center & Stone Chariot", description: "Explore Vittala Temple complex (Stone Chariot), Virupaksha Temple, and Hampi bazaar." },
      { day: 3, title: "Royal Enclosure & Coracle Ride", description: "Visit Lotus Mahal, Elephant Stables, Queen's Bath. Afternoon coracle boat ride on Tungabhadra river." },
      { day: 4, title: "Hampi to Badami via Pattadakal", description: "Drive to Badami. En route visit UNESCO sites of Pattadakal and Aihole. Explore Badami Cave Temples." },
      { day: 5, title: "Badami Fort & Departure", description: "Visit Badami Fort and Bhutanatha temple beside Agastya lake. Depart from Hubli." }
    ],
    inclusions: ["Boutique Heritage stays", "Breakfast included", "Private cab for all transfers", "Hampi local guide"],
    exclusions: ["Monument entry fees", "Coracle ride fare", "Meals other than breakfast"]
  },
  {
    title: "Gokarna Beach & Temples Solo Trip",
    slug: "gokarna-beach-temples-solo-trip",
    destination: "Gokarna - Murudeshwar",
    description: "Relax on pristine crescent beaches. Trek from Half Moon Beach to Paradise Beach and visit the world's second-tallest Shiva statue in Murudeshwar.",
    price: 8999,
    duration: 4,
    category: "SOLO",
    images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"],
    itinerary: [
      { day: 1, title: "Arrival in Gokarna", description: "Arrive in Gokarna. Check-in to beach cottage near Kudle Beach. Sunset walk." },
      { day: 2, title: "Gokarna Beach Trek", description: "Guided trek covering Kudle Beach, Om Beach, Half Moon Beach, and Paradise Beach. Swim in the sea." },
      { day: 3, title: "Murudeshwar Shiva Statue Excursion", description: "Drive to Murudeshwar. Visit temple and view the giant Shiva statue overlooking Arabian Sea. Return to Gokarna." },
      { day: 4, title: "Mahabaleshwar Temple & Departure", description: "Visit 4th-century Mahabaleshwar Temple. Transfer to Gokarna/Madgaon station." }
    ],
    inclusions: ["Beachside cottage stay", "Breakfast included", "Gokarna beach trek guide", "All transport"],
    exclusions: ["Lunch & Dinner", "Water sports", "Train tickets"]
  },
  {
    title: "Pondicherry French Quarter Tour",
    slug: "pondicherry-french-quarter-tour",
    destination: "Pondicherry - Auroville",
    description: "Experience French Riviera vibes in India. Walk along white town streets, visit Auroville Matrimandir, and surf at Serenity Beach.",
    price: 10999,
    duration: 4,
    category: "COUPLE",
    images: ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
    itinerary: [
      { day: 1, title: "Chennai to Pondicherry Drive", description: "Pickup from Chennai. Drive along East Coast Road to Pondicherry. Evening walk in Promenade Beach." },
      { day: 2, title: "Auroville & Matrimandir", description: "Excursion to Auroville community. View the Golden Globe Matrimandir. Evening explore French Quarter on bicycles." },
      { day: 3, title: "Pondicherry Beaches & Heritage", description: "Visit Paradise Beach (speed boat ride), Basilica of Sacred Heart, and local boutiques." },
      { day: 4, title: "Pondicherry to Chennai Departure", description: "Visit Aurobindo Ashram. Drive back to Chennai." }
    ],
    inclusions: ["Boutique White Town stay", "Breakfast", "Bicycle rental for 1 day", "AC Cab from Chennai"],
    exclusions: ["Auroville inner chamber entry (requires booking)", "Boat rides", "Lunch/Dinner"]
  },
  {
    title: "Rameshwaram & Kanyakumari Pilgrimage",
    slug: "rameshwaram-kanyakumari-pilgrimage",
    destination: "Madurai - Rameshwaram - Kanyakumari",
    description: "Cross the historic Pamban Bridge. Take a holy bath in 22 wells of Rameshwaram, and see the meeting point of three oceans in Kanyakumari.",
    price: 14500,
    duration: 5,
    category: "PILGRIMAGE",
    images: ["https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800"],
    itinerary: [
      { day: 1, title: "Madurai Temple Tour", description: "Arrive in Madurai. Visit Sri Meenakshi Amman Temple and Thirumalai Nayakkar Palace." },
      { day: 2, title: "Madurai to Rameshwaram", description: "Drive to Rameshwaram crossing Pamban Bridge. Visit Ramanathaswamy Temple." },
      { day: 3, title: "Dhanushkodi Exploration", description: "Explore the ghost town of Dhanushkodi, the land's end where Ram Setu begins. Visit APJ Abdul Kalam Memorial." },
      { day: 4, title: "Rameshwaram to Kanyakumari", description: "Drive to Kanyakumari. Watch sunset over the Indian Ocean. Visit Kumari Amman Temple." },
      { day: 5, title: "Vivekananda Rock & Madurai Departure", description: "Ferry ride to Vivekananda Rock Memorial & Thiruvalluvar Statue. Drive back to Madurai for departure." }
    ],
    inclusions: ["3-Star Hotel Stay", "Breakfast Included", "Ferry tickets in Kanyakumari", "AC Cab for entire tour"],
    exclusions: ["Temple pooja fees", "Lunch & Dinner", "Tips"]
  },
  {
    title: "Chikmagalur Coffee Hills Trek",
    slug: "chikmagalur-coffee-hills-trek",
    destination: "Chikmagalur",
    description: "Trek to Karnataka's highest peak, Mullayanagiri. Enjoy misty waterfall views, spice walks, and estate homestays.",
    price: 8999,
    duration: 3,
    category: "GROUP",
    images: ["https://images.unsplash.com/photo-1611001716885-b3402558a62b?w=800"],
    itinerary: [
      { day: 1, title: "Bangalore to Chikmagalur & Estate Walk", description: "Pickup from Bangalore. Drive to Chikmagalur. Check-in to estate homestay. Guided plantation tour." },
      { day: 2, title: "Mullayanagiri Trek & Bababudangiri", description: "Trek to Mullayanagiri peak for panoramic views. Visit Bababudangiri shrine and Jhari waterfalls by jeep." },
      { day: 3, title: "Hebbe Falls & Bangalore Departure", description: "Visit scenic Hebbe Falls (jeep ride). Drive back to Bangalore." }
    ],
    inclusions: ["Plantation Homestay", "All Meals (Veg & Non-Veg)", "Mullayanagiri Trek guide", "Transport from Bangalore"],
    exclusions: ["Local jeep charges to Hebbe/Jhari falls", "Personal expenses"]
  },
  {
    title: "Munnar & Thekkady Hill Escapade",
    slug: "munnar-thekkady-hill-escapade",
    destination: "Munnar - Thekkady",
    description: "Breathe in the tea-scented air of Munnar and explore spice plantations. Take a boat cruise on Periyar Lake to watch wild elephants.",
    price: 13999,
    duration: 5,
    category: "FAMILY",
    images: ["https://images.unsplash.com/photo-1516690561799-46d8f74f90f6?w=800"],
    itinerary: [
      { day: 1, title: "Kochi to Munnar", description: "Arrive in Kochi. Scenic drive to Munnar. Evening at leisure." },
      { day: 2, title: "Munnar Tea Fields", description: "Visit Mattupetty Dam, Kundala Lake, Top Station, and Tea Museum." },
      { day: 3, title: "Munnar to Thekkady", description: "Drive to Thekkady. Visit spice plantations (cardamom, pepper, cinnamon). Evening martial arts (Kalaripayattu) show." },
      { day: 4, title: "Periyar Wildlife Boat Safari", description: "Early morning boat cruise on Periyar Lake. Elephant ride optional. Afternoon free for spice shopping." },
      { day: 5, title: "Thekkady to Kochi Departure", description: "Drive back to Kochi. Drop at airport or railway station." }
    ],
    inclusions: ["3-Star Hotel Stay", "Breakfast Included", "Periyar Boat Safari tickets", "AC Sedan for transfers"],
    exclusions: ["Kalaripayattu ticket", "Elephant ride fees", "Lunch & Dinner"]
  },
  {
    title: "Varkala Cliff Beach Holiday",
    slug: "varkala-cliff-beach-holiday",
    destination: "Varkala",
    description: "Relax on the dramatic red cliffs overlooking the Arabian Sea. Enjoy beachside yoga, paragliding, and cafes.",
    price: 11999,
    duration: 4,
    category: "SOLO",
    images: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800"],
    itinerary: [
      { day: 1, title: "Trivandrum to Varkala Cliff", description: "Arrive in Trivandrum. Drive to Varkala. Check-in to cliff-side resort. Evening walk on Varkala beach." },
      { day: 2, title: "Jatayu Earth Center Excursion", description: "Visit the massive Jatayu sculpture park, the world's largest bird sculpture. Return to Varkala." },
      { day: 3, title: "Edava Beach & Kayaking", description: "Morning beach yoga. Proceed to Kappil lake/Edava beach for backwater kayaking. Sunset at cliff cafe." },
      { day: 4, title: "Janardhana Swamy Temple & Departure", description: "Visit 2000-year-old temple. Transfer to Trivandrum Airport." }
    ],
    inclusions: ["Cliffside Resort Stay", "Breakfast Included", "Jatayu Earth Center ticket", "Kayaking session"],
    exclusions: ["Lunch & Dinner", "Paragliding (optional)", "Airport cab (optional surcharge)"]
  },
  {
    title: "Araku Valley & Vizag Coastal Tour",
    slug: "araku-valley-vizag-coastal-tour",
    destination: "Visakhapatnam - Araku Valley",
    description: "Enjoy the scenic train ride through tunnels to Araku coffee country. Visit Borra Caves and relax on Vizag's RK Beach.",
    price: 12999,
    duration: 4,
    category: "FAMILY",
    images: ["https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=800"],
    itinerary: [
      { day: 1, title: "Vizag Arrival & Beach Visit", description: "Arrive in Vizag. Visit Kailasagiri hill top, Submarine Museum, and RK Beach." },
      { day: 2, title: "Vizag to Araku Vistadome Train", description: "Board the scenic Vistadome train through tunnels and valleys to Araku. Check-in to resort." },
      { day: 3, title: "Borra Caves & Coffee Plantation", description: "Explore the million-year-old Borra Caves. Visit Coffee Museum, Padmapuram Gardens, and Chaparai waterfall." },
      { day: 4, title: "Araku to Vizag & Departure", description: "Drive back to Vizag. Visit Yarada Beach (most scenic beach) before departing." }
    ],
    inclusions: ["Standard Resort Stays", "Breakfast Included", "Vistadome Train tickets", "AC Cab for sightseeing"],
    exclusions: ["Cave entry fees", "Lunch & Dinner", "Camera fees"]
  },

  // --- WEST INDIA (12 Packages) ---
  {
    title: "Goa Beach Party & Water Sports",
    slug: "goa-beach-party-water-sports",
    destination: "North Goa - South Goa",
    description: "The ultimate beach fun! Experience parasailing, jet skiing, dynamic nightlife, and explore beautiful Portuguese forts.",
    price: 13999,
    duration: 5,
    category: "GROUP",
    images: ["https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800"],
    itinerary: [
      { day: 1, title: "Arrival in Goa", description: "Transfer to North Goa hotel. Evening free to relax on Baga Beach." },
      { day: 2, title: "North Goa Forts & Beaches", description: "Visit Aguada Fort, Chapora Fort (Dil Chahta Hai style), Anjuna Beach, and Vagator Beach." },
      { day: 3, title: "Grand Island Boat Trip & Snorkeling", description: "Full-day boat trip to Grand Island. Enjoy dolphin spotting, snorkeling, and BBQ lunch." },
      { day: 4, title: "Water Sports & South Goa Heritage", description: "Morning parasailing, banana boat, jet ski at Calangute. Afternoon visit to Old Goa churches & Mangueshi Temple." },
      { day: 5, title: "Departure", description: "Morning free for shopping at Panaji. Transfer to airport/railway station." }
    ],
    inclusions: ["3-Star Hotel with pool", "Breakfast Included", "Grand Island Boat Trip with BBQ", "Water Sports Combo", "All transfers"],
    exclusions: ["Flight tickets", "Club entry charges", "Meals not mentioned"]
  },
  {
    title: "Royal Rajasthan Heritage Tour",
    slug: "royal-rajasthan-heritage-tour",
    destination: "Jaipur - Jodhpur - Udaipur",
    description: "Walk in the footsteps of Kings. Visit Udaipur's Lake Palace, Jodhpur's Mehrangarh Fort, and Jaipur's pink palaces.",
    price: 26999,
    duration: 8,
    category: "FAMILY",
    images: ["https://images.unsplash.com/photo-1477587458883-471a5ed94245?w=800"],
    itinerary: [
      { day: 1, title: "Arrive Jaipur", description: "Pickup. Check-in to heritage hotel. Evening visit Birla Temple and Chokhi Dhani." },
      { day: 2, title: "Jaipur Forts & Palaces", description: "Amber Fort, Jal Mahal, Hawa Mahal, City Palace, and local bazaar shopping." },
      { day: 3, title: "Jaipur to Jodhpur", description: "Drive to the Blue City, Jodhpur. Visit Mandore Gardens in the evening." },
      { day: 4, title: "Jodhpur Blue City Tour", description: "Explore Mehrangarh Fort, Jaswant Thada, and Umaid Bhawan Palace." },
      { day: 5, title: "Jodhpur to Udaipur via Ranakpur", description: "Drive to Udaipur. En route visit the stunning Jain Temple at Ranakpur with 1444 pillars." },
      { day: 6, title: "Udaipur Lake City Tour", description: "Explore City Palace, Saheliyon-ki-Bari, Jagdish Temple. Evening boat ride on Lake Pichola." },
      { day: 7, title: "Udaipur Day Excursion to Chittorgarh", description: "Day trip to Chittorgarh Fort, the largest fort in India. Return to Udaipur." },
      { day: 8, title: "Udaipur Departure", description: "Transfer to Udaipur Airport or Railway Station." }
    ],
    inclusions: ["Heritage Hotels Stays", "Breakfast Included", "Lake Pichola Boat Ride", "Chittorgarh Day Tour", "Private Sedan"],
    exclusions: ["Fort guide fees", "Meals other than breakfast", "Chokhi Dhani entry fee"]
  },
  {
    title: "Mount Abu & Udaipur Romantic Getaway",
    slug: "mount-abu-udaipur-romantic-getaway",
    destination: "Udaipur - Mount Abu",
    description: "Combine Rajasthan's only hill station with the romantic city of lakes. Stay in lakeside heritage properties and see Dilwara temples.",
    price: 16999,
    duration: 5,
    category: "COUPLE",
    images: ["https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800"],
    itinerary: [
      { day: 1, title: "Udaipur Arrival", description: "Arrive in Udaipur. Check-in to lake-view hotel. Evening sunset walk at Ambrai Ghat." },
      { day: 2, title: "Udaipur Royal Palaces", description: "Visit City Palace, Monsoon Palace (Sajjangarh) for sunset, and Jag Mandir." },
      { day: 3, title: "Udaipur to Mount Abu Drive", description: "Drive to Mount Abu hill station. Check-in. Evening boat ride on Nakki Lake." },
      { day: 4, title: "Mount Abu dilwara temples", description: "Visit Dilwara Jain Temples, famous for intricate marble carvings. View sunset from Sunset Point." },
      { day: 5, title: "Mount Abu to Udaipur Departure", description: "Transfer back to Udaipur Airport." }
    ],
    inclusions: ["Lakeside Hotel Stays", "Daily Breakfast", "Nakki Lake Boating tickets", "AC transport"],
    exclusions: ["Dilwara temple entry (free but guide extra)", "Lunch & Dinner"]
  },
  {
    title: "Gir National Park Lion Safari",
    slug: "gir-national-park-lion-safari",
    destination: "Sasan Gir - Junagadh",
    description: "See the Asiatic Lion in its only natural home. Enjoy open jeep forest safaris and wildlife resort stays.",
    price: 12999,
    duration: 3,
    category: "FAMILY",
    images: ["https://images.unsplash.com/photo-1602491453977-63a33bc51fdb?w=800"],
    itinerary: [
      { day: 1, title: "Arrival in Sasan Gir", description: "Arrive at Gir. Check-in to wildlife resort. Informative slideshow session by naturalist." },
      { day: 2, title: "Asiatic Lion Safari & Devalia", description: "Early morning Gir Jungle Trail Safari to spot lions. Afternoon visit to Devalia Safari Park." },
      { day: 3, title: "Junagadh Fort & Departure", description: "Visit historic Uparkot Fort in Junagadh. Transfer to Rajkot Airport." }
    ],
    inclusions: ["Jungle Resort Stay", "All Meals", "1 Gir Jungle Safari permit & jeep", "Devalia park entry", "AC Transport"],
    exclusions: ["Camera charges", "Extra safari rides", "Tips"]
  },
  {
    title: "Rann of Kutch Desert Festival",
    slug: "rann-of-kutch-desert-festival",
    destination: "Bhuj - White Rann - Tent City",
    description: "Witness the surreal white salt desert. Stay in premium tents, enjoy Gujarati folk culture, and watch the full moon over the Rann.",
    price: 19999,
    duration: 4,
    category: "FAMILY",
    images: ["https://images.unsplash.com/photo-1599818817290-7d3129841870?w=800"],
    itinerary: [
      { day: 1, title: "Bhuj to White Rann Tent City", description: "Pickup from Bhuj. Transfer to the Tent City at Dhordo. Traditional welcome. Evening cultural program." },
      { day: 2, title: "Sunrise at Rann & Kala Dungar", description: "Sunrise visit to the White Salt Rann. Visit Kala Dungar (Black Hill), the highest point in Kutch." },
      { day: 3, title: "Craft Villages & Bhuj Heritage", description: "Visit Nirona craft village to see Rogan art. Excursion to Aina Mahal and Prag Mahal in Bhuj." },
      { day: 4, title: "Bhuj Departure", description: "Visit Bhujodi weavers village. Drop at Bhuj airport/station." }
    ],
    inclusions: ["Premium Tent/Bunga stay", "All meals (Traditional Gujarati)", "Rann Entry Permits", "Cultural shows", "AC Transfers"],
    exclusions: ["Flight tickets", "Adventure rides (ATV/Parasailing)", "Personal purchases"]
  },
  {
    title: "Lonavala & Khandala Weekend Escape",
    slug: "lonavala-khandala-weekend-escape",
    destination: "Lonavala - Khandala",
    description: "Relax in the Western Ghats. Visit Karla Caves, Bhushi Dam, and enjoy panoramic valley views from Tiger's Point.",
    price: 6999,
    duration: 3,
    category: "GROUP",
    images: ["https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800"],
    itinerary: [
      { day: 1, title: "Mumbai/Pune to Lonavala", description: "Pickup from Mumbai or Pune. Drive to Lonavala. Check-in. Visit Bhushi Dam and Tiger Point." },
      { day: 2, title: "Karla Caves & Wax Museum", description: "Explore ancient Buddhist rock-cut Karla and Bhaja Caves. Visit Celebrity Wax Museum." },
      { day: 3, title: "Khandala Sightseeing & Departure", description: "Visit Duke's Nose, Rajmachi Point, and Sunset Point in Khandala. Drive back to Mumbai." }
    ],
    inclusions: ["3-Star Hotel Stay", "Breakfast Included", "AC Sedan for transfers", "Sightseeing"],
    exclusions: ["Cave entry fees", "Lunch & Dinner", "Wax museum tickets"]
  },
  {
    title: "Mahabaleshwar Strawberry Valley Tour",
    slug: "mahabaleshwar-strawberry-valley-tour",
    destination: "Mahabaleshwar - Panchgani",
    description: "Pick strawberries, admire Wilson Point sunrise, boat on Venna Lake, and explore Panchgani tableland.",
    price: 8999,
    duration: 3,
    category: "COUPLE",
    images: ["https://images.unsplash.com/photo-1518638150341-db70b38cc6f0?w=800"],
    itinerary: [
      { day: 1, title: "Pune to Mahabaleshwar", description: "Drive from Pune. Check-in. Visit Mapro Garden for strawberry treats and Venna Lake for boating." },
      { day: 2, title: "Mahabaleshwar Points & Panchgani", description: "Visit Arthur's Seat, Wilson Point (sunrise), Kate's Point. Drive to Panchgani Table Land." },
      { day: 3, title: "Pratapgad Fort & Departure", description: "Explore the historic Pratapgad Fort. Return drive to Pune." }
    ],
    inclusions: ["Valley View Hotel Stay", "Breakfast & Dinner", "Private Cab for sightseeing", "Mapro Garden visit"],
    exclusions: ["Boating charges", "Fort guide", "Lunch"]
  },
  {
    title: "Ajanta & Ellora Caves Heritage Tour",
    slug: "ajanta-ellora-caves-heritage-tour",
    destination: "Aurangabad - Ajanta - Ellora",
    description: "Marvel at ancient rock-cut architecture. Visit Kailash Temple (carved from a single rock) and 2,000-year-old Buddhist murals.",
    price: 11999,
    duration: 4,
    category: "SOLO",
    images: ["https://images.unsplash.com/photo-1608958416733-4f9db29ad1b4?w=800"],
    itinerary: [
      { day: 1, title: "Aurangabad Arrival & Bibi Ka Maqbara", description: "Arrive in Aurangabad. Visit Bibi Ka Maqbara (Tomb of the Lady, replica of Taj Mahal)." },
      { day: 2, title: "Ellora Caves & Daulatabad Fort", description: "Explore Ellora Caves (Buddhist, Hindu, Jain). Visit the giant monolithic Kailash Temple. Climb Daulatabad Fort." },
      { day: 3, title: "Ajanta Caves Excursion", description: "Full-day trip to Ajanta Caves, famous for ancient Buddhist paintings and sculptures. Return to Aurangabad." },
      { day: 4, title: "Aurangabad Departure", description: "Visit Panchakki (water mill). Transfer to Aurangabad Airport." }
    ],
    inclusions: ["3-Star Hotel Stay", "Breakfast Included", "AC Cab for Ajanta-Ellora trips", "English Guide for caves"],
    exclusions: ["Entry tickets for monuments", "Lunch & Dinner", "Shuttle bus fees at Ajanta"]
  },
  {
    title: "Daman & Diu Beach Relaxation",
    slug: "daman-diu-beach-relaxation",
    destination: "Diu Island - Daman",
    description: "Unwind on peaceful coastal islands. Explore Diu Fort, Naida Caves, Nagoa Beach, and enjoy low-tax seaside dining.",
    price: 14999,
    duration: 4,
    category: "COUPLE",
    images: ["https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800"],
    itinerary: [
      { day: 1, title: "Arrival in Diu Island", description: "Arrive at Diu. Transfer to beach resort. Sunset at Ghoghla Beach." },
      { day: 2, title: "Diu Fort & Naida Caves", description: "Explore Diu Fort (built by Portuguese), Naida Caves (natural rock formations), and St. Paul's Church." },
      { day: 3, title: "Nagoa Beach & Water Sports", description: "Relax at the horseshoe-shaped Nagoa Beach. Parasailing or jet ski optional. Evening at Shell Museum." },
      { day: 4, title: "Diu Departure", description: "Check-out and transfer to Diu Airport or Veraval station." }
    ],
    inclusions: ["Beach Resort Stay", "Breakfast Included", "AC Cab for local tours", "Taxes"],
    exclusions: ["Water sports fees", "Lunch & Dinner", "Airfare"]
  },
  {
    title: "Jaisalmer Desert Safari & Camping",
    slug: "jaisalmer-desert-safari-camping",
    destination: "Jaisalmer - Sam Sand Dunes",
    description: "Camp under stars in the Thar Desert. Enjoy camel safaris, Rajasthani folk dance, and explore Jaisalmer's Golden Fort.",
    price: 9999,
    duration: 3,
    category: "GROUP",
    images: ["https://images.unsplash.com/photo-1504681869397-bb707b667825?w=800"],
    itinerary: [
      { day: 1, title: "Arrival & Jaisalmer Fort", description: "Arrive in Jaisalmer. Visit the living Golden Fort (Sonar Qila), Patwon ki Haveli, and Salim Singh ki Haveli." },
      { day: 2, title: "Kuldhara Ghost Village & Sam Dunes Camp", description: "Visit the abandoned ghost village of Kuldhara. Proceed to Sam Sand Dunes. Enjoy camel safari, jeep safari, sunset over dunes, Rajasthani dinner, and folk dance." },
      { day: 3, title: "Gadisar Lake & Departure", description: "Sunrise at Gadisar Lake. Drop at Jaisalmer railway station." }
    ],
    inclusions: ["1 Night Heritage Hotel, 1 Night Desert Camp", "Breakfast & Dinner", "Camel Safari & Jeep Safari", "Cultural Program", "Private Cab"],
    exclusions: ["Monument entry fees", "Lunch", "Personal expenses"]
  },
  {
    title: "Dwarka & Somnath Pilgrimage tour",
    slug: "dwarka-somnath-pilgrimage-tour",
    destination: "Ahmedabad - Dwarka - Somnath",
    description: "Visit two of India's most holy coastal temples: Dwarkadhish temple of Lord Krishna and the Jyotirlinga Somnath temple.",
    price: 15999,
    duration: 5,
    category: "PILGRIMAGE",
    images: ["https://images.unsplash.com/photo-1600100398055-144709f6ba43?w=800"],
    itinerary: [
      { day: 1, title: "Ahmedabad to Dwarka Drive", description: "Pickup from Ahmedabad. 8-hour drive to Dwarka. Check-in to hotel. Evening temple darshan." },
      { day: 2, title: "Dwarkadhish Temple & Bet Dwarka", description: "Morning prayers at Dwarkadhish. Take a ferry to Bet Dwarka island. Visit Nageshwar Jyotirlinga." },
      { day: 3, title: "Dwarka to Somnath via Porbandar", description: "Drive to Somnath. Stop at Porbandar to visit Kirti Mandir (Gandhi ji's birthplace). Attend evening Somnath Light & Sound show." },
      { day: 4, title: "Somnath Temple & Junagadh", description: "Pray at Somnath Temple on the shore of Arabian Sea. Drive to Junagadh. Check-in." },
      { day: 5, title: "Junagadh to Ahmedabad Departure", description: "Drive back to Ahmedabad. Drop at Airport." }
    ],
    inclusions: ["3-Star Hotel Stay", "Breakfast Included", "Ferry tickets to Bet Dwarka", "AC Cab for all travel"],
    exclusions: ["Special darshan tickets", "Lunch & Dinner", "Guide charges"]
  },
  {
    title: "Alibaug Beach Escape",
    slug: "alibaug-beach-escape",
    destination: "Alibaug",
    description: "Quick getaway from Mumbai. Take a ferry, visit Kolaba Fort in the sea, and enjoy local Konkani fish thali.",
    price: 5999,
    duration: 2,
    category: "COUPLE",
    images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"],
    itinerary: [
      { day: 1, title: "Mumbai to Alibaug & Kolaba Fort", description: "Take speed boat from Gateway of India to Mandwa. Transfer to Alibaug. Walk to Kolaba Fort inside the sea during low tide." },
      { day: 2, title: "Varsoli Beach & Return", description: "Morning water sports at Varsoli Beach. Return ferry to Mumbai." }
    ],
    inclusions: ["Beachside Resort Stay", "Breakfast Included", "Ferry tickets (Mumbai-Mandwa)", "Local auto/cab transfers"],
    exclusions: ["Water sports charges", "Lunch & Dinner"]
  },

  // --- EAST & NORTH-EAST INDIA (12 Packages) ---
  {
    title: "Darjeeling Tea & Toy Train Vacation",
    slug: "darjeeling-tea-toy-train-vacation",
    destination: "Darjeeling - Kalimpong",
    description: "Watch the sunrise over Mount Kanchenjunga from Tiger Hill. Ride the iconic Himalayan Toy Train and tour lush tea gardens.",
    price: 14999,
    duration: 5,
    category: "FAMILY",
    images: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800"],
    itinerary: [
      { day: 1, title: "Bagdogra to Darjeeling", description: "Pickup from Bagdogra Airport. Drive to Darjeeling (altitude 2,042m). Check-in to hotel." },
      { day: 2, title: "Tiger Hill Sunrise & Local Tour", description: "Early morning (4 AM) trip to Tiger Hill to watch sunrise over Mt. Kanchenjunga. Visit Ghoom Monastery, Batasia Loop (Toy Train), and Tea Garden." },
      { day: 3, title: "Darjeeling Ropeway & Zoo", description: "Visit Padmaja Naidu Himalayan Zoological Park, Himalayan Mountaineering Institute, and enjoy Ropeway ride." },
      { day: 4, title: "Darjeeling to Kalimpong Drive", description: "Drive to Kalimpong. Visit Pine View Nursery, Durpin Monastery, and Deolo Hill." },
      { day: 5, title: "Kalimpong to Bagdogra Departure", description: "Drive back to Bagdogra/NJP for departure." }
    ],
    inclusions: ["3-Star Hotel Stay", "Breakfast Included", "AC Cab for mountain travel", "Sightseeing"],
    exclusions: ["Toy Train tickets (must pre-book)", "Ropeway fees", "Lunch & Dinner"]
  },
  {
    title: "Gangtok & Tsango Lake Adventure",
    slug: "gangtok-tsango-lake-adventure",
    destination: "Gangtok - Tsango Lake - Baba Mandir",
    description: "Explore the beautiful Buddhist capital of Sikkim. Visit pristine Tsango Lake at 3,750m and Nathu La Pass on the Chinese border.",
    price: 16999,
    duration: 5,
    category: "ADVENTURE",
    images: ["https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800"],
    itinerary: [
      { day: 1, title: "Bagdogra to Gangtok Drive", description: "Pickup from Bagdogra. Drive along Teesta river to Gangtok. Check-in." },
      { day: 2, title: "Gangtok Local Monasteries", description: "Visit Rumtek Monastery, Do Drul Chorten, Namgyal Institute of Tibetology, and Ropeway." },
      { day: 3, title: "Tsango Lake & Baba Mandir Excursion", description: "Day trip to high-altitude Tsango Lake and Baba Harbhajan Singh Mandir. Optional Nathu La pass border permit." },
      { day: 4, title: "Tashi View Point & Ban Jhakri", description: "Visit Tashi View Point for mountain ranges, Ganesh Tok, and Ban Jhakri Waterfall park." },
      { day: 5, title: "Gangtok to Bagdogra Departure", description: "Drive back to Bagdogra Airport." }
    ],
    inclusions: ["Deluxe Hotel Stay", "Breakfast & Dinner", "Lake permits and local vehicles", "AC Cab for Bagdogra transfers"],
    exclusions: ["Nathu La permit fees (approx 5,000/cab extra)", "Lunch", "Personal expenses"]
  },
  {
    title: "Meghalaya Waterfalls & Caves Explorer",
    slug: "meghalaya-waterfalls-caves-explorer",
    destination: "Shillong - Cherrapunji - Mawlynnong",
    description: "Visit the wettest place on earth. Trek to the Double Decker Living Root Bridge, explore Mawsmai Cave, and see cleanest village Mawlynnong.",
    price: 19999,
    duration: 6,
    category: "ADVENTURE",
    images: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800"],
    itinerary: [
      { day: 1, title: "Guwahati to Shillong Drive", description: "Pickup from Guwahati Airport. Stop at Umiam Lake (Barapani). Check-in to Shillong hotel." },
      { day: 2, title: "Shillong to Cherrapunji", description: "Drive to Cherrapunji. Visit Elephant Falls, Laitlum Canyons, Nohkalikai Falls, and Mawsmai Cave." },
      { day: 3, title: "Double Decker Living Root Bridge Trek", description: "Trek down 3,500 steps to Nongriat village to see the famous Double Decker Living Root Bridge. Swim in natural pools." },
      { day: 4, title: "Cherrapunji to Mawlynnong & Dawki", description: "Visit Mawlynnong (cleanest village in Asia). Drive to Dawki border town. Enjoy boating on crystal clear Umngot River." },
      { day: 5, title: "Dawki back to Shillong", description: "Return to Shillong. Visit Don Bosco Museum and police bazaar for local shopping." },
      { day: 6, title: "Shillong to Guwahati Departure", description: "Drive to Guwahati. Visit Kamakhya Temple before drop-off at Airport." }
    ],
    inclusions: ["Scenic Hotels/Homestays", "Breakfast Included", "Dawki Boat Ride", "Double Decker trek guide", "AC Transport"],
    exclusions: ["Living root bridge entry fees", "Lunch & Dinner", "Adventure activities"]
  },
  {
    title: "Tawang Monastery Himalayan Tour",
    slug: "tawang-monastery-himalayan-tour",
    destination: "Guwahati - Dirang - Tawang - Bomdila",
    description: "Travel to Arunachal Pradesh's mountain kingdom. Cross Sela Pass (4,170m) and visit the magnificent 400-year-old Tawang Monastery.",
    price: 25999,
    duration: 8,
    category: "SOLO",
    images: ["https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800"],
    itinerary: [
      { day: 1, title: "Guwahati to Bhalukpong", description: "Pickup from Guwahati. Drive to Bhalukpong on Arunachal border. Apply Inner Line Permit." },
      { day: 2, title: "Bhalukpong to Dirang Valley", description: "Drive to Dirang. Visit Dirang Dzong (fortress) and kiwi orchards." },
      { day: 3, title: "Dirang to Tawang via Sela Pass", description: "Drive to Tawang crossing the snow-covered Sela Pass and Sela Lake. Stop at Jaswant Garh War Memorial." },
      { day: 4, title: "Tawang Monastery & Giant Buddha", description: "Visit the massive Tawang Monastery (second-largest in the world) and the 30-foot tall Buddha Statue." },
      { day: 5, title: "Bumla Pass & Madhuri Lake Excursion", description: "Day trip to Bum La Pass on the Indo-China border and Sangetsar Lake (Madhuri Lake) by local army-approved vehicle." },
      { day: 6, title: "Tawang to Bomdila", description: "Drive to Bomdila. Visit Bomdila Monastery and market." },
      { day: 7, title: "Bomdila to Guwahati Drive", description: "Long drive back to Guwahati. Check-in to hotel." },
      { day: 8, title: "Guwahati Departure", description: "Transfer to airport." }
    ],
    inclusions: ["Standard Mountain Stays", "Breakfast & Dinner", "Inner Line Permits", "AC Cab for travel (except Bumla Pass)"],
    exclusions: ["Bumla Pass local army taxi cost (approx 5,000 extra)", "Lunch", "Personal expenses"]
  },
  {
    title: "Kaziranga Rhino Wildlife Safari",
    slug: "kaziranga-rhino-wildlife-safari",
    destination: "Kaziranga National Park - Guwahati",
    description: "Spot the rare One-Horned Indian Rhinoceros. Experience thrilling elephant and jeep safaris in Assam's grass floodplains.",
    price: 14999,
    duration: 4,
    category: "FAMILY",
    images: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800"],
    itinerary: [
      { day: 1, title: "Guwahati to Kaziranga", description: "Pickup from Guwahati. 5-hour drive to Kaziranga. Check-in at wildlife resort. Evening cultural show." },
      { day: 2, title: "Elephant Safari & Jeep Safari", description: "Early morning Elephant Safari in Kohora range (best way to see rhinos closely). Afternoon Open Jeep Safari in Bagori range." },
      { day: 3, title: "Kaziranga Orchid Park & Tea Estate", description: "Visit Kaziranga National Orchid and Biodiversity Park. Walk through organic tea estates." },
      { day: 4, title: "Kaziranga to Guwahati Departure", description: "Return to Guwahati. Drop at airport." }
    ],
    inclusions: ["Jungle Resort Stay", "Breakfast & Dinner", "1 Elephant Safari", "1 Jeep Safari", "AC Sedan transport"],
    exclusions: ["Camera fees", "Lunch", "Folk dance tickets"]
  },
  {
    title: "Sundarbans Mangrove Cruise",
    slug: "sundarbans-mangrove-cruise",
    destination: "Kolkata - Sundarbans National Park",
    description: "Explore the world's largest mangrove forest by boat. Search for Royal Bengal Tigers, saltwater crocodiles, and mudskippers.",
    price: 11999,
    duration: 4,
    category: "GROUP",
    images: ["https://images.unsplash.com/photo-1547139224-891b800c3293?w=800"],
    itinerary: [
      { day: 1, title: "Kolkata to Gadkhali & Boat to Island", description: "Drive from Kolkata to Gadkhali jetting. Board motorized boat to cruise to resort island. Forest entry formalities." },
      { day: 2, title: "Sajnekhali Watch Tower & Tiger Reserve Cruise", description: "Full-day boat cruise through narrow channels. Visit Sajnekhali Watch Tower, Sudhanyakhali Watch Tower, and Dobanki canopy walk." },
      { day: 3, title: "Local Village Walk & Cultural Show", description: "Interact with local honey collectors. Evening Bonbibi Yatra (traditional theatre show)." },
      { day: 4, title: "Sundarbans to Kolkata Departure", description: "Morning boat ride. Return drive to Kolkata." }
    ],
    inclusions: ["Eco-resort stay", "All meals (Fresh local fish/veg)", "Motorized cruise boat", "Forest permits & guides", "Kolkata transport"],
    exclusions: ["Video camera permits", "Personal purchases", "Tips"]
  },
  {
    title: "Puri Jagannath & Konark Sun Temple",
    slug: "puri-jagannath-konark-sun-temple",
    destination: "Bhubaneswar - Puri - Konark - Chilika Lake",
    description: "Visit Odisha's golden triangle. Pray at Jagannath Temple, marvel at the 13th-century Konark Sun Temple, and spot dolphins in Chilika Lake.",
    price: 11500,
    duration: 4,
    category: "PILGRIMAGE",
    images: ["https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=800"],
    itinerary: [
      { day: 1, title: "Bhubaneswar to Puri & Jagannath temple", description: "Pickup from Bhubaneswar. Visit Dhauli Shanti Stupa. Drive to Puri. Evening darshan at Jagannath Temple." },
      { day: 2, title: "Chilika Lake Dolphin Cruise", description: "Excursion to Chilika Lake (Satapada). Take boat ride to spot Irrawaddy dolphins and see sea-mouth." },
      { day: 3, title: "Konark Sun Temple & Chandrabhaga Beach", description: "Drive along Marine Drive to Konark Sun Temple (Black Pagoda). Visit Chandrabhaga Beach. Evening free at Puri Beach market." },
      { day: 4, title: "Bhubaneswar temples & Departure", description: "Return to Bhubaneswar. Visit Lingaraj Temple and Udayagiri & Khandagiri caves. Drop at airport." }
    ],
    inclusions: ["Puri Beach Hotel Stay", "Breakfast Included", "Chilika boat cruise tickets", "AC Cab for all travel"],
    exclusions: ["Temple panda guide charges", "Lunch & Dinner", "Cave entry tickets"]
  },
  {
    title: "Majuli Island Cultural Retreat",
    slug: "majuli-island-cultural-retreat",
    destination: "Jorhat - Majuli Island",
    description: "Stay on the world's largest river island on the Brahmaputra. Experience Neo-Vaishnavite culture, satras, mask making, and Assamese cottage stays.",
    price: 12999,
    duration: 3,
    category: "SOLO",
    images: ["https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=800"],
    itinerary: [
      { day: 1, title: "Jorhat to Majuli Ferry", description: "Pickup from Jorhat. Drive to Nimati Ghat. Take a public ferry across Brahmaputra to Majuli. Check-in to bamboo cottage." },
      { day: 2, title: "Satras & Mask Making Tour", description: "Explore Kamalabari and Auniati Satras. Visit Samaguri Satra to witness traditional mask-making heritage. Watch sunset at Luit river bank." },
      { day: 3, title: "Mishing Tribe Village & Departure", description: "Visit local Mishing tribal village. Return ferry to Jorhat airport." }
    ],
    inclusions: ["Traditional Bamboo cottage stay", "Breakfast & Dinner", "Ferry tickets", "Local auto/cab transfers"],
    exclusions: ["Guide fees", "Lunch", "Personal expenses"]
  },
  {
    title: "Sikkim Goechala Alpine Trek",
    slug: "sikkim-goechala-alpine-trek",
    destination: "Yuksom - Goecha La - Kanchenjunga National Park",
    description: "A challenging high-altitude trek in Sikkim. Walk through rhododendron forests up to 4,940m for close-up views of Mount Kanchenjunga.",
    price: 21999,
    duration: 8,
    category: "ADVENTURE",
    images: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"],
    itinerary: [
      { day: 1, title: "Arrival in Yuksom", description: "Drive from Bagdogra to Yuksom, the historical capital of Sikkim. Meet trek crew." },
      { day: 2, title: "Yuksom to Sachen Trek", description: "Trek 8 km through dense tropical forests of Kanchenjunga National Park." },
      { day: 3, title: "Sachen to Tsokha Trek", description: "Trek 7 km crossing suspension bridges. Steep climb to the refugee village Tsokha." },
      { day: 4, title: "Tsokha to Dzongri Trek", description: "Trek 9 km through beautiful rhododendron forests to the alpine meadow of Dzongri (4,030m)." },
      { day: 5, title: "Dzongri to Thansing Trek", description: "Early morning hike to Dzongri view point. Trek 8 km to Thansing valley below Mt. Pandim." },
      { day: 6, title: "Thansing to Lamuney Camp", description: "Easy 4 km trek to Lamuney base camp. Afternoon briefing for Goechala summit hike." },
      { day: 7, title: "Summit day: Lamuney to Goecha La & Back to Kokchurang", description: "Start at 3 AM. Trek to Goechala View Point 1 (4,600m) for sunrise over Kanchenjunga. Trek back to Kokchurang (total 16 km)." },
      { day: 8, title: "Kokchurang to Yuksom & Departure", description: "Trek back to Yuksom (18 km). Drive back to Bagdogra next morning." }
    ],
    inclusions: ["Tents & Sleeping Bags", "All meals during trek", "Porters, Mules & Trek guides", "National park entry permit"],
    exclusions: ["Yuksom hotels", "Bagdogra transport", "Personal clothing/backpacks"]
  },
  {
    title: "Ziro Valley tribal Explorer",
    slug: "ziro-valley-tribal-explorer",
    destination: "Guwahati - Itanagar - Ziro Valley",
    description: "Meet the Apatani tribe in Arunachal. Admire pine-clad hills, step farming, and attend the world-famous Ziro Music Festival.",
    price: 22999,
    duration: 5,
    category: "SOLO",
    images: ["https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=800"],
    itinerary: [
      { day: 1, title: "Guwahati to Itanagar", description: "Pickup from Guwahati. Drive to Itanagar, capital of Arunachal." },
      { day: 2, title: "Itanagar to Ziro Valley", description: "Drive to Ziro Valley. Meet local Apatani family at homestay." },
      { day: 3, title: "Apatani Village Walk & Hong", description: "Guided walk in Hong, Asia's largest tribal village. Learn about tattooing and nose-plug customs." },
      { day: 4, title: "Talley Valley Wildlife Sanctuary hike", description: "Day trek in Talley Valley, home to rare bamboo orchids. Evening bonfire." },
      { day: 5, title: "Ziro to Guwahati Departure", description: "Long drive back to Guwahati Airport." }
    ],
    inclusions: ["Local Homestay", "Breakfast & Dinner", "Inner Line Permit", "Apatani tribe local guide"],
    exclusions: ["Music festival entry pass", "Lunch", "Transport other than private SUV"]
  },
  {
    title: "Manipur Loktak Lake Heritage Tour",
    slug: "manipur-loktak-lake-heritage-tour",
    destination: "Imphal - Loktak Lake - Moirang",
    description: "See the world's only floating national park (Keibul Lamjao). Float on Phumdis, stay in lakeside huts, and see the rare Sangai deer.",
    price: 16999,
    duration: 4,
    category: "FAMILY",
    images: ["https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800"],
    itinerary: [
      { day: 1, title: "Imphal Arrival & Kangla Fort", description: "Arrive in Imphal. Visit Kangla Fort and IMA Keithel (all-women market)." },
      { day: 2, title: "Loktak Lake & Floating Huts", description: "Drive to Loktak Lake. Take a boat ride to see phumdis (floating landmasses). Overnight in lakeside floating cottage." },
      { day: 3, title: "Keibul Lamjao National Park & Moirang", description: "Visit Keibul Lamjao, the world's only floating national park, to spot Sangai (brow-antlered deer). Visit INA Memorial in Moirang." },
      { day: 4, title: "Imphal departure", description: "Visit War Cemetery. Drop at Imphal Airport." }
    ],
    inclusions: ["Floating Cottage & Hotel stay", "Breakfast Included", "Loktak Lake boat ride", "Private AC transport"],
    exclusions: ["Entry tickets", "Lunch & Dinner", "Tips"]
  },
  {
    title: "Digha Coastal Weekend Escape",
    slug: "digha-coastal-weekend-escape",
    destination: "Kolkata - Digha - Mandarmani",
    description: "Enjoy a quick beach break from Kolkata. Walk along cashew forests, see red crabs, and relax at Mandarmani beach resort.",
    price: 6999,
    duration: 3,
    category: "COUPLE",
    images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"],
    itinerary: [
      { day: 1, title: "Kolkata to Digha Beach Drive", description: "Pickup from Kolkata. 4-hour drive to Digha. Check-in to resort. Sunset at New Digha Beach." },
      { day: 2, title: "Mandarmani Beach & Water Sports", description: "Drive to Mandarmani, a flat beach where cars can drive. Try ATV riding or speed boating. Evening seafood dinner." },
      { day: 3, title: "Udaypur Beach & Return to Kolkata", description: "Visit the serene Udaypur beach on Odisha border. Drive back to Kolkata." }
    ],
    inclusions: ["3-Star Beach Resort Stay", "Breakfast Included", "Private AC Cab from Kolkata", "Toll & Parking"],
    exclusions: ["Beach sports fees", "Lunch & Dinner"]
  },

  // --- ISLANDS (4 Packages) ---
  {
    title: "Andaman Coral Islands Adventure",
    slug: "andaman-coral-islands-adventure",
    destination: "Port Blair - Havelock Island - Neil Island",
    description: "Explore crystal clear oceans and coral reefs. Walk on Radhanagar Beach (Asia's best), snorkel at Elephant Beach, and visit historical Cellular Jail.",
    price: 24999,
    duration: 6,
    category: "COUPLE",
    images: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800"],
    itinerary: [
      { day: 1, title: "Port Blair Arrival & Cellular Jail", description: "Arrive in Port Blair. Visit historic Cellular Jail (Kala Pani) and watch the evening Light & Sound show." },
      { day: 2, title: "Ferry to Havelock Island", description: "Board high-speed cruise ferry to Havelock Island. Check-in at beachside resort. Sunset at Radhanagar Beach." },
      { day: 3, title: "Elephant Beach Snorkeling", description: "Speed boat ride to Elephant Beach. Complimentary snorkeling session to see live corals and marine life." },
      { day: 4, title: "Havelock to Neil Island Cruise", description: "Board ferry to Neil Island. Visit Bharatpur Beach and Laxmanpur Beach (natural bridge formation)." },
      { day: 5, title: "Neil to Port Blair & Shopping", description: "Return ferry to Port Blair. Afternoon free for local woodcraft shopping." },
      { day: 6, title: "Departure from Port Blair", description: "Transfer to airport." }
    ],
    inclusions: ["Premium Beach Resorts", "Daily Breakfast", "Premium Cruise Ferry tickets (Makruzz/Green Ocean)", "Snorkeling session", "AC Cab for all island tours"],
    exclusions: ["Flight tickets", "Scuba diving (optional, can add for 3,500)", "Lunch & Dinner"],
    isFeatured: true
  },
  {
    title: "Havelock Honeymoon Luxury Escape",
    slug: "havelock-honeymoon-luxury-escape",
    destination: "Port Blair - Havelock Island",
    description: "Indulge in a private island retreat. Stay in luxury beach villas, enjoy a private candle-lit dinner by the ocean, and go for sunset scuba dives.",
    price: 39999,
    duration: 5,
    category: "HONEYMOON",
    images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800"],
    itinerary: [
      { day: 1, title: "Port Blair Arrival & Beachfront Resort", description: "Arrive at Port Blair. Transfer to resort. Evening private candle-lit dinner at Corbyn's Cove beach." },
      { day: 2, title: "Havelock Island Luxury Cruise", description: "Premium class cruise ferry to Havelock. Check-in at luxury beach villa with pool. Relax at resort." },
      { day: 3, title: "Private Scuba Diving & Radhanagar Beach", description: "Private couple Scuba Diving session with certified instructors (underwater photos included). Evening sunset at Radhanagar Beach." },
      { day: 4, title: "Elephant Beach Snorkeling & Spa", description: "Chartered boat to Elephant Beach. Afternoon couples massage session at resort spa." },
      { day: 5, title: "Port Blair Transfer & Departure", description: "Cruise back to Port Blair. Drop at Veer Savarkar Airport." }
    ],
    inclusions: ["Luxury Resort Stays", "Breakfast & Dinner", "1 Private Candle-lit Dinner", "1 Scuba Diving session", "Couples Spa Session", "All Cruise tickets"],
    exclusions: ["Airfare", "Personal photos/videos not in dive", "Lunch"]
  },
  {
    title: "Lakshadweep Coral Lagoon Cruise",
    slug: "lakshadweep-coral-lagoon-cruise",
    destination: "Kochi - Agatti Island - Bangaram Island",
    description: "Explore the untouched coral atolls of Lakshadweep. Kayak in shallow turquoise lagoons, swim with sea turtles, and sunbathe on white sandbars.",
    price: 29999,
    duration: 5,
    category: "SOLO",
    images: ["https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800"],
    itinerary: [
      { day: 1, title: "Kochi to Agatti Island Flight", description: "Fly from Kochi to Agatti Island. Breathtaking views of coral reefs from air. Check-in to Agatti beach cottage." },
      { day: 2, title: "Bangaram Island Day Excursion", description: "Speed boat trip to uninhabited Bangaram Island. Walk on pristine sandbars. Spot sea turtles." },
      { day: 3, title: "Agatti Lagoon Kayaking & Glass Boat", description: "Enjoy complimentary kayaking in the calm lagoon. Glass bottom boat ride to view coral gardens." },
      { day: 4, title: "Kalpeni Island or local cycle tour", description: "Explore Agatti island on bicycles. Visit local coconut processing center." },
      { day: 5, title: "Agatti to Kochi Departure", description: "Transfer to Agatti Airport for flight back to Kochi." }
    ],
    inclusions: ["Beachside Cottages", "All Meals (Veg/Seafood)", "Lakshadweep Entry Permits", "Bangaram island speed boat tour", "Kayaking & Glass Boat ride"],
    exclusions: ["Flights Kochi-Agatti-Kochi (approx 11,000)", "Scuba diving / Deep sea fishing", "Tips"],
    isFeatured: true
  },
  {
    title: "Baratang Island Mangrove Expedition",
    slug: "baratang-island-mangrove-expedition",
    destination: "Port Blair - Baratang Island",
    description: "Unravel Andaman's secret wonders. Cruise through dense mangrove forests, walk through limestone caves, and see active mud volcanoes.",
    price: 11999,
    duration: 3,
    category: "ADVENTURE",
    images: ["https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=800"],
    itinerary: [
      { day: 1, title: "Port Blair to Baratang via Jarawa Reserve", description: "Drive early morning through Jarawa Tribal Reserve Forest. Spot Jarawa tribes from vehicle (strict rules apply). Take vehicle ferry to Baratang Island." },
      { day: 2, title: "Limestone Caves & Mud Volcano", description: "Speedboat ride through dense mangrove canopy. Trek 1.5 km to Limestone Caves. Afternoon visit to Mud Volcano. Evening sunset at Baludera Beach." },
      { day: 3, title: "Baratang to Port Blair Return", description: "Drive back through Jarawa reserve. Drop at Port Blair airport." }
    ],
    inclusions: ["Standard guest house", "All meals", "Forest clearances & permits", "Speedboat rides", "AC Transfers"],
    exclusions: ["Camera charges", "Personal tips"]
  },

  // --- ADDITIONAL UNIQUE INDIAN DESTINATIONS TO MAKE IT 52 PACKAGES ---
  {
    title: "Coorg & Wayanad Twin Hills Tour",
    slug: "coorg-wayanad-twin-hills-tour",
    destination: "Bangalore - Coorg - Wayanad",
    description: "Enjoy the lush green valleys of Karnataka and Kerala. Walk through tea and coffee gardens, see lakes, and explore waterfalls.",
    price: 18999,
    duration: 5,
    category: "FAMILY",
    images: ["https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800"],
    itinerary: [
      { day: 1, title: "Bangalore to Coorg & Abbey Falls", description: "Pickup and drive to Coorg. Visit Abbey Falls and Raja's seat." },
      { day: 2, title: "Coorg Sightseeing", description: "Visit Dubare Elephant Camp, Bylakuppe Golden Temple, and Nisargadhama." },
      { day: 3, title: "Coorg to Wayanad", description: "Drive to Wayanad, Kerala. Check-in. Visit Banasura Sagar Dam." },
      { day: 4, title: "Wayanad Exploration", description: "Visit Edakkal Caves and Soochipara Waterfalls." },
      { day: 5, title: "Wayanad to Bangalore Departure", description: "Drive back to Bangalore. Drop at airport." }
    ],
    inclusions: ["3-Star Hotel Stay", "Breakfast Included", "AC Cab for entire tour"],
    exclusions: ["Trek guides", "Lunch & Dinner", "Entry tickets"]
  },
  {
    title: "Golden Triangle with Varanasi",
    slug: "golden-triangle-with-varanasi",
    destination: "Delhi - Agra - Jaipur - Varanasi",
    description: "Expand the classic Indian experience. See the historical gems of Agra and Jaipur, and fly to the spiritual center Varanasi.",
    price: 29999,
    duration: 9,
    category: "PILGRIMAGE",
    images: ["https://images.unsplash.com/photo-1561361041-c96a49f80988?w=800"],
    itinerary: [
      { day: 1, title: "Arrive Delhi", description: "Arrive at Delhi. Overnight stay." },
      { day: 2, title: "Delhi Tour", description: "Red Fort, Qutub Minar, India Gate." },
      { day: 3, title: "Delhi to Agra", description: "Drive to Agra. Taj Mahal sunset." },
      { day: 4, title: "Agra to Jaipur", description: "Visit Agra Fort. Drive to Jaipur." },
      { day: 5, title: "Jaipur Tour", description: "Amber Fort, Hawa Mahal, City Palace." },
      { day: 6, title: "Jaipur to Delhi & Train to Varanasi", description: "Drive back to Delhi. Board overnight AC train to Varanasi." },
      { day: 7, title: "Arrive Varanasi & Ganga Aarti", description: "Check-in to hotel. Evening boat ride and Aarti." },
      { day: 8, title: "Varanasi Ghats & Sarnath", description: "Morning boat ride. Visit temples. Afternoon Sarnath visit." },
      { day: 9, title: "Varanasi Departure", description: "Transfer to Varanasi airport." }
    ],
    inclusions: ["3-Star Hotel Stay", "Breakfast Included", "AC Sleeper Train tickets", "AC transport", "Boat rides"],
    exclusions: ["Monument entry fees", "Lunch & Dinner"]
  },
  {
    title: "Best of Himachal Backpacking",
    slug: "best-of-himachal-backpacking",
    destination: "Delhi - Manali - Kasol - Kheerganga",
    description: "Hike through the hippie paradise of Parvati Valley. Sleep in Kheerganga tents next to natural hot springs.",
    price: 8999,
    duration: 5,
    category: "GROUP",
    images: ["https://images.unsplash.com/photo-1598977123418-45f04b615e37?w=800"],
    itinerary: [
      { day: 1, title: "Delhi to Manali Overnight Bus", description: "Board luxury Volvo bus from Delhi to Manali." },
      { day: 2, title: "Manali Local exploration", description: "Hadimba Temple, Old Manali cafes, Mall Road." },
      { day: 3, title: "Manali to Kasol & Manikaran", description: "Drive to Kasol. Visit Manikaran hot springs and Gurudwara. Stay in Kasol riverside." },
      { day: 4, title: "Kheerganga Trek & Camping", description: "Trek 12km from Barshaini to Kheerganga. Take a dip in natural hot springs. Stay in tents." },
      { day: 5, title: "Kheerganga to Delhi Departure", description: "Trek back down. Board overnight Volvo back to Delhi." }
    ],
    inclusions: ["Homestay & Camp stay", "Breakfast & Dinner", "Volvo tickets", "Trek guide"],
    exclusions: ["Personal porters", "Lunch", "Any items not in inclusion"]
  },
  {
    title: "Sunderbans & Kolkata Cultural Tour",
    slug: "sunderbans-kolkata-cultural-tour",
    destination: "Kolkata - Sunderbans",
    description: "Combine the colonial charm of Kolkata with the wild delta mangrove forest of Sunderbans.",
    price: 13999,
    duration: 5,
    category: "FAMILY",
    images: ["https://images.unsplash.com/photo-1558431382-27e303142255?w=800"],
    itinerary: [
      { day: 1, title: "Kolkata Arrival & City Walk", description: "Arrive in Kolkata. Visit Victoria Memorial and Howrah Bridge." },
      { day: 2, title: "Dakshineswar Temple & local food", description: "Visit Dakshineswar Kali Temple and Belur Math. Enjoy local sweets." },
      { day: 3, title: "Kolkata to Sunderbans", description: "Drive to Sunderbans. Evening mangrove walk." },
      { day: 4, title: "Sunderbans Watch Towers Boat Tour", description: "Day cruise inside the forest to search for tigers and birds." },
      { day: 5, title: "Sunderbans to Kolkata Departure", description: "Transfer back to Kolkata Airport." }
    ],
    inclusions: ["3-Star Hotel & Eco Lodge", "Daily Breakfast, All Meals at Sunderbans", "AC Transport", "Boat Cruise"],
    exclusions: ["Monument entry fees", "Kolkata Lunch & Dinner"]
  },
  {
    title: "Rajasthan Forts & Desert Special",
    slug: "rajasthan-forts-desert-special",
    destination: "Jaipur - Pushkar - Jodhpur - Jaisalmer",
    description: "Explore Rajasthan's famous desert circuit. Pray at Pushkar's Brahma Temple, see the Blue City Jodhpur, and camp in Jaisalmer.",
    price: 21999,
    duration: 7,
    category: "GROUP",
    images: ["https://images.unsplash.com/photo-1504681869397-bb707b667825?w=800"],
    itinerary: [
      { day: 1, title: "Arrive Jaipur", description: "Check-in. Evening visit Jal Mahal." },
      { day: 2, title: "Jaipur Sightseeing & Pushkar Drive", description: "Visit Amber Fort. Drive to Pushkar. Visit Pushkar lake." },
      { day: 3, title: "Pushkar to Jodhpur", description: "Brahma temple visit. Drive to Jodhpur. Evening free at local market." },
      { day: 4, title: "Jodhpur Sightseeing & Jaisalmer Drive", description: "Explore Mehrangarh Fort. Drive to Jaisalmer." },
      { day: 5, title: "Jaisalmer Fort & Sam Dunes", description: "Visit Jaisalmer Golden Fort. Proceed to desert camp for camel ride & dinner." },
      { day: 6, title: "Jaisalmer to Jodhpur Return", description: "Drive back to Jodhpur. Overnight stay." },
      { day: 7, title: "Jodhpur Departure", description: "Drop at Jodhpur Airport." }
    ],
    inclusions: ["3-Star Hotels & Camps", "Daily Breakfast & Dinner", "Desert safari & program", "AC Cab for all travel"],
    exclusions: ["Guide charges", "Lunch", "Entry tickets"]
  },
  {
    title: "Uttarakhand Hill Station Explorer",
    slug: "uttarakhand-hill-station-explorer",
    destination: "Delhi - Rishikesh - Mussoorie - Corbett",
    description: "Explore the diverse landscapes of Uttarakhand: holy Ganges at Rishikesh, misty Mussoorie, and the jungles of Corbett.",
    price: 15999,
    duration: 6,
    category: "FAMILY",
    images: ["https://images.unsplash.com/photo-1542856391-010fb87dcfed?w=800"],
    itinerary: [
      { day: 1, title: "Delhi to Rishikesh", description: "Drive to Rishikesh. Attend Ganga Aarti." },
      { day: 2, title: "Rishikesh to Mussoorie", description: "Adventure rafting in morning. Afternoon drive to Mussoorie." },
      { day: 3, title: "Mussoorie Sightseeing", description: "Kempty Falls, Gun Hill, Landour." },
      { day: 4, title: "Mussoorie to Corbett National Park", description: "Drive down to Corbett forest. Evening free." },
      { day: 5, title: "Corbett Safari", description: "Early morning jeep safari. Evening at leisure." },
      { day: 6, title: "Corbett to Delhi Departure", description: "Return drive to Delhi." }
    ],
    inclusions: ["3-Star Hotel Stay", "Daily Breakfast & Dinner", "1 Jeep Safari", "AC Cab for transport"],
    exclusions: ["Rafting fees", "Lunch", "Monument fees"]
  },
  {
    title: "Spiritual Char Dham with Haridwar",
    slug: "spiritual-char-dham-with-haridwar",
    destination: "Haridwar - Yamunotri - Gangotri - Kedarnath - Badrinath",
    description: "Complete 12-day sacred Hindu pilgrimage covering all four Himalayan abodes of gods in Uttarakhand.",
    price: 24999,
    duration: 12,
    category: "PILGRIMAGE",
    images: ["https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=800"],
    itinerary: [
      { day: 1, title: "Haridwar to Barkot", description: "Pickup from Haridwar. Scenic drive to Barkot." },
      { day: 2, title: "Yamunotri Darshan", description: "Trek to Yamunotri Temple. Perform pooja. Return to Barkot." },
      { day: 3, title: "Barkot to Uttarkashi", description: "Drive along Bhagirathi river to Uttarkashi." },
      { day: 4, title: "Gangotri Darshan", description: "Drive to Gangotri Temple. Take holy bath. Back to Uttarkashi." },
      { day: 5, title: "Uttarkashi to Guptkashi", description: "Drive to Guptkashi. Visit Vishwanath Temple." },
      { day: 6, title: "Guptkashi to Kedarnath Trek", description: "Drive to Sonprayag. 16km trek to Kedarnath Temple. Stay overnight at Kedarnath." },
      { day: 7, title: "Kedarnath Temple Darshan & Return", description: "Early morning prayers. Trek down to Sonprayag. Drive back to Guptkashi." },
      { day: 8, title: "Guptkashi to Badrinath", description: "Drive to Badrinath Dham. Check-in to hotel." },
      { day: 9, title: "Badrinath Darshan & Mana Village", description: "Pray at Badrinath temple. Visit Mana village, the last Indian village." },
      { day: 10, title: "Badrinath to Pipalkoti", description: "Drive towards Pipalkoti/Rudraprayag." },
      { day: 11, title: "Pipalkoti to Rishikesh", description: "Drive to Rishikesh. Evening free to explore Lakshman Jhula." },
      { day: 12, title: "Rishikesh to Haridwar Departure", description: "Drop at Haridwar station." }
    ],
    inclusions: ["Basic Guesthouses/Hotels", "All Vegetarian Meals", "AC Tempo Traveller/SUV", "Permits"],
    exclusions: ["Helicopter ride to Kedarnath", "Pony/Doli charges", "Personal expenses"]
  },
  {
    title: "Wildlife, Coffee & Beach Special",
    slug: "wildlife-coffee-beach-special",
    destination: "Bangalore - Kabini - Coorg - Gokarna",
    description: "Perfect combinations: spot tigers in Kabini, hike coffee hills in Coorg, and relax on Gokarna's beaches.",
    price: 22999,
    duration: 7,
    category: "ADVENTURE",
    images: ["https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=800"],
    itinerary: [
      { day: 1, title: "Bangalore to Kabini Safari", description: "Drive from Bangalore to Kabini forest. Evening wildlife safari." },
      { day: 2, title: "Kabini to Coorg Hills", description: "Morning boat ride. Drive to Coorg coffee estates." },
      { day: 3, title: "Coorg sightseeing", description: "Visit Dubare Camp and Abbey Falls." },
      { day: 4, title: "Coorg to Gokarna Beach", description: "Scenic drive from hills down to Gokarna coast." },
      { day: 5, title: "Gokarna Om Beach Trek", description: "Beach trek covering major beaches. Watch sunset." },
      { day: 6, title: "Gokarna Beach Relax", description: "Day free for sunbathing or local market shopping." },
      { day: 7, title: "Gokarna to Hubli Departure", description: "Drive to Hubli Airport for flight back." }
    ],
    inclusions: ["3-Star Hotel Stay", "Breakfast Included, All Meals at Kabini", "1 Jungle Jeep Safari", "AC Cab transport"],
    exclusions: ["Boating fees", "Lunch & Dinner other than Kabini"]
  },
  {
    title: "French Pondy & Temple Cities",
    slug: "french-pondy-temple-cities",
    destination: "Chennai - Mahabalipuram - Pondicherry",
    description: "Explore the UNESCO stone carvings of Mahabalipuram and the French colonial streets of Pondicherry.",
    price: 10999,
    duration: 4,
    category: "COUPLE",
    images: ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
    itinerary: [
      { day: 1, title: "Chennai to Mahabalipuram", description: "Arrive in Chennai. Drive to Mahabalipuram. Visit Shore Temple and Five Rathas." },
      { day: 2, title: "Mahabalipuram to Pondicherry", description: "Drive along ECR to Pondy. Evening walk on Rock Beach." },
      { day: 3, title: "Pondicherry French Quarter & Auroville", description: "Explore White town on foot. Afternoon visit to Auroville." },
      { day: 4, title: "Pondy to Chennai Departure", description: "Return drive to Chennai." }
    ],
    inclusions: ["Boutique Hotels Stay", "Daily Breakfast", "AC Cab for all travel", "Guided walk in White town"],
    exclusions: ["Monument entry fees", "Lunch & Dinner"]
  },
  {
    title: "Best of Kerala Houseboats & Wildlife",
    slug: "best-of-kerala-houseboats-wildlife",
    destination: "Kochi - Thekkady - Alleppey - Kochi",
    description: "Enjoy wild elephant boat safaris in Thekkady, and cruise along romantic backwaters in Alleppey.",
    price: 15999,
    duration: 5,
    category: "COUPLE",
    images: ["https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800"],
    itinerary: [
      { day: 1, title: "Kochi to Thekkady Drive", description: "Pickup from Kochi. Drive to Thekkady. Visit spice garden." },
      { day: 2, title: "Thekkady Periyar Safari", description: "Morning boat ride in Periyar Lake. Afternoon spice walk." },
      { day: 3, title: "Thekkady to Alleppey Houseboat", description: "Drive to Alleppey. Board private houseboat. Day & night cruise." },
      { day: 4, title: "Alleppey backwater tour", description: "Relaxing cruise through smaller canals." },
      { day: 5, title: "Alleppey to Kochi Departure", description: "Transfer back to Kochi." }
    ],
    inclusions: ["Houseboat & Hotel Stay", "Breakfast Included, All Meals on Houseboat", "AC Sedan transport"],
    exclusions: ["Boat ride tickets in Periyar", "Lunch & Dinner in hotel stays"]
  },
  {
    title: "East India Hill Stations & Tea Tour",
    slug: "east-india-hill-stations-tea-tour",
    destination: "Kolkata - Darjeeling - Gangtok",
    description: "Enjoy the British colonial charm of Darjeeling, view Mount Kanchenjunga, and experience Sikkimese culture in Gangtok.",
    price: 21999,
    duration: 7,
    category: "FAMILY",
    images: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800"],
    itinerary: [
      { day: 1, title: "Kolkata to Bagdogra & Drive to Darjeeling", description: "Fly from Kolkata to Bagdogra. Drive to Darjeeling." },
      { day: 2, title: "Darjeeling Tea & Toy Train", description: "Early sunrise at Tiger hill. Toy train ride and tea estate walk." },
      { day: 3, title: "Darjeeling Sightseeing", description: "Visit Zoo, mountaineering institute, and ropeway." },
      { day: 4, title: "Darjeeling to Gangtok", description: "Scenic drive along Teesta river to Gangtok." },
      { day: 5, title: "Gangtok Lakes & Monasteries", description: "Visit Tsango Lake and Baba Mandir." },
      { day: 6, title: "Gangtok City Tour", description: "Explore local monasteries and viewpoints." },
      { day: 7, title: "Gangtok to Bagdogra Departure", description: "Drive back to Bagdogra for departure." }
    ],
    inclusions: ["3-Star Hotels Stay", "Daily Breakfast & Dinner", "Private AC Cab for hills", "Toy Train tickets"],
    exclusions: ["Nathu La pass permit", "Lunch", "Monument fees"]
  },
  {
    title: "Royal Jodhpur & Desert Special",
    slug: "royal-jodhpur-desert-special",
    destination: "Jodhpur - Jaisalmer",
    description: "Walk inside Mehrangarh Fort, explore Mehrangarh museum, and sleep in desert camps in Jaisalmer.",
    price: 11999,
    duration: 4,
    category: "COUPLE",
    images: ["https://images.unsplash.com/photo-1504681869397-bb707b667825?w=800"],
    itinerary: [
      { day: 1, title: "Arrive Jodhpur", description: "Visit Mehrangarh Fort and Jaswant Thada." },
      { day: 2, title: "Jodhpur to Jaisalmer", description: "Drive to Jaisalmer. Visit Gadisar lake." },
      { day: 3, title: "Jaisalmer Fort & Sam Dunes", description: "Visit Golden Fort and havelis. Afternoon proceed to desert camp for camel ride and dinner." },
      { day: 4, title: "Jaisalmer Departure", description: "Drop at Jaisalmer railway station." }
    ],
    inclusions: ["3-Star Hotel & Camp Stay", "Daily Breakfast & Dinner", "Camel safari", "AC Sedan transport"],
    exclusions: ["Monument entry fees", "Lunch"]
  },
  {
    title: "Andaman Beach & Scuba Tour",
    slug: "andaman-beach-scuba-tour",
    destination: "Port Blair - Havelock Island",
    description: "Unwind on Radhanagar Beach and go for professional Scuba diving in Havelock's turquoise waters.",
    price: 18999,
    duration: 4,
    category: "ADVENTURE",
    images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800"],
    itinerary: [
      { day: 1, title: "Arrive Port Blair", description: "Cellular Jail tour and light & sound show." },
      { day: 2, title: "Havelock Cruise & Sunset", description: "Board cruise ferry to Havelock. Sunset at Radhanagar Beach." },
      { day: 3, title: "Scuba Diving & Radhanagar Beach", description: "Morning Scuba diving session. Afternoon at leisure." },
      { day: 4, title: "Havelock to Port Blair Departure", description: "Ferry back to Port Blair and transfer to Airport." }
    ],
    inclusions: ["Beachside Resort Stay", "Breakfast Included", "Cruise tickets", "1 Scuba Diving session", "All transfers"],
    exclusions: ["Airfare", "Lunch & Dinner"]
  },
  {
    title: "Spiritual Haridwar, Rishikesh & Varanasi",
    slug: "spiritual-haridwar-rishikesh-varanasi",
    destination: "Haridwar - Rishikesh - Varanasi",
    description: "A complete spiritual trip of North India. Witness Ganga Aarti at Har Ki Pauri and Dashashwamedh Ghat.",
    price: 17999,
    duration: 7,
    category: "PILGRIMAGE",
    images: ["https://images.unsplash.com/photo-1561361041-c96a49f80988?w=800"],
    itinerary: [
      { day: 1, title: "Delhi to Haridwar", description: "Drive to Haridwar. Attend Ganga Aarti." },
      { day: 2, title: "Haridwar to Rishikesh", description: "Visit temples and ashrams in Rishikesh." },
      { day: 3, title: "Rishikesh exploration", description: "Yoga session and river rafting." },
      { day: 4, title: "Rishikesh to Delhi & flight to Varanasi", description: "Drive to Delhi airport. Fly to Varanasi." },
      { day: 5, title: "Varanasi Ghats Tour", description: "Sunrise boat ride, Kashi Vishwanath temple visit, evening Ganga Aarti." },
      { day: 6, title: "Sarnath Excursion", description: "Day trip to Sarnath Buddhist ruins." },
      { day: 7, title: "Varanasi Departure", description: "Transfer to Varanasi airport." }
    ],
    inclusions: ["3-Star Hotel Stay", "Breakfast Included", "AC Cab for sightseeing", "Boat rides", "Domestic flight Delhi-Varanasi"],
    exclusions: ["Monument fees", "Lunch & Dinner"]
  },
  {
    title: "Rann of Kutch & Gir Lion Tour",
    slug: "rann-of-kutch-gir-lion-tour",
    destination: "Bhuj - White Rann - Sasan Gir",
    description: "The complete Gujarat tour. Explore the white salt desert and spot Asiatic Lions in Gir Forest.",
    price: 24999,
    duration: 6,
    category: "FAMILY",
    images: ["https://images.unsplash.com/photo-1602491453977-63a33bc51fdb?w=800"],
    itinerary: [
      { day: 1, title: "Bhuj Arrival & Rann Camp", description: "Pickup and transfer to White Rann camp. Cultural program." },
      { day: 2, title: "White Rann Sunrise & Kala Dungar", description: "Sunrise at Salt desert. Excursion to Black Hill." },
      { day: 3, title: "Bhuj to Sasan Gir", description: "Long drive to Gir National Park. Check-in to forest resort." },
      { day: 4, title: "Gir Lion Safari", description: "Early morning jeep safari. Afternoon free to relax at resort." },
      { day: 5, title: "Junagadh Excursion", description: "Visit Junagadh heritage structures. Back to Gir." },
      { day: 6, title: "Gir to Rajkot Departure", description: "Transfer to Rajkot Airport." }
    ],
    inclusions: ["Standard resort & camps", "Breakfast, Dinner, All meals at Gir", "1 Gir Lion Safari", "AC Cab transport"],
    exclusions: ["Flight tickets", "Lunch other than Gir resort"]
  },
  {
    title: "Chikmagalur & Coorg Adventure Homestay",
    slug: "chikmagalur-coorg-adventure-homestay",
    destination: "Bangalore - Chikmagalur - Coorg",
    description: "Experience plantation life in Karnataka. Hike hills, visit waterfalls, and sleep inside active estates.",
    price: 14999,
    duration: 5,
    category: "GROUP",
    images: ["https://images.unsplash.com/photo-1611001716885-b3402558a62b?w=800"],
    itinerary: [
      { day: 1, title: "Bangalore to Chikmagalur", description: "Pickup and drive to Chikmagalur plantation." },
      { day: 2, title: "Mullayanagiri Peak Trek", description: "Trek to Mullayanagiri peak. Visit Jhari falls." },
      { day: 3, title: "Chikmagalur to Coorg", description: "Drive to Coorg coffee estatehomestay." },
      { day: 4, title: "Coorg sightseeing", description: "Visit Dubare Elephant Camp, Abbey Falls, and Golden Temple." },
      { day: 5, title: "Coorg to Bangalore Departure", description: "Drive back to Bangalore." }
    ],
    inclusions: ["Homestay Stay", "All Meals (Breakfast, Lunch, Dinner)", "Trek guides", "AC Cab transport"],
    exclusions: ["Rafting fees", "Personal expenses"]
  },
  {
    title: "Sikkim & Meghalaya North-East Special",
    slug: "sikkim-meghalaya-north-east-special",
    destination: "Guwahati - Shillong - Gangtok - Darjeeling",
    description: "A grand tour of North-East India. Explore Cherrapunji root bridges, Gangtok monasteries, and Darjeeling sunrise.",
    price: 34999,
    duration: 10,
    category: "FAMILY",
    images: ["https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800"],
    itinerary: [
      { day: 1, title: "Guwahati to Shillong", description: "Arrive in Guwahati. Drive to Shillong. Check-in." },
      { day: 2, title: "Cherrapunji Waterfalls", description: "Explore Cherrapunji caves and waterfalls." },
      { day: 3, title: "Mawlynnong Cleanest Village", description: "Visit Asia's cleanest village and Dawki river." },
      { day: 4, title: "Shillong to Guwahati & flight to Bagdogra & Drive to Gangtok", description: "Transfer to Guwahati. Fly to Bagdogra. Drive to Gangtok." },
      { day: 5, title: "Gangtok local tour", description: "Explore local monasteries." },
      { day: 6, title: "Tsango Lake Excursion", description: "Visit high-altitude Tsango Lake." },
      { day: 7, title: "Gangtok to Darjeeling", description: "Drive to Darjeeling." },
      { day: 8, title: "Darjeeling local tour", description: "Early morning sunrise at Tiger Hill. Tea garden walk." },
      { day: 9, title: "Darjeeling relaxation", description: "Day free for shopping." },
      { day: 10, title: "Darjeeling to Bagdogra Departure", description: "Drop at Bagdogra Airport." }
    ],
    inclusions: ["3-Star Hotels Stay", "Daily Breakfast & Dinner", "AC Cab for all transfers", "Domestic flight Guwahati-Bagdogra"],
    exclusions: ["Nathu La permits", "Lunch", "Monument fees"]
  },
  {
    title: "Rajasthan Heritage with Jaisalmer",
    slug: "rajasthan-heritage-with-jaisalmer",
    destination: "Jaipur - Jodhpur - Udaipur - Jaisalmer",
    description: "Cover the classic Rajasthan tour package with desert camping and camel safaris in Jaisalmer.",
    price: 29999,
    duration: 9,
    category: "FAMILY",
    images: ["https://images.unsplash.com/photo-1477587458883-471a5ed94245?w=800"],
    itinerary: [
      { day: 1, title: "Arrive Jaipur", description: "Check-in to hotel. Evening visit Birla Temple." },
      { day: 2, title: "Jaipur Forts", description: "Amber Fort, Hawa Mahal, City Palace." },
      { day: 3, title: "Jaipur to Jodhpur", description: "Drive to Jodhpur. Visit Mandore gardens." },
      { day: 4, title: "Jodhpur Blue City", description: "Mehrangarh Fort, Jaswant Thada." },
      { day: 5, title: "Jodhpur to Jaisalmer", description: "Drive to Jaisalmer Golden Fort." },
      { day: 6, title: "Jaisalmer Desert Camping", description: "Desert camp. Camel safari, Rajasthani folk dance." },
      { day: 7, title: "Jaisalmer to Udaipur", description: "Drive to Udaipur. Check-in." },
      { day: 8, title: "Udaipur Sightseeing", description: "City Palace, boat ride on Lake Pichola." },
      { day: 9, title: "Udaipur Departure", description: "Drop at Udaipur Airport." }
    ],
    inclusions: ["3-Star Hotels & Camps", "Daily Breakfast & Dinner", "Desert program & safari", "AC Cab for all travel"],
    exclusions: ["Guide charges", "Lunch", "Monument fees"]
  },
  {
    title: "Himachal Spiti Valley Expedition",
    slug: "himachal-spiti-valley-expedition",
    destination: "Shimla - Kaza - Chandratal - Manali",
    description: "Explore the remote Spiti Valley. See old monasteries, high-altitude passes, and sleep next to Chandratal Lake.",
    price: 26999,
    duration: 8,
    category: "ADVENTURE",
    images: ["https://images.unsplash.com/photo-1616421946026-6140810ee393?w=800"],
    itinerary: [
      { day: 1, title: "Shimla to Kalpa", description: "Drive from Shimla along Sutlej river to Kalpa." },
      { day: 2, title: "Kalpa to Tabo", description: "Drive to Tabo. Visit Nako lake." },
      { day: 3, title: "Tabo to Kaza", description: "Explore Dhankar monastery. Drive to Kaza." },
      { day: 4, title: "Kaza Local Tour", description: "Visit Key Monastery, Kibber village, and Hikkim." },
      { day: 5, title: "Kaza to Chandratal Lake", description: "Drive over Kunzum pass to Chandratal. Overnight camping." },
      { day: 6, title: "Chandratal to Manali", description: "Drive to Manali crossing Rohtang Pass." },
      { day: 7, title: "Manali Local rest", description: "Visit Hadimba temple and local cafes." },
      { day: 8, title: "Manali to Delhi Departure", description: "Volvo bus back to Delhi." }
    ],
    inclusions: ["Homestay & Camp stay", "Breakfast & Dinner", " अनुभवी Driver & SUV", "Permits"],
    exclusions: ["Lunch", "Adventure sports"]
  },
  {
    title: "Munnar, Thekkady & Alleppey Honeymoon Special",
    slug: "munnar-thekkady-alleppey-honeymoon-special",
    destination: "Kochi - Munnar - Thekkady - Alleppey",
    description: "Enjoy a premium romantic tour of Kerala. Stay in treehouses, see spice gardens, and cruise on private houseboats.",
    price: 21999,
    duration: 6,
    category: "HONEYMOON",
    images: ["https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800"],
    itinerary: [
      { day: 1, title: "Kochi to Munnar Drive", description: "Pickup and drive to Munnar. Sunset valley view." },
      { day: 2, title: "Munnar Tea Hills Tour", description: "Visit tea estates, Eravikulam park, and Mattupetty dam." },
      { day: 3, title: "Munnar to Thekkady", description: "Drive to Thekkady. Visit spice gardens. Evening show." },
      { day: 4, title: "Thekkady to Alleppey Houseboat", description: "Drive to Alleppey. Board private houseboat. Overnight cruise." },
      { day: 5, title: "Alleppey backwater cruise", description: "Full day cruising. Dinner on board." },
      { day: 6, title: "Alleppey to Kochi Departure", description: "Drive back to Kochi Airport." }
    ],
    inclusions: ["Houseboat + 4-Star Resort stays", "All meals in houseboat, breakfast in hotels", "Private AC Cab", "Honeymoon special cake & flower decoration"],
    exclusions: ["Entry tickets", "Lunch & Dinner in hotels"]
  },
  {
    title: "Rishikesh Camping & Rafting weekend",
    slug: "rishikesh-camping-rafting-weekend",
    destination: "Rishikesh",
    description: "Enjoy camping on the banks of Ganges, river rafting, and bonfires in Rishikesh.",
    price: 5999,
    duration: 3,
    category: "GROUP",
    images: ["https://images.unsplash.com/photo-1598977123418-45f04b615e37?w=800"],
    itinerary: [
      { day: 1, title: "Delhi to Rishikesh Camp", description: "Drive from Delhi. Check-in to riverside camps. Bonfire." },
      { day: 2, title: "River Rafting & Cliff Jump", description: "16km white water rafting. Waterfall trek." },
      { day: 3, title: "Beatles Ashram & Return", description: "Visit Beatles Ashram. Drive back to Delhi." }
    ],
    inclusions: ["2 Nights Camp Stay", "All Meals at Camp", "Rafting session", "Transport from Delhi"],
    exclusions: ["Ashram entry fee", "Personal expenses"]
  },
  {
    title: "Leh Ladakh Bike Trip",
    slug: "leh-ladakh-bike-trip",
    destination: "Leh - Nubra - Pangong - Leh",
    description: "Ride through highest passes of the world on Royal Enfield bikes in Ladakh.",
    price: 34999,
    duration: 7,
    category: "ADVENTURE",
    images: ["https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800"],
    itinerary: [
      { day: 1, title: "Leh Arrival & Acclimatization", description: "Rest and pick up Royal Enfield bikes." },
      { day: 2, title: "Leh Local Monasteries", description: "Visit Magnetic Hill and Hall of Fame." },
      { day: 3, title: "Leh to Nubra via Khardung La", description: "Ride over Khardung La pass. Overnight in Nubra." },
      { day: 4, title: "Nubra to Pangong Tso", description: "Ride along Shyok river to Pangong Lake." },
      { day: 5, title: "Pangong to Leh via Chang La", description: "Ride back to Leh crossing Chang La pass." },
      { day: 6, title: "Leh local shopping", description: "Free day for shopping or rafting." },
      { day: 7, title: "Leh Departure", description: "Drop at Leh airport." }
    ],
    inclusions: ["Standard Hotels/Camps", "Breakfast & Dinner", "Royal Enfield 500cc Bike with fuel", "Inner Line Permits", "Mechanic with backup vehicle"],
    exclusions: ["Airfare", "Helmet & gear (available for rent)", "Lunch"]
  },
  {
    title: "Char Dham Yatra by Helicopter",
    slug: "char-dham-yatra-by-helicopter",
    destination: "Dehradun - Yamunotri - Gangotri - Kedarnath - Badrinath",
    description: "Premium VIP Char Dham pilgrimage covering all four sites in just 5 days by helicopter from Dehradun.",
    price: 185000,
    duration: 5,
    category: "PILGRIMAGE",
    images: ["https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=800"],
    itinerary: [
      { day: 1, title: "Dehradun to Kharsali (Yamunotri)", description: "Fly from Sahastradhara heliport to Kharsali. Visit Yamunotri temple." },
      { day: 2, title: "Kharsali to Harsil (Gangotri)", description: "Fly to Harsil. Drive to Gangotri temple for darshan." },
      { day: 3, title: "Harsil to Kedarnath", description: "Fly to Sersi. Shuttle heli to Kedarnath. VIP Darshan." },
      { day: 4, title: "Kedarnath to Badrinath", description: "Fly to Badrinath. VIP Darshan at Badrinath Temple." },
      { day: 5, title: "Badrinath to Dehradun Departure", description: "Fly back to Dehradun Sahastradhara." }
    ],
    inclusions: ["Luxury Heli flights", "VIP Darshan permits", "Premium Hotels Stay", "All Meals", "Local handlers & transfers"],
    exclusions: ["Personal pooja offerings", "Tips"]
  },
  {
    title: "Goa Beach Party Weekend Tour",
    slug: "goa-beach-party-weekend-tour",
    destination: "North Goa",
    description: "Quick weekend beach party in Goa. Cruise, water sports, and beach clubs.",
    price: 9999,
    duration: 3,
    category: "GROUP",
    images: ["https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800"],
    itinerary: [
      { day: 1, title: "Arrive Goa", description: "Transfer to North Goa hotel. Evening beach club party." },
      { day: 2, title: "Water Sports & Cruise", description: "Parasailing & jet ski in morning. Sunset boat cruise." },
      { day: 3, title: "Goa Departure", description: "Drop at airport." }
    ],
    inclusions: ["3-Star Hotel Stay", "Breakfast Included", "Sunset Cruise tickets", "Water sports combo"],
    exclusions: ["Club entry charges", "Lunch & Dinner"]
  },
  {
    title: "Golden Triangle Tour with Goa Beaches",
    slug: "golden-triangle-tour-with-goa-beaches",
    destination: "Delhi - Agra - Jaipur - Goa",
    description: "Combine India's premium historical sites in the north with relaxing beaches in Goa.",
    price: 34999,
    duration: 10,
    category: "FAMILY",
    images: ["https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800"],
    itinerary: [
      { day: 1, title: "Arrive Delhi", description: "Check-in to hotel." },
      { day: 2, title: "Delhi Tour", description: "Explore Old and New Delhi." },
      { day: 3, title: "Delhi to Agra", description: "Drive to Agra. Taj Mahal sunset." },
      { day: 4, title: "Agra to Jaipur", description: "Visit Agra Fort. Drive to Jaipur." },
      { day: 5, title: "Jaipur Tour", description: "Explore palaces and forts." },
      { day: 6, title: "Jaipur to Delhi & Flight to Goa", description: "Drive to Delhi. Fly to Goa. Check-in to resort." },
      { day: 7, title: "North Goa Beaches", description: "Anjuna, Baga, Fort Aguada." },
      { day: 8, title: "South Goa Heritage", description: "Churches, temples, spice plantation." },
      { day: 9, title: "Goa relaxation", description: "Day free at beach." },
      { day: 10, title: "Goa Departure", description: "Transfer to airport." }
    ],
    inclusions: ["3-Star Hotels Stay", "Daily Breakfast", "Domestic flight Delhi-Goa", "AC Cab for transfers"],
    exclusions: ["Monument entry fees", "Lunch & Dinner"]
  },
  {
    title: "Kashmir Paradise Honeymoon Tour",
    slug: "kashmir-paradise-honeymoon-tour",
    destination: "Srinagar - Gulmarg - Pahalgam",
    description: "Create eternal memories in romantic Kashmir. Enjoy shikara rides, houseboat stay, and snow mountains.",
    price: 25999,
    duration: 6,
    category: "HONEYMOON",
    images: ["https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800"],
    itinerary: [
      { day: 1, title: "Arrive Srinagar Houseboat", description: " houseboat check-in. Evening shikara ride." },
      { day: 2, title: "Srinagar Mughal Gardens", description: "Visit Mughal gardens." },
      { day: 3, title: "Srinagar to Gulmarg", description: "Drive to Gulmarg. Cable car Gondola ride." },
      { day: 4, title: "Gulmarg to Pahalgam", description: "Drive to Pahalgam. Saffron fields walk." },
      { day: 5, title: "Pahalgam local valleys", description: "Visit Aru & Betaab valley." },
      { day: 6, title: "Pahalgam to Srinagar Departure", description: "Drive to Srinagar airport." }
    ],
    inclusions: ["Houseboat & Hotel Stay", "Breakfast & Dinner", "Shikara Ride", "Honeymoon decoration & cake", "All transfers"],
    exclusions: ["Gondola tickets", "Pony rides", "Lunch"]
  },
  {
    title: "Rann of Kutch Desert Festival Special",
    slug: "rann-of-kutch-desert-festival-special",
    destination: "Bhuj - White Rann",
    description: "Enjoy Kutch culture, camel safaris, and see the white desert shine under full moon.",
    price: 18999,
    duration: 3,
    category: "FAMILY",
    images: ["https://images.unsplash.com/photo-1599818817290-7d3129841870?w=800"],
    itinerary: [
      { day: 1, title: "Bhuj to White Rann", description: "Transfer to White Rann Tent city." },
      { day: 2, title: "Rann Sunrise & craft villages", description: "Sunrise visit to Rann. Visit Kutch craft villages." },
      { day: 3, title: "Bhuj Departure", description: "Bhuj palace visit. Transfer to airport." }
    ],
    inclusions: ["Premium tents stay", "All meals", "Permits", "Transfers"],
    exclusions: ["Adventure ride fees", "Lunch during travel"]
  }
];
