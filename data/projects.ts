// data/projects.ts

export interface ProjectAsset {
  id: string;
  type: 'image' | 'video';
  src: string;
  title: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'photography' | 'videography' | 'editing';
  coverType: 'image' | 'video';
  coverSrc: string;
  description: string;
  client: string;
  year: string;
  assets: ProjectAsset[];
}

// ==========================================================================
// 1. GENERATOR DATA ASSET DINAMIS (SINKRONISASI 100% DIREKTORI FISIK)
// ==========================================================================

// --- Proyek A: After Movie Orchestra 2025 ---
const gladiNumbers = [11, 122, 123, 20, 26, 33, 36, 42, 59, 61, 64, 72, 8, 81, 95];
const orchestraGladiPhotos: ProjectAsset[] = gladiNumbers.map(num => ({
  id: `orch-g-${num}`,
  type: 'image',
  src: `/media/photo/Gladi Day 02 ~ (${num}).jpg`,
  title: `Gladi Day Documentation #${num}`
}));

const imgNumbers = [
  6045, 6056, 6066, 6118, 6186, 6463, 6466, 6469, 6473, 6476,
  6501, 6504, 6511, 6525, 6526, 6536, 6542, 6548, 6561, 6565,
  6566, 6568, 6574, 6577, 6582, 6585, 6597, 6598, 6637, 6647,
  6649, 6685, 6686, 6690, 6691, 6701, 6702, 6707, 6708, 6709,
  6710, 6711, 6712, 6715, 6716, 6717, 6718, 6719, 6720, 6721,
  6722, 6724, 6726, 6727, 6732, 6733, 6734, 6749, 6750, 6751,
  6754, 6755, 6760, 6773, 6774, 6775, 6777, 6778, 6779, 6780,
  6781, 6782, 6784, 6785, 6786, 6787, 6788, 6798, 6801, 6813,
  6814, 6816, 6817, 6820, 6821, 6824, 6825, 6836, 6837, 6838,
  6843, 6848, 6893, 6898, 6899, 6900, 6901, 6902, 6903, 6905,
  6906, 6908, 6909, 6910, 6913, 6914
];
const orchestraLivePhotos: ProjectAsset[] = imgNumbers.map(num => ({
  id: `orch-i-${num}`,
  type: 'image',
  src: `/media/photo/IMG_${num}.jpg`,
  title: `Stage Live Shoot #IMG_${num}`
}));

const orchestraAssetsCombined: ProjectAsset[] = [
  { id: 'orch-v1', type: 'video', src: '/media/orchestra/After Movie Orchestra 2025.mp4', title: 'Official After Movie' },
  { id: 'orch-v2', type: 'video', src: '/media/orchestra/Gladi Kotor Orchestra.mp4', title: 'Behind The Scenes - Gladi Kotor' },
  ...orchestraGladiPhotos,
  ...orchestraLivePhotos,
  { id: 'orch-i-6840-1', type: 'image', src: '/media/photo/IMG_6840 (1).jpg', title: 'Stage Live Shoot #IMG_6840 (1)' }
];

// --- Proyek E: Jakarta International Vape Expo 2025 ---
const jivePhotos: ProjectAsset[] = Array.from({ length: 24 }, (_, i) => ({
  id: `jive-${i + 1}`,
  type: 'image',
  src: `/media/photo/Recap JIVE x NIXX 2025-${i + 1}.jpg`,
  title: `JIVE x NIXX Expo Area Capture #${i + 1}`
}));

// --- Proyek F: Mini Soccer Sports Action ---
const miniSoccerPhotos: ProjectAsset[] = Array.from({ length: 122 }, (_, i) => {
  const padNum = String(i).padStart(2, '0');
  return {
    id: `soc-${padNum}`,
    type: 'image',
    src: `/media/photo/MinSocc 2700px v-${padNum}.jpg`,
    title: `Mini Soccer Action Match v-${padNum}`
  };
});


// ==========================================================================
// 2. EXPORT BASIS DATA PROYEK UTAMA
// ==========================================================================

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'orchestra-2025',
    title: 'After Movie Orchestra 2025',
    category: 'videography',
    coverType: 'video',
    coverSrc: '/media/orchestra/After Movie Orchestra 2025.mp4',
    description: 'Dokumentasi sinematik komprehensif rangkaian pagelaran musik orkestra megah resmi, mencakup liputan hari H dan rangkaian latihan balik layar.',
    client: 'Orchestra Nusantara',
    year: '2025',
    assets: orchestraAssetsCombined
  },
  {
    id: 'dobro-coffeshop',
    title: 'Dobro Coffeshop Bekasi Promo',
    category: 'videography',
    coverType: 'video',
    coverSrc: '/media/dobro/Dobro Coffeshop 2024.mp4',
    description: 'Produksi video promosi komersial untuk Dobro Coffeshop cabang Bekasi. Berfokus pada penonjolan atmosfer ruang, proses pembuatan kopi, dan interaksi urban.',
    client: 'Dobro Co. Company',
    year: '2024',
    assets: [
      { id: 'dobro-v1', type: 'video', src: '/media/dobro/Dobro Coffeshop 2024.mp4', title: 'Commercial Cinematic Video' }
    ]
  },
{
  id: 'cinematography-productions',
  title: 'Cinematography & Narrative Films',
  category: 'videography',
  coverType: 'image',
  coverSrc: '/media/film/Short Film/New Poster 2026 v2.png',
  description: 'Eksplorasi seni visual melalui penyutradaraan film pendek independen dan narasi fiksi, menekankan pada teknik color grading dramatis, manipulasi pencahayaan mood, serta komposisi bingkai sinematik yang bercerita.',
  client: 'Independent Cinema / Production Set',
  year: '2025',
  assets: [
    { id: 'been-v1', type: 'video', src: '/media/film/Short Film/FIRST REUNION I’VE EVER BEEN 2025.mp4', title: 'BEEN 2025 - Short Film Cinematic' },
    { id: 'been-p1', type: 'image', src: '/media/film/Short Film/New Poster 2026 v2.png', title: 'Official Theater Poster v2' },
    { id: 'been-p2', type: 'image', src: '/media/film/Short Film/New Poster 2026 v3.png', title: 'Alternative Promo Poster v3' },
    { id: 'been-v6', type: 'video', src: '/media/film/MV Validasi Lelahmu 2025/Validasi Lelahmu - Sehan Nono - CFS 16 Antimager.mp4', title: 'Music Video - Validasi Lelahmu' },
    { id: 'been-v2', type: 'video', src: '/media/film/REPLECED.mp4', title: 'REPLACED Production Reel' },
    { id: 'been-v3', type: 'video', src: '/media/film/STRICTLY BUSINESS.mp4', title: 'STRICTLY BUSINESS Short Piece' },
    { id: 'been-v4', type: 'video', src: '/media/film/The Burnout.mp4', title: 'The Burnout Short Cinematic' },
    { id: 'been-v5', type: 'video', src: '/media/film/THE OBSERVER.mp4', title: 'THE OBSERVER Narration Film' }
  ]
},
  {
    id: 'cinematic-contents',
    title: 'Commercial Cinematic Reels',
    category: 'editing',
    coverType: 'video',
    coverSrc: '/media/konten/Car Cinematic Suddenly Meet Up 2025.mp4',
    description: 'Kumpulan portofolio penyuntingan video pendek komersial bertema otomotif premium dan performa panggung dengan ritme konseptual tinggi.',
    client: 'Various Commercials',
    year: '2025',
    assets: [
      { id: 'cine-v1', type: 'video', src: '/media/konten/Car Cinematic Suddenly Meet Up 2025.mp4', title: 'Car Cinematic Suddenly Meet Up 2025' },
      { id: 'cine-v2', type: 'video', src: '/media/konten/Cinem Pajero x Fortuner 2024.mp4', title: 'Cinem Pajero x Fortuner 2024' },
      { id: 'cine-v3', type: 'video', src: '/media/konten/Cinematic Kak Deborah 2025.mp4', title: 'Cinematic Portrait Kak Deborah' },
      { id: 'cine-v4', type: 'video', src: '/media/konten/Cinematic Perform Orchestra Kak Deborah 2025.mp4', title: 'Orchestra Solo Perform Showcase' },
      { id: 'cine-v5', type: 'video', src: '/media/konten/Cinematic Rolling Aerox 2025.mp4', title: 'Aerox Automotive Reel' },
      { id: 'cine-v6', type: 'video', src: '/media/konten/Lost In City 2025.mp4', title: 'Lost In City 2025 Montages' },
      { id: 'cine-v7', type: 'video', src: '/media/konten/Motor Cinematic Suddenly Meet Up 2025.mp4', title: 'Motorbike Suddenly Meet Up Reel' },
      { id: 'cine-v8', type: 'video', src: '/media/konten/Xmax Cinematic 2025.mp4', title: 'Xmax Cinematic Commercial' }
    ]
  },
  {
    id: 'jive-nixx-exhibition',
    title: 'JIVE x NIXX Exhibition Expo',
    category: 'photography',
    coverType: 'image',
    coverSrc: '/media/photo/Recap JIVE x NIXX 2025-1.jpg',
    description: 'Dokumentasi liputan pameran kolaborasi industri kreatif berskala besar antara JIVE dan NIXX di Jakarta.',
    client: 'JIVE x NIXX Organizer',
    year: '2025',
    assets: jivePhotos
  },
  {
    id: 'mini-soccer-match',
    title: 'Mini Soccer Sports Action',
    category: 'photography',
    coverType: 'image',
    coverSrc: '/media/photo/MinSocc 2700px v-00.jpg',
    description: 'Sesi fotografi aksi olahraga berkecepatan tinggi, membekukan gerakan dinamis pemain di atas lapangan hijau.',
    client: 'Mini Soccer League',
    year: '2025',
    assets: miniSoccerPhotos
  },
  {
    id: 'graduation-session',
    title: 'Graduation & Family Portrait',
    category: 'photography',
    coverType: 'image',
    coverSrc: '/media/photo/P Graduation Andin (1).jpg',
    description: 'Sesi dokumentasi kelulusan akademis personal formal serta potret kehangatan bersama keluarga.',
    client: 'Andin & Family',
    year: '2026',
    assets: [
      { id: 'grad-1', type: 'image', src: '/media/photo/P Graduation Andin (1).jpg', title: 'Graduation Solo Portrait #01' },
      { id: 'grad-2', type: 'image', src: '/media/photo/P Graduation Andin (18).jpg', title: 'Graduation Solo Portrait #18' },
      { id: 'grad-3', type: 'image', src: '/media/photo/P Graduation Andin (42).jpg', title: 'Graduation Solo Portrait #42' },
      { id: 'grad-4', type: 'image', src: '/media/photo/P Graduation Andin (77).jpg', title: 'Graduation Outdoor Session #77' },
      { id: 'grad-5', type: 'image', src: '/media/photo/P Graduation Andin (78).jpg', title: 'Graduation Ceremony Joy #78' },
      { id: 'grad-6', type: 'image', src: '/media/photo/P Graduation Andin (82).jpg', title: 'Graduation Certificate Showcase #82' },
      { id: 'grad-7', type: 'image', src: '/media/photo/P Graduation Andin (91).jpg', title: 'Graduation Studio Portrait #91' },
      { id: 'grad-8', type: 'image', src: '/media/photo/Foto Keluarga (1).jpg', title: 'Family Warm Session I' },
      { id: 'grad-9', type: 'image', src: '/media/photo/Foto Keluarga (5).jpg', title: 'Family Warm Session II' }
    ]
  }
];