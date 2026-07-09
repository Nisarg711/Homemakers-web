'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import ArticleCard from '@/components/ArticleCard';
import DemandCard from '@/components/DemandCard';
import UserCard from '@/components/UserCard';
import FeatureCard from '@/components/FeatureCard';
import { useGeolocation } from '@/hooks/useGeolocation';
import ChatWidget from '@/components/chatWidget';


export default function DashboardPage() {
  //useSession doesn't go to the DB. 
  // It calls GET /api/auth/session which NextAuth handles 
  // automatically — it reads the cookie, decrypts it, 
  // runs your session() callback, and returns the result as JSON.
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState({});
  const [news, setNews] = useState([]);
  const { location, error, loading, getLocation } = useGeolocation();
  const [userAddress, setUserAddress] = useState(null);
  const [nearbyProperties, setNearbyProperties] = useState([]);
  const [demandmap,setdemandmap]=useState({})
  const [demandData,setdemandData]=useState({});
  

    useEffect(()=>{
    async function fetchSchema(){
       const res=await fetch('/api/fetch/schema',{
        "method":"GET"
       })
       const data=await res.json();
       console.log(data);
    }
  fetchSchema()
  },[])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
   
  }, [status, router])

  useEffect(()=>{
  console.log("Location: ", location)
  async function fetchAddress(location)
  {
    if(location)
  {
    const res=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json`,{
      method:'GET',
      headers: {
          "User-Agent": "MyNextApp/1.0",
          Accept: "application/json",
        }
    })
    const data=await res.json();
    console.log("Address: ", data.address)
    if(data?.address)
    {
      setUserAddress(data.address);
    }
  }
 }
  fetchAddress(location);
  
},[location])

 // later when backend ready:
  useEffect(() => {
    if (userAddress==null) {
      return
    }
    async function fetchnearbyproperties(userAddress)
    {
      try{
        console.log("Fetching nearby properties for location: ", userAddress)
        const res=await fetch('/api/fetch/properties',{
          method:'POST',
          headers: {
              "Content-Type": "application/json",
            },
          body: JSON.stringify(userAddress)
        })
        const data=await res.json();
        console.log("Response from properties API: ")
        if(data?.count > 0) {
          console.log("Nearby properties setting ", data.properties)
          setNearbyProperties(data.properties);
        }
      }
      catch(error)
      {
        console.error("Error fetching nearby properties: ", error);
      }
    }
      fetchnearbyproperties(userAddress);
  }, [userAddress]);

useEffect(() => {
    console.log("Nearby properties: ", nearbyProperties);
   const citymap = nearbyProperties.reduce((acc, property) => {
  const { type, city, district } = property;

  acc[type] ??= {};
  acc[type][city] ??= {};

  acc[type][city][district] =
    (acc[type][city][district] ?? 0) + 1;

  return acc;
}, {});
    setdemandmap(citymap);
}, [nearbyProperties]);
useEffect(()=>{
  if(demandmap!={})
  {
const data={}
for (const [type, cities] of Object.entries(demandmap)) {
  data[type] = Object.entries(cities)
    .flatMap(([city, districts]) =>
      Object.entries(districts).map(([district, count]) => ({
        location: `${district}, ${city}`,
        count,
      }))
    )
    .sort((a, b) => b.count - a.count)
    .map(item => item.location);
}
setdemandData(data)
  }
},[demandmap])


useEffect(()=>{
  console.log("Demand Data: Indep ",demandData["Independent House"])
},[demandData])
useEffect(()=>{
  console.log("Selected: ",selectedLocation)
  if(selectedLocation !=null)
  setUserAddress(selectedLocation)
},[selectedLocation])

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        if (response.ok) {
          const data = await response.json();
          // Extract results array from the Tavily response
          const newsResults = data.response?.results || [];
          setNews(newsResults);
        } else {
          console.error('Failed to fetch news');
          setNews([]);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews([]);
      }
    };

    fetchNews();
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-accent-primary border-t-transparent animate-spin" />
          <p className="text-dark-text-secondary text-sm font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;


  // Display only top 3 articles from fetched news
  const topArticles = Array.isArray(news) ? news.slice(0, 3) : [];
  const topnearbyProperties = Array.isArray(nearbyProperties) ? nearbyProperties.slice(0, 3) : [];


  const userData = [
    { id: 1, title: 'Buyers', description: 'Find your perfect property with our extensive listings and personalized recommendations.', buttonText: 'Buy Now' },
    { id: 2, title: 'Tenants', description: 'Browse rental properties and find a home that fits your lifestyle and budget.', buttonText: 'Try Now' },
    { id: 3, title: 'Sellers', description: 'List your property and connect with qualified buyers in your area.', buttonText: 'Sell Now' },
  ];

  const features = [
    { id: 1, title: 'Supports Multiple Users', description: 'Manage accounts for buyers, tenants, sellers, agents, and firms all on one platform.' },
    { id: 2, title: 'AI-Powered Platform', description: 'Not just an ordinary real estate site. Integrated with AI for our users' },
    { id: 3, title: 'Secure & Transparent', description: 'Efficient transaction tracking with privacy' },
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar
        onLocationChange={(location) => setSelectedLocation(location)}
      />

      {/* Hero Section */}
      <div
        className="relative h-56 sm:h-72 flex items-center justify-center overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: 'url(/cover.png)' }}
      >
        {/* Gradient mesh overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-accent-dark/30 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />

        <div className="text-center relative z-10 px-4 animate-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Find Your Perfect Home
          </h1>
          <p className="text-sm sm:text-base text-white/70 font-medium">
            Welcome back, <span className="text-white">{session.user.name}</span>
          </p>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="px-4 sm:px-6 pb-10 sm:pb-14">
        <SearchBar onLocationRequest={getLocation} location={location}
        locationLoading={loading}
        userAddress={userAddress} />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Recommended Properties */}
        <section className="mb-12 sm:mb-16">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-dark-text section-header">Recommended for You</h2>
            <p className="text-xs sm:text-sm text-dark-text-secondary mt-3">Properties based on your entered location</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topnearbyProperties.length > 0 ? topnearbyProperties.map((property, index) => (
              <div key={property.apn} className={`delay-${index + 1}`}>
                <PropertyCard property={
                  {
                    "apn": property.apn,
                    "title": property.title,
                    "location": `${property.localAddress}, ${property.city}, ${property.state}`,
                    "price": "₹" + (property.rent?.monthlyRent || property.sell?.price || 'Price on request'),
                    "bedrooms": 'N/A',
                    "bathrooms": 'N/A',
                    "area": `${property.area} sq.ft`,
                    "availableFor": property.availableFor,
                  }
                } />
              </div>
            )) : (
              <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl border border-dark-border/40 p-5 space-y-4">
                    <div className="skeleton h-40 w-full rounded-xl" />
                    <div className="skeleton h-5 w-1/3" />
                    <div className="skeleton h-4 w-2/3" />
                    <div className="skeleton h-4 w-1/2" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Top Articles */}
        <section className="mb-12 sm:mb-16">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-dark-text section-header">Top Articles</h2>
            <p className="text-xs sm:text-sm text-dark-text-secondary mt-3">Latest real estate news and insights</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topArticles.length > 0 ? (
              topArticles.map((article, index) => (
                <div key={article.url || index} className={`delay-${index + 1}`}>
                  <ArticleCard article={article} />
                </div>
              ))
            ) : (
              <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl border border-dark-border/40 p-5 space-y-4">
                    <div className="skeleton h-32 w-full rounded-xl" />
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-3 w-full" />
                    <div className="skeleton h-3 w-2/3" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Demand Section */}
        {(Object.keys(demandmap).length > 0) ? (
          <section className="mb-12 sm:mb-16">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-dark-text section-header">Demand in {selectedLocation.city}</h2>
              <p className="text-xs sm:text-sm text-dark-text-secondary mt-3">Most searched property types in this area</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DemandCard category={{ title: 'Apartments', subtitle: 'Most searched localities for Apartments' }} locations={demandData["Apartment"]} />
              <DemandCard category={{ title: 'Villas', subtitle: 'Most searched societies for Plots' }} locations={demandData["villa"]} />
              <DemandCard category={{ title: 'Independent House', subtitle: 'Most searched localities for Houses' }} locations={demandData["Independent House"]} />
            </div>
          </section>
        ) : <></>}

        {/* Our Users */}
        <section className="mb-12 sm:mb-16">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-dark-text section-header">Our Users</h2>
            <p className="text-xs sm:text-sm text-dark-text-secondary mt-3">One platform for everyone in real estate</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userData.map((user, index) => (
              <div key={user.id} className={`delay-${index + 1}`}>
                <UserCard userType={user} />
              </div>
            ))}
          </div>
        </section>

        {/* Why Homemakers */}
        <section className="mb-12 sm:mb-16">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-dark-text section-header">Why Homemakers?</h2>
            <p className="text-xs sm:text-sm text-dark-text-secondary mt-3">Built different, for a reason</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={feature.id} className={`delay-${index + 1}`}>
                <FeatureCard feature={feature} />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-border/40 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-dark-text-muted">© 2025 HomeMakers. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-dark-text-muted hover:text-accent-primary transition">Privacy</a>
            <a href="#" className="text-sm text-dark-text-muted hover:text-accent-primary transition">Terms</a>
            <a href="#" className="text-sm text-dark-text-muted hover:text-accent-primary transition">Contact</a>
          </div>
        </div>
      </footer>

      <ChatWidget/>
    </div>
  );
}
