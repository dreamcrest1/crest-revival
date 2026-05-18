import { useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleSqrt } from 'd3-scale';

// Tiny city coordinate dataset for major Indian cities — enough for bubble overlay
const INDIA_CITIES: Record<string, [number, number]> = {
  Mumbai: [72.8777, 19.0760], Delhi: [77.1025, 28.7041], Bengaluru: [77.5946, 12.9716], Bangalore: [77.5946, 12.9716],
  Hyderabad: [78.4867, 17.3850], Chennai: [80.2707, 13.0827], Kolkata: [88.3639, 22.5726], Pune: [73.8567, 18.5204],
  Ahmedabad: [72.5714, 23.0225], Surat: [72.8311, 21.1702], Jaipur: [75.7873, 26.9124], Lucknow: [80.9462, 26.8467],
  Kanpur: [80.3319, 26.4499], Nagpur: [79.0882, 21.1458], Indore: [75.8577, 22.7196], Thane: [72.9781, 19.2183],
  Bhopal: [77.4126, 23.2599], Visakhapatnam: [83.2185, 17.6868], Patna: [85.1376, 25.5941], Vadodara: [73.1812, 22.3072],
  Ghaziabad: [77.4538, 28.6692], Ludhiana: [75.8573, 30.9010], Agra: [78.0081, 27.1767], Nashik: [73.7898, 19.9975],
  Faridabad: [77.3178, 28.4089], Meerut: [77.7064, 28.9845], Rajkot: [70.8022, 22.3039], Varanasi: [82.9739, 25.3176],
  Srinagar: [74.7973, 34.0837], Aurangabad: [75.3433, 19.8762], Dhanbad: [86.4304, 23.7957], Amritsar: [74.8723, 31.6340],
  Allahabad: [81.8463, 25.4358], Ranchi: [85.3240, 23.3441], Coimbatore: [76.9558, 11.0168], Jabalpur: [79.9864, 23.1815],
  Gwalior: [78.1828, 26.2183], Vijayawada: [80.6480, 16.5062], Jodhpur: [73.0243, 26.2389], Madurai: [78.1198, 9.9252],
  Raipur: [81.6296, 21.2514], Kota: [75.8648, 25.2138], Guwahati: [91.7362, 26.1445], Chandigarh: [76.7794, 30.7333],
  Mysuru: [76.6394, 12.2958], Mysore: [76.6394, 12.2958], Gurgaon: [77.0266, 28.4595], Noida: [77.3910, 28.5355],
  Thiruvananthapuram: [76.9366, 8.5241], Kochi: [76.2673, 9.9312],
};

const WORLD_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const INDIA_URL = 'https://raw.githubusercontent.com/markmarkoh/datamaps/master/src/js/data/ind.topo.json';

// Map our country names to topojson NAME field (TopoJSON uses common English names)
const NORMALIZE: Record<string, string> = {
  'United States': 'United States of America', 'USA': 'United States of America', 'US': 'United States of America',
  'UK': 'United Kingdom', 'South Korea': 'Republic of Korea', 'North Korea': "Dem. Rep. Korea",
  'Russia': 'Russian Federation', 'Iran': 'Iran (Islamic Republic of)', 'Vietnam': 'Viet Nam',
};

interface Props {
  mode: 'world' | 'india';
  countries?: [string, number][];
  cities?: [string, number][];
}

const GeoMap = ({ mode, countries = [], cities = [] }: Props) => {
  const countryMap = useMemo(() => {
    const m: Record<string, number> = {};
    for (const [k, v] of countries) m[NORMALIZE[k] ?? k] = v;
    return m;
  }, [countries]);

  const cityBubbles = useMemo(() => {
    if (mode !== 'india') return [];
    return cities
      .map(([k, v]) => {
        const cityOnly = k.split(',')[0].trim();
        const coords = INDIA_CITIES[cityOnly];
        return coords ? { name: cityOnly, v, coords } : null;
      })
      .filter(Boolean) as { name: string; v: number; coords: [number, number] }[];
  }, [cities, mode]);

  const max = mode === 'world' ? Math.max(1, ...Object.values(countryMap)) : Math.max(1, ...cityBubbles.map(b => b.v));
  const sizeScale = scaleSqrt().domain([0, max]).range([2, mode === 'world' ? 22 : 16]);
  const colorScale = (v: number) => {
    if (v <= 0) return 'hsl(220, 18%, 22%)';
    const t = Math.min(1, v / max);
    const h = 24; // primary orange
    const l = 18 + t * 35;
    return `hsl(${h}, 90%, ${l}%)`;
  };

  return (
    <div className="w-full" style={{ aspectRatio: mode === 'world' ? '16 / 9' : '1 / 1', maxHeight: 540 }}>
      <ComposableMap
        projection={mode === 'world' ? 'geoMercator' : 'geoMercator'}
        projectionConfig={mode === 'world'
          ? { scale: 130, center: [10, 20] }
          : { scale: 1000, center: [82, 22] }}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup zoom={1} minZoom={1} maxZoom={4}>
          <Geographies geography={mode === 'world' ? WORLD_URL : INDIA_URL}>
            {({ geographies }) => geographies.map((geo) => {
              const name = (geo.properties as { name?: string; NAME?: string }).name ?? (geo.properties as { NAME?: string }).NAME ?? '';
              const v = mode === 'world' ? (countryMap[name] || 0) : 0;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={mode === 'world' ? colorScale(v) : 'hsl(220, 18%, 22%)'}
                  stroke="hsl(220, 15%, 14%)"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: 'hsl(24, 95%, 53%)', outline: 'none', cursor: 'pointer' },
                    pressed: { outline: 'none' },
                  }}
                />
              );
            })}
          </Geographies>

          {mode === 'india' && cityBubbles.map((b) => (
            <g key={b.name} transform={`translate(${b.coords[0]} ${b.coords[1]})`}>
              <CityBubble v={b.v} size={sizeScale(b.v)} name={b.name} />
            </g>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

// react-simple-maps uses a Mercator projection; we render bubbles inside Geographies using Marker
// To keep coordinates correct we wrap in a Marker-equivalent: render through ProjectionContext via plain SVG <g> using projected coords.
// Simpler: import Marker from react-simple-maps for correct projection.
import { Marker } from 'react-simple-maps';
const CityBubble = ({ v, size, name }: { v: number; size: number; name: string }) => (
  <Marker coordinates={[0, 0]}>
    <circle r={size} fill="hsl(24, 95%, 53%)" fillOpacity={0.55} stroke="hsl(24, 95%, 53%)" strokeWidth={1.2} />
    <text textAnchor="middle" y={-size - 3} style={{ fontFamily: 'inherit', fontSize: 9, fill: 'hsl(0,0%,90%)', pointerEvents: 'none' }}>
      {name} · {v}
    </text>
  </Marker>
);

export default GeoMap;
