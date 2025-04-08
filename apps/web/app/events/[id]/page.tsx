import Navbar from '../../components/Navbar';
import PriceChart from '../../components/PriceChart';
import PlaceOrder from '../../components/PlaceOrder';
import Orderbook from '../../components/Orderbook';
import EventDetails from '../../components/EventDetails';

export default function PredictionPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Details */}
            <EventDetails />
            {/* Price Chart */}
            <PriceChart />
            {/* Order Book */}
            <Orderbook />
          </div>
          {/* Place Order */}
          <PlaceOrder />
        </div>
      </main>
    </div>
  );
}